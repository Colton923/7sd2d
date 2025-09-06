import * as fs from "fs";
import * as path from "path";
import { WeaponAuditEntry } from "../config/loot/types";

export class WeaponAuditSystem {
  private static auditLog: WeaponAuditEntry[] = [];
  private static sessionStartTime: Date = new Date();

  /**
   * Add a weapon to the audit log
   */
  static addWeaponAudit(entry: WeaponAuditEntry): void {
    entry.generatedAt = new Date();
    this.auditLog.push(entry);
  }

  /**
   * Get all audit entries
   */
  static getAuditLog(): WeaponAuditEntry[] {
    return [...this.auditLog];
  }

  /**
   * Get audit entries for a specific session
   */
  static getSessionAudit(): WeaponAuditEntry[] {
    const sessionEntries = this.auditLog.filter((entry) => {
      const entryTime = new Date(entry.generatedAt || "");
      return entryTime >= this.sessionStartTime;
    });
    return sessionEntries;
  }

  /**
   * Clear the audit log
   */
  static clearAuditLog(): void {
    this.auditLog = [];
    this.sessionStartTime = new Date();
  }

  /**
   * Export audit log to CSV
   */
  static exportToCSV(filePath?: string): string {
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

    const rows = this.auditLog.map((entry) =>
      headers
        .map((header) => {
          const value = entry[header];
          // Handle dates and numbers properly
          if (header === "generatedAt") return `"${value || ""}"`;
          if (typeof value === "number") return value.toString();
          return `"${value || ""}"`;
        })
        .join(",")
    );

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
  static generateAnalytics(): {
    totalWeapons: number;
    manufacturerBreakdown: { [manufacturer: string]: number };
    rarityBreakdown: { [rarity: string]: number };
    weaponTypeBreakdown: { [type: string]: number };
    tierBreakdown: { [tier: number]: number };
    averageStats: {
      damage: number;
      durability: number;
      accuracy: number;
      value: number;
    };
    topWeapons: WeaponAuditEntry[];
  } {
    const totalWeapons = this.auditLog.length;

    const manufacturerBreakdown: { [manufacturer: string]: number } = {};
    const rarityBreakdown: { [rarity: string]: number } = {};
    const weaponTypeBreakdown: { [type: string]: number } = {};
    const tierBreakdown: { [tier: number]: number } = {};

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
      durability:
        totalWeapons > 0 ? Math.round(totalDurability / totalWeapons) : 0,
      accuracy:
        totalWeapons > 0
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
  static printAnalyticsReport(): void {
    const analytics = this.generateAnalytics();

    console.log("\n=== WEAPON AUDIT ANALYTICS REPORT ===");
    console.log(`Total Weapons Generated: ${analytics.totalWeapons}`);

    console.log("\n--- Manufacturer Breakdown ---");
    for (const [manufacturer, count] of Object.entries(
      analytics.manufacturerBreakdown
    )) {
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
      console.log(
        `${index + 1}. ${weapon.manufacturer} ${weapon.base_weapon} (${
          weapon.rarity
        }) - ${weapon.final_economic_value} value`
      );
    });

    console.log("\n=====================================\n");
  }

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
  }): WeaponAuditEntry[] {
    return this.auditLog.filter((entry) => {
      if (filters.manufacturer && entry.manufacturer !== filters.manufacturer)
        return false;
      if (filters.rarity && entry.rarity !== filters.rarity) return false;
      if (filters.weaponType && entry.weapon_type !== filters.weaponType)
        return false;
      if (filters.minTier && entry.tier < filters.minTier) return false;
      if (filters.maxTier && entry.tier > filters.maxTier) return false;
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
  static getWeaponsByManufacturer(manufacturer: string): WeaponAuditEntry[] {
    return this.auditLog.filter((entry) => entry.manufacturer === manufacturer);
  }

  /**
   * Get weapons by rarity
   */
  static getWeaponsByRarity(rarity: string): WeaponAuditEntry[] {
    return this.auditLog.filter((entry) => entry.rarity === rarity);
  }

  /**
   * Get weapons by type
   */
  static getWeaponsByType(weaponType: string): WeaponAuditEntry[] {
    return this.auditLog.filter((entry) => entry.weapon_type === weaponType);
  }

  /**
   * Calculate manufacturer statistics
   */
  static getManufacturerStats(manufacturer: string): {
    weaponCount: number;
    averageDamage: number;
    averageDurability: number;
    averageValue: number;
    rarityDistribution: { [rarity: string]: number };
  } | null {
    const manufacturerWeapons = this.getWeaponsByManufacturer(manufacturer);
    if (manufacturerWeapons.length === 0) return null;

    let totalDamage = 0;
    let totalDurability = 0;
    let totalValue = 0;
    const rarityDistribution: { [rarity: string]: number } = {};

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
      averageDurability: Math.round(
        totalDurability / manufacturerWeapons.length
      ),
      averageValue: Math.round(totalValue / manufacturerWeapons.length),
      rarityDistribution,
    };
  }

  /**
   * Export manufacturer comparison report
   */
  static exportManufacturerComparison(filePath?: string): string {
    const manufacturers = ["Atlas", "Tediore", "Hyperion", "Vladof", "Jakobs"];
    const report: string[] = [];

    report.push("Manufacturer Comparison Report");
    report.push("==============================");
    report.push("");

    for (const manufacturer of manufacturers) {
      const stats = this.getManufacturerStats(manufacturer);
      if (!stats) continue;

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
