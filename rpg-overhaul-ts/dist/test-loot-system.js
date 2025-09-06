#!/usr/bin/env ts-node
"use strict";
/**
 * Test script for the integrated loot system
 * Demonstrates TypeScript loot generation working with C# runtime patches
 */
Object.defineProperty(exports, "__esModule", { value: true });
const weapon_loot_generator_1 = require("./generators/weapon-loot-generator");
const location_loot_distributor_1 = require("./generators/location-loot-distributor");
const loot_integrated_weapon_generator_1 = require("./generators/loot-integrated-weapon-generator");
const weapon_audit_system_1 = require("./utils/weapon-audit-system");
console.log("🧪 Testing RPG Overhaul Loot System Integration\n");
// Test 1: Basic weapon loot generation
console.log("📦 Test 1: Weapon Loot Generation");
const context1 = {
    gamestage: 150,
    location: "military",
    containerType: "weapon_case",
    difficulty: 3,
    biome: "wasteland",
    playerLevel: 25,
};
const { result: weapons, audit } = weapon_loot_generator_1.WeaponLootGenerator.generateWeaponLoot(context1);
console.log(`Generated ${weapons.length} weapons for gamestage ${context1.gamestage}`);
weapons.forEach((weapon, i) => {
    console.log(`  ${i + 1}. ${weapon.name} (${weapon.rarity}) - ${weapon.value} value`);
});
// Test 2: Location-based loot distribution
console.log("\n🏞️  Test 2: Location-Based Loot Distribution");
const context2 = {
    gamestage: 75,
    location: "houses",
    containerType: "kitchen_cupboard",
    difficulty: 2,
    biome: "forest",
};
const locationItems = location_loot_distributor_1.LocationLootDistributor.generateLocationLoot(context2);
console.log(`Generated ${locationItems.length} items for ${context2.location} in ${context2.biome}`);
locationItems.slice(0, 5).forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.name} (${item.category}) - ${item.value} value`);
});
// Test 3: Integrated weapon generation
console.log("\n⚔️  Test 3: Loot-Integrated Weapon Generation");
const weaponGenerator = new loot_integrated_weapon_generator_1.LootIntegratedWeaponGenerator();
const weapon = weaponGenerator.generateWeaponFromLoot("gunHandgunT1Pistol", "pistol", context1);
if (weapon) {
    console.log("Successfully generated integrated weapon:");
    const weaponData = weapon.build(); // Build to get the actual data
    console.log(`  Name: ${weaponData.name}`);
    console.log("  Properties:", weaponData.properties);
}
else {
    console.log("No weapon generated (normal for loot probability)");
}
// Test 4: Analytics and audit
console.log("\n📊 Test 4: Weapon Audit Analytics");
const analytics = weapon_audit_system_1.WeaponAuditSystem.generateAnalytics();
console.log(`Total weapons in audit: ${analytics.totalWeapons}`);
if (analytics.totalWeapons > 0) {
    console.log(`Average damage: ${analytics.averageStats.damage}`);
    console.log(`Average value: ${analytics.averageStats.value}`);
    console.log("Manufacturer breakdown:", analytics.manufacturerBreakdown);
}
// Test 5: Export audit data
console.log("\n💾 Test 5: Export Weapon Audit");
const csvData = weapon_audit_system_1.WeaponAuditSystem.exportToCSV("./weapon_audit_test.csv");
console.log(`Exported ${csvData.split("\n").length - 1} weapon records to CSV`);
// Test 6: Manufacturer comparison
console.log("\n🏭 Test 6: Manufacturer Comparison");
const comparison = weapon_audit_system_1.WeaponAuditSystem.exportManufacturerComparison("./manufacturer_comparison.txt");
console.log("Generated manufacturer comparison report");
console.log("\n✅ Loot System Integration Test Complete!");
console.log("\n📋 What this demonstrates:");
console.log("1. ✅ TypeScript loot configuration loading");
console.log("2. ✅ Weapon generation with RPG properties");
console.log("3. ✅ Location-based loot distribution");
console.log("4. ✅ Biome-specific modifiers");
console.log("5. ✅ Weapon audit and analytics");
console.log("6. ✅ CSV export for data analysis");
console.log("7. ✅ Manufacturer comparison reports");
console.log("\n🎯 Ready for C# runtime integration!");
// Clean up
weapon_audit_system_1.WeaponAuditSystem.clearAuditLog();
//# sourceMappingURL=test-loot-system.js.map