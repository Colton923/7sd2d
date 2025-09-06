/**
 * Comprehensive Affix Database for Weapon Generation
 *
 * Categories:
 * - Prefixes: Modify weapon behavior and primary stats
 * - Suffixes: Add secondary bonuses and special properties
 * - Implicit: Manufacturer-specific bonuses
 * - Unique: Rare special effects
 * - Mastercrafted: Ultimate tier affixes
 */
export interface Affix {
    type: 'prefix' | 'suffix' | 'implicit' | 'unique' | 'mastercrafted';
    name: string;
    stat: string;
    operation: 'base_add' | 'perc_add' | 'perc_subtract' | 'multiply' | 'base_multiply';
    minValue: number;
    maxValue: number;
    tier: number;
    rarityWeight: number;
    levelReq: number;
    masteryReq: number;
    weaponTypes: string[];
    description: string;
    conflictGroup?: string;
}
export declare const prefixAffixes: Affix[];
export declare const suffixAffixes: Affix[];
export declare const implicitAffixes: Affix[];
export declare const uniqueAffixes: Affix[];
export declare const mastercraftedAffixes: Affix[];
export declare const allAffixes: {
    prefix: Affix[];
    suffix: Affix[];
    implicit: Affix[];
    unique: Affix[];
    mastercrafted: Affix[];
};
export declare function getAffixesByType(type: Affix['type']): Affix[];
export declare function getCompatibleAffixes(weaponType: string, affixType: Affix['type']): Affix[];
//# sourceMappingURL=affixes.d.ts.map