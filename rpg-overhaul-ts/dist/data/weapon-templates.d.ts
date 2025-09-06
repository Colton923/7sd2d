/**
 * Weapon Templates Database
 *
 * Contains all specific weapon templates with unique characteristics
 * Each template represents a base weapon type that can be modified
 */
export type WeaponClass = 'pistol' | 'rifle' | 'shotgun' | 'sniper' | 'smg' | 'automatic' | 'launcher' | 'melee' | 'bow' | 'crossbow' | 'special';
export interface WeaponBaseStats {
    damage: number;
    fireRate: number;
    accuracy: number;
    range: number;
    magazineSize: number;
    reloadSpeed: number;
    durability: number;
    staminaLoss: number;
    criticalChance: number;
    criticalDamage: number;
    dismemberChance: number;
    penetration: number;
    spread: number;
    recoil: number;
    weight: number;
}
export interface WeaponTemplate {
    id: string;
    name: string;
    baseType: string;
    weaponClass: WeaponClass;
    description: string;
    tier: number;
    statModifiers?: Partial<WeaponBaseStats>;
    specialProperties?: {
        burstFire?: number;
        chargeTime?: number;
        overheat?: boolean;
        dualWield?: boolean;
        silenced?: boolean;
        scoped?: boolean;
        unique?: boolean;
    };
    requiredParts?: string[];
    bannedParts?: string[];
    fixedAffixes?: string[];
}
export declare const weaponTemplates: WeaponTemplate[];
export declare function getWeaponTemplate(id: string): WeaponTemplate | undefined;
export declare function getTemplatesByClass(weaponClass: WeaponClass): WeaponTemplate[];
export declare function getTemplatesByTier(tier: number): WeaponTemplate[];
export declare function calculateTemplateStats(template: WeaponTemplate, baseStats: WeaponBaseStats): WeaponBaseStats;
export declare function getRandomTemplate(tier?: number, weaponClass?: WeaponClass): WeaponTemplate | undefined;
//# sourceMappingURL=weapon-templates.d.ts.map