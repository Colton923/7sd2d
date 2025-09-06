/**
 * Stat Scaling System
 *
 * Handles level-based scaling of weapon stats at generation time.
 * Stats are calculated ONCE when the item is created and remain fixed.
 */
import { WeaponBaseStats } from './weapon-templates';
/**
 * Stat ranges define min/max values for each stat based on tier
 * These percentages are applied to base stats
 */
export interface StatScaleRange {
    minScale: number;
    maxScale: number;
}
/**
 * Tier-based scaling ranges
 * Higher tiers have wider ranges and higher potential
 */
export declare const tierScalingRanges: Record<number, StatScaleRange>;
/**
 * Calculate the scaling factor based on player level
 * This determines where in the min-max range the stats will be
 *
 * @param playerLevel - The player's level when the item drops
 * @param weaponTier - The tier of the weapon
 * @param maxLevel - Maximum player level (default 100)
 * @returns A value between 0 and 1 representing position in the range
 */
export declare function calculateLevelFactor(playerLevel: number, weaponTier: number, maxLevel?: number): number;
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
export declare function scaleWeaponStats(baseStats: WeaponBaseStats, playerLevel: number, weaponTier: number, quality?: number): WeaponBaseStats;
/**
 * Generate a unique item level based on player level and tier
 * This represents the "item level" that gets saved with the weapon
 */
export declare function calculateItemLevel(playerLevel: number, weaponTier: number, quality: number): number;
/**
 * Get a descriptive suffix for the weapon based on its item level
 */
export declare function getItemLevelSuffix(itemLevel: number): string;
/**
 * Calculate stat variance for more variety
 * Adds random variance to individual stats
 */
export declare function applyStatVariance(stats: WeaponBaseStats, variance?: number): WeaponBaseStats;
//# sourceMappingURL=stat-scaling.d.ts.map