import { LootGenerator } from "./loot-generator";
import { LootConfigLoader } from "../config/loot/config";
import {
  LootGenerationContext,
  GeneratedLootItem,
  WeaponAuditEntry,
} from "../config/loot/types";

export class WeaponLootGenerator extends LootGenerator {
  private static weaponAudit: WeaponAuditEntry[] = [];

  /**
   * Generate weapon loot with full RPG properties
   */
  static generateWeaponLoot(context: LootGenerationContext): {
    result: GeneratedLootItem[];
    audit: WeaponAuditEntry[];
  } {
    const result: GeneratedLootItem[] = [];
    const audit: WeaponAuditEntry[] = [];

    // Determine how many weapons to generate
    const weaponCount = this.determineWeaponCount(context);

    for (let i = 0; i < weaponCount; i++) {
      const weapon = this.generateWeapon(context);
      if (weapon) {
        result.push(weapon.item);
        audit.push(weapon.audit);
        this.weaponAudit.push(weapon.audit);
      }
    }

    return { result, audit };
  }

  /**
   * Generate a single weapon with full RPG properties
   */
  private static generateWeapon(context: LootGenerationContext): {
    item: GeneratedLootItem;
    audit: WeaponAuditEntry;
  } | null {
    // Select base weapon template
    const baseWeapon = this.selectBaseWeapon(context);

    // Apply manufacturer
    const manufacturer = this.selectManufacturer(context);

    // Determine rarity
    const rarity = this.determineWeaponRarity(context.gamestage);

    // Apply manufacturer traits
    const weaponStats = this.applyManufacturerTraits(
      baseWeapon,
      manufacturer,
      rarity
    );

    // Generate item name
    const itemName = this.generateWeaponName(baseWeapon, manufacturer, rarity);

    // Create audit entry
    const audit: WeaponAuditEntry = {
      base_weapon: baseWeapon.name,
      manufacturer: manufacturer,
      rarity: rarity,
      tier:
        this.determineLootTier(context.gamestage) === "tier_1"
          ? 1
          : this.determineLootTier(context.gamestage) === "tier_2"
          ? 2
          : this.determineLootTier(context.gamestage) === "tier_3"
          ? 3
          : this.determineLootTier(context.gamestage) === "tier_4"
          ? 4
          : 5,
      final_damage: weaponStats.damage,
      final_durability: weaponStats.durability,
      final_rate_of_fire: weaponStats.rateOfFire,
      final_accuracy: weaponStats.accuracy,
      final_range: weaponStats.range,
      final_magazine_size: weaponStats.magazineSize,
      final_weight: weaponStats.weight,
      final_economic_value: weaponStats.value,
      material: baseWeapon.material,
      weapon_type: baseWeapon.type,
      ammo_type: baseWeapon.ammoType,
    };

    // Create loot item
    const item: GeneratedLootItem = {
      name: itemName,
      category: "weapons",
      rarity: rarity,
      quantity: 1,
      value: weaponStats.value,
      properties: {
        baseWeapon: baseWeapon.name,
        manufacturer: manufacturer,
        weaponType: baseWeapon.type,
        ammoType: baseWeapon.ammoType,
        damage: weaponStats.damage,
        durability: weaponStats.durability,
        rateOfFire: weaponStats.rateOfFire,
        accuracy: weaponStats.accuracy,
        range: weaponStats.range,
        magazineSize: weaponStats.magazineSize,
        weight: weaponStats.weight,
        material: baseWeapon.material,
        gamestage: context.gamestage,
        location: context.location,
        generated: new Date().toISOString(),
      },
    };

    return { item, audit };
  }

  /**
   * Determine how many weapons to generate
   */
  private static determineWeaponCount(context: LootGenerationContext): number {
    const tier = this.determineLootTier(context.gamestage);
    const tierConfig = LootConfigLoader.loadTierConfig()[tier];

    if (!tierConfig) return 0;

    // Weapons are rarer, so reduce chance
    const weaponChance = tierConfig.drop_chance * 0.3; // 30% of normal drop chance

    if (Math.random() > weaponChance / 100) {
      return 0;
    }

    return Math.min(Math.floor(Math.random() * 2) + 1, tierConfig.max_items);
  }

  /**
   * Select a base weapon template
   */
  private static selectBaseWeapon(context: LootGenerationContext): any {
    // This would integrate with your existing weapon templates
    // For now, return a mock weapon
    const mockWeapons = [
      {
        name: "Pistol",
        type: "pistol",
        material: "steel",
        ammoType: "ammo9mmBullet",
      },
      {
        name: "Rifle",
        type: "rifle",
        material: "steel",
        ammoType: "ammo762mmBullet",
      },
      {
        name: "Shotgun",
        type: "shotgun",
        material: "steel",
        ammoType: "ammoShotgunShell",
      },
      {
        name: "SMG",
        type: "smg",
        material: "steel",
        ammoType: "ammo9mmBullet",
      },
      {
        name: "Rocket Launcher",
        type: "launcher",
        material: "steel",
        ammoType: "ammoRocketHE",
      },
    ];

    return mockWeapons[Math.floor(Math.random() * mockWeapons.length)];
  }

  /**
   * Select a manufacturer
   */
  private static selectManufacturer(context: LootGenerationContext): string {
    const manufacturers = ["Atlas", "Tediore", "Hyperion", "Vladof", "Jakobs"];
    return manufacturers[Math.floor(Math.random() * manufacturers.length)];
  }

  /**
   * Determine weapon rarity with game stage scaling
   */
  private static determineWeaponRarity(gamestage: number): string {
    const weaponScaling = LootConfigLoader.getWeaponRarityScaling();
    const tier = this.determineLootTier(gamestage);
    const tierScaling = weaponScaling[tier];

    if (!tierScaling) return "Common";

    const roll = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(tierScaling)) {
      if (rarity === "drop_chance" || rarity === "description") continue;
      const chanceValue = typeof chance === 'number' ? chance : 0;
      cumulative += chanceValue;
      if (roll <= cumulative) {
        return rarity;
      }
    }

    return "Common";
  }

  /**
   * Apply manufacturer traits to weapon stats
   */
  private static applyManufacturerTraits(
    baseWeapon: any,
    manufacturer: string,
    rarity: string
  ): {
    damage: number;
    durability: number;
    rateOfFire: number;
    accuracy: number;
    range: number;
    magazineSize: number;
    weight: number;
    value: number;
  } {
    // Base stats (would come from weapon templates)
    const baseStats = {
      damage: 25,
      durability: 1000,
      rateOfFire: 2.0,
      accuracy: 0.8,
      range: 50,
      magazineSize: 12,
      weight: 1.2,
      value: 100,
    };

    // Apply manufacturer modifiers
    const modifiers = this.getManufacturerModifiers(manufacturer);

    // Apply rarity modifiers
    const rarityMultipliers = LootConfigLoader.getRarityMultipliers();
    const rarityMultiplier = rarityMultipliers[rarity] || 1.0;

    return {
      damage: Math.floor(
        baseStats.damage * modifiers.damage * rarityMultiplier
      ),
      durability: Math.floor(baseStats.durability * modifiers.durability),
      rateOfFire: baseStats.rateOfFire * modifiers.rateOfFire,
      accuracy: Math.min(1.0, baseStats.accuracy * modifiers.accuracy),
      range: Math.floor(baseStats.range * modifiers.range),
      magazineSize: Math.floor(baseStats.magazineSize * modifiers.magazineSize),
      weight: baseStats.weight * modifiers.weight,
      value: Math.floor(baseStats.value * rarityMultiplier * modifiers.value),
    };
  }

  /**
   * Get manufacturer-specific modifiers
   */
  private static getManufacturerModifiers(manufacturer: string): {
    damage: number;
    durability: number;
    rateOfFire: number;
    accuracy: number;
    range: number;
    magazineSize: number;
    weight: number;
    value: number;
  } {
    const modifiers: { [key: string]: any } = {
      Atlas: {
        // Reliability/Durability focus
        damage: 1.0,
        durability: 1.5,
        rateOfFire: 0.9,
        accuracy: 1.1,
        range: 1.0,
        magazineSize: 1.2,
        weight: 1.1,
        value: 1.1,
      },
      Tediore: {
        // Light/High capacity
        damage: 0.9,
        durability: 0.7,
        rateOfFire: 1.1,
        accuracy: 0.9,
        range: 0.9,
        magazineSize: 1.5,
        weight: 0.8,
        value: 0.9,
      },
      Hyperion: {
        // High tech/Accuracy
        damage: 1.1,
        durability: 0.9,
        rateOfFire: 1.0,
        accuracy: 1.3,
        range: 1.2,
        magazineSize: 0.9,
        weight: 1.0,
        value: 1.3,
      },
      Vladof: {
        // High damage/Heavy
        damage: 1.3,
        durability: 1.1,
        rateOfFire: 0.8,
        accuracy: 0.8,
        range: 1.1,
        magazineSize: 0.8,
        weight: 1.3,
        value: 1.2,
      },
      Jakobs: {
        // Critical hits/Variable
        damage: 1.2,
        durability: 1.0,
        rateOfFire: 0.9,
        accuracy: 1.0,
        range: 1.0,
        magazineSize: 1.0,
        weight: 1.0,
        value: 1.4,
      },
    };

    return (
      modifiers[manufacturer] || {
        damage: 1.0,
        durability: 1.0,
        rateOfFire: 1.0,
        accuracy: 1.0,
        range: 1.0,
        magazineSize: 1.0,
        weight: 1.0,
        value: 1.0,
      }
    );
  }

  /**
   * Generate weapon name
   */
  private static generateWeaponName(
    baseWeapon: any,
    manufacturer: string,
    rarity: string
  ): string {
    return `rl${manufacturer}${baseWeapon.name}`;
  }

  /**
   * Get weapon audit data
   */
  static getWeaponAudit(): WeaponAuditEntry[] {
    return [...this.weaponAudit];
  }

  /**
   * Clear weapon audit data
   */
  static clearWeaponAudit(): void {
    this.weaponAudit = [];
  }

  /**
   * Export weapon audit to CSV
   */
  static exportWeaponAuditToCSV(): string {
    const headers = [
      "base_weapon",
      "manufacturer",
      "rarity",
      "tier",
      "final_damage",
      "final_durability",
      "final_rate_of_fire",
      "final_accuracy",
      "final_range",
      "final_magazine_size",
      "final_weight",
      "final_economic_value",
      "material",
      "weapon_type",
      "ammo_type",
    ];

    const rows = this.weaponAudit.map((entry) =>
      headers.map((header) => entry[header]).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  }
}
