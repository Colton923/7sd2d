import { WeaponAuditEntry } from "../config/loot/types";
export declare class WeaponAuditSystem {
    private static auditLog;
    private static sessionStartTime;
    /**
     * Add a weapon to the audit log
     */
    static addWeaponAudit(entry: WeaponAuditEntry): void;
    /**
     * Get all audit entries
     */
    static getAuditLog(): WeaponAuditEntry[];
    /**
     * Get audit entries for a specific session
     */
    static getSessionAudit(): WeaponAuditEntry[];
    /**
     * Clear the audit log
     */
    static clearAuditLog(): void;
    /**
     * Export audit log to CSV
     */
    static exportToCSV(filePath?: string): string;
    /**
     * Generate audit analytics
     */
    static generateAnalytics(): {
        totalWeapons: number;
        manufacturerBreakdown: {
            [manufacturer: string]: number;
        };
        rarityBreakdown: {
            [rarity: string]: number;
        };
        weaponTypeBreakdown: {
            [type: string]: number;
        };
        tierBreakdown: {
            [tier: number]: number;
        };
        averageStats: {
            damage: number;
            durability: number;
            accuracy: number;
            value: number;
        };
        topWeapons: WeaponAuditEntry[];
    };
    /**
     * Print analytics report
     */
    static printAnalyticsReport(): void;
    /**
     * Filter audit entries by criteria
     */
    static filterAudit(filters: {
        manufacturer?: string;
        rarity?: string;
        weaponType?: string;
        minTier?: number;
        maxTier?: number;
        minValue?: number;
        maxValue?: number;
    }): WeaponAuditEntry[];
    /**
     * Get weapons by manufacturer
     */
    static getWeaponsByManufacturer(manufacturer: string): WeaponAuditEntry[];
    /**
     * Get weapons by rarity
     */
    static getWeaponsByRarity(rarity: string): WeaponAuditEntry[];
    /**
     * Get weapons by type
     */
    static getWeaponsByType(weaponType: string): WeaponAuditEntry[];
    /**
     * Calculate manufacturer statistics
     */
    static getManufacturerStats(manufacturer: string): {
        weaponCount: number;
        averageDamage: number;
        averageDurability: number;
        averageValue: number;
        rarityDistribution: {
            [rarity: string]: number;
        };
    } | null;
    /**
     * Export manufacturer comparison report
     */
    static exportManufacturerComparison(filePath?: string): string;
}
//# sourceMappingURL=weapon-audit-system.d.ts.map