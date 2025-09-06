"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedWeaponGenerator = exports.ElementalType = void 0;
const mod_builder_1 = require("@7d2d/mod-builder");
const manufacturers_1 = require("../config/manufacturers");
const affixes_1 = require("../data/affixes");
const weapon_parts_1 = require("../data/weapon-parts");
const elemental_effects_1 = require("../data/elemental-effects");
Object.defineProperty(exports, "ElementalType", { enumerable: true, get: function () { return elemental_effects_1.ElementalType; } });
const triggered_effects_1 = require("../data/triggered-effects");
const weapon_base_stats_1 = require("../data/weapon-base-stats");
const stat_scaling_1 = require("../data/stat-scaling");
class AdvancedWeaponGenerator {
    constructor() {
        this.generatedWeapons = new Map();
        // Databases are now imported from external files
    }
    // Databases are loaded from external files - no initialization needed
    generateWeapon(config) {
        const weaponHash = this.generateWeaponHash(config);
        // Check if we've already generated this exact weapon
        if (this.generatedWeapons.has(weaponHash)) {
            return this.generatedWeapons.get(weaponHash);
        }
        // Calculate final stats with all modifiers
        const finalStats = this.calculateFinalStats(config);
        // Generate unique weapon name
        const weaponName = this.generateUniqueWeaponName(config, weaponHash);
        // Create the weapon using 7d2d-ts builders
        const weapon = new mod_builder_1.Builders.Item(weaponName)
            .extends(config.baseType)
            .tags('weapon', config.weaponClass, config.rarity, `T${config.tier}`, `Q${config.quality}`)
            .displayType(config.weaponClass === 'melee' ? 'melee' : 'rangedGun')
            .property('CustomIcon', weaponName.toLowerCase())
            .property('CustomIconTint', manufacturers_1.rarityTiers[config.rarity].color)
            .property('QualityTier', config.tier.toString())
            .property('Quality', config.quality.toString())
            .property('EconomicValue', Math.round(this.calculateEconomicValue(config, finalStats)))
            .property('Weight', finalStats.weight.toFixed(2))
            .property('ShowQuality', 'true')
            .property('UnlockedBy', `perkLevel${config.playerLevelRequirement}`)
            .property('PlayerLevelRequirement', config.playerLevelRequirement.toString())
            .property('MasteryRequirement', config.masteryLevel.toString())
            .property('ItemLevel', (config.itemLevel || 1).toString())
            .property('GeneratedAtPlayerLevel', config.playerLevelAtGeneration.toString())
            .property('RepairTools', 'resourceRepairKit')
            .property('DegradationMax', finalStats.durability.toString())
            .property('MaxRange', finalStats.range.toString())
            .property('EntityDamage', finalStats.damage.toFixed(2))
            .property('BlockDamage', (finalStats.damage * 0.5).toFixed(2))
            .property('AttacksPerMinute', (finalStats.fireRate * 60).toString())
            .property('StaminaLoss', finalStats.staminaLoss.toFixed(2))
            .property('CritChance', finalStats.criticalChance.toFixed(3))
            .property('CritDamage', finalStats.criticalDamage.toFixed(2))
            .property('DismembermentBaseChance', finalStats.dismemberChance.toFixed(3))
            .property('Penetration', finalStats.penetration.toFixed(2))
            .property('Spread', finalStats.spread.toFixed(3))
            .property('Recoil', finalStats.recoil.toFixed(3))
            .property('MagazineSize', Math.round(finalStats.magazineSize).toString())
            .property('ReloadTime', finalStats.reloadSpeed.toFixed(2));
        // Add elemental properties
        if (config.elementalType !== elemental_effects_1.ElementalType.None) {
            this.addElementalProperties(weapon, config.elementalType, finalStats);
        }
        // Add affix descriptions
        this.addAffixDescriptions(weapon, config);
        // Add triggered effects
        this.addTriggeredEffects(weapon, config.triggeredEffects);
        // Add mod slots
        weapon.property('ModSlots', this.generateModSlots(config));
        // Add part bonuses
        this.addPartBonuses(weapon, config.parts);
        // Cache the generated weapon
        this.generatedWeapons.set(weaponHash, weapon);
        return weapon;
    }
    calculateFinalStats(config) {
        let stats = { ...config.baseStats };
        // CRITICAL: Apply level-based scaling FIRST
        // This is calculated ONCE when the item is generated and becomes permanent
        stats = (0, stat_scaling_1.scaleWeaponStats)(stats, config.playerLevelAtGeneration, // Player's level when this item dropped
        config.tier, config.quality);
        // Calculate and store the item level (represents the item's power level)
        const itemLevel = (0, stat_scaling_1.calculateItemLevel)(config.playerLevelAtGeneration, config.tier, config.quality);
        config.itemLevel = itemLevel;
        // Apply stat variance for uniqueness (makes each drop slightly different)
        stats = (0, stat_scaling_1.applyStatVariance)(stats, 0.1);
        // Apply manufacturer modifiers
        const mfg = manufacturers_1.manufacturers[config.manufacturer];
        if (mfg) {
            Object.entries(mfg.statModifiers).forEach(([stat, modifier]) => {
                if (stat === 'allStats') {
                    Object.keys(stats).forEach(s => {
                        stats[s] *= (1 + modifier);
                    });
                }
                else if (stat in stats) {
                    stats[stat] *= (1 + modifier);
                }
            });
        }
        // Apply rarity multiplier
        const rarity = manufacturers_1.rarityTiers[config.rarity];
        stats.damage *= rarity.statMultiplier;
        stats.durability *= rarity.statMultiplier;
        stats.criticalChance += rarity.statMultiplier * 0.01;
        // Apply mastery level scaling (player's skill with this weapon type)
        const masteryMultiplier = 1 + (config.masteryLevel / 100) * 0.3; // Up to 1.3x at max mastery
        stats.damage *= masteryMultiplier;
        stats.fireRate *= (1 + config.masteryLevel / 200); // Slight fire rate boost
        stats.accuracy = Math.min(stats.accuracy * (1 + config.masteryLevel / 150), 0.99); // Accuracy improvement
        // Apply all affixes
        [...config.prefixes, ...config.suffixes, ...config.implicitAffixes, ...(config.uniqueAffixes || [])].forEach(affix => {
            const value = this.rollAffixValue(affix, config.quality, config.masteryLevel);
            this.applyAffixToStats(stats, affix, value);
        });
        // Apply part modifiers
        config.parts.forEach(part => {
            Object.entries(part.statModifiers).forEach(([stat, modifier]) => {
                if (stat in stats) {
                    stats[stat] *= (1 + modifier);
                }
            });
        });
        // Apply synergies (if multiple parts from same set)
        const synergies = this.calculateSynergies(config.parts);
        Object.entries(synergies).forEach(([stat, bonus]) => {
            if (stat in stats) {
                stats[stat] *= (1 + bonus);
            }
        });
        return stats;
    }
    rollAffixValue(affix, quality, masteryLevel) {
        // Roll within min/max range, influenced by quality and mastery
        const range = affix.maxValue - affix.minValue;
        const qualityInfluence = quality / 600; // 0 to 1
        const masteryInfluence = masteryLevel / 100; // 0 to 1
        // Combined influence creates bias toward higher rolls
        const rollBias = (qualityInfluence + masteryInfluence) / 2;
        const roll = Math.random() * (1 - rollBias) + rollBias; // Biased toward 1
        return affix.minValue + (range * roll);
    }
    applyAffixToStats(stats, affix, value) {
        if (!(affix.stat in stats)) {
            // Handle special stats that aren't in base stats
            stats[affix.stat] = 0;
        }
        switch (affix.operation) {
            case 'base_add':
                stats[affix.stat] += value;
                break;
            case 'perc_add':
                stats[affix.stat] *= (1 + value);
                break;
            case 'perc_subtract':
                stats[affix.stat] *= (1 - value);
                break;
            case 'base_multiply':
                stats[affix.stat] *= value;
                break;
        }
    }
    calculateSynergies(parts) {
        const synergies = {};
        // Check for matching tier sets
        const tierCounts = {};
        parts.forEach(part => {
            tierCounts[part.tier] = (tierCounts[part.tier] || 0) + 1;
        });
        // 3+ parts of same tier grant bonuses
        Object.entries(tierCounts).forEach(([tier, count]) => {
            if (count >= 3) {
                switch (tier) {
                    case 'legendary':
                        synergies.damage = 0.15;
                        synergies.criticalChance = 0.05;
                        break;
                    case 'master':
                        synergies.accuracy = 0.10;
                        synergies.durability = 0.20;
                        break;
                    case 'advanced':
                        synergies.fireRate = 0.10;
                        synergies.reloadSpeed = -0.15;
                        break;
                }
            }
        });
        return synergies;
    }
    generateWeaponHash(config) {
        // Generate a unique hash for this exact weapon configuration
        const hashComponents = [
            config.baseType,
            config.manufacturer,
            config.quality,
            config.rarity,
            config.tier,
            config.playerLevelRequirement,
            config.playerLevelAtGeneration, // Include the generation level for uniqueness
            config.masteryLevel,
            ...config.prefixes.map(a => a.name),
            ...config.suffixes.map(a => a.name),
            ...config.parts.map(p => p.name),
            config.elementalType,
            ...config.triggeredEffects.map(e => e.effect)
        ];
        return hashComponents.join('_').replace(/\s+/g, '');
    }
    generateUniqueWeaponName(config, hash) {
        const parts = [];
        // Add item level suffix for quick power identification
        if (config.itemLevel) {
            const levelSuffix = (0, stat_scaling_1.getItemLevelSuffix)(config.itemLevel);
            parts.push(levelSuffix);
        }
        // Add most significant prefix
        if (config.prefixes.length > 0) {
            parts.push(config.prefixes[0].name);
        }
        // Add manufacturer
        parts.push(config.manufacturer);
        // Add base weapon type
        parts.push(config.weaponClass);
        // Add most significant suffix
        if (config.suffixes.length > 0) {
            parts.push(config.suffixes[0].name.replace('of ', ''));
        }
        // Add tier and quality
        parts.push(`T${config.tier}Q${config.quality}`);
        // Add a short hash for uniqueness
        parts.push(hash.substring(0, 6));
        return parts.join('_').replace(/\s+/g, '');
    }
    addElementalProperties(weapon, element, stats) {
        const elementalDamage = stats.damage * 0.3; // 30% of damage as elemental
        switch (element) {
            case elemental_effects_1.ElementalType.Fire:
                weapon.property('ElementalDamageType', 'heat');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'burning');
                break;
            case elemental_effects_1.ElementalType.Ice:
                weapon.property('ElementalDamageType', 'cold');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'freeze');
                break;
            case elemental_effects_1.ElementalType.Electric:
                weapon.property('ElementalDamageType', 'electric');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'shock');
                break;
            case elemental_effects_1.ElementalType.Poison:
                weapon.property('ElementalDamageType', 'poison');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'poisoned');
                break;
            case elemental_effects_1.ElementalType.Radiation:
                weapon.property('ElementalDamageType', 'radiation');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'radiated');
                break;
            case elemental_effects_1.ElementalType.Explosive:
                weapon.property('ElementalDamageType', 'explosive');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'explosion');
                break;
            case elemental_effects_1.ElementalType.Bleeding:
                weapon.property('ElementalDamageType', 'bleeding');
                weapon.property('ElementalDamage', (elementalDamage * 0.5).toFixed(2));
                weapon.property('ElementalEffect', 'bleed');
                break;
            case elemental_effects_1.ElementalType.Void:
                weapon.property('ElementalDamageType', 'void');
                weapon.property('ElementalDamage', elementalDamage.toFixed(2));
                weapon.property('ElementalEffect', 'void_drain');
                break;
        }
    }
    addAffixDescriptions(weapon, config) {
        const descriptions = [];
        // Add comma-separated list of prefix names for C# to parse
        if (config.prefixes.length > 0) {
            const prefixNames = config.prefixes.map(a => a.name).join(',');
            weapon.property('Prefixes', prefixNames);
            config.prefixes.forEach(affix => {
                descriptions.push(`[${affix.name}] ${affix.description}`);
            });
        }
        // Add comma-separated list of suffix names for C# to parse
        if (config.suffixes.length > 0) {
            const suffixNames = config.suffixes.map(a => a.name).join(',');
            weapon.property('Suffixes', suffixNames);
            config.suffixes.forEach(affix => {
                descriptions.push(`[${affix.name}] ${affix.description}`);
            });
        }
        // Add comma-separated list of implicit names for C# to parse
        if (config.implicitAffixes.length > 0) {
            const implicitNames = config.implicitAffixes.map(a => a.name).join(',');
            weapon.property('Implicits', implicitNames);
            config.implicitAffixes.forEach(affix => {
                descriptions.push(`[Implicit: ${affix.name}] ${affix.description}`);
            });
        }
        // Add unique affixes if present
        if (config.uniqueAffixes && config.uniqueAffixes.length > 0) {
            const uniqueNames = config.uniqueAffixes.map(a => a.name).join(',');
            weapon.property('UniqueAffixes', uniqueNames);
            config.uniqueAffixes.forEach(affix => {
                descriptions.push(`[UNIQUE: ${affix.name}] ${affix.description}`);
            });
        }
        weapon.property('AffixDescriptions', descriptions.join(' | '));
    }
    addTriggeredEffects(weapon, effects) {
        effects.forEach((effect, index) => {
            weapon.property(`TriggeredEffect${index}_Trigger`, effect.trigger);
            weapon.property(`TriggeredEffect${index}_Effect`, effect.effect);
            weapon.property(`TriggeredEffect${index}_Chance`, effect.chance.toString());
            if (effect.cooldown) {
                weapon.property(`TriggeredEffect${index}_Cooldown`, effect.cooldown.toString());
            }
            if (effect.stackable) {
                weapon.property(`TriggeredEffect${index}_Stackable`, 'true');
                weapon.property(`TriggeredEffect${index}_MaxStacks`, (effect.maxStacks || 1).toString());
            }
        });
    }
    addPartBonuses(weapon, parts) {
        parts.forEach((part, index) => {
            weapon.property(`Part${index}_Slot`, part.slot);
            weapon.property(`Part${index}_Name`, part.name);
            weapon.property(`Part${index}_Tier`, part.tier);
            if (part.specialEffect) {
                weapon.property(`Part${index}_SpecialEffect`, part.specialEffect);
            }
        });
    }
    generateModSlots(config) {
        const baseSlots = manufacturers_1.rarityTiers[config.rarity].modSlots;
        const tierBonus = Math.floor(config.tier / 2);
        const qualityBonus = Math.floor(config.quality / 150);
        const masteryBonus = Math.floor(config.masteryLevel / 25);
        const totalSlots = Math.min(6, baseSlots + tierBonus + qualityBonus + masteryBonus);
        const slots = Array(6).fill(0).map((_, i) => i < totalSlots ? config.modSlotCount : 0);
        return slots.join(',');
    }
    calculateEconomicValue(config, stats) {
        let value = 100;
        // Base value from damage and quality
        value += stats.damage * 10;
        value *= (1 + config.quality / 100);
        // Rarity multiplier
        value *= manufacturers_1.rarityTiers[config.rarity].statMultiplier * 2;
        // Affix value
        value += config.prefixes.length * 500;
        value += config.suffixes.length * 500;
        value += (config.uniqueAffixes?.length || 0) * 2000;
        // Part value
        config.parts.forEach(part => {
            switch (part.tier) {
                case 'legendary':
                    value += 5000;
                    break;
                case 'master':
                    value += 2000;
                    break;
                case 'advanced':
                    value += 500;
                    break;
                case 'basic':
                    value += 100;
                    break;
            }
        });
        // Elemental bonus
        if (config.elementalType !== elemental_effects_1.ElementalType.None) {
            value *= 1.5;
        }
        return Math.round(value);
    }
    // Generate a complete randomized weapon
    generateRandomWeapon(baseType, weaponClass, options) {
        const tier = this.randomBetween(options?.minTier || 1, options?.maxTier || 6);
        const rarity = options?.forcedRarity || this.getRandomRarity();
        const playerLevel = options?.playerLevel || this.randomBetween(1, 100);
        const config = {
            baseType,
            weaponClass,
            manufacturer: options?.forcedManufacturer || this.getRandomManufacturer(),
            quality: this.randomBetween(options?.minQuality || 1, options?.maxQuality || 600),
            rarity,
            tier,
            playerLevelRequirement: this.calculateLevelRequirement(tier, rarity),
            playerLevelAtGeneration: playerLevel, // The player's level when this item was generated
            masteryLevel: options?.masteryLevel || this.randomBetween(0, 100),
            prefixes: this.rollRandomAffixes('prefixes', weaponClass),
            suffixes: this.rollRandomAffixes('suffixes', weaponClass),
            implicitAffixes: this.getManufacturerImplicits(options?.forcedManufacturer || this.getRandomManufacturer()),
            uniqueAffixes: Math.random() < 0.1 ? this.rollRandomAffixes('unique', weaponClass, 1) : undefined,
            parts: this.rollRandomParts(weaponClass),
            elementalType: this.getRandomElementalType(),
            triggeredEffects: this.rollRandomTriggeredEffects(),
            modSlotCount: this.randomBetween(1, 6),
            baseStats: this.getBaseStatsForWeaponClass(weaponClass)
        };
        return this.generateWeapon(config);
    }
    getRandomManufacturer() {
        const mfgs = Object.keys(manufacturers_1.manufacturers);
        return mfgs[Math.floor(Math.random() * mfgs.length)];
    }
    getRandomRarity() {
        const rarities = Object.keys(manufacturers_1.rarityTiers);
        const weights = rarities.map(r => 1 / manufacturers_1.rarityTiers[r].statMultiplier);
        return this.weightedRandom(rarities, weights);
    }
    getRandomElementalType() {
        const types = Object.values(elemental_effects_1.ElementalType);
        return types[Math.floor(Math.random() * types.length)];
    }
    rollRandomAffixes(type, weaponClass, count) {
        const affixes = (0, affixes_1.getCompatibleAffixes)(weaponClass, type);
        const numAffixes = count || this.randomBetween(0, 3);
        const selected = [];
        const available = [...affixes]; // Create a copy to avoid modifying original
        for (let i = 0; i < numAffixes && available.length > 0; i++) {
            const index = Math.floor(Math.random() * available.length);
            selected.push(available[index]);
            available.splice(index, 1); // Don't select same affix twice
        }
        return selected;
    }
    getManufacturerImplicits(manufacturer) {
        const implicits = affixes_1.allAffixes.implicit;
        return implicits.filter(a => a.name.toLowerCase().includes(manufacturer.toLowerCase())).slice(0, 2);
    }
    rollRandomParts(weaponClass) {
        const parts = [];
        const slots = ['barrel', 'trigger', 'stock', 'magazine'];
        slots.forEach(slot => {
            const slotParts = weapon_parts_1.allWeaponParts[slot] || [];
            if (slotParts.length > 0) {
                parts.push(slotParts[Math.floor(Math.random() * slotParts.length)]);
            }
        });
        return parts;
    }
    rollRandomTriggeredEffects() {
        // Use the external database function to generate random effects
        const level = Math.floor(Math.random() * 50) + 1;
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        const weaponType = 'ranged'; // Could be passed as parameter
        return (0, triggered_effects_1.generateRandomTriggeredEffects)(level, rarity, weaponType);
    }
    getBaseStatsForWeaponClass(weaponClass) {
        return { ...weapon_base_stats_1.weaponClassStats[weaponClass] };
    }
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }
    calculateLevelRequirement(tier, rarity) {
        // Base level requirements by tier
        const tierLevels = {
            1: 1, // Tier 1: Level 1-10
            2: 10, // Tier 2: Level 10-20
            3: 20, // Tier 3: Level 20-30
            4: 30, // Tier 4: Level 30-40
            5: 40, // Tier 5: Level 40-50
            6: 50 // Tier 6: Level 50+
        };
        // Rarity adds additional level requirements
        const rarityModifiers = {
            'common': 0,
            'uncommon': 2,
            'rare': 5,
            'epic': 8,
            'legendary': 10
        };
        const baseLevel = tierLevels[tier] || 1;
        const rarityModifier = rarityModifiers[rarity] || 0;
        return Math.min(60, baseLevel + rarityModifier); // Cap at level 60
    }
    // Get weapons available for a specific player level
    getWeaponsForPlayerLevel(playerLevel) {
        const availableWeapons = [];
        // Determine max tier based on player level
        let maxTier = 1;
        if (playerLevel >= 50)
            maxTier = 6;
        else if (playerLevel >= 40)
            maxTier = 5;
        else if (playerLevel >= 30)
            maxTier = 4;
        else if (playerLevel >= 20)
            maxTier = 3;
        else if (playerLevel >= 10)
            maxTier = 2;
        // Generate list of weapon configs that can spawn
        for (let tier = 1; tier <= maxTier; tier++) {
            const rarities = this.getRaritiesForPlayerLevel(playerLevel, tier);
            rarities.forEach(rarity => {
                const levelReq = this.calculateLevelRequirement(tier, rarity);
                if (levelReq <= playerLevel) {
                    availableWeapons.push(`Tier${tier}_${rarity}`);
                }
            });
        }
        return availableWeapons;
    }
    getRaritiesForPlayerLevel(playerLevel, tier) {
        const rarities = ['common'];
        // Higher levels unlock better rarities
        if (playerLevel >= 5)
            rarities.push('uncommon');
        if (playerLevel >= 15)
            rarities.push('rare');
        if (playerLevel >= 25 && tier >= 2)
            rarities.push('epic');
        if (playerLevel >= 35 && tier >= 3)
            rarities.push('legendary');
        return rarities;
    }
    // Generate loot table for specific player level and game stage
    generateLootTable(playerLevel, gameStage) {
        const lootTable = new Map();
        // Game stage affects quality distribution
        const minQuality = Math.max(1, gameStage * 10 - 50);
        const maxQuality = Math.min(600, gameStage * 15);
        // Higher game stages have better tier chances
        const tierWeights = this.getTierWeightsForGameStage(gameStage);
        // Generate weighted loot table
        const availableWeapons = this.getWeaponsForPlayerLevel(playerLevel);
        availableWeapons.forEach(weaponConfig => {
            const [tierStr, rarity] = weaponConfig.split('_');
            const tier = parseInt(tierStr.replace('Tier', ''));
            // Calculate spawn weight based on tier and rarity
            const tierWeight = tierWeights[tier] || 0.1;
            const rarityWeight = 1 / manufacturers_1.rarityTiers[rarity].statMultiplier;
            const finalWeight = tierWeight * rarityWeight;
            lootTable.set(weaponConfig, finalWeight);
        });
        return lootTable;
    }
    getTierWeightsForGameStage(gameStage) {
        // Early game favors low tiers, late game favors high tiers
        const weights = {};
        if (gameStage < 50) {
            weights[1] = 1.0;
            weights[2] = 0.3;
            weights[3] = 0.1;
            weights[4] = 0.01;
            weights[5] = 0.001;
            weights[6] = 0.0001;
        }
        else if (gameStage < 150) {
            weights[1] = 0.5;
            weights[2] = 1.0;
            weights[3] = 0.5;
            weights[4] = 0.2;
            weights[5] = 0.05;
            weights[6] = 0.01;
        }
        else if (gameStage < 300) {
            weights[1] = 0.2;
            weights[2] = 0.5;
            weights[3] = 1.0;
            weights[4] = 0.6;
            weights[5] = 0.3;
            weights[6] = 0.1;
        }
        else {
            weights[1] = 0.1;
            weights[2] = 0.2;
            weights[3] = 0.4;
            weights[4] = 0.8;
            weights[5] = 1.0;
            weights[6] = 0.6;
        }
        return weights;
    }
}
exports.AdvancedWeaponGenerator = AdvancedWeaponGenerator;
//# sourceMappingURL=advanced-weapon-generator.js.map