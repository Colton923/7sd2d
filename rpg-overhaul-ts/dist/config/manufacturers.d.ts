export interface Manufacturer {
    name: string;
    tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    specialization: string[];
    statModifiers: Record<string, number>;
    description: string;
}
export declare const manufacturers: Record<string, Manufacturer>;
export declare const rarityTiers: {
    common: {
        color: string;
        statMultiplier: number;
        modSlots: number;
        dropChance: number;
    };
    uncommon: {
        color: string;
        statMultiplier: number;
        modSlots: number;
        dropChance: number;
    };
    rare: {
        color: string;
        statMultiplier: number;
        modSlots: number;
        dropChance: number;
    };
    epic: {
        color: string;
        statMultiplier: number;
        modSlots: number;
        dropChance: number;
    };
    legendary: {
        color: string;
        statMultiplier: number;
        modSlots: number;
        dropChance: number;
    };
};
//# sourceMappingURL=manufacturers.d.ts.map