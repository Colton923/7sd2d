"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaponGenerator = void 0;
const mod_builder_1 = require("@7d2d/mod-builder");
const manufacturers_1 = require("../config/manufacturers");
class WeaponGenerator {
    constructor() {
        this.weapons = [];
    }
    generateWeapon(config) {
        const mfg = manufacturers_1.manufacturers[config.manufacturer];
        const rarity = manufacturers_1.rarityTiers[config.rarity];
        // Calculate final stats based on manufacturer and rarity
        const finalStats = this.calculateStats(config.baseStats, mfg, rarity, config.tier, config.level);
        // Generate weapon name
        const weaponName = this.generateWeaponName(config);
        // Create weapon using 7d2d-ts builders
        const weapon = new mod_builder_1.Builders.Item(weaponName)
            .extends(config.baseType)
            .tags('weapon', config.baseType.includes('melee') ? 'melee' : 'ranged', config.rarity)
            .displayType(config.baseType.includes('melee') ? 'melee' : 'rangedGun')
            .property('CustomIcon', weaponName.toLowerCase())
            .property('CustomIconTint', rarity.color)
            .property('QualityTier', config.tier.toString())
            .property('EconomicValue', Math.round(finalStats.damage * 10 * rarity.statMultiplier))
            .property('Weight', 5)
            .property('ShowQuality', 'true')
            .property('Tags', `T${config.tier}_${config.rarity}`)
            .property('UnlockedBy', `perkLevel${config.level}`)
            .property('RepairTools', 'resourceRepairKit')
            .property('DegradationMax', finalStats.durability.toString())
            .property('MaxRange', finalStats.range.toString())
            .property('EntityDamage', finalStats.damage.toString())
            .property('BlockDamage', Math.round(finalStats.damage * 0.5).toString())
            .property('AttacksPerMinute', (finalStats.fireRate * 60).toString())
            .property('StaminaLoss', finalStats.staminaLoss.toString());
        // Add manufacturer-specific properties
        if (mfg.specialization.includes('elemental')) {
            weapon.property('DamageType', 'heat');
            weapon.property('ElementalDamage', Math.round(finalStats.damage * 0.3).toString());
        }
        if (finalStats.criticalChance) {
            weapon.property('CritChance', finalStats.criticalChance.toString());
        }
        if (finalStats.dismemberChance) {
            weapon.property('DismembermentBaseChance', finalStats.dismemberChance.toString());
        }
        // Add mod slots based on rarity
        const modSlots = Array(6).fill(0).map((_, i) => i < config.tier ? rarity.modSlots : Math.max(1, rarity.modSlots - 1));
        weapon.property('ModSlots', modSlots.join(','));
        this.weapons.push(weapon);
        return weapon;
    }
    calculateStats(baseStats, manufacturer, rarity, tier, level) {
        const stats = { ...baseStats };
        // Apply manufacturer modifiers
        Object.entries(manufacturer.statModifiers).forEach(([stat, modifier]) => {
            if (stat === 'allStats') {
                Object.keys(stats).forEach(s => {
                    stats[s] *= (1 + modifier);
                });
            }
            else if (stat in stats) {
                stats[stat] *= (1 + modifier);
            }
        });
        // Apply rarity multiplier
        Object.keys(stats).forEach(stat => {
            stats[stat] *= rarity.statMultiplier;
        });
        // Apply tier scaling
        const tierMultiplier = 0.8 + (tier - 1) * 0.4;
        stats.damage *= tierMultiplier;
        stats.durability *= tierMultiplier;
        // Apply level scaling
        const levelMultiplier = 1 + (level - 1) * 0.02;
        stats.damage *= levelMultiplier;
        stats.range *= Math.min(1.5, levelMultiplier);
        return stats;
    }
    generateWeaponName(config) {
        const parts = [];
        // Add rarity prefix for higher tiers
        if (['rare', 'epic', 'legendary'].includes(config.rarity)) {
            parts.push(config.rarity);
        }
        // Add manufacturer
        parts.push(config.manufacturer);
        // Add base type
        const baseTypeName = config.baseType
            .replace('gun', '')
            .replace('melee', '')
            .replace('Wpn', '');
        parts.push(baseTypeName);
        // Add tier
        parts.push(`T${config.tier}`);
        return parts.join('_').replace(/\s+/g, '_');
    }
    generateWeaponSet(baseType, baseStats, options = {}) {
        const mfgs = options.manufacturers || Object.keys(manufacturers_1.manufacturers);
        const rarities = options.rarities || Object.keys(manufacturers_1.rarityTiers);
        const tiers = options.tiers || [1, 2, 3, 4, 5, 6];
        const levels = options.levels || [1, 10, 20, 30, 40, 50];
        const weapons = [];
        for (const manufacturer of mfgs) {
            for (const rarity of rarities) {
                for (const tier of tiers) {
                    for (const level of levels) {
                        // Skip invalid combinations
                        if (tier === 6 && rarity === 'common')
                            continue;
                        if (tier === 1 && rarity === 'legendary')
                            continue;
                        const weapon = this.generateWeapon({
                            baseType,
                            manufacturer,
                            rarity,
                            tier,
                            level,
                            baseStats
                        });
                        weapons.push(weapon);
                    }
                }
            }
        }
        return weapons;
    }
    build() {
        return this.weapons.map(w => w.build());
    }
    getWeapons() {
        return this.weapons;
    }
}
exports.WeaponGenerator = WeaponGenerator;
//# sourceMappingURL=weapon-generator.js.map