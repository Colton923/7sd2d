import * as fs from "fs";
import * as path from "path";
import { LootConfig, EconomyTierBasedLoot, TierLootConfig } from "./types";

export class LootConfigLoader {
  private static lootConfig: LootConfig | null = null;
  private static economyConfig: EconomyTierBasedLoot | null = null;
  private static tierConfig: { [tier: string]: TierLootConfig } | null = null;

  static loadLootConfig(): LootConfig {
    if (!this.lootConfig) {
      const configPath = path.join(__dirname, "loot_config.json");
      const configData = fs.readFileSync(configPath, "utf-8");
      this.lootConfig = JSON.parse(configData);
    }
    return this.lootConfig!;
  }

  static loadEconomyConfig(): EconomyTierBasedLoot {
    if (!this.economyConfig) {
      const configPath = path.join(__dirname, "economy_tier_based_loot.json");
      const configData = fs.readFileSync(configPath, "utf-8");
      this.economyConfig = JSON.parse(configData);
    }
    return this.economyConfig!;
  }

  static loadTierConfig(): { [tier: string]: TierLootConfig } {
    if (!this.tierConfig) {
      const configPath = path.join(__dirname, "tier_based_loot.json");
      const configData = fs.readFileSync(configPath, "utf-8");
      this.tierConfig = JSON.parse(configData);
    }
    return this.tierConfig!;
  }

  static getLootCategories() {
    return this.loadLootConfig().loot_categories;
  }

  static getSpawnLocations() {
    return this.loadLootConfig().spawn_locations;
  }

  static getRarityMultipliers() {
    return this.loadLootConfig().rarity_multipliers;
  }

  static getProgressionScaling() {
    return this.loadLootConfig().progression_scaling;
  }

  static getZombieDrops() {
    return this.loadLootConfig().zombie_drops;
  }

  static getSpecialEvents() {
    return this.loadLootConfig().special_events;
  }

  static getWeaponRarityScaling() {
    return this.loadEconomyConfig().weapon_rarity_scaling;
  }

  static getEquipmentByTier() {
    return this.loadEconomyConfig().equipment_by_tier;
  }

  static getSpecialDropsByBiome() {
    return this.loadEconomyConfig().special_drops_by_biome;
  }

  static getEconomicScaling() {
    return this.loadEconomyConfig().economic_scaling;
  }

  static getLootQuantityScaling() {
    return this.loadEconomyConfig().loot_quantity_scaling;
  }
}
