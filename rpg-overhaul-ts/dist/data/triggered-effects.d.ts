/**
 * Triggered Effects Database
 *
 * Defines all possible triggered effects that can occur on weapons
 */
export type TriggerType = 'onKill' | 'onCrit' | 'onHit' | 'onReload' | 'onDamaged' | 'onLowHealth' | 'onHeadshot' | 'onMiss' | 'onBlock' | 'onDodge' | 'onFirstShot' | 'onLastShot' | 'onEmptyMag' | 'onFullMag' | 'onSprint' | 'onCrouch' | 'onJump' | 'onMelee' | 'onSwapWeapon' | 'onNightfall' | 'onDaybreak' | 'onBloodMoon';
export interface TriggeredEffect {
    trigger: TriggerType;
    effect: string;
    chance: number;
    cooldown?: number;
    stackable?: boolean;
    maxStacks?: number;
    duration?: number;
    value?: number | string;
    description: string;
}
export interface TriggeredEffectTemplate {
    effect: string;
    name: string;
    description: string;
    category: 'offensive' | 'defensive' | 'utility' | 'special';
    validTriggers: TriggerType[];
    baseChance: number;
    baseCooldown?: number;
    baseDuration?: number;
    baseValue?: number | string;
    stackable: boolean;
    maxStacks?: number;
    levelScaling?: {
        chancePerLevel?: number;
        valuePerLevel?: number;
        cooldownReduction?: number;
    };
}
export declare const triggeredEffectTemplates: Record<string, TriggeredEffectTemplate>;
export declare function generateRandomTriggeredEffects(level: number, rarity: string, weaponType: string): TriggeredEffect[];
export declare function getCompatibleTriggers(weaponType: string): TriggerType[];
//# sourceMappingURL=triggered-effects.d.ts.map