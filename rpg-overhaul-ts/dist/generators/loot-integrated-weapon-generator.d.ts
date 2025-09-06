import { ItemBuilder } from "@7d2d/mod-builder";
import { rarityTiers } from "../config/manufacturers";
import { Affix } from "../data/affixes";
import { WeaponPart } from "../data/weapon-parts";
import { ElementalType } from "../data/elemental-effects";
import { TriggeredEffect } from "../data/triggered-effects";
import { WeaponBaseStats, WeaponClass } from "../data/weapon-base-stats";
import { LootGenerationContext } from "../config/loot/types";
export { Affix, WeaponPart, ElementalType, TriggeredEffect, WeaponClass };
/**
 * Loot-Integrated Weapon Generator
 *
 * This generator combines the advanced weapon generation with the loot system
 * to create weapons that spawn according to game rules and progression.
 */
export declare class LootIntegratedWeaponGenerator {
    private generatedWeapons;
    private lootGenerator;
    /**
     * Generate a weapon using the loot system
     */
    generateWeaponFromLoot(baseType: string, weaponClass: WeaponClass, context: LootGenerationContext): ItemBuilder | null;
    /**
     * Generate loot for a specific location and context
     */
    generateLocationLoot(context: LootGenerationContext): ItemBuilder[];
    /**
     * Convert loot weapon data to advanced weapon config
     */
    private convertLootToAdvancedConfig;
    /**
     * Generate advanced weapon (copied from AdvancedWeaponGenerator)
     */
    private generateAdvancedWeapon;
    /**
     * Calculate final stats (simplified version)
     */
    private calculateFinalStats;
    /**
     * Helper methods
     */
    private calculateQualityFromLoot;
    private calculateTierFromGamestage;
    private calculatePlayerLevelRequirement;
    private isWeaponItem;
    private createWeaponFromLootItem;
    private generateWeaponHash;
    private generateUniqueWeaponName;
    private calculateEconomicValue;
}
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
//# sourceMappingURL=loot-integrated-weapon-generator.d.ts.map