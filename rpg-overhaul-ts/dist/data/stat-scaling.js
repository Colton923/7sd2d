"use strict";
/**
 * Stat Scaling System
 *
 * Handles level-based scaling of weapon stats at generation time.
 * Stats are calculated ONCE when the item is created and remain fixed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tierScalingRanges = void 0;
exports.calculateLevelFactor = calculateLevelFactor;
exports.scaleWeaponStats = scaleWeaponStats;
exports.calculateItemLevel = calculateItemLevel;
exports.getItemLevelSuffix = getItemLevelSuffix;
exports.applyStatVariance = applyStatVariance;
/**
 * Tier-based scaling ranges
 * Higher tiers have wider ranges and higher potential
 */
exports.tierScalingRanges = {
    0: { minScale: 0.4, maxScale: 0.8 }, // Tier 0: 40-80% of base
    1: { minScale: 0.6, maxScale: 1.0 }, // Tier 1: 60-100% of base
    2: { minScale: 0.8, maxScale: 1.2 }, // Tier 2: 80-120% of base
    3: { minScale: 1.0, maxScale: 1.5 }, // Tier 3: 100-150% of base
    4: { minScale: 1.2, maxScale: 1.8 }, // Tier 4: 120-180% of base
    5: { minScale: 1.5, maxScale: 2.2 }, // Tier 5: 150-220% of base
    6: { minScale: 2.0, maxScale: 3.0 } // Tier 6: 200-300% of base
};
/**
 * Calculate the scaling factor based on player level
 * This determines where in the min-max range the stats will be
 *
 * @param playerLevel - The player's level when the item drops
 * @param weaponTier - The tier of the weapon
 * @param maxLevel - Maximum player level (default 100)
 * @returns A value between 0 and 1 representing position in the range
 */
function calculateLevelFactor(playerLevel, weaponTier, maxLevel = 100) {
    // Ensure player level is within bounds
    const clampedLevel = Math.max(1, Math.min(playerLevel, maxLevel));
    // Calculate tier-appropriate level ranges
    // Higher tier weapons expect higher level players
    const tierMinLevel = weaponTier * 10; // Tier 3 expects level 30+
    const tierMaxLevel = Math.min((weaponTier + 2) * 15, maxLevel); // Tier 3 maxes at level 75
    // Calculate how far the player is within the expected range for this tier
    if (clampedLevel < tierMinLevel) {
        // Player is under-leveled for this tier, gets minimum stats
        return 0;
    }
    else if (clampedLevel >= tierMaxLevel) {
        // Player is at or above max expected level for tier, gets maximum stats
        return 1;
    }
    else {
        // Player is within expected range, interpolate
        const levelProgress = (clampedLevel - tierMinLevel) / (tierMaxLevel - tierMinLevel);
        // Apply a slight curve to make mid-levels more rewarding
        return Math.pow(levelProgress, 0.8);
    }
}
/**
 * Apply scaling to weapon stats based on player level
 * This is called ONCE when the weapon is generated
 *
 * @param baseStats - The base stats for the weapon
 * @param playerLevel - The player's level when the item drops
 * @param weaponTier - The tier of the weapon
 * @param quality - Optional quality modifier (1-600)
 * @returns Scaled stats that will be permanent for this item
 */
function scaleWeaponStats(baseStats, playerLevel, weaponTier, quality = 300) {
    const tierRange = exports.tierScalingRanges[weaponTier] || exports.tierScalingRanges[1];
    const levelFactor = calculateLevelFactor(playerLevel, weaponTier);
    // Quality affects the scaling slightly (adds 0-20% bonus)
    const qualityBonus = (quality / 600) * 0.2;
    // Calculate the final scaling multiplier
    const scaleFactor = tierRange.minScale +
        (tierRange.maxScale - tierRange.minScale) * levelFactor +
        qualityBonus;
    // Apply scaling to each stat
    const scaledStats = {
        // Damage scales fully
        damage: Math.round(baseStats.damage * scaleFactor),
        // Fire rate scales moderately (capped at 150% to prevent breaking animations)
        fireRate: Math.min(baseStats.fireRate * Math.min(scaleFactor, 1.5), 30),
        // Accuracy improves but has diminishing returns
        accuracy: Math.min(baseStats.accuracy + (scaleFactor - 1) * 0.1, 0.99),
        // Range scales moderately
        range: Math.round(baseStats.range * (1 + (scaleFactor - 1) * 0.5)),
        // Magazine size scales but with limits
        magazineSize: Math.round(baseStats.magazineSize * (1 + (scaleFactor - 1) * 0.3)),
        // Reload speed improves (lower is better)
        reloadSpeed: Math.max(baseStats.reloadSpeed / (1 + (scaleFactor - 1) * 0.3), 0.5),
        // Durability scales well
        durability: Math.round(baseStats.durability * scaleFactor),
        // Stamina loss improves (lower is better)
        staminaLoss: Math.max(baseStats.staminaLoss / (1 + (scaleFactor - 1) * 0.2), 1),
        // Critical chance improves with diminishing returns
        criticalChance: Math.min(baseStats.criticalChance + (scaleFactor - 1) * 0.05, 0.5),
        // Critical damage scales moderately
        criticalDamage: baseStats.criticalDamage + (scaleFactor - 1) * 0.5,
        // Dismember chance improves
        dismemberChance: Math.min(baseStats.dismemberChance + (scaleFactor - 1) * 0.1, 0.8),
        // Penetration scales well
        penetration: Math.round(baseStats.penetration * scaleFactor),
        // Spread improves (lower is better)
        spread: Math.max(baseStats.spread / (1 + (scaleFactor - 1) * 0.3), 0.001),
        // Recoil improves (lower is better)
        recoil: Math.max(baseStats.recoil / (1 + (scaleFactor - 1) * 0.2), 0.01),
        // Weight doesn't change - it's a physical property
        weight: baseStats.weight
    };
    return scaledStats;
}
/**
 * Generate a unique item level based on player level and tier
 * This represents the "item level" that gets saved with the weapon
 */
function calculateItemLevel(playerLevel, weaponTier, quality) {
    const levelFactor = calculateLevelFactor(playerLevel, weaponTier);
    const qualityFactor = quality / 600;
    // Item level is a combination of tier base, player influence, and quality
    const tierBase = weaponTier * 10;
    const levelBonus = levelFactor * 50;
    const qualityBonus = qualityFactor * 10;
    return Math.round(tierBase + levelBonus + qualityBonus);
}
/**
 * Get a descriptive suffix for the weapon based on its item level
 */
function getItemLevelSuffix(itemLevel) {
    if (itemLevel < 10)
        return 'Crude';
    if (itemLevel < 20)
        return 'Worn';
    if (itemLevel < 30)
        return 'Standard';
    if (itemLevel < 40)
        return 'Quality';
    if (itemLevel < 50)
        return 'Superior';
    if (itemLevel < 60)
        return 'Exceptional';
    if (itemLevel < 70)
        return 'Elite';
    if (itemLevel < 80)
        return 'Masterwork';
    if (itemLevel < 90)
        return 'Legendary';
    return 'Godlike';
}
/**
 * Calculate stat variance for more variety
 * Adds random variance to individual stats
 */
function applyStatVariance(stats, variance = 0.1) {
    const randomVariance = (stat) => {
        const factor = 1 + (Math.random() - 0.5) * variance * 2;
        return stat * factor;
    };
    return {
        damage: Math.round(randomVariance(stats.damage)),
        fireRate: randomVariance(stats.fireRate),
        accuracy: Math.min(randomVariance(stats.accuracy), 0.99),
        range: Math.round(randomVariance(stats.range)),
        magazineSize: Math.round(randomVariance(stats.magazineSize)),
        reloadSpeed: Math.max(randomVariance(stats.reloadSpeed), 0.5),
        durability: Math.round(randomVariance(stats.durability)),
        staminaLoss: Math.max(randomVariance(stats.staminaLoss), 1),
        criticalChance: Math.min(randomVariance(stats.criticalChance), 0.5),
        criticalDamage: randomVariance(stats.criticalDamage),
        dismemberChance: Math.min(randomVariance(stats.dismemberChance), 0.8),
        penetration: Math.round(randomVariance(stats.penetration)),
        spread: Math.max(randomVariance(stats.spread), 0.001),
        recoil: Math.max(randomVariance(stats.recoil), 0.01),
        weight: stats.weight // Weight doesn't vary
    };
}
//# sourceMappingURL=stat-scaling.js.map