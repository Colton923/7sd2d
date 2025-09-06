import { EntityBuilder } from '@7d2d/mod-builder';
export interface ZombieStats {
    health: number;
    speed: number;
    damage: number;
    armor: number;
    experience: number;
    sightRange: number;
    hearingRange: number;
}
export interface ZombieVariant {
    name: string;
    type: 'normal' | 'feral' | 'radiated' | 'boss' | 'special';
    tier: number;
    baseStats: ZombieStats;
    abilities?: string[];
    lootTable?: string;
    specialBehaviors?: string[];
}
export declare class EntityGenerator {
    private entities;
    generateZombie(variant: ZombieVariant): EntityBuilder;
    private calculateZombieStats;
    private generateZombieName;
    private getBaseZombieType;
    private getHandItem;
    private getDefaultLootTable;
    private addAbilities;
    private addSpecialBehavior;
    generateZombieHorde(baseVariant: ZombieVariant, count: number, options?: {
        tierRange?: [number, number];
        includeSpecials?: boolean;
        includeBoss?: boolean;
    }): EntityBuilder[];
    build(): any[];
    getEntities(): EntityBuilder[];
}
//# sourceMappingURL=entity-generator.d.ts.map