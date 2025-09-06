"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootGenerator = void 0;
const config_1 = require("../config/loot/config");
class LootGenerator {
    /**
     * Generate loot for a specific context (location, gamestage, etc.)
     */
    static generateLoot(context) {
        const result = {
            items: [],
            totalValue: 0,
            rarityDistribution: {},
            categoryBreakdown: {},
        };
        // Determine loot tier based on gamestage
        const lootTier = this.determineLootTier(context.gamestage);
        // Get available loot categories for this context
        const availableCategories = this.getAvailableCategories(context);
        // Generate items based on tier configuration
        const tierConfig = config_1.LootConfigLoader.loadTierConfig()[lootTier];
        if (!tierConfig) {
            console.warn(`No tier configuration found for tier ${lootTier}`);
            return result;
        }
        // Determine number of items to generate
        const itemCount = this.rollItemCount(tierConfig);
        for (let i = 0; i < itemCount; i++) {
            const item = this.generateSingleItem(context, availableCategories);
            if (item) {
                result.items.push(item);
                result.totalValue += item.value;
                // Update statistics
                result.rarityDistribution[item.rarity] =
                    (result.rarityDistribution[item.rarity] || 0) + 1;
                result.categoryBreakdown[item.category] =
                    (result.categoryBreakdown[item.category] || 0) + 1;
            }
        }
        return result;
    }
    /**
     * Generate a single loot item
     */
    static generateSingleItem(context, availableCategories) {
        if (availableCategories.length === 0)
            return null;
        // Select random category
        const category = availableCategories[Math.floor(this.random() * availableCategories.length)];
        // Get category config
        const categoryConfig = config_1.LootConfigLoader.getLootCategories()[category];
        if (!categoryConfig)
            return null;
        // Determine rarity based on gamestage and category
        const rarity = this.determineRarity(context.gamestage, category);
        // Generate item properties based on category and rarity
        const itemProperties = this.generateItemProperties(category, rarity, context);
        return {
            name: itemProperties.name,
            category: category,
            rarity: rarity,
            quantity: itemProperties.quantity,
            value: itemProperties.value,
            properties: itemProperties.additionalProperties,
        };
    }
    /**
     * Determine loot tier based on gamestage
     */
    static determineLootTier(gamestage) {
        if (gamestage <= 25)
            return "tier_1";
        if (gamestage <= 100)
            return "tier_2";
        if (gamestage <= 300)
            return "tier_3";
        if (gamestage <= 1000)
            return "tier_4";
        return "tier_5";
    }
    /**
     * Get available loot categories for the current context
     */
    static getAvailableCategories(context) {
        const allCategories = config_1.LootConfigLoader.getLootCategories();
        const availableCategories = [];
        for (const [categoryName, category] of Object.entries(allCategories)) {
            // Check gamestage requirements
            if (context.gamestage < category.gamestage_min ||
                context.gamestage > category.gamestage_max) {
                continue;
            }
            // Check location requirements
            if (category.spawn_locations.length > 0 &&
                !category.spawn_locations.includes(context.location)) {
                continue;
            }
            // Check probability
            if (this.random() > category.base_probability) {
                continue;
            }
            availableCategories.push(categoryName);
        }
        return availableCategories;
    }
    /**
     * Determine item rarity based on gamestage and category
     */
    static determineRarity(gamestage, category) {
        const weaponScaling = config_1.LootConfigLoader.getWeaponRarityScaling();
        // For weapon categories, use weapon-specific rarity scaling
        if (category.includes("weapons")) {
            const tier = this.determineLootTier(gamestage);
            const tierScaling = weaponScaling[tier];
            if (tierScaling) {
                const roll = this.random() * 100;
                let cumulative = 0;
                for (const [rarity, chance] of Object.entries(tierScaling)) {
                    if (rarity === "drop_chance" || rarity === "description")
                        continue;
                    const chanceValue = typeof chance === 'number' ? chance : 0;
                    cumulative += chanceValue;
                    if (roll <= cumulative) {
                        return rarity;
                    }
                }
            }
        }
        // Default rarity determination
        const roll = this.random() * 100;
        if (roll <= 60)
            return "Common";
        if (roll <= 85)
            return "Uncommon";
        if (roll <= 95)
            return "Rare";
        if (roll <= 99)
            return "Epic";
        return "Legendary";
    }
    /**
     * Generate item properties based on category and rarity
     */
    static generateItemProperties(category, rarity, context) {
        // This is a simplified implementation - in practice, you'd have
        // specific generators for each category
        const baseName = `${rarity} ${category.replace("_", " ")} Item`;
        const quantity = this.rollQuantity(category);
        const value = this.calculateItemValue(rarity, category, context.gamestage);
        return {
            name: baseName,
            quantity: quantity,
            value: value,
            additionalProperties: {
                gamestage: context.gamestage,
                location: context.location,
                generated: new Date().toISOString(),
            },
        };
    }
    /**
     * Roll the number of items to generate
     */
    static rollItemCount(tierConfig) {
        const { drop_chance, max_items } = tierConfig;
        if (this.random() > drop_chance / 100) {
            return 0;
        }
        return Math.floor(this.random() * max_items) + 1;
    }
    /**
     * Roll quantity for a specific item
     */
    static rollQuantity(category) {
        const scaling = config_1.LootConfigLoader.getLootQuantityScaling();
        const tier = this.determineLootTier(100); // Default tier for quantity
        const tierScaling = scaling[tier];
        if (tierScaling) {
            return (Math.floor(this.random() * (tierScaling.max - tierScaling.min + 1)) +
                tierScaling.min);
        }
        return 1;
    }
    /**
     * Calculate item value based on rarity, category, and gamestage
     */
    static calculateItemValue(rarity, category, gamestage) {
        const rarityMultipliers = config_1.LootConfigLoader.getRarityMultipliers();
        const economicScaling = config_1.LootConfigLoader.getEconomicScaling();
        const tier = this.determineLootTier(gamestage);
        const rarityMultiplier = rarityMultipliers[rarity] || 1.0;
        const economicMultiplier = economicScaling[tier] || 1.0;
        const baseValue = 10; // Base value for common items
        return Math.floor(baseValue * rarityMultiplier * economicMultiplier);
    }
    /**
     * Set random seed for reproducible results (useful for testing)
     */
    static setSeed(seed) {
        // Simple seeded random number generator
        let x = seed;
        this.random = () => {
            x = (x * 9301 + 49297) % 233280;
            return x / 233280;
        };
    }
    /**
     * Reset to default random function
     */
    static resetRandom() {
        this.random = Math.random;
    }
}
exports.LootGenerator = LootGenerator;
LootGenerator.random = Math.random;
//# sourceMappingURL=loot-generator.js.map