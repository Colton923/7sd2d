"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootConfigLoader = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class LootConfigLoader {
    static loadLootConfig() {
        if (!this.lootConfig) {
            const configPath = path.join(__dirname, "loot_config.json");
            const configData = fs.readFileSync(configPath, "utf-8");
            this.lootConfig = JSON.parse(configData);
        }
        return this.lootConfig;
    }
    static loadEconomyConfig() {
        if (!this.economyConfig) {
            const configPath = path.join(__dirname, "economy_tier_based_loot.json");
            const configData = fs.readFileSync(configPath, "utf-8");
            this.economyConfig = JSON.parse(configData);
        }
        return this.economyConfig;
    }
    static loadTierConfig() {
        if (!this.tierConfig) {
            const configPath = path.join(__dirname, "tier_based_loot.json");
            const configData = fs.readFileSync(configPath, "utf-8");
            this.tierConfig = JSON.parse(configData);
        }
        return this.tierConfig;
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
exports.LootConfigLoader = LootConfigLoader;
LootConfigLoader.lootConfig = null;
LootConfigLoader.economyConfig = null;
LootConfigLoader.tierConfig = null;
//# sourceMappingURL=config.js.map