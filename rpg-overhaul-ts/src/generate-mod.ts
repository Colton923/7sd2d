// import { XMLGenerator } from '@7d2d/mod-builder';
import { SimpleXMLGenerator } from "./utils/simple-xml-generator";
import {
  AdvancedWeaponGenerator,
  ElementalType,
} from "./generators/advanced-weapon-generator";
import { EntityGenerator, ZombieVariant } from "./generators/entity-generator";
import * as fs from "fs";
import * as path from "path";

// Main mod generation script
async function generateRPGOverhaulMod() {
  console.log("🎮 Starting RPG Overhaul Mod Generation...\n");

  // Initialize generators
  const weaponGen = new AdvancedWeaponGenerator();
  const entityGen = new EntityGenerator();
  const xmlGen = new SimpleXMLGenerator();

  // Create output directory structure
  const outputDir = path.join(
    __dirname,
    "..",
    "..",
    "rpg-overhaul",
    "output",
    "mods",
    "7D2D-RPGOverhaul"
  );
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
    { base: "gunHandgunT1Pistol", class: "pistol" as const },
    { base: "gunRifleT2HuntingRifle", class: "rifle" as const },
    { base: "gunShotgunT1DoubleBarrel", class: "shotgun" as const },
    { base: "gunSniperT3SniperRifle", class: "sniper" as const },
    { base: "gunMGT2TacticalAR", class: "automatic" as const },
    { base: "gunSMGT1PipeGun", class: "smg" as const },
    { base: "meleeWpnBladeT2Machete", class: "melee" as const },
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
        const weapon = weaponGen.generateRandomWeapon(
          weaponType.base,
          weaponType.class,
          {
            minTier: levelRange.tiers[0],
            maxTier: levelRange.tiers[levelRange.tiers.length - 1],
            minQuality: levelRange.qualities[0],
            maxQuality: levelRange.qualities[1],
            playerLevel: levelRange.min,
          }
        );

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
  const lootTables = new Map<number, Map<string, number>>();

  const gameStages = [50, 150, 300, 500];
  gameStages.forEach((stage) => {
    const playerLevel = Math.min(60, Math.floor(stage / 10));
    const lootTable = weaponGen.generateLootTable(playerLevel, stage);
    lootTables.set(stage, lootTable);
    console.log(
      `  ✓ Generated loot table for game stage ${stage} (${lootTable.size} weapon types)`
    );
  });

  // Generate Zombies
  console.log("\n🧟 Generating Zombie Entities...");

  // Standard zombie variants
  const standardZombie: ZombieVariant = {
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
  const feralZombie: ZombieVariant = {
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
  const radiatedZombie: ZombieVariant = {
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

  fs.writeFileSync(
    path.join(outputDir, "generation-summary.json"),
    JSON.stringify(summary, null, 2)
  );
  console.log("\n📊 Generation summary saved to generation-summary.json");
}

// Run the generator
generateRPGOverhaulMod().catch((error) => {
  console.error("❌ Error generating mod:", error);
  process.exit(1);
});
