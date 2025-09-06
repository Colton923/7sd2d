/**
 * Elemental Types and Effects Database
 *
 * Defines all elemental damage types, their effects, and interactions
 */
export declare enum ElementalType {
    None = "none",
    Fire = "fire",
    Ice = "ice",
    Electric = "electric",
    Poison = "poison",
    Radiation = "radiation",
    Explosive = "explosive",
    Bleeding = "bleeding",
    Void = "void",
    Holy = "holy",
    Chaos = "chaos",
    Plasma = "plasma",
    Corrosive = "corrosive",
    Sonic = "sonic",
    Psychic = "psychic",
    Quantum = "quantum"
}
export interface ElementalEffect {
    type: ElementalType;
    name: string;
    description: string;
    color: string;
    damageType: string;
    effectName: string;
    damageMultiplier: number;
    dotDamage?: number;
    dotDuration?: number;
    spreadChance?: number;
    stackable?: boolean;
    maxStacks?: number;
    statusEffects?: {
        slow?: number;
        blind?: number;
        weaken?: number;
        stun?: number;
        fear?: number;
        confuse?: number;
    };
    combinesWith?: ElementalType[];
    neutralizes?: ElementalType[];
    strongAgainst?: string[];
    weakAgainst?: string[];
}
export declare const elementalEffects: Record<ElementalType, ElementalEffect>;
export interface ElementalCombo {
    elements: ElementalType[];
    name: string;
    description: string;
    effect: string;
    damageBonus: number;
    specialEffect?: string;
}
export declare const elementalCombos: ElementalCombo[];
export declare function getElementalInteraction(element1: ElementalType, element2: ElementalType): ElementalCombo | null;
export declare function calculateElementalDamage(baseDamage: number, elementalType: ElementalType, enemyType?: string): number;
//# sourceMappingURL=elemental-effects.d.ts.map