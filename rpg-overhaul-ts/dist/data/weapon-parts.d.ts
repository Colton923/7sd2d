/**
 * Comprehensive Weapon Parts Database
 *
 * Parts System:
 * - Each weapon can have multiple part slots
 * - Parts are tiered: basic, advanced, master, legendary
 * - Quality requirements gate which parts can be installed
 * - Mastery requirements determine player access
 * - Parts can have special effects and synergies
 */
export interface WeaponPart {
    slot: 'barrel' | 'trigger' | 'stock' | 'magazine' | 'scope' | 'grip' | 'muzzle' | 'underbarrel';
    name: string;
    tier: 'basic' | 'advanced' | 'master' | 'legendary';
    qualityRange: [number, number];
    masteryReq: number;
    statModifiers: Record<string, number>;
    specialEffect?: string;
    synergies?: string[];
}
export declare const barrelParts: WeaponPart[];
export declare const triggerParts: WeaponPart[];
export declare const stockParts: WeaponPart[];
export declare const magazineParts: WeaponPart[];
export declare const scopeParts: WeaponPart[];
export declare const gripParts: WeaponPart[];
export declare const muzzleParts: WeaponPart[];
export declare const underbarrelParts: WeaponPart[];
export declare const allWeaponParts: {
    barrel: WeaponPart[];
    trigger: WeaponPart[];
    stock: WeaponPart[];
    magazine: WeaponPart[];
    scope: WeaponPart[];
    grip: WeaponPart[];
    muzzle: WeaponPart[];
    underbarrel: WeaponPart[];
};
export declare function getPartsBySlotAndTier(slot: WeaponPart['slot'], tier?: WeaponPart['tier'], minQuality?: number, maxQuality?: number): WeaponPart[];
export declare function getCompatibleParts(quality: number, masteryLevel: number): Map<string, WeaponPart[]>;
//# sourceMappingURL=weapon-parts.d.ts.map