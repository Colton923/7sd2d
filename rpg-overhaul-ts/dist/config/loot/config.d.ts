import { LootConfig, EconomyTierBasedLoot, TierLootConfig } from "./types";
export declare class LootConfigLoader {
    private static lootConfig;
    private static economyConfig;
    private static tierConfig;
    static loadLootConfig(): LootConfig;
    static loadEconomyConfig(): EconomyTierBasedLoot;
    static loadTierConfig(): {
        [tier: string]: TierLootConfig;
    };
    static getLootCategories(): {
        [category: string]: import("./types").LootCategory;
    };
    static getSpawnLocations(): {
        [location: string]: import("./types").SpawnLocation;
    };
    static getRarityMultipliers(): import("./types").RarityMultipliers;
    static getProgressionScaling(): {
        early_game: import("./types").ProgressionScaling;
        mid_game: import("./types").ProgressionScaling;
        late_game: import("./types").ProgressionScaling;
        end_game: import("./types").ProgressionScaling;
    };
    static getZombieDrops(): {
        [tier: string]: import("./types").ZombieDropTier;
    };
    static getSpecialEvents(): {
        supply_drops: import("./types").SpecialEvent;
        trader_quests: import("./types").SpecialEvent;
        dungeon_loot: import("./types").SpecialEvent;
    };
    static getWeaponRarityScaling(): {
        [tier: string]: import("./types").WeaponRarityScaling;
    };
    static getEquipmentByTier(): {
        [tier: string]: import("./types").EquipmentByTier;
    };
    static getSpecialDropsByBiome(): {
        [biome: string]: import("./types").SpecialDropByBiome;
    };
    static getEconomicScaling(): {
        [tier: string]: number;
    };
    static getLootQuantityScaling(): {
        [tier: string]: {
            min: number;
            max: number;
        };
    };
}
//# sourceMappingURL=config.d.ts.map