"use strict";
/**
 * Comprehensive Weapon Parts Database
 *
 * Parts System:
 * - Each weapon can have multiple part slots
 * - Parts are tiered: basic, advanced, master, legendary
 * - Quality requirements gate which parts can be installed
 * - Mastery requirements determine player access
 * - Parts can have special effects and synergies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.allWeaponParts = exports.underbarrelParts = exports.muzzleParts = exports.gripParts = exports.scopeParts = exports.magazineParts = exports.stockParts = exports.triggerParts = exports.barrelParts = void 0;
exports.getPartsBySlotAndTier = getPartsBySlotAndTier;
exports.getCompatibleParts = getCompatibleParts;
// ============================================================================
// BARREL PARTS - Affects damage, range, accuracy, special properties
// ============================================================================
exports.barrelParts = [
    // BASIC TIER
    { slot: 'barrel', name: 'Standard Barrel', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'barrel', name: 'Short Barrel', tier: 'basic', qualityRange: [1, 200], masteryReq: 5,
        statModifiers: { handling: 0.10, range: -0.15, spread: 0.10 },
        specialEffect: undefined, synergies: ['close_combat'] },
    { slot: 'barrel', name: 'Extended Barrel', tier: 'basic', qualityRange: [1, 200], masteryReq: 10,
        statModifiers: { range: 0.15, accuracy: 0.05, handling: -0.05 },
        specialEffect: undefined, synergies: ['marksman'] },
    { slot: 'barrel', name: 'Vented Barrel', tier: 'basic', qualityRange: [1, 250], masteryReq: 15,
        statModifiers: { fireRate: 0.08, recoil: -0.10, noise: 0.15 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'barrel', name: 'Heavy Barrel', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { damage: 0.10, recoil: 0.15, weight: 0.20, accuracy: 0.10 },
        specialEffect: undefined, synergies: ['siege'] },
    { slot: 'barrel', name: 'Match Barrel', tier: 'advanced', qualityRange: [150, 400], masteryReq: 30,
        statModifiers: { accuracy: 0.20, criticalChance: 0.03, range: 0.10 },
        specialEffect: undefined, synergies: ['precision'] },
    { slot: 'barrel', name: 'Fluted Barrel', tier: 'advanced', qualityRange: [200, 400], masteryReq: 35,
        statModifiers: { weight: -0.15, handling: 0.15, fireRate: 0.05 },
        specialEffect: undefined },
    { slot: 'barrel', name: 'Rifled Barrel', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { penetration: 0.25, accuracy: 0.15, fireRate: -0.10 },
        specialEffect: 'ArmorPiercing', synergies: ['penetrator'] },
    // MASTER TIER  
    { slot: 'barrel', name: 'Whisper Barrel', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { damage: -0.10, noise: -0.80, criticalChance: 0.05 },
        specialEffect: 'Silent', synergies: ['stealth', 'assassin'] },
    { slot: 'barrel', name: 'Overcharged Barrel', tier: 'master', qualityRange: [350, 550], masteryReq: 55,
        statModifiers: { damage: 0.25, elementalDamage: 0.20, durability: -0.20 },
        specialEffect: 'Overcharge', synergies: ['elemental'] },
    { slot: 'barrel', name: 'Precision Barrel', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { accuracy: 0.30, criticalChance: 0.08, spread: -0.50 },
        specialEffect: 'PerfectAccuracy', synergies: ['sniper', 'marksman'] },
    { slot: 'barrel', name: 'Burst Barrel', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { burstCount: 3, fireRate: 0.20, recoil: 0.25 },
        specialEffect: 'BurstFire', synergies: ['assault'] },
    // LEGENDARY TIER
    { slot: 'barrel', name: 'Siege Barrel', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { damage: 0.30, blockDamage: 0.50, penetration: 0.40 },
        specialEffect: 'StructureDestroyer', synergies: ['demolition'] },
    { slot: 'barrel', name: 'Infinity Barrel', tier: 'legendary', qualityRange: [500, 600], masteryReq: 80,
        statModifiers: { magazineSize: 1.00, ammoConsumption: -0.50 },
        specialEffect: 'InfiniteAmmo', synergies: ['suppression'] },
    { slot: 'barrel', name: 'Quantum Barrel', tier: 'legendary', qualityRange: [550, 600], masteryReq: 90,
        statModifiers: { damage: 0.40, phaseShift: 0.20 },
        specialEffect: 'QuantumPhase', synergies: ['exotic'] },
    { slot: 'barrel', name: 'Apocalypse Barrel', tier: 'legendary', qualityRange: [550, 600], masteryReq: 100,
        statModifiers: { damage: 0.50, explosionRadius: 0.30, explosionChance: 0.15 },
        specialEffect: 'Doomsday', synergies: ['destruction'] },
];
// ============================================================================
// TRIGGER PARTS - Affects fire rate, critical chance, special firing modes
// ============================================================================
exports.triggerParts = [
    // BASIC TIER
    { slot: 'trigger', name: 'Standard Trigger', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'trigger', name: 'Hair Trigger', tier: 'basic', qualityRange: [1, 200], masteryReq: 10,
        statModifiers: { fireRate: 0.15, accuracy: -0.05 },
        specialEffect: undefined },
    { slot: 'trigger', name: 'Heavy Trigger', tier: 'basic', qualityRange: [1, 250], masteryReq: 15,
        statModifiers: { accuracy: 0.10, fireRate: -0.10, criticalChance: 0.02 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'trigger', name: 'Match Trigger', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { accuracy: 0.10, criticalChance: 0.02, fireRate: 0.05 },
        specialEffect: undefined, synergies: ['precision'] },
    { slot: 'trigger', name: 'Competition Trigger', tier: 'advanced', qualityRange: [200, 400], masteryReq: 35,
        statModifiers: { criticalChance: 0.05, criticalDamage: 0.15 },
        specialEffect: 'PrecisionShot', synergies: ['competition'] },
    { slot: 'trigger', name: 'Rapid Trigger', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { fireRate: 0.25, accuracy: -0.10, recoil: 0.15 },
        specialEffect: undefined, synergies: ['automatic'] },
    // MASTER TIER
    { slot: 'trigger', name: 'Binary Trigger', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { fireRate: 0.30, accuracy: -0.10, shotsPerTrigger: 2 },
        specialEffect: 'DoubleTap', synergies: ['burst'] },
    { slot: 'trigger', name: 'Smart Trigger', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { criticalChance: 0.10, criticalDamage: 0.25, targetTracking: 0.20 },
        specialEffect: 'PerfectTiming', synergies: ['smart_weapon'] },
    { slot: 'trigger', name: 'Quantum Trigger', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { fireRate: 0.20, quantumChance: 0.10 },
        specialEffect: 'QuantumShot', synergies: ['exotic'] },
    // LEGENDARY TIER
    { slot: 'trigger', name: 'Infinite Trigger', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { fireRate: 0.50, neverJam: 1.00 },
        specialEffect: 'NeverStop', synergies: ['endless'] },
    { slot: 'trigger', name: 'Neural Trigger', tier: 'legendary', qualityRange: [550, 600], masteryReq: 85,
        statModifiers: { criticalChance: 0.15, aimAssist: 0.50 },
        specialEffect: 'MindLink', synergies: ['cybernetic'] },
    { slot: 'trigger', name: 'Chaos Trigger', tier: 'legendary', qualityRange: [550, 600], masteryReq: 95,
        statModifiers: { fireRate: 0.40, randomEffect: 1.00 },
        specialEffect: 'ChaosFire', synergies: ['chaos'] },
];
// ============================================================================
// STOCK PARTS - Affects recoil, stability, handling, accuracy
// ============================================================================
exports.stockParts = [
    // BASIC TIER
    { slot: 'stock', name: 'Standard Stock', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'stock', name: 'Ergonomic Stock', tier: 'basic', qualityRange: [1, 200], masteryReq: 10,
        statModifiers: { recoil: -0.10, handling: 0.10, aimSpeed: 0.05 },
        specialEffect: undefined },
    { slot: 'stock', name: 'Padded Stock', tier: 'basic', qualityRange: [1, 250], masteryReq: 15,
        statModifiers: { recoil: -0.15, staminaLoss: -0.10 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'stock', name: 'Heavy Stock', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { recoil: -0.20, weight: 0.15, stability: 0.20 },
        specialEffect: undefined, synergies: ['heavy_weapon'] },
    { slot: 'stock', name: 'Tactical Stock', tier: 'advanced', qualityRange: [200, 400], masteryReq: 35,
        statModifiers: { handling: 0.20, aimSpeed: 0.15, moveSpeed: 0.10 },
        specialEffect: 'TacticalMobility', synergies: ['tactical'] },
    { slot: 'stock', name: 'Adjustable Stock', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { accuracy: 0.15, recoil: -0.15, versatility: 0.20 },
        specialEffect: undefined },
    // MASTER TIER
    { slot: 'stock', name: 'Competition Stock', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { accuracy: 0.15, stability: 0.20, recoil: -0.25 },
        specialEffect: 'SteadyAim', synergies: ['competition', 'precision'] },
    { slot: 'stock', name: 'Hydraulic Stock', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { recoil: -0.40, stability: 0.30 },
        specialEffect: 'RecoilAbsorption', synergies: ['automatic'] },
    { slot: 'stock', name: 'Gyroscopic Stock', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { stability: 0.40, accuracy: 0.20, hipFireAccuracy: 0.30 },
        specialEffect: 'GyroStabilized', synergies: ['mobile'] },
    // LEGENDARY TIER
    { slot: 'stock', name: 'Recoilless Stock', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { recoil: -0.50, accuracy: 0.20, stability: 0.35 },
        specialEffect: 'NoRecoil', synergies: ['perfect_control'] },
    { slot: 'stock', name: 'Exoskeleton Stock', tier: 'legendary', qualityRange: [550, 600], masteryReq: 85,
        statModifiers: { weight: -0.50, handling: 0.40, strength: 0.30 },
        specialEffect: 'PowerAssist', synergies: ['augmented'] },
    { slot: 'stock', name: 'Graviton Stock', tier: 'legendary', qualityRange: [550, 600], masteryReq: 95,
        statModifiers: { recoil: -0.60, stability: 0.50, gravityDefiance: 1.00 },
        specialEffect: 'AntiGravity', synergies: ['exotic'] },
];
// ============================================================================
// MAGAZINE PARTS - Affects capacity, reload speed, ammo efficiency
// ============================================================================
exports.magazineParts = [
    // BASIC TIER
    { slot: 'magazine', name: 'Standard Magazine', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'magazine', name: 'Extended Magazine', tier: 'basic', qualityRange: [1, 200], masteryReq: 10,
        statModifiers: { magazineSize: 0.25, reloadSpeed: 0.10 },
        specialEffect: undefined },
    { slot: 'magazine', name: 'Quick Magazine', tier: 'basic', qualityRange: [1, 250], masteryReq: 15,
        statModifiers: { reloadSpeed: -0.15, magazineSize: -0.10 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'magazine', name: 'Quick-Release Magazine', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { reloadSpeed: -0.20, handling: 0.10 },
        specialEffect: 'QuickSwap' },
    { slot: 'magazine', name: 'High-Capacity Magazine', tier: 'advanced', qualityRange: [200, 400], masteryReq: 35,
        statModifiers: { magazineSize: 0.40, weight: 0.10, reloadSpeed: 0.15 },
        specialEffect: undefined, synergies: ['suppression'] },
    { slot: 'magazine', name: 'Dual Magazine', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { magazineSize: 0.30, alternateReload: 1.00 },
        specialEffect: 'DualMag', synergies: ['tactical'] },
    // MASTER TIER
    { slot: 'magazine', name: 'Drum Magazine', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { magazineSize: 0.50, reloadSpeed: 0.30, weight: 0.20 },
        specialEffect: 'HighCapacity', synergies: ['heavy_weapon'] },
    { slot: 'magazine', name: 'Smart Magazine', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { ammoEfficiency: 0.25, autoSort: 1.00 },
        specialEffect: 'SmartAmmo', synergies: ['smart_weapon'] },
    { slot: 'magazine', name: 'Energy Magazine', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { rechargeRate: 0.30, infiniteReserve: 0.20 },
        specialEffect: 'EnergyCell', synergies: ['energy_weapon'] },
    // LEGENDARY TIER
    { slot: 'magazine', name: 'Belt-Fed System', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { magazineSize: 1.0, fireRate: 0.20, mobility: -0.30 },
        specialEffect: 'Continuous', synergies: ['machine_gun'] },
    { slot: 'magazine', name: 'Bottomless Magazine', tier: 'legendary', qualityRange: [550, 600], masteryReq: 85,
        statModifiers: { magazineSize: 2.0, neverReload: 0.50 },
        specialEffect: 'Bottomless', synergies: ['endless'] },
    { slot: 'magazine', name: 'Quantum Magazine', tier: 'legendary', qualityRange: [550, 600], masteryReq: 95,
        statModifiers: { magazineSize: 0.50, quantumReload: 1.00, phasedAmmo: 1.00 },
        specialEffect: 'QuantumAmmo', synergies: ['exotic'] },
];
// ============================================================================
// SCOPE PARTS - Affects accuracy, range, critical chance, zoom
// ============================================================================
exports.scopeParts = [
    // BASIC TIER
    { slot: 'scope', name: 'Iron Sights', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'scope', name: 'Red Dot Sight', tier: 'basic', qualityRange: [1, 200], masteryReq: 10,
        statModifiers: { accuracy: 0.10, aimSpeed: 0.15 },
        specialEffect: undefined },
    { slot: 'scope', name: '2x Scope', tier: 'basic', qualityRange: [1, 250], masteryReq: 15,
        statModifiers: { range: 0.20, accuracy: 0.15, aimSpeed: -0.10 },
        specialEffect: 'Zoom2x' },
    // ADVANCED TIER
    { slot: 'scope', name: '4x ACOG Scope', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { range: 0.40, accuracy: 0.20, criticalChance: 0.03 },
        specialEffect: 'Zoom4x', synergies: ['marksman'] },
    { slot: 'scope', name: 'Holographic Sight', tier: 'advanced', qualityRange: [200, 400], masteryReq: 35,
        statModifiers: { accuracy: 0.15, aimSpeed: 0.20, targetAcquisition: 0.25 },
        specialEffect: 'HoloSight', synergies: ['tactical'] },
    { slot: 'scope', name: 'Variable Scope', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { range: 0.30, accuracy: 0.25, versatility: 0.30 },
        specialEffect: 'VariableZoom', synergies: ['adaptable'] },
    // MASTER TIER
    { slot: 'scope', name: '8x Sniper Scope', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { range: 0.60, accuracy: 0.30, criticalChance: 0.05, aimSpeed: -0.20 },
        specialEffect: 'Zoom8x', synergies: ['sniper'] },
    { slot: 'scope', name: 'Thermal Scope', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { targetDetection: 1.00, nightVision: 1.00, accuracy: 0.20 },
        specialEffect: 'ThermalVision', synergies: ['hunter'] },
    { slot: 'scope', name: 'Smart Scope', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { criticalChance: 0.08, windCompensation: 1.00, rangeCalculation: 1.00 },
        specialEffect: 'SmartTargeting', synergies: ['smart_weapon'] },
    // LEGENDARY TIER
    { slot: 'scope', name: 'Quantum Scope', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { range: 1.00, accuracy: 0.40, throughWalls: 0.50 },
        specialEffect: 'QuantumSight', synergies: ['exotic'] },
    { slot: 'scope', name: 'Oracle Scope', tier: 'legendary', qualityRange: [550, 600], masteryReq: 85,
        statModifiers: { criticalChance: 0.15, futureVision: 1.00, perfectShot: 0.25 },
        specialEffect: 'Precognition', synergies: ['divine'] },
    { slot: 'scope', name: 'Omniscient Scope', tier: 'legendary', qualityRange: [550, 600], masteryReq: 100,
        statModifiers: { allEnemiesVisible: 1.00, weakPointHighlight: 1.00, criticalChance: 0.20 },
        specialEffect: 'Omniscience', synergies: ['godlike'] },
];
// ============================================================================
// GRIP PARTS - Affects handling, stability, melee damage
// ============================================================================
exports.gripParts = [
    // BASIC TIER
    { slot: 'grip', name: 'Standard Grip', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'grip', name: 'Rubber Grip', tier: 'basic', qualityRange: [1, 200], masteryReq: 5,
        statModifiers: { handling: 0.10, recoil: -0.05 },
        specialEffect: undefined },
    { slot: 'grip', name: 'Ergonomic Grip', tier: 'basic', qualityRange: [1, 250], masteryReq: 10,
        statModifiers: { handling: 0.15, aimSpeed: 0.10, staminaLoss: -0.05 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'grip', name: 'Vertical Foregrip', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { recoil: -0.15, stability: 0.20, hipFireAccuracy: 0.15 },
        specialEffect: undefined, synergies: ['assault'] },
    { slot: 'grip', name: 'Angled Foregrip', tier: 'advanced', qualityRange: [200, 400], masteryReq: 30,
        statModifiers: { aimSpeed: 0.20, handling: 0.20, recoil: -0.10 },
        specialEffect: undefined, synergies: ['tactical'] },
    { slot: 'grip', name: 'Bipod Grip', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { stability: 0.40, accuracy: 0.25, mobility: -0.20 },
        specialEffect: 'DeployableBipod', synergies: ['sniper', 'machine_gun'] },
    // MASTER TIER
    { slot: 'grip', name: 'Tactical Grip', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { handling: 0.30, meleeDamage: 0.20, quickMelee: 1.00 },
        specialEffect: 'CQBGrip', synergies: ['close_combat'] },
    { slot: 'grip', name: 'Stabilizing Grip', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { stability: 0.35, recoil: -0.25, sustainedFireAccuracy: 0.30 },
        specialEffect: 'RockSteady', synergies: ['suppression'] },
    // LEGENDARY TIER
    { slot: 'grip', name: 'Graviton Grip', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { recoil: -0.40, handling: 0.40, weightlessness: 1.00 },
        specialEffect: 'AntiGravGrip', synergies: ['exotic'] },
    { slot: 'grip', name: 'Neural Grip', tier: 'legendary', qualityRange: [550, 600], masteryReq: 85,
        statModifiers: { handling: 0.50, thoughtControl: 1.00, perfectControl: 1.00 },
        specialEffect: 'MindControl', synergies: ['cybernetic'] },
];
// ============================================================================
// MUZZLE PARTS - Affects damage, noise, recoil, special effects
// ============================================================================
exports.muzzleParts = [
    // BASIC TIER
    { slot: 'muzzle', name: 'Standard Muzzle', tier: 'basic', qualityRange: [1, 200], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'muzzle', name: 'Flash Hider', tier: 'basic', qualityRange: [1, 200], masteryReq: 5,
        statModifiers: { muzzleFlash: -0.50, stealth: 0.10 },
        specialEffect: undefined },
    { slot: 'muzzle', name: 'Compensator', tier: 'basic', qualityRange: [1, 250], masteryReq: 10,
        statModifiers: { recoil: -0.15, noise: 0.20 },
        specialEffect: undefined },
    // ADVANCED TIER
    { slot: 'muzzle', name: 'Suppressor', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { noise: -0.60, damage: -0.05, range: 0.10 },
        specialEffect: 'Suppressed', synergies: ['stealth'] },
    { slot: 'muzzle', name: 'Muzzle Brake', tier: 'advanced', qualityRange: [200, 400], masteryReq: 30,
        statModifiers: { recoil: -0.25, stability: 0.15, noise: 0.30 },
        specialEffect: undefined, synergies: ['automatic'] },
    { slot: 'muzzle', name: 'Choke', tier: 'advanced', qualityRange: [200, 450], masteryReq: 35,
        statModifiers: { spread: -0.30, range: 0.15, damage: 0.05 },
        specialEffect: 'TightSpread', synergies: ['shotgun'] },
    // MASTER TIER
    { slot: 'muzzle', name: 'Advanced Suppressor', tier: 'master', qualityRange: [350, 550], masteryReq: 50,
        statModifiers: { noise: -0.80, damage: 0, criticalChance: 0.05 },
        specialEffect: 'Whisper', synergies: ['assassin'] },
    { slot: 'muzzle', name: 'Blast Diffuser', tier: 'master', qualityRange: [400, 550], masteryReq: 60,
        statModifiers: { explosionRadius: 0.30, damage: 0.15, selfDamageReduction: 0.50 },
        specialEffect: 'BlastControl', synergies: ['explosive'] },
    // LEGENDARY TIER
    { slot: 'muzzle', name: 'Void Suppressor', tier: 'legendary', qualityRange: [500, 600], masteryReq: 75,
        statModifiers: { noise: -1.00, phaseShift: 0.20, voidDamage: 0.30 },
        specialEffect: 'VoidSilence', synergies: ['void'] },
    { slot: 'muzzle', name: 'Particle Accelerator', tier: 'legendary', qualityRange: [550, 600], masteryReq: 90,
        statModifiers: { damage: 0.50, penetration: 1.00, particleBeam: 1.00 },
        specialEffect: 'ParticleBeam', synergies: ['energy_weapon'] },
];
// ============================================================================
// UNDERBARREL PARTS - Adds special functionality
// ============================================================================
exports.underbarrelParts = [
    // BASIC TIER
    { slot: 'underbarrel', name: 'None', tier: 'basic', qualityRange: [1, 600], masteryReq: 0,
        statModifiers: {}, specialEffect: undefined },
    { slot: 'underbarrel', name: 'Flashlight', tier: 'basic', qualityRange: [1, 250], masteryReq: 5,
        statModifiers: { visibility: 1.00, stealth: -0.20 },
        specialEffect: 'Illumination' },
    // ADVANCED TIER
    { slot: 'underbarrel', name: 'Laser Sight', tier: 'advanced', qualityRange: [150, 400], masteryReq: 25,
        statModifiers: { hipFireAccuracy: 0.30, accuracy: 0.10 },
        specialEffect: 'LaserTargeting' },
    { slot: 'underbarrel', name: 'Grenade Launcher', tier: 'advanced', qualityRange: [200, 450], masteryReq: 40,
        statModifiers: { weight: 0.30, explosiveOption: 1.00 },
        specialEffect: 'UnderbarrelGL', synergies: ['demolition'] },
    // MASTER TIER
    { slot: 'underbarrel', name: 'Shotgun Attachment', tier: 'master', qualityRange: [350, 550], masteryReq: 55,
        statModifiers: { alternateFireMode: 1.00, closeRangePower: 0.50 },
        specialEffect: 'MasterKey', synergies: ['breach'] },
    { slot: 'underbarrel', name: 'Plasma Cutter', tier: 'master', qualityRange: [400, 550], masteryReq: 65,
        statModifiers: { meleeDamage: 1.00, doorBreach: 1.00 },
        specialEffect: 'PlasmaBlade', synergies: ['utility'] },
    // LEGENDARY TIER
    { slot: 'underbarrel', name: 'Gravity Generator', tier: 'legendary', qualityRange: [500, 600], masteryReq: 80,
        statModifiers: { gravityWell: 1.00, crowdControl: 1.00 },
        specialEffect: 'GravityWell', synergies: ['exotic'] },
    { slot: 'underbarrel', name: 'Temporal Disruptor', tier: 'legendary', qualityRange: [550, 600], masteryReq: 95,
        statModifiers: { timeDistortion: 1.00, slowField: 1.00 },
        specialEffect: 'TimeWarp', synergies: ['chrono'] },
];
// Export all parts categorized by slot
exports.allWeaponParts = {
    barrel: exports.barrelParts,
    trigger: exports.triggerParts,
    stock: exports.stockParts,
    magazine: exports.magazineParts,
    scope: exports.scopeParts,
    grip: exports.gripParts,
    muzzle: exports.muzzleParts,
    underbarrel: exports.underbarrelParts
};
// Export function to get parts by slot and tier
function getPartsBySlotAndTier(slot, tier, minQuality, maxQuality) {
    let parts = exports.allWeaponParts[slot] || [];
    if (tier) {
        parts = parts.filter(p => p.tier === tier);
    }
    if (minQuality !== undefined && maxQuality !== undefined) {
        parts = parts.filter(p => p.qualityRange[0] <= maxQuality && p.qualityRange[1] >= minQuality);
    }
    return parts;
}
// Export function to get compatible parts for quality level
function getCompatibleParts(quality, masteryLevel) {
    const compatible = new Map();
    Object.entries(exports.allWeaponParts).forEach(([slot, parts]) => {
        const validParts = parts.filter(part => part.qualityRange[0] <= quality &&
            part.qualityRange[1] >= quality &&
            part.masteryReq <= masteryLevel);
        compatible.set(slot, validParts);
    });
    return compatible;
}
//# sourceMappingURL=weapon-parts.js.map