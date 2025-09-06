import { LootGenerationContext, LootGenerationResult } from "../config/loot/types";
export declare class LootGenerator {
    private static random;
    /**
     * Generate loot for a specific context (location, gamestage, etc.)
     */
    static generateLoot(context: LootGenerationContext): LootGenerationResult;
    /**
     * Generate a single loot item
     */
    private static generateSingleItem;
    /**
     * Determine loot tier based on gamestage
     */
    protected static determineLootTier(gamestage: number): string;
    /**
     * Get available loot categories for the current context
     */
    private static getAvailableCategories;
    /**
     * Determine item rarity based on gamestage and category
     */
    private static determineRarity;
    /**
     * Generate item properties based on category and rarity
     */
    private static generateItemProperties;
    /**
     * Roll the number of items to generate
     */
    private static rollItemCount;
    /**
     * Roll quantity for a specific item
     */
    private static rollQuantity;
    /**
     * Calculate item value based on rarity, category, and gamestage
     */
    private static calculateItemValue;
    /**
     * Set random seed for reproducible results (useful for testing)
     */
    static setSeed(seed: number): void;
    /**
     * Reset to default random function
     */
    static resetRandom(): void;
}
//# sourceMappingURL=loot-generator.d.ts.map