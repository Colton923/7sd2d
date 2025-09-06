"use strict";
/**
 * Weapon Templates Database
 *
 * Contains all specific weapon templates with unique characteristics
 * Each template represents a base weapon type that can be modified
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaponTemplates = void 0;
exports.getWeaponTemplate = getWeaponTemplate;
exports.getTemplatesByClass = getTemplatesByClass;
exports.getTemplatesByTier = getTemplatesByTier;
exports.calculateTemplateStats = calculateTemplateStats;
exports.getRandomTemplate = getRandomTemplate;
exports.weaponTemplates = [
    // ========== PISTOLS ==========
    {
        id: 'pistol_9mm',
        name: '9mm Pistol',
        baseType: 'gunHandgunT1Pistol',
        weaponClass: 'pistol',
        description: 'Standard 9mm sidearm',
        tier: 1
    },
    {
        id: 'pistol_44magnum',
        name: '.44 Magnum',
        baseType: 'gunHandgunT2Magnum44',
        weaponClass: 'pistol',
        description: 'High-caliber revolver',
        tier: 2,
        statModifiers: {
            damage: 40,
            fireRate: 1.2,
            magazineSize: 6,
            penetration: 3
        }
    },
    {
        id: 'pistol_desert_eagle',
        name: 'Desert Vulture',
        baseType: 'gunHandgunT3DesertVulture',
        weaponClass: 'pistol',
        description: 'Heavy semi-automatic pistol',
        tier: 3,
        statModifiers: {
            damage: 55,
            fireRate: 1.5,
            magazineSize: 7,
            penetration: 4,
            recoil: 0.2
        }
    },
    {
        id: 'pistol_plasma',
        name: 'Plasma Pistol',
        baseType: 'gunHandgunT4PlasmaPistol',
        weaponClass: 'pistol',
        description: 'Energy-based sidearm',
        tier: 4,
        statModifiers: {
            damage: 65,
            fireRate: 2.5,
            magazineSize: 20,
            penetration: 5
        },
        specialProperties: {
            overheat: true
        },
        fixedAffixes: ['plasma_burn']
    },
    {
        id: 'pistol_dual_wield',
        name: 'Dual Berettas',
        baseType: 'gunHandgunT3DualPistols',
        weaponClass: 'pistol',
        description: 'Dual-wielded pistols',
        tier: 3,
        statModifiers: {
            fireRate: 4.0,
            magazineSize: 30,
            accuracy: 0.7
        },
        specialProperties: {
            dualWield: true
        }
    },
    // ========== RIFLES ==========
    {
        id: 'rifle_hunting',
        name: 'Hunting Rifle',
        baseType: 'gunRifleT1HuntingRifle',
        weaponClass: 'rifle',
        description: 'Bolt-action hunting rifle',
        tier: 1,
        statModifiers: {
            fireRate: 0.8,
            accuracy: 0.95
        }
    },
    {
        id: 'rifle_lever_action',
        name: 'Lever Action Rifle',
        baseType: 'gunRifleT2LeverActionRifle',
        weaponClass: 'rifle',
        description: 'Classic lever-action rifle',
        tier: 2,
        statModifiers: {
            fireRate: 1.5,
            magazineSize: 8
        }
    },
    {
        id: 'rifle_sniper',
        name: 'Sniper Rifle',
        baseType: 'gunRifleT3SniperRifle',
        weaponClass: 'sniper',
        description: 'Long-range precision rifle',
        tier: 3,
        specialProperties: {
            scoped: true
        }
    },
    {
        id: 'rifle_antimaterial',
        name: 'Anti-Material Rifle',
        baseType: 'gunRifleT4AntiMaterial',
        weaponClass: 'sniper',
        description: 'Heavy caliber anti-vehicle rifle',
        tier: 4,
        statModifiers: {
            damage: 200,
            fireRate: 0.3,
            penetration: 10,
            weight: 15
        },
        specialProperties: {
            scoped: true
        }
    },
    {
        id: 'rifle_gauss',
        name: 'Gauss Rifle',
        baseType: 'gunRifleT5GaussRifle',
        weaponClass: 'sniper',
        description: 'Electromagnetic rail rifle',
        tier: 5,
        statModifiers: {
            damage: 250,
            fireRate: 0.5,
            penetration: 15,
            accuracy: 1.0
        },
        specialProperties: {
            chargeTime: 1.0,
            scoped: true
        }
    },
    // ========== SHOTGUNS ==========
    {
        id: 'shotgun_double_barrel',
        name: 'Double Barrel Shotgun',
        baseType: 'gunShotgunT1DoubleBarrel',
        weaponClass: 'shotgun',
        description: 'Classic double-barrel shotgun',
        tier: 1,
        statModifiers: {
            magazineSize: 2,
            reloadSpeed: 2.0
        }
    },
    {
        id: 'shotgun_pump',
        name: 'Pump Shotgun',
        baseType: 'gunShotgunT2PumpShotgun',
        weaponClass: 'shotgun',
        description: 'Pump-action shotgun',
        tier: 2,
        statModifiers: {
            magazineSize: 8,
            fireRate: 1.0
        }
    },
    {
        id: 'shotgun_auto',
        name: 'Auto Shotgun',
        baseType: 'gunShotgunT3AutoShotgun',
        weaponClass: 'shotgun',
        description: 'Automatic combat shotgun',
        tier: 3,
        statModifiers: {
            fireRate: 3.0,
            magazineSize: 12,
            spread: 0.12
        }
    },
    {
        id: 'shotgun_combat',
        name: 'Combat Shotgun',
        baseType: 'gunShotgunT4CombatShotgun',
        weaponClass: 'shotgun',
        description: 'Military-grade automatic shotgun',
        tier: 4,
        statModifiers: {
            damage: 100,
            fireRate: 4.0,
            magazineSize: 20,
            spread: 0.08
        }
    },
    {
        id: 'shotgun_explosive',
        name: 'Explosive Shotgun',
        baseType: 'gunShotgunT5ExplosiveShotgun',
        weaponClass: 'shotgun',
        description: 'Fires explosive slugs',
        tier: 5,
        statModifiers: {
            damage: 150,
            fireRate: 1.5,
            magazineSize: 8
        },
        fixedAffixes: ['explosive_rounds']
    },
    // ========== SMGs ==========
    {
        id: 'smg_pipe',
        name: 'Pipe Machine Gun',
        baseType: 'gunMGT0PipeMachineGun',
        weaponClass: 'smg',
        description: 'Improvised automatic weapon',
        tier: 0,
        statModifiers: {
            durability: 400,
            accuracy: 0.6
        }
    },
    {
        id: 'smg_tactical',
        name: 'SMG-5',
        baseType: 'gunMGT1SMGS',
        weaponClass: 'smg',
        description: 'Tactical submachine gun',
        tier: 2,
        statModifiers: {
            fireRate: 12,
            accuracy: 0.75
        }
    },
    {
        id: 'smg_vector',
        name: 'Vector SMG',
        baseType: 'gunMGT3VectorSMG',
        weaponClass: 'smg',
        description: 'High-tech compact SMG',
        tier: 3,
        statModifiers: {
            damage: 22,
            fireRate: 15,
            accuracy: 0.8,
            magazineSize: 45
        }
    },
    {
        id: 'smg_laser',
        name: 'Laser SMG',
        baseType: 'gunMGT4LaserSMG',
        weaponClass: 'smg',
        description: 'Energy-based automatic weapon',
        tier: 4,
        statModifiers: {
            damage: 28,
            fireRate: 20,
            magazineSize: 100,
            reloadSpeed: 1.5
        },
        specialProperties: {
            overheat: true
        }
    },
    // ========== AUTOMATIC RIFLES ==========
    {
        id: 'rifle_ak47',
        name: 'AK-47 Assault Rifle',
        baseType: 'gunMGT2TacticalAR',
        weaponClass: 'automatic',
        description: 'Reliable assault rifle',
        tier: 2,
        statModifiers: {
            damage: 38,
            fireRate: 7
        }
    },
    {
        id: 'rifle_m4',
        name: 'M60 Machine Gun',
        baseType: 'gunMGT3M60',
        weaponClass: 'automatic',
        description: 'Heavy machine gun',
        tier: 3,
        statModifiers: {
            damage: 42,
            fireRate: 10,
            magazineSize: 150,
            weight: 10
        }
    },
    {
        id: 'rifle_plasma',
        name: 'Plasma Rifle',
        baseType: 'gunMGT4PlasmaRifle',
        weaponClass: 'automatic',
        description: 'Advanced energy rifle',
        tier: 4,
        statModifiers: {
            damage: 50,
            fireRate: 8,
            magazineSize: 60,
            penetration: 5
        },
        specialProperties: {
            overheat: true
        }
    },
    {
        id: 'rifle_minigun',
        name: 'Minigun',
        baseType: 'gunMGT5Minigun',
        weaponClass: 'automatic',
        description: 'Rotating barrel heavy weapon',
        tier: 5,
        statModifiers: {
            damage: 35,
            fireRate: 30,
            magazineSize: 500,
            weight: 20,
            accuracy: 0.5
        },
        specialProperties: {
            chargeTime: 0.5
        }
    },
    // ========== LAUNCHERS ==========
    {
        id: 'launcher_pipe_bomb',
        name: 'Pipe Bomb Launcher',
        baseType: 'gunExplosivesT1PipeBombLauncher',
        weaponClass: 'launcher',
        description: 'Improvised explosive launcher',
        tier: 1,
        statModifiers: {
            damage: 150,
            fireRate: 0.5,
            magazineSize: 1
        }
    },
    {
        id: 'launcher_grenade',
        name: 'Grenade Launcher',
        baseType: 'gunExplosivesT2GrenadeLauncher',
        weaponClass: 'launcher',
        description: 'Rapid grenade launcher',
        tier: 2,
        statModifiers: {
            damage: 200,
            fireRate: 1,
            magazineSize: 6,
            reloadSpeed: 4
        }
    },
    {
        id: 'launcher_rocket',
        name: 'Rocket Launcher',
        baseType: 'gunExplosivesT3RocketLauncher',
        weaponClass: 'launcher',
        description: 'Anti-vehicle rocket launcher',
        tier: 3
    },
    {
        id: 'launcher_guided',
        name: 'Guided Missile Launcher',
        baseType: 'gunExplosivesT4GuidedMissile',
        weaponClass: 'launcher',
        description: 'Lock-on missile system',
        tier: 4,
        statModifiers: {
            damage: 400,
            fireRate: 0.3,
            magazineSize: 4
        },
        specialProperties: {
            chargeTime: 2.0
        }
    },
    {
        id: 'launcher_nuke',
        name: 'Mini-Nuke Launcher',
        baseType: 'gunExplosivesT5MiniNuke',
        weaponClass: 'launcher',
        description: 'Tactical nuclear launcher',
        tier: 5,
        statModifiers: {
            damage: 1000,
            fireRate: 0.1,
            magazineSize: 1,
            reloadSpeed: 10
        },
        specialProperties: {
            unique: true
        }
    },
    // ========== MELEE WEAPONS ==========
    {
        id: 'melee_club',
        name: 'Wooden Club',
        baseType: 'meleeWpnClubT0WoodenClub',
        weaponClass: 'melee',
        description: 'Basic wooden club',
        tier: 0,
        statModifiers: {
            damage: 15,
            durability: 250
        }
    },
    {
        id: 'melee_bat',
        name: 'Baseball Bat',
        baseType: 'meleeWpnClubT1BaseballBat',
        weaponClass: 'melee',
        description: 'Metal baseball bat',
        tier: 1,
        statModifiers: {
            damage: 25
        }
    },
    {
        id: 'melee_sledge',
        name: 'Sledgehammer',
        baseType: 'meleeWpnSledgeT2Sledgehammer',
        weaponClass: 'melee',
        description: 'Heavy construction hammer',
        tier: 2,
        statModifiers: {
            damage: 45,
            staminaLoss: 20,
            dismemberChance: 0.4
        }
    },
    {
        id: 'melee_steel_sledge',
        name: 'Steel Sledgehammer',
        baseType: 'meleeWpnSledgeT3SteelSledgehammer',
        weaponClass: 'melee',
        description: 'Reinforced sledgehammer',
        tier: 3,
        statModifiers: {
            damage: 60,
            staminaLoss: 25,
            dismemberChance: 0.5
        }
    },
    {
        id: 'melee_machete',
        name: 'Machete',
        baseType: 'meleeWpnBladeT1Machete',
        weaponClass: 'melee',
        description: 'Sharp jungle blade',
        tier: 1,
        statModifiers: {
            damage: 20,
            fireRate: 2.0,
            dismemberChance: 0.25
        }
    },
    {
        id: 'melee_katana',
        name: 'Katana',
        baseType: 'meleeWpnBladeT3Katana',
        weaponClass: 'melee',
        description: 'Japanese sword',
        tier: 3,
        statModifiers: {
            damage: 40,
            fireRate: 2.5,
            criticalChance: 0.2,
            dismemberChance: 0.35
        }
    },
    {
        id: 'melee_chainsaw',
        name: 'Chainsaw',
        baseType: 'meleeToolChainsaw',
        weaponClass: 'melee',
        description: 'Motorized cutting tool',
        tier: 3,
        statModifiers: {
            damage: 30,
            fireRate: 10,
            dismemberChance: 0.6,
            staminaLoss: 15
        },
        specialProperties: {
            overheat: true
        }
    },
    {
        id: 'melee_plasma_sword',
        name: 'Plasma Sword',
        baseType: 'meleeWpnBladeT5PlasmaSword',
        weaponClass: 'melee',
        description: 'Energy blade weapon',
        tier: 5,
        statModifiers: {
            damage: 80,
            fireRate: 2.0,
            penetration: 10,
            dismemberChance: 0.8
        },
        specialProperties: {
            overheat: true
        },
        fixedAffixes: ['plasma_burn', 'energy_blade']
    },
    // ========== BOWS ==========
    {
        id: 'bow_wooden',
        name: 'Wooden Bow',
        baseType: 'gunBowT0PrimitiveBow',
        weaponClass: 'bow',
        description: 'Simple wooden bow',
        tier: 0,
        statModifiers: {
            damage: 20,
            fireRate: 0.8
        }
    },
    {
        id: 'bow_compound',
        name: 'Compound Bow',
        baseType: 'gunBowT3CompoundBow',
        weaponClass: 'bow',
        description: 'Modern compound bow',
        tier: 3,
        statModifiers: {
            damage: 45,
            fireRate: 1.2,
            accuracy: 0.95
        }
    },
    {
        id: 'bow_explosive',
        name: 'Explosive Bow',
        baseType: 'gunBowT4ExplosiveBow',
        weaponClass: 'bow',
        description: 'Fires explosive arrows',
        tier: 4,
        statModifiers: {
            damage: 60
        },
        fixedAffixes: ['explosive_arrows']
    },
    // ========== CROSSBOWS ==========
    {
        id: 'crossbow_iron',
        name: 'Iron Crossbow',
        baseType: 'gunBowT1IronCrossbow',
        weaponClass: 'crossbow',
        description: 'Basic crossbow',
        tier: 1
    },
    {
        id: 'crossbow_compound',
        name: 'Compound Crossbow',
        baseType: 'gunBowT2CompoundCrossbow',
        weaponClass: 'crossbow',
        description: 'Advanced crossbow',
        tier: 2,
        statModifiers: {
            damage: 75,
            accuracy: 0.98,
            penetration: 4
        }
    },
    {
        id: 'crossbow_repeating',
        name: 'Repeating Crossbow',
        baseType: 'gunBowT3RepeatingCrossbow',
        weaponClass: 'crossbow',
        description: 'Magazine-fed crossbow',
        tier: 3,
        statModifiers: {
            damage: 65,
            fireRate: 2.0,
            magazineSize: 5
        }
    },
    // ========== SPECIAL WEAPONS ==========
    {
        id: 'special_flamethrower',
        name: 'Flamethrower',
        baseType: 'gunSpecialT3Flamethrower',
        weaponClass: 'special',
        description: 'Incendiary weapon',
        tier: 3,
        statModifiers: {
            damage: 25,
            fireRate: 20,
            range: 15,
            magazineSize: 100
        },
        fixedAffixes: ['burning'],
        specialProperties: {
            overheat: true
        }
    },
    {
        id: 'special_tesla',
        name: 'Tesla Gun',
        baseType: 'gunSpecialT4TeslaGun',
        weaponClass: 'special',
        description: 'Chain lightning weapon',
        tier: 4,
        statModifiers: {
            damage: 40,
            fireRate: 5,
            range: 30
        },
        fixedAffixes: ['chain_lightning'],
        specialProperties: {
            chargeTime: 0.5
        }
    },
    {
        id: 'special_gravity',
        name: 'Gravity Gun',
        baseType: 'gunSpecialT5GravityGun',
        weaponClass: 'special',
        description: 'Manipulates gravity fields',
        tier: 5,
        statModifiers: {
            damage: 100,
            fireRate: 1,
            range: 50
        },
        fixedAffixes: ['gravity_well'],
        specialProperties: {
            unique: true,
            chargeTime: 1.5
        }
    },
    {
        id: 'special_railgun',
        name: 'Railgun',
        baseType: 'gunSpecialT5Railgun',
        weaponClass: 'special',
        description: 'Electromagnetic accelerator',
        tier: 5,
        statModifiers: {
            damage: 300,
            fireRate: 0.2,
            penetration: 20,
            accuracy: 1.0
        },
        specialProperties: {
            chargeTime: 2.0,
            scoped: true
        }
    },
    {
        id: 'special_bfg',
        name: 'BFG-9000',
        baseType: 'gunSpecialT6BFG',
        weaponClass: 'special',
        description: 'The ultimate weapon',
        tier: 6,
        statModifiers: {
            damage: 500,
            fireRate: 0.1,
            magazineSize: 3,
            reloadSpeed: 8
        },
        fixedAffixes: ['plasma_explosion', 'chain_reaction'],
        specialProperties: {
            unique: true,
            chargeTime: 3.0
        }
    }
];
// Get weapon template by ID
function getWeaponTemplate(id) {
    return exports.weaponTemplates.find(t => t.id === id);
}
// Get templates by class
function getTemplatesByClass(weaponClass) {
    return exports.weaponTemplates.filter(t => t.weaponClass === weaponClass);
}
// Get templates by tier
function getTemplatesByTier(tier) {
    return exports.weaponTemplates.filter(t => t.tier === tier);
}
// Calculate template stats by merging base class stats with modifiers
function calculateTemplateStats(template, baseStats) {
    if (!template.statModifiers) {
        return { ...baseStats };
    }
    return {
        ...baseStats,
        ...template.statModifiers
    };
}
// Get random template for tier and class
function getRandomTemplate(tier, weaponClass) {
    let templates = exports.weaponTemplates;
    if (tier !== undefined) {
        templates = templates.filter(t => t.tier === tier);
    }
    if (weaponClass) {
        templates = templates.filter(t => t.weaponClass === weaponClass);
    }
    if (templates.length === 0)
        return undefined;
    return templates[Math.floor(Math.random() * templates.length)];
}
//# sourceMappingURL=weapon-templates.js.map