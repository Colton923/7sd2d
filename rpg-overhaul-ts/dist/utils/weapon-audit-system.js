"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaponAuditSystem = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WeaponAuditSystem {
    /**
     * Add a weapon to the audit log
     */
    static addWeaponAudit(entry) {
        entry.generatedAt = new Date();
        this.auditLog.push(entry);
    }
    /**
     * Get all audit entries
     */
    static getAuditLog() {
        return [...this.auditLog];
    }
    /**
     * Get audit entries for a specific session
     */
    static getSessionAudit() {
        const sessionEntries = this.auditLog.filter((entry) => {
            const entryTime = new Date(entry.generatedAt || "");
            return entryTime >= this.sessionStartTime;
        });
        return sessionEntries;
    }
    /**
     * Clear the audit log
     */
    static clearAuditLog() {
        this.auditLog = [];
        this.sessionStartTime = new Date();
    }
    /**
     * Export audit log to CSV
     */
    static exportToCSV(filePath) {
        const headers = [
            "generatedAt",
            "base_weapon",
            "manufacturer",
            "rarity",
            "tier",
            "final_damage",
            "final_durability",
            "final_rate_of_fire",
            "final_accuracy",
            "final_range",
            "final_magazine_size",
            "final_weight",
            "final_economic_value",
            "material",
            "weapon_type",
            "ammo_type",
        ];
        const rows = this.auditLog.map((entry) => headers
            .map((header) => {
            const value = entry[header];
            // Handle dates and numbers properly
            if (header === "generatedAt")
                return `"${value || ""}"`;
            if (typeof value === "number")
                return value.toString();
            return `"${value || ""}"`;
        })
            .join(","));
        const csvContent = [headers.join(","), ...rows].join("\n");
        if (filePath) {
            const outputPath = path.resolve(filePath);
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, csvContent, "utf-8");
            console.log(`Weapon audit exported to: ${outputPath}`);
        }
        return csvContent;
    }
    /**
     * Generate audit analytics
     */
    static generateAnalytics() {
        const totalWeapons = this.auditLog.length;
        const manufacturerBreakdown = {};
        const rarityBreakdown = {};
        const weaponTypeBreakdown = {};
        const tierBreakdown = {};
        let totalDamage = 0;
        let totalDurability = 0;
        let totalAccuracy = 0;
        let totalValue = 0;
        for (const entry of this.auditLog) {
            // Manufacturer breakdown
            manufacturerBreakdown[entry.manufacturer] =
                (manufacturerBreakdown[entry.manufacturer] || 0) + 1;
            // Rarity breakdown
            rarityBreakdown[entry.rarity] = (rarityBreakdown[entry.rarity] || 0) + 1;
            // Weapon type breakdown
            weaponTypeBreakdown[entry.weapon_type] =
                (weaponTypeBreakdown[entry.weapon_type] || 0) + 1;
            // Tier breakdown
            tierBreakdown[entry.tier] = (tierBreakdown[entry.tier] || 0) + 1;
            // Accumulate stats for averages
            totalDamage += entry.final_damage;
            totalDurability += entry.final_durability;
            totalAccuracy += entry.final_accuracy;
            totalValue += entry.final_economic_value;
        }
        const averageStats = {
            damage: totalWeapons > 0 ? Math.round(totalDamage / totalWeapons) : 0,
            durability: totalWeapons > 0 ? Math.round(totalDurability / totalWeapons) : 0,
            accuracy: totalWeapons > 0
                ? Math.round((totalAccuracy / totalWeapons) * 100) / 100
                : 0,
            value: totalWeapons > 0 ? Math.round(totalValue / totalWeapons) : 0,
        };
        // Get top 5 weapons by value
        const topWeapons = [...this.auditLog]
            .sort((a, b) => b.final_economic_value - a.final_economic_value)
            .slice(0, 5);
        return {
            totalWeapons,
            manufacturerBreakdown,
            rarityBreakdown,
            weaponTypeBreakdown,
            tierBreakdown,
            averageStats,
            topWeapons,
        };
    }
    /**
     * Print analytics report
     */
    static printAnalyticsReport() {
        const analytics = this.generateAnalytics();
        console.log("\n=== WEAPON AUDIT ANALYTICS REPORT ===");
        console.log(`Total Weapons Generated: ${analytics.totalWeapons}`);
        console.log("\n--- Manufacturer Breakdown ---");
        for (const [manufacturer, count] of Object.entries(analytics.manufacturerBreakdown)) {
            const percentage = ((count / analytics.totalWeapons) * 100).toFixed(1);
            console.log(`${manufacturer}: ${count} (${percentage}%)`);
        }
        console.log("\n--- Rarity Breakdown ---");
        for (const [rarity, count] of Object.entries(analytics.rarityBreakdown)) {
            const percentage = ((count / analytics.totalWeapons) * 100).toFixed(1);
            console.log(`${rarity}: ${count} (${percentage}%)`);
        }
        console.log("\n--- Weapon Type Breakdown ---");
        for (const [type, count] of Object.entries(analytics.weaponTypeBreakdown)) {
            const percentage = ((count / analytics.totalWeapons) * 100).toFixed(1);
            console.log(`${type}: ${count} (${percentage}%)`);
        }
        console.log("\n--- Average Stats ---");
        console.log(`Damage: ${analytics.averageStats.damage}`);
        console.log(`Durability: ${analytics.averageStats.durability}`);
        console.log(`Accuracy: ${analytics.averageStats.accuracy}`);
        console.log(`Value: ${analytics.averageStats.value}`);
        console.log("\n--- Top 5 Weapons by Value ---");
        analytics.topWeapons.forEach((weapon, index) => {
            console.log(`${index + 1}. ${weapon.manufacturer} ${weapon.base_weapon} (${weapon.rarity}) - ${weapon.final_economic_value} value`);
        });
        console.log("\n=====================================\n");
    }
    /**
     * Filter audit entries by criteria
     */
    static filterAudit(filters) {
        return this.auditLog.filter((entry) => {
            if (filters.manufacturer && entry.manufacturer !== filters.manufacturer)
                return false;
            if (filters.rarity && entry.rarity !== filters.rarity)
                return false;
            if (filters.weaponType && entry.weapon_type !== filters.weaponType)
                return false;
            if (filters.minTier && entry.tier < filters.minTier)
                return false;
            if (filters.maxTier && entry.tier > filters.maxTier)
                return false;
            if (filters.minValue && entry.final_economic_value < filters.minValue)
                return false;
            if (filters.maxValue && entry.final_economic_value > filters.maxValue)
                return false;
            return true;
        });
    }
    /**
     * Get weapons by manufacturer
     */
    static getWeaponsByManufacturer(manufacturer) {
        return this.auditLog.filter((entry) => entry.manufacturer === manufacturer);
    }
    /**
     * Get weapons by rarity
     */
    static getWeaponsByRarity(rarity) {
        return this.auditLog.filter((entry) => entry.rarity === rarity);
    }
    /**
     * Get weapons by type
     */
    static getWeaponsByType(weaponType) {
        return this.auditLog.filter((entry) => entry.weapon_type === weaponType);
    }
    /**
     * Calculate manufacturer statistics
     */
    static getManufacturerStats(manufacturer) {
        const manufacturerWeapons = this.getWeaponsByManufacturer(manufacturer);
        if (manufacturerWeapons.length === 0)
            return null;
        let totalDamage = 0;
        let totalDurability = 0;
        let totalValue = 0;
        const rarityDistribution = {};
        for (const weapon of manufacturerWeapons) {
            totalDamage += weapon.final_damage;
            totalDurability += weapon.final_durability;
            totalValue += weapon.final_economic_value;
            rarityDistribution[weapon.rarity] =
                (rarityDistribution[weapon.rarity] || 0) + 1;
        }
        return {
            weaponCount: manufacturerWeapons.length,
            averageDamage: Math.round(totalDamage / manufacturerWeapons.length),
            averageDurability: Math.round(totalDurability / manufacturerWeapons.length),
            averageValue: Math.round(totalValue / manufacturerWeapons.length),
            rarityDistribution,
        };
    }
    /**
     * Export manufacturer comparison report
     */
    static exportManufacturerComparison(filePath) {
        const manufacturers = ["Atlas", "Tediore", "Hyperion", "Vladof", "Jakobs"];
        const report = [];
        report.push("Manufacturer Comparison Report");
        report.push("==============================");
        report.push("");
        for (const manufacturer of manufacturers) {
            const stats = this.getManufacturerStats(manufacturer);
            if (!stats)
                continue;
            report.push(`${manufacturer}:`);
            report.push(`  Weapons Generated: ${stats.weaponCount}`);
            report.push(`  Average Damage: ${stats.averageDamage}`);
            report.push(`  Average Durability: ${stats.averageDurability}`);
            report.push(`  Average Value: ${stats.averageValue}`);
            report.push("  Rarity Distribution:");
            for (const [rarity, count] of Object.entries(stats.rarityDistribution)) {
                const percentage = ((count / stats.weaponCount) * 100).toFixed(1);
                report.push(`    ${rarity}: ${count} (${percentage}%)`);
            }
            report.push("");
        }
        const reportContent = report.join("\n");
        if (filePath) {
            fs.writeFileSync(filePath, reportContent, "utf-8");
            console.log(`Manufacturer comparison exported to: ${filePath}`);
        }
        return reportContent;
    }
}
exports.WeaponAuditSystem = WeaponAuditSystem;
WeaponAuditSystem.auditLog = [];
WeaponAuditSystem.sessionStartTime = new Date();
//# sourceMappingURL=weapon-audit-system.js.map