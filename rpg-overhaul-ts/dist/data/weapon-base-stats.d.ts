/**
 * Weapon Base Stats Database
 *
 * Defines base statistics for all weapon types and classes
 */
import { WeaponTemplate, WeaponClass, WeaponBaseStats, getWeaponTemplate as getTemplate } from './weapon-templates';
export { WeaponTemplate, WeaponClass, WeaponBaseStats, getTemplate as getWeaponTemplate };
export declare const weaponClassStats: Record<WeaponClass, WeaponBaseStats>;
export declare function getWeaponClassStats(weaponClass: WeaponClass): WeaponBaseStats;
export declare function calculateTemplateStats(template: WeaponTemplate): WeaponBaseStats;
//# sourceMappingURL=weapon-base-stats.d.ts.map