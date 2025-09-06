import { LootGenerationContext, GeneratedLootItem } from "../config/loot/types";
export declare class LocationLootDistributor {
    /**
     * Generate location-specific loot with biome considerations
     */
    static generateLocationLoot(context: LootGenerationContext): GeneratedLootItem[];
    /**
     * Generate base loot for a specific location
     */
    private static generateBaseLocationLoot;
    /**
     * Generate loot for a specific container type
     */
    private static generateContainerLoot;
    /**
     * Generate biome-specific special drops
     */
    private static generateBiomeSpecialLoot;
    /**
     * Select special drops based on biome and difficulty
     */
    private static selectBiomeSpecialDrops;
    /**
     * Apply location-specific modifiers to items
     */
    private static applyLocationModifiers;
    /**
     * Get loot table for a specific container type
     */
    private static getContainerLootTable;
    /**
     * Determine biome-specific rarity
     */
    private static determineBiomeRarity;
    /**
     * Categorize an item based on its name
     */
    private static categorizeItem;
    /**
     * Calculate item value
     */
    private static calculateItemValue;
    /**
     * Calculate special item value
     */
    private static calculateSpecialItemValue;
    /**
     * Roll quantity between min and max
     */
    private static rollQuantity;
    /**
     * Get location-specific loot probabilities
     */
    static getLocationLootProbability(location: string, gamestage: number): {
        baseProbability: number;
        lootAbundance: number;
    };
}
//# sourceMappingURL=location-loot-distributor.d.ts.map