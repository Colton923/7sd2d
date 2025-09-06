import { Builders, ItemBuilder } from "@7d2d/mod-builder";
import { manufacturers, rarityTiers } from "../config/manufacturers";
import { allAffixes, getCompatibleAffixes, Affix } from "../data/affixes";
import {
  allWeaponParts,
  getPartsBySlotAndTier,
  WeaponPart,
} from "../data/weapon-parts";
import {
  ElementalType,
  elementalEffects,
  getElementalInteraction,
} from "../data/elemental-effects";
import {
  TriggeredEffect,
  generateRandomTriggeredEffects,
  getCompatibleTriggers,
} from "../data/triggered-effects";
import {
  WeaponBaseStats,
  WeaponClass,
  weaponClassStats,
  getWeaponTemplate,
  calculateTemplateStats,
} from "../data/weapon-base-stats";
import {
  scaleWeaponStats,
  calculateItemLevel,
  getItemLevelSuffix,
  applyStatVariance,
} from "../data/stat-scaling";

// Import loot system
import { WeaponLootGenerator } from "./weapon-loot-generator";
import { LocationLootDistributor } from "./location-loot-distributor";
import { LootGenerationContext } from "../config/loot/types";
import { WeaponAuditSystem } from "../utils/weapon-audit-system";

// Re-export types that are used externally
export { Affix, WeaponPart, ElementalType, TriggeredEffect, WeaponClass };

/**
 * Loot-Integrated Weapon Generator
 *
 * This generator combines the advanced weapon generation with the loot system
 * to create weapons that spawn according to game rules and progression.
 */
export class LootIntegratedWeaponGenerator {
  private generatedWeapons: Map<string, ItemBuilder> = new Map();
  private lootGenerator = new WeaponLootGenerator();

  /**
   * Generate a weapon using the loot system
   */
  generateWeaponFromLoot(
    baseType: string,
    weaponClass: WeaponClass,
    context: LootGenerationContext
  ): ItemBuilder | null {
    // Use the loot system to determine weapon properties
    const { result, audit } = WeaponLootGenerator.generateWeaponLoot(context);

    if (result.length === 0) {
      return null; // No weapon generated for this context
    }

    const lootWeapon = result[0];

    // Convert loot weapon data to advanced weapon config
    const config = this.convertLootToAdvancedConfig(
      lootWeapon,
      baseType,
      weaponClass,
      context
    );

    // Generate the weapon using the advanced generator
    const weapon = this.generateAdvancedWeapon(config);

    // Add to audit system
    audit.forEach((entry) => WeaponAuditSystem.addWeaponAudit(entry));

    return weapon;
  }

  /**
   * Generate loot for a specific location and context
   */
  generateLocationLoot(context: LootGenerationContext): ItemBuilder[] {
    const weapons: ItemBuilder[] = [];

    // Generate base loot for this location
    const locationItems = LocationLootDistributor.generateLocationLoot(context);

    // Convert loot items to weapons where applicable
    for (const item of locationItems) {
      if (this.isWeaponItem(item.category)) {
        // Convert to weapon - this would need more sophisticated logic
        // For now, create a basic weapon representation
        const weapon = this.createWeaponFromLootItem(item, context);
        if (weapon) {
          weapons.push(weapon);
        }
      }
    }

    return weapons;
  }

  /**
   * Convert loot weapon data to advanced weapon config
   */
  private convertLootToAdvancedConfig(
    lootWeapon: any,
    baseType: string,
    weaponClass: WeaponClass,
    context: LootGenerationContext
  ): AdvancedWeaponConfig {
    return {
      baseType,
      weaponClass,
      manufacturer: lootWeapon.properties?.manufacturer || "Atlas",
      quality: this.calculateQualityFromLoot(lootWeapon, context),
      rarity: lootWeapon.rarity as keyof typeof rarityTiers,
      tier: this.calculateTierFromGamestage(context.gamestage),
      playerLevelRequirement: this.calculatePlayerLevelRequirement(
        context.gamestage
      ),
      playerLevelAtGeneration:
        context.playerLevel || Math.floor(context.gamestage / 10),
      masteryLevel: 0, // Would be loaded from player data
      prefixes: [], // Would be parsed from lootWeapon.properties
      suffixes: [],
      implicitAffixes: [],
      parts: [], // Would be parsed from lootWeapon.properties
      elementalType: ElementalType.None,
      triggeredEffects: [],
      modSlotCount: 4,
      baseStats: weaponClassStats[weaponClass],
    };
  }

  /**
   * Generate advanced weapon (copied from AdvancedWeaponGenerator)
   */
  private generateAdvancedWeapon(config: AdvancedWeaponConfig): ItemBuilder {
    const weaponHash = this.generateWeaponHash(config);

    // Check if we've already generated this exact weapon
    if (this.generatedWeapons.has(weaponHash)) {
      return this.generatedWeapons.get(weaponHash)!;
    }

    // Calculate final stats with all modifiers
    const finalStats = this.calculateFinalStats(config);

    // Generate unique weapon name
    const weaponName = this.generateUniqueWeaponName(config, weaponHash);

    // Create the weapon
    const weapon = new Builders.Item(weaponName)
      .extends(config.baseType)
      .tags(
        "weapon",
        config.weaponClass,
        config.rarity,
        `T${config.tier}`,
        `Q${config.quality}`
      )
      .displayType(config.weaponClass === "melee" ? "melee" : "rangedGun")
      .property("CustomIcon", weaponName.toLowerCase())
      .property("CustomIconTint", rarityTiers[config.rarity].color)
      .property("QualityTier", config.tier.toString())
      .property("Quality", config.quality.toString())
      .property(
        "EconomicValue",
        Math.round(this.calculateEconomicValue(config, finalStats))
      )
      .property("Weight", finalStats.weight.toFixed(2))
      .property("ShowQuality", "true")
      .property("UnlockedBy", `perkLevel${config.playerLevelRequirement}`)
      .property(
        "PlayerLevelRequirement",
        config.playerLevelRequirement.toString()
      )
      .property("RepairTools", "resourceRepairKit")
      .property("DegradationMax", finalStats.durability.toString())
      .property("MaxRange", finalStats.range.toString())
      .property("EntityDamage", finalStats.damage.toFixed(2))
      .property("BlockDamage", (finalStats.damage * 0.5).toFixed(2))
      .property("AttacksPerMinute", (finalStats.fireRate * 60).toString())
      .property("StaminaLoss", finalStats.staminaLoss.toFixed(2))
      .property("CritChance", finalStats.criticalChance.toFixed(3))
      .property("CritDamage", finalStats.criticalDamage.toFixed(2))
      .property(
        "DismembermentBaseChance",
        finalStats.dismemberChance.toFixed(3)
      )
      .property("Penetration", finalStats.penetration.toFixed(2))
      .property("Spread", finalStats.spread.toFixed(3))
      .property("Recoil", finalStats.recoil.toFixed(3))
      .property("MagazineSize", Math.round(finalStats.magazineSize).toString())
      .property("ReloadTime", finalStats.reloadSpeed.toFixed(2));

    // Cache the generated weapon
    this.generatedWeapons.set(weaponHash, weapon);

    return weapon;
  }

  /**
   * Calculate final stats (simplified version)
   */
  private calculateFinalStats(
    config: AdvancedWeaponConfig
  ): typeof config.baseStats {
    let stats = { ...config.baseStats };

    // Apply quality scaling
    stats = scaleWeaponStats(
      stats,
      config.playerLevelAtGeneration,
      config.tier,
      config.quality
    );

    // Apply stat variance
    stats = applyStatVariance(stats, 0.1);

    // Apply manufacturer modifiers
    const mfg = manufacturers[config.manufacturer];
    if (mfg) {
      Object.entries(mfg.statModifiers).forEach(([stat, modifier]) => {
        if (stat === "allStats") {
          Object.keys(stats).forEach((s) => {
            (stats as any)[s] *= 1 + modifier;
          });
        } else if (stat in stats) {
          (stats as any)[stat] *= 1 + modifier;
        }
      });
    }

    // Apply rarity multiplier
    const rarity = rarityTiers[config.rarity];
    stats.damage *= rarity.statMultiplier;
    stats.durability *= rarity.statMultiplier;

    return stats;
  }

  /**
   * Helper methods
   */
  private calculateQualityFromLoot(
    lootWeapon: any,
    context: LootGenerationContext
  ): number {
    // Convert loot weapon properties to quality value
    const tier = this.calculateTierFromGamestage(context.gamestage);
    const baseQuality = tier * 100;
    return Math.min(600, baseQuality + Math.floor(Math.random() * 100));
  }

  private calculateTierFromGamestage(gamestage: number): number {
    if (gamestage <= 25) return 1;
    if (gamestage <= 100) return 2;
    if (gamestage <= 300) return 3;
    if (gamestage <= 1000) return 4;
    return 5;
  }

  private calculatePlayerLevelRequirement(gamestage: number): number {
    return Math.max(1, Math.floor(gamestage / 10));
  }

  private isWeaponItem(category: string): boolean {
    return ["weapons", "rifle", "pistol", "shotgun", "melee"].includes(
      category
    );
  }

  private createWeaponFromLootItem(
    item: any,
    context: LootGenerationContext
  ): ItemBuilder | null {
    // Create a basic weapon representation from loot item
    // This is a simplified implementation
    const weapon = new Builders.Item(item.name)
      .property("EconomicValue", item.value.toString())
      .property("Weight", "1.0")
      .property("EntityDamage", "25");

    return weapon;
  }

  private generateWeaponHash(config: AdvancedWeaponConfig): string {
    const hashComponents = [
      config.baseType,
      config.manufacturer,
      config.quality,
      config.rarity,
      config.tier,
      config.playerLevelRequirement,
      config.playerLevelAtGeneration,
      config.masteryLevel,
    ];

    return hashComponents.join("_").replace(/\s+/g, "");
  }

  private generateUniqueWeaponName(
    config: AdvancedWeaponConfig,
    hash: string
  ): string {
    const parts = [
      config.manufacturer,
      config.weaponClass,
      `T${config.tier}Q${config.quality}`,
      hash.substring(0, 6),
    ];

    return parts.join("_").replace(/\s+/g, "");
  }

  private calculateEconomicValue(
    config: AdvancedWeaponConfig,
    stats: any
  ): number {
    let value = 100;
    value += stats.damage * 10;
    value *= 1 + config.quality / 100;
    value *= rarityTiers[config.rarity].statMultiplier * 2;
    return Math.round(value);
  }
}

// Re-export the config interface
export interface AdvancedWeaponConfig {
  baseType: string;
  weaponClass: WeaponClass;
  manufacturer: string;
  quality: number;
  rarity: keyof typeof rarityTiers;
  tier: number;
  playerLevelRequirement: number;
  playerLevelAtGeneration: number;
  masteryLevel: number;
  itemLevel?: number;
  prefixes: Affix[];
  suffixes: Affix[];
  implicitAffixes: Affix[];
  uniqueAffixes?: Affix[];
  parts: WeaponPart[];
  elementalType: ElementalType;
  triggeredEffects: TriggeredEffect[];
  modSlotCount: number;
  installedMods?: string[];
  baseStats: WeaponBaseStats;
}
