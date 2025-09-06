import { ItemBuilder } from '@7d2d/mod-builder';
import { rarityTiers } from '../config/manufacturers';
import { Affix } from '../data/affixes';
import { WeaponPart } from '../data/weapon-parts';
import { ElementalType } from '../data/elemental-effects';
import { TriggeredEffect } from '../data/triggered-effects';
import { WeaponBaseStats, WeaponClass } from '../data/weapon-base-stats';
export { Affix, WeaponPart, ElementalType, TriggeredEffect, WeaponClass };
/**
 * Advanced Weapon Generator for achieving quadrillions of unique weapon combinations
 *
 * PROGRESSION SYSTEM:
 * - Player Level: Gates which weapons can spawn/be equipped (NOT a stat multiplier)
 *   - Level 1-10: Tier 1 weapons, common/uncommon
 *   - Level 10-20: Tier 2 weapons, rare unlocked at 15
 *   - Level 20-30: Tier 3 weapons, epic unlocked at 25
 *   - Level 30-40: Tier 4 weapons
 *   - Level 40-50: Tier 5 weapons, legendary unlocked at 35
 *   - Level 50+: Tier 6 weapons
 *
 * - Game Stage: Affects loot quality and tier distribution
 *   - Early (1-50): Mostly T1-T2, Q1-100
 *   - Mid (50-150): T2-T3 common, Q50-200
 *   - Late (150-300): T3-T4 common, Q100-400
 *   - End (300+): T4-T6 common, Q200-600
 *
 * - Mastery Level (0-100): DOES scale weapon effectiveness
 *   - Improves damage, accuracy, handling
 *   - Unlocks special weapon parts
 *   - Affects affix roll quality
 *
 * - Quality (1-600): Primary stat multiplier
 *   - Directly scales damage, durability, accuracy
 *   - Higher quality = better affix rolls
 *   - Gated by game stage progression
 *
 * Combination Formula:
 * - Base Types: ~20 types
 * - Manufacturers: 12+
 * - Quality Levels: 600 (1-600)
 * - Rarity Tiers: 6
 * - Prefixes: ~50+ options
 * - Suffixes: ~50+ options
 * - Implicit Affixes: ~15 per manufacturer
 * - Parts: 4 tiers × 10+ parts per slot × 4-6 slots
 * - Mastery Levels: 100 levels (scaling factor)
 * - Mod Combinations: 6 slots × ~20 mods per slot
 * - Elemental Types: 8+ types
 * - Triggered Effects: ~20+ types
 *
 * Total: 20 × 12 × 600 × 6 × 50 × 50 × 15 × (4×10)^4 × 100 × 20^6 × 8 × 20
 *      = Quadrillions+ of unique combinations
 */
export interface AdvancedWeaponConfig {
    baseType: string;
    weaponClass: WeaponClass;
    manufacturer: string;
    quality: number;
    rarity: keyof typeof rarityTiers;
    tier: number;
    playerLevelRequirement: number;
    playerLevelAtGeneration: number;
    masteryLevel: number;
    itemLevel?: number;
    prefixes: Affix[];
    suffixes: Affix[];
    implicitAffixes: Affix[];
    uniqueAffixes?: Affix[];
    parts: WeaponPart[];
    elementalType: ElementalType;
    triggeredEffects: TriggeredEffect[];
    modSlotCount: number;
    installedMods?: string[];
    baseStats: WeaponBaseStats;
}
export declare class AdvancedWeaponGenerator {
    private generatedWeapons;
    constructor();
    generateWeapon(config: AdvancedWeaponConfig): ItemBuilder;
    private calculateFinalStats;
    private rollAffixValue;
    private applyAffixToStats;
    private calculateSynergies;
    private generateWeaponHash;
    private generateUniqueWeaponName;
    private addElementalProperties;
    private addAffixDescriptions;
    private addTriggeredEffects;
    private addPartBonuses;
    private generateModSlots;
    private calculateEconomicValue;
    generateRandomWeapon(baseType: string, weaponClass: AdvancedWeaponConfig['weaponClass'], options?: {
        minQuality?: number;
        maxQuality?: number;
        minTier?: number;
        maxTier?: number;
        forcedManufacturer?: string;
        forcedRarity?: keyof typeof rarityTiers;
        playerLevel?: number;
        masteryLevel?: number;
    }): ItemBuilder;
    private getRandomManufacturer;
    private getRandomRarity;
    private getRandomElementalType;
    private rollRandomAffixes;
    private getManufacturerImplicits;
    private rollRandomParts;
    private rollRandomTriggeredEffects;
    private getBaseStatsForWeaponClass;
    private randomBetween;
    private weightedRandom;
    private calculateLevelRequirement;
    getWeaponsForPlayerLevel(playerLevel: number): string[];
    private getRaritiesForPlayerLevel;
    generateLootTable(playerLevel: number, gameStage: number): Map<string, number>;
    private getTierWeightsForGameStage;
}
//# sourceMappingURL=advanced-weapon-generator.d.ts.map