import { ItemBuilder } from '@7d2d/mod-builder';
import { rarityTiers } from '../config/manufacturers';
export interface WeaponStats {
    damage: number;
    fireRate: number;
    accuracy: number;
    range: number;
    magazineSize: number;
    reloadSpeed: number;
    durability: number;
    staminaLoss: number;
    criticalChance?: number;
    dismemberChance?: number;
}
export interface WeaponConfig {
    baseType: string;
    manufacturer: string;
    rarity: keyof typeof rarityTiers;
    tier: number;
    level: number;
    baseStats: WeaponStats;
}
export declare class WeaponGenerator {
    private weapons;
    generateWeapon(config: WeaponConfig): ItemBuilder;
    private calculateStats;
    private generateWeaponName;
    generateWeaponSet(baseType: string, baseStats: WeaponStats, options?: {
        manufacturers?: string[];
        rarities?: (keyof typeof rarityTiers)[];
        tiers?: number[];
        levels?: number[];
    }): ItemBuilder[];
    build(): any[];
    getWeapons(): ItemBuilder[];
}
//# sourceMappingURL=weapon-generator.d.ts.map