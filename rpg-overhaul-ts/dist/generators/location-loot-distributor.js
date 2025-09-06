"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationLootDistributor = void 0;
const config_1 = require("../config/loot/config");
class LocationLootDistributor {
    /**
     * Generate location-specific loot with biome considerations
     */
    static generateLocationLoot(context) {
        const items = [];
        // Get base loot for this location
        const baseLoot = this.generateBaseLocationLoot(context);
        items.push(...baseLoot);
        // Add biome-specific special drops
        const biomeLoot = this.generateBiomeSpecialLoot(context);
        items.push(...biomeLoot);
        // Apply location modifiers
        const modifiedItems = this.applyLocationModifiers(items, context);
        return modifiedItems;
    }
    /**
     * Generate base loot for a specific location
     */
    static generateBaseLocationLoot(context) {
        const items = [];
        const spawnLocations = config_1.LootConfigLoader.getSpawnLocations();
        const locationConfig = spawnLocations[context.location];
        if (!locationConfig) {
            console.warn(`No location config found for ${context.location}`);
            return items;
        }
        // Generate loot based on containers in this location
        for (const container of locationConfig.containers) {
            const containerLoot = this.generateContainerLoot(container, context);
            items.push(...containerLoot);
        }
        return items;
    }
    /**
     * Generate loot for a specific container type
     */
    static generateContainerLoot(containerType, context) {
        const items = [];
        // Container-specific loot tables would be defined here
        // For now, use a simplified approach
        const containerLootTable = this.getContainerLootTable(containerType);
        for (const lootEntry of containerLootTable) {
            if (Math.random() <= lootEntry.probability) {
                const quantity = this.rollQuantity(lootEntry.quantity.min, lootEntry.quantity.max);
                const item = {
                    name: lootEntry.itemName,
                    category: this.categorizeItem(lootEntry.itemName),
                    rarity: "Common", // Would be determined by loot generation
                    quantity: quantity,
                    value: this.calculateItemValue(lootEntry.itemName, quantity),
                    properties: {
                        container: containerType,
                        location: context.location,
                        gamestage: context.gamestage,
                    },
                };
                items.push(item);
            }
        }
        return items;
    }
    /**
     * Generate biome-specific special drops
     */
    static generateBiomeSpecialLoot(context) {
        const items = [];
        if (!context.biome)
            return items;
        const biomeDrops = config_1.LootConfigLoader.getSpecialDropsByBiome();
        const biomeConfig = biomeDrops[context.biome];
        if (!biomeConfig)
            return items;
        // Generate special drops for this biome
        const specialItems = this.selectBiomeSpecialDrops(biomeConfig, context.difficulty);
        for (const itemName of specialItems) {
            const item = {
                name: itemName,
                category: "special",
                rarity: this.determineBiomeRarity(context.difficulty),
                quantity: 1,
                value: this.calculateSpecialItemValue(itemName),
                properties: {
                    biome: context.biome,
                    special: true,
                    location: context.location,
                    gamestage: context.gamestage,
                },
            };
            items.push(item);
        }
        return items;
    }
    /**
     * Select special drops based on biome and difficulty
     */
    static selectBiomeSpecialDrops(biomeConfig, difficulty) {
        const selectedItems = [];
        const allDrops = [
            ...biomeConfig.common,
            ...biomeConfig.uncommon,
            ...biomeConfig.rare,
        ];
        // Select 1-3 items based on difficulty
        const itemCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < itemCount && allDrops.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * allDrops.length);
            selectedItems.push(allDrops[randomIndex]);
            allDrops.splice(randomIndex, 1);
        }
        return selectedItems;
    }
    /**
     * Apply location-specific modifiers to items
     */
    static applyLocationModifiers(items, context) {
        const spawnLocations = config_1.LootConfigLoader.getSpawnLocations();
        const locationConfig = spawnLocations[context.location];
        if (!locationConfig)
            return items;
        const lootAbundance = locationConfig.loot_abundance;
        return items.map((item) => ({
            ...item,
            quantity: Math.floor(item.quantity * lootAbundance),
            value: Math.floor(item.value * lootAbundance),
            properties: {
                ...item.properties,
                lootAbundance: lootAbundance,
                locationModifier: lootAbundance > 1.0 ? "rich" : "poor",
            },
        }));
    }
    /**
     * Get loot table for a specific container type
     */
    static getContainerLootTable(containerType) {
        // This would be loaded from configuration files
        // Simplified example for demonstration
        const lootTables = {
            medicine_cabinet: [
                { itemName: "bandage", probability: 0.8, quantity: { min: 1, max: 3 } },
                {
                    itemName: "firstAidKit",
                    probability: 0.3,
                    quantity: { min: 1, max: 1 },
                },
                {
                    itemName: "painkillers",
                    probability: 0.5,
                    quantity: { min: 1, max: 2 },
                },
            ],
            kitchen_cupboard: [
                {
                    itemName: "cannedFood",
                    probability: 0.7,
                    quantity: { min: 1, max: 4 },
                },
                {
                    itemName: "bottledWater",
                    probability: 0.6,
                    quantity: { min: 1, max: 3 },
                },
                {
                    itemName: "cookingTools",
                    probability: 0.4,
                    quantity: { min: 1, max: 2 },
                },
            ],
            bedroom_dresser: [
                { itemName: "clothes", probability: 0.9, quantity: { min: 1, max: 2 } },
                { itemName: "jewelry", probability: 0.2, quantity: { min: 1, max: 1 } },
                { itemName: "books", probability: 0.6, quantity: { min: 1, max: 3 } },
            ],
            store_shelf: [
                {
                    itemName: "cannedFood",
                    probability: 0.8,
                    quantity: { min: 2, max: 6 },
                },
                {
                    itemName: "bottledWater",
                    probability: 0.7,
                    quantity: { min: 2, max: 5 },
                },
                { itemName: "tools", probability: 0.5, quantity: { min: 1, max: 3 } },
                {
                    itemName: "electronics",
                    probability: 0.3,
                    quantity: { min: 1, max: 2 },
                },
            ],
            military_weapon_case: [
                {
                    itemName: "militaryRifle",
                    probability: 0.4,
                    quantity: { min: 1, max: 1 },
                },
                {
                    itemName: "ammoMilitary",
                    probability: 0.8,
                    quantity: { min: 10, max: 50 },
                },
                {
                    itemName: "militaryArmor",
                    probability: 0.6,
                    quantity: { min: 1, max: 1 },
                },
            ],
        };
        return lootTables[containerType] || [];
    }
    /**
     * Determine biome-specific rarity
     */
    static determineBiomeRarity(difficulty) {
        const roll = Math.random() * 100;
        if (difficulty >= 5) {
            if (roll <= 50)
                return "Rare";
            if (roll <= 80)
                return "Epic";
            return "Legendary";
        }
        else if (difficulty >= 3) {
            if (roll <= 60)
                return "Uncommon";
            if (roll <= 90)
                return "Rare";
            return "Epic";
        }
        else {
            if (roll <= 70)
                return "Common";
            if (roll <= 95)
                return "Uncommon";
            return "Rare";
        }
    }
    /**
     * Categorize an item based on its name
     */
    static categorizeItem(itemName) {
        const categories = {
            food: ["cannedFood", "bottledWater", "rawMeat"],
            medical: ["bandage", "firstAidKit", "painkillers"],
            weapons: ["rifle", "pistol", "shotgun", "militaryRifle"],
            armor: ["militaryArmor", "clothes"],
            tools: ["tools", "cookingTools"],
            ammo: ["ammoMilitary", "ammo9mm"],
            electronics: ["electronics"],
        };
        for (const [category, items] of Object.entries(categories)) {
            if (items.some((item) => itemName.includes(item))) {
                return category;
            }
        }
        return "misc";
    }
    /**
     * Calculate item value
     */
    static calculateItemValue(itemName, quantity) {
        const baseValues = {
            bandage: 5,
            firstAidKit: 25,
            painkillers: 8,
            cannedFood: 12,
            bottledWater: 8,
            clothes: 15,
            tools: 20,
            electronics: 30,
            militaryRifle: 200,
            ammoMilitary: 2,
            militaryArmor: 150,
        };
        const baseValue = baseValues[itemName] || 10;
        return baseValue * quantity;
    }
    /**
     * Calculate special item value
     */
    static calculateSpecialItemValue(itemName) {
        const specialValues = {
            witchsBrew: 75,
            cursedBone: 50,
            swampGem: 100,
            oasisWater: 60,
            mirageStone: 80,
            pharaohsGold: 150,
            eternalIce: 90,
            northernLights: 120,
            vikingTreasure: 200,
            militaryIntel: 85,
            experimentalTech: 110,
            corporateSecrets: 95,
        };
        return specialValues[itemName] || 50;
    }
    /**
     * Roll quantity between min and max
     */
    static rollQuantity(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * Get location-specific loot probabilities
     */
    static getLocationLootProbability(location, gamestage) {
        const spawnLocations = config_1.LootConfigLoader.getSpawnLocations();
        const locationConfig = spawnLocations[location];
        if (!locationConfig) {
            return { baseProbability: 0.1, lootAbundance: 1.0 };
        }
        // Adjust probability based on gamestage
        const gamestageModifier = Math.min(1.0, gamestage / 100);
        const baseProbability = 0.15 * gamestageModifier;
        return {
            baseProbability: Math.min(0.9, baseProbability),
            lootAbundance: locationConfig.loot_abundance,
        };
    }
}
exports.LocationLootDistributor = LocationLootDistributor;
//# sourceMappingURL=location-loot-distributor.js.map