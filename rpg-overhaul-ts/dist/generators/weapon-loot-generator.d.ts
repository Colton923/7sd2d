import { LootGenerator } from "./loot-generator";
import { LootGenerationContext, GeneratedLootItem, WeaponAuditEntry } from "../config/loot/types";
export declare class WeaponLootGenerator extends LootGenerator {
    private static weaponAudit;
    /**
     * Generate weapon loot with full RPG properties
     */
    static generateWeaponLoot(context: LootGenerationContext): {
        result: GeneratedLootItem[];
        audit: WeaponAuditEntry[];
    };
    /**
     * Generate a single weapon with full RPG properties
     */
    private static generateWeapon;
    /**
     * Determine how many weapons to generate
     */
    private static determineWeaponCount;
    /**
     * Select a base weapon template
     */
    private static selectBaseWeapon;
    /**
     * Select a manufacturer
     */
    private static selectManufacturer;
    /**
     * Determine weapon rarity with game stage scaling
     */
    private static determineWeaponRarity;
    /**
     * Apply manufacturer traits to weapon stats
     */
    private static applyManufacturerTraits;
    /**
     * Get manufacturer-specific modifiers
     */
    private static getManufacturerModifiers;
    /**
     * Generate weapon name
     */
    private static generateWeaponName;
    /**
     * Get weapon audit data
     */
    static getWeaponAudit(): WeaponAuditEntry[];
    /**
     * Clear weapon audit data
     */
    static clearWeaponAudit(): void;
    /**
     * Export weapon audit to CSV
     */
    static exportWeaponAuditToCSV(): string;
}
//# sourceMappingURL=weapon-loot-generator.d.ts.map