"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootIntegratedWeaponGenerator = exports.ElementalType = void 0;
const mod_builder_1 = require("@7d2d/mod-builder");
const manufacturers_1 = require("../config/manufacturers");
const elemental_effects_1 = require("../data/elemental-effects");
Object.defineProperty(exports, "ElementalType", { enumerable: true, get: function () { return elemental_effects_1.ElementalType; } });
const weapon_base_stats_1 = require("../data/weapon-base-stats");
const stat_scaling_1 = require("../data/stat-scaling");
// Import loot system
const weapon_loot_generator_1 = require("./weapon-loot-generator");
const location_loot_distributor_1 = require("./location-loot-distributor");
const weapon_audit_system_1 = require("../utils/weapon-audit-system");
/**
 * Loot-Integrated Weapon Generator
 *
 * This generator combines the advanced weapon generation with the loot system
 * to create weapons that spawn according to game rules and progression.
 */
class LootIntegratedWeaponGenerator {
    constructor() {
        this.generatedWeapons = new Map();
        this.lootGenerator = new weapon_loot_generator_1.WeaponLootGenerator();
    }
    /**
     * Generate a weapon using the loot system
     */
    generateWeaponFromLoot(baseType, weaponClass, context) {
        // Use the loot system to determine weapon properties
        const { result, audit } = weapon_loot_generator_1.WeaponLootGenerator.generateWeaponLoot(context);
        if (result.length === 0) {
            return null; // No weapon generated for this context
        }
        const lootWeapon = result[0];
        // Convert loot weapon data to advanced weapon config
        const config = this.convertLootToAdvancedConfig(lootWeapon, baseType, weaponClass, context);
        // Generate the weapon using the advanced generator
        const weapon = this.generateAdvancedWeapon(config);
        // Add to audit system
        audit.forEach((entry) => weapon_audit_system_1.WeaponAuditSystem.addWeaponAudit(entry));
        return weapon;
    }
    /**
     * Generate loot for a specific location and context
     */
    generateLocationLoot(context) {
        const weapons = [];
        // Generate base loot for this location
        const locationItems = location_loot_distributor_1.LocationLootDistributor.generateLocationLoot(context);
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
    convertLootToAdvancedConfig(lootWeapon, baseType, weaponClass, context) {
        return {
            baseType,
            weaponClass,
            manufacturer: lootWeapon.properties?.manufacturer || "Atlas",
            quality: this.calculateQualityFromLoot(lootWeapon, context),
            rarity: lootWeapon.rarity,
            tier: this.calculateTierFromGamestage(context.gamestage),
            playerLevelRequirement: this.calculatePlayerLevelRequirement(context.gamestage),
            playerLevelAtGeneration: context.playerLevel || Math.floor(context.gamestage / 10),
            masteryLevel: 0, // Would be loaded from player data
            prefixes: [], // Would be parsed from lootWeapon.properties
            suffixes: [],
            implicitAffixes: [],
            parts: [], // Would be parsed from lootWeapon.properties
            elementalType: elemental_effects_1.ElementalType.None,
            triggeredEffects: [],
            modSlotCount: 4,
            baseStats: weapon_base_stats_1.weaponClassStats[weaponClass],
        };
    }
    /**
     * Generate advanced weapon (copied from AdvancedWeaponGenerator)
     */
    generateAdvancedWeapon(config) {
        const weaponHash = this.generateWeaponHash(config);
        // Check if we've already generated this exact weapon
        if (this.generatedWeapons.has(weaponHash)) {
            return this.generatedWeapons.get(weaponHash);
        }
        // Calculate final stats with all modifiers
        const finalStats = this.calculateFinalStats(config);
        // Generate unique weapon name
        const weaponName = this.generateUniqueWeaponName(config, weaponHash);
        // Create the weapon
        const weapon = new mod_builder_1.Builders.Item(weaponName)
            .extends(config.baseType)
            .tags("weapon", config.weaponClass, config.rarity, `T${config.tier}`, `Q${config.quality}`)
            .displayType(config.weaponClass === "melee" ? "melee" : "rangedGun")
            .property("CustomIcon", weaponName.toLowerCase())
            .property("CustomIconTint", manufacturers_1.rarityTiers[config.rarity].color)
            .property("QualityTier", config.tier.toString())
            .property("Quality", config.quality.toString())
            .property("EconomicValue", Math.round(this.calculateEconomicValue(config, finalStats)))
            .property("Weight", finalStats.weight.toFixed(2))
            .property("ShowQuality", "true")
            .property("UnlockedBy", `perkLevel${config.playerLevelRequirement}`)
            .property("PlayerLevelRequirement", config.playerLevelRequirement.toString())
            .property("RepairTools", "resourceRepairKit")
            .property("DegradationMax", finalStats.durability.toString())
            .property("MaxRange", finalStats.range.toString())
            .property("EntityDamage", finalStats.damage.toFixed(2))
            .property("BlockDamage", (finalStats.damage * 0.5).toFixed(2))
            .property("AttacksPerMinute", (finalStats.fireRate * 60).toString())
            .property("StaminaLoss", finalStats.staminaLoss.toFixed(2))
            .property("CritChance", finalStats.criticalChance.toFixed(3))
            .property("CritDamage", finalStats.criticalDamage.toFixed(2))
            .property("DismembermentBaseChance", finalStats.dismemberChance.toFixed(3))
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
    calculateFinalStats(config) {
        let stats = { ...config.baseStats };
        // Apply quality scaling
        stats = (0, stat_scaling_1.scaleWeaponStats)(stats, config.playerLevelAtGeneration, config.tier, config.quality);
        // Apply stat variance
        stats = (0, stat_scaling_1.applyStatVariance)(stats, 0.1);
        // Apply manufacturer modifiers
        const mfg = manufacturers_1.manufacturers[config.manufacturer];
        if (mfg) {
            Object.entries(mfg.statModifiers).forEach(([stat, modifier]) => {
                if (stat === "allStats") {
                    Object.keys(stats).forEach((s) => {
                        stats[s] *= 1 + modifier;
                    });
                }
                else if (stat in stats) {
                    stats[stat] *= 1 + modifier;
                }
            });
        }
        // Apply rarity multiplier
        const rarity = manufacturers_1.rarityTiers[config.rarity];
        stats.damage *= rarity.statMultiplier;
        stats.durability *= rarity.statMultiplier;
        return stats;
    }
    /**
     * Helper methods
     */
    calculateQualityFromLoot(lootWeapon, context) {
        // Convert loot weapon properties to quality value
        const tier = this.calculateTierFromGamestage(context.gamestage);
        const baseQuality = tier * 100;
        return Math.min(600, baseQuality + Math.floor(Math.random() * 100));
    }
    calculateTierFromGamestage(gamestage) {
        if (gamestage <= 25)
            return 1;
        if (gamestage <= 100)
            return 2;
        if (gamestage <= 300)
            return 3;
        if (gamestage <= 1000)
            return 4;
        return 5;
    }
    calculatePlayerLevelRequirement(gamestage) {
        return Math.max(1, Math.floor(gamestage / 10));
    }
    isWeaponItem(category) {
        return ["weapons", "rifle", "pistol", "shotgun", "melee"].includes(category);
    }
    createWeaponFromLootItem(item, context) {
        // Create a basic weapon representation from loot item
        // This is a simplified implementation
        const weapon = new mod_builder_1.Builders.Item(item.name)
            .property("EconomicValue", item.value.toString())
            .property("Weight", "1.0")
            .property("EntityDamage", "25");
        return weapon;
    }
    generateWeaponHash(config) {
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
    generateUniqueWeaponName(config, hash) {
        const parts = [
            config.manufacturer,
            config.weaponClass,
            `T${config.tier}Q${config.quality}`,
            hash.substring(0, 6),
        ];
        return parts.join("_").replace(/\s+/g, "");
    }
    calculateEconomicValue(config, stats) {
        let value = 100;
        value += stats.damage * 10;
        value *= 1 + config.quality / 100;
        value *= manufacturers_1.rarityTiers[config.rarity].statMultiplier * 2;
        return Math.round(value);
    }
}
exports.LootIntegratedWeaponGenerator = LootIntegratedWeaponGenerator;
//# sourceMappingURL=loot-integrated-weapon-generator.js.map