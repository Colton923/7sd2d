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
// import { XMLGenerator } from '@7d2d/mod-builder';
const simple_xml_generator_1 = require("./utils/simple-xml-generator");
const advanced_weapon_generator_1 = require("./generators/advanced-weapon-generator");
const entity_generator_1 = require("./generators/entity-generator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Main mod generation script
async function generateRPGOverhaulMod() {
    console.log("🎮 Starting RPG Overhaul Mod Generation...\n");
    // Initialize generators
    const weaponGen = new advanced_weapon_generator_1.AdvancedWeaponGenerator();
    const entityGen = new entity_generator_1.EntityGenerator();
    const xmlGen = new simple_xml_generator_1.SimpleXMLGenerator();
    // Create output directory structure
    const outputDir = path.join(__dirname, "..", "..", "rpg-overhaul", "output", "mods", "7D2D-RPGOverhaul");
    const configDir = path.join(outputDir, "Config");
    [outputDir, configDir].forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    console.log("📁 Created output directories");
    // Generate Weapons with Advanced System
    console.log("\n⚔️ Generating Procedural Weapons...");
    const allWeapons = [];
    const weaponClasses = [
        { base: "gunHandgunT1Pistol", class: "pistol" },
        { base: "gunRifleT2HuntingRifle", class: "rifle" },
        { base: "gunShotgunT1DoubleBarrel", class: "shotgun" },
        { base: "gunSniperT3SniperRifle", class: "sniper" },
        { base: "gunMGT2TacticalAR", class: "automatic" },
        { base: "gunSMGT1PipeGun", class: "smg" },
        { base: "meleeWpnBladeT2Machete", class: "melee" },
    ];
    // Generate weapons for different player level ranges
    const levelRanges = [
        { min: 1, max: 10, tiers: [1, 2], qualities: [1, 100] },
        { min: 10, max: 20, tiers: [2, 3], qualities: [50, 200] },
        { min: 20, max: 30, tiers: [3, 4], qualities: [100, 300] },
        { min: 30, max: 40, tiers: [4, 5], qualities: [200, 400] },
        { min: 40, max: 50, tiers: [5, 6], qualities: [300, 500] },
        { min: 50, max: 60, tiers: [6], qualities: [400, 600] },
    ];
    let totalGenerated = 0;
    for (const weaponType of weaponClasses) {
        for (const levelRange of levelRanges) {
            // Generate a variety of weapons for each level range
            const numVariants = 5; // Reduce for manageable output
            for (let i = 0; i < numVariants; i++) {
                const weapon = weaponGen.generateRandomWeapon(weaponType.base, weaponType.class, {
                    minTier: levelRange.tiers[0],
                    maxTier: levelRange.tiers[levelRange.tiers.length - 1],
                    minQuality: levelRange.qualities[0],
                    maxQuality: levelRange.qualities[1],
                    playerLevel: levelRange.min,
                });
                allWeapons.push(weapon.build());
                totalGenerated++;
            }
        }
    }
    console.log(`  ✓ Generated ${totalGenerated} unique procedural weapons`);
    console.log(`  ✓ Weapon types: ${weaponClasses.length}`);
    console.log(`  ✓ Level ranges: ${levelRanges.length}`);
    console.log(`  ✓ Each weapon has unique affixes, parts, and properties`);
    // Generate loot tables for different game stages
    console.log("\n📊 Generating Loot Tables...");
    const lootTables = new Map();
    const gameStages = [50, 150, 300, 500];
    gameStages.forEach((stage) => {
        const playerLevel = Math.min(60, Math.floor(stage / 10));
        const lootTable = weaponGen.generateLootTable(playerLevel, stage);
        lootTables.set(stage, lootTable);
        console.log(`  ✓ Generated loot table for game stage ${stage} (${lootTable.size} weapon types)`);
    });
    // Generate Zombies
    console.log("\n🧟 Generating Zombie Entities...");
    // Standard zombie variants
    const standardZombie = {
        name: "Walker",
        type: "normal",
        tier: 1,
        baseStats: {
            health: 150,
            speed: 0.3,
            damage: 15,
            armor: 0,
            experience: 100,
            sightRange: 30,
            hearingRange: 40,
        },
    };
    const standardHorde = entityGen.generateZombieHorde(standardZombie, 10, {
        tierRange: [1, 3],
        includeSpecials: false,
    });
    // Feral zombie variants
    const feralZombie = {
        name: "Feral",
        type: "feral",
        tier: 3,
        baseStats: {
            health: 250,
            speed: 0.5,
            damage: 25,
            armor: 5,
            experience: 250,
            sightRange: 40,
            hearingRange: 50,
        },
        abilities: ["rage"],
    };
    const feralHorde = entityGen.generateZombieHorde(feralZombie, 5, {
        tierRange: [3, 5],
        includeSpecials: true,
    });
    // Radiated zombie variants
    const radiatedZombie = {
        name: "Radiated",
        type: "radiated",
        tier: 5,
        baseStats: {
            health: 500,
            speed: 0.4,
            damage: 40,
            armor: 10,
            experience: 500,
            sightRange: 50,
            hearingRange: 60,
        },
        abilities: ["regeneration", "acidSpit"],
        specialBehaviors: ["nocturnal"],
    };
    const radiatedHorde = entityGen.generateZombieHorde(radiatedZombie, 3, {
        tierRange: [5, 6],
        includeSpecials: true,
        includeBoss: true,
    });
    console.log(`  ✓ Generated ${standardHorde.length} standard zombies`);
    console.log(`  ✓ Generated ${feralHorde.length} feral zombies`);
    console.log(`  ✓ Generated ${radiatedHorde.length} radiated zombies`);
    // Generate XML files
    console.log("\n📝 Generating XML files...");
    // Generate items.xml (weapons)
    const itemsXml = xmlGen.generateItems(allWeapons);
    fs.writeFileSync(path.join(configDir, "items.xml"), itemsXml);
    console.log("  ✓ Generated items.xml");
    // Generate entityclasses.xml (zombies)
    const allZombies = [...standardHorde, ...feralHorde, ...radiatedHorde];
    const entitiesXml = xmlGen.generateEntities(allZombies.map((z) => z.build()));
    fs.writeFileSync(path.join(configDir, "entityclasses.xml"), entitiesXml);
    console.log("  ✓ Generated entityclasses.xml");
    // Generate ModInfo.xml (V2 format)
    const modInfoXml = `<?xml version="1.0" encoding="UTF-8"?>
<ModInfo>
  <Name value="7D2D-RPGOverhaul"/>
  <DisplayName value="7D2D RPG Overhaul"/>
  <Description value="Complete RPG overhaul with procedural weapons, elemental damage, affixes, mastery system, and enhanced loot"/>
  <Author value="7D2D RPG Overhaul Team"/>
  <Version value="1.0.0"/>
  <Website value=""/>
</ModInfo>`;
    fs.writeFileSync(path.join(outputDir, "ModInfo.xml"), modInfoXml);
    console.log("  ✓ Generated ModInfo.xml");
    console.log("\n✅ RPG Overhaul Mod generation complete!");
    console.log(`📂 Output location: ${outputDir}`);
    // Generate summary
    const summary = {
        generated: new Date().toISOString(),
        statistics: {
            weapons: totalGenerated,
            zombies: allZombies.length,
            totalItems: allWeapons.length + allZombies.length,
        },
        files: ["ModInfo.xml", "Config/items.xml", "Config/entityclasses.xml"],
    };
    fs.writeFileSync(path.join(outputDir, "generation-summary.json"), JSON.stringify(summary, null, 2));
    console.log("\n📊 Generation summary saved to generation-summary.json");
}
// Run the generator
generateRPGOverhaulMod().catch((error) => {
    console.error("❌ Error generating mod:", error);
    process.exit(1);
});
//# sourceMappingURL=generate-mod.js.map