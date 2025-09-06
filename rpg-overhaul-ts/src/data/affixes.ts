/**
 * Comprehensive Affix Database for Weapon Generation
 * 
 * Categories:
 * - Prefixes: Modify weapon behavior and primary stats
 * - Suffixes: Add secondary bonuses and special properties
 * - Implicit: Manufacturer-specific bonuses
 * - Unique: Rare special effects
 * - Mastercrafted: Ultimate tier affixes
 */

export interface Affix {
  type: 'prefix' | 'suffix' | 'implicit' | 'unique' | 'mastercrafted';
  name: string;
  stat: string;
  operation: 'base_add' | 'perc_add' | 'perc_subtract' | 'multiply' | 'base_multiply';
  minValue: number;
  maxValue: number;
  tier: number;
  rarityWeight: number;
  levelReq: number;
  masteryReq: number;
  weaponTypes: string[];
  description: string;
  conflictGroup?: string;
}

// ============================================================================
// PREFIX AFFIXES - Primary weapon modifiers
// ============================================================================

export const prefixAffixes: Affix[] = [
  // ===== DAMAGE PREFIXES =====
  { type: 'prefix', name: 'Sharp', stat: 'damage', operation: 'perc_add', minValue: 0.05, maxValue: 0.15, tier: 1, rarityWeight: 120, levelReq: 1, masteryReq: 0, weaponTypes: ['melee'], description: 'Sharpened edge' },
  { type: 'prefix', name: 'Heavy', stat: 'damage', operation: 'perc_add', minValue: 0.10, maxValue: 0.20, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Increased weight and impact' },
  { type: 'prefix', name: 'Brutal', stat: 'damage', operation: 'perc_add', minValue: 0.15, maxValue: 0.35, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Increased damage' },
  { type: 'prefix', name: 'Vicious', stat: 'damage', operation: 'perc_add', minValue: 0.25, maxValue: 0.40, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['all'], description: 'Significantly increased damage' },
  { type: 'prefix', name: 'Devastating', stat: 'damage', operation: 'perc_add', minValue: 0.35, maxValue: 0.55, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['all'], description: 'Greatly increased damage' },
  { type: 'prefix', name: 'Obliterating', stat: 'damage', operation: 'perc_add', minValue: 0.45, maxValue: 0.70, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['all'], description: 'Massively increased damage' },
  { type: 'prefix', name: 'Apocalyptic', stat: 'damage', operation: 'perc_add', minValue: 0.55, maxValue: 0.85, tier: 5, rarityWeight: 10, levelReq: 40, masteryReq: 50, weaponTypes: ['all'], description: 'Catastrophic damage increase' },
  { type: 'prefix', name: 'Godslayer', stat: 'damage', operation: 'perc_add', minValue: 0.75, maxValue: 1.00, tier: 6, rarityWeight: 5, levelReq: 50, masteryReq: 75, weaponTypes: ['all'], description: 'Divine damage potential' },

  // ===== FIRE RATE PREFIXES =====
  { type: 'prefix', name: 'Quick', stat: 'fireRate', operation: 'perc_add', minValue: 0.05, maxValue: 0.15, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['ranged'], description: 'Faster action' },
  { type: 'prefix', name: 'Rapid', stat: 'fireRate', operation: 'perc_add', minValue: 0.10, maxValue: 0.25, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['ranged'], description: 'Increased fire rate' },
  { type: 'prefix', name: 'Swift', stat: 'fireRate', operation: 'perc_add', minValue: 0.20, maxValue: 0.35, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 10, weaponTypes: ['ranged'], description: 'Swift firing mechanism' },
  { type: 'prefix', name: 'Frenzied', stat: 'fireRate', operation: 'perc_add', minValue: 0.25, maxValue: 0.45, tier: 3, rarityWeight: 50, levelReq: 15, masteryReq: 20, weaponTypes: ['automatic', 'smg'], description: 'Greatly increased fire rate' },
  { type: 'prefix', name: 'Berserk', stat: 'fireRate', operation: 'perc_add', minValue: 0.35, maxValue: 0.60, tier: 4, rarityWeight: 25, levelReq: 25, masteryReq: 35, weaponTypes: ['automatic', 'smg'], description: 'Uncontrolled firing speed' },
  { type: 'prefix', name: 'Turbo', stat: 'fireRate', operation: 'perc_add', minValue: 0.50, maxValue: 0.80, tier: 5, rarityWeight: 10, levelReq: 35, masteryReq: 50, weaponTypes: ['automatic'], description: 'Turbocharged mechanism' },

  // ===== ACCURACY PREFIXES =====
  { type: 'prefix', name: 'Steady', stat: 'accuracy', operation: 'perc_add', minValue: 0.05, maxValue: 0.10, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Steadier handling' },
  { type: 'prefix', name: 'Precise', stat: 'accuracy', operation: 'perc_add', minValue: 0.08, maxValue: 0.18, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Improved accuracy' },
  { type: 'prefix', name: 'Accurate', stat: 'accuracy', operation: 'perc_add', minValue: 0.12, maxValue: 0.25, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['all'], description: 'Enhanced precision' },
  { type: 'prefix', name: 'Surgical', stat: 'accuracy', operation: 'perc_add', minValue: 0.18, maxValue: 0.35, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 30, weaponTypes: ['sniper', 'rifle'], description: 'Exceptional accuracy' },
  { type: 'prefix', name: 'Laser-Guided', stat: 'accuracy', operation: 'perc_add', minValue: 0.30, maxValue: 0.50, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 45, weaponTypes: ['sniper', 'rifle'], description: 'Computer-assisted targeting' },
  { type: 'prefix', name: 'Perfect', stat: 'accuracy', operation: 'perc_add', minValue: 0.40, maxValue: 0.65, tier: 5, rarityWeight: 10, levelReq: 40, masteryReq: 60, weaponTypes: ['sniper'], description: 'Flawless precision' },

  // ===== CRITICAL PREFIXES =====
  { type: 'prefix', name: 'Sharp-Eyed', stat: 'criticalChance', operation: 'base_add', minValue: 0.02, maxValue: 0.05, tier: 1, rarityWeight: 90, levelReq: 5, masteryReq: 10, weaponTypes: ['all'], description: 'Better weak point targeting' },
  { type: 'prefix', name: 'Keen', stat: 'criticalChance', operation: 'base_add', minValue: 0.03, maxValue: 0.08, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['all'], description: 'Increased critical chance' },
  { type: 'prefix', name: 'Ruthless', stat: 'criticalChance', operation: 'base_add', minValue: 0.06, maxValue: 0.12, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['all'], description: 'High critical chance' },
  { type: 'prefix', name: 'Lethal', stat: 'criticalDamage', operation: 'perc_add', minValue: 0.20, maxValue: 0.50, tier: 3, rarityWeight: 50, levelReq: 25, masteryReq: 35, weaponTypes: ['all'], description: 'Increased critical damage' },
  { type: 'prefix', name: 'Assassin\'s', stat: 'criticalChance', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['sniper', 'pistol'], description: 'Assassin training' },
  { type: 'prefix', name: 'Executioner\'s', stat: 'criticalDamage', operation: 'perc_add', minValue: 0.40, maxValue: 0.80, tier: 5, rarityWeight: 10, levelReq: 40, masteryReq: 55, weaponTypes: ['all'], description: 'Execution-style criticals' },

  // ===== SPECIALIZED PREFIXES =====
  { type: 'prefix', name: 'Lightweight', stat: 'weight', operation: 'perc_subtract', minValue: 0.15, maxValue: 0.30, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Reduced weight' },
  { type: 'prefix', name: 'Compact', stat: 'weight', operation: 'perc_subtract', minValue: 0.25, maxValue: 0.40, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 10, weaponTypes: ['pistol', 'smg'], description: 'Compact design' },
  { type: 'prefix', name: 'Extended', stat: 'magazineSize', operation: 'perc_add', minValue: 0.20, maxValue: 0.50, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 10, weaponTypes: ['ranged'], description: 'Larger magazine' },
  { type: 'prefix', name: 'High-Capacity', stat: 'magazineSize', operation: 'perc_add', minValue: 0.40, maxValue: 0.80, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['automatic', 'smg'], description: 'Extra large magazine' },
  { type: 'prefix', name: 'Penetrating', stat: 'penetration', operation: 'base_add', minValue: 1, maxValue: 3, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['rifle', 'sniper'], description: 'Armor penetration' },
  { type: 'prefix', name: 'Armor-Piercing', stat: 'penetration', operation: 'base_add', minValue: 2, maxValue: 5, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['rifle', 'sniper', 'automatic'], description: 'Heavy armor penetration' },
  { type: 'prefix', name: 'Stabilized', stat: 'recoil', operation: 'perc_subtract', minValue: 0.20, maxValue: 0.40, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['ranged'], description: 'Reduced recoil' },
  { type: 'prefix', name: 'Compensated', stat: 'recoil', operation: 'perc_subtract', minValue: 0.35, maxValue: 0.60, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 30, weaponTypes: ['automatic', 'smg'], description: 'Recoil compensation' },
  { type: 'prefix', name: 'Silent', stat: 'noise', operation: 'perc_subtract', minValue: 0.50, maxValue: 0.80, tier: 3, rarityWeight: 40, levelReq: 25, masteryReq: 35, weaponTypes: ['all'], description: 'Suppressed noise' },
  { type: 'prefix', name: 'Whisper', stat: 'noise', operation: 'perc_subtract', minValue: 0.70, maxValue: 0.95, tier: 4, rarityWeight: 20, levelReq: 35, masteryReq: 50, weaponTypes: ['all'], description: 'Near-silent operation' },

  // ===== ELEMENTAL PREFIXES =====
  { type: 'prefix', name: 'Burning', stat: 'elementalDamage', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 2, rarityWeight: 60, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], conflictGroup: 'elemental', description: 'Fire damage' },
  { type: 'prefix', name: 'Freezing', stat: 'elementalDamage', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 2, rarityWeight: 60, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], conflictGroup: 'elemental', description: 'Ice damage' },
  { type: 'prefix', name: 'Shocking', stat: 'elementalDamage', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 2, rarityWeight: 60, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], conflictGroup: 'elemental', description: 'Electric damage' },
  { type: 'prefix', name: 'Toxic', stat: 'elementalDamage', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 2, rarityWeight: 60, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], conflictGroup: 'elemental', description: 'Poison damage' },
  { type: 'prefix', name: 'Irradiated', stat: 'elementalDamage', operation: 'base_add', minValue: 0.15, maxValue: 0.30, tier: 3, rarityWeight: 40, levelReq: 25, masteryReq: 35, weaponTypes: ['all'], conflictGroup: 'elemental', description: 'Radiation damage' },
  { type: 'prefix', name: 'Explosive', stat: 'explosionRadius', operation: 'base_add', minValue: 1, maxValue: 3, tier: 3, rarityWeight: 30, levelReq: 30, masteryReq: 40, weaponTypes: ['launcher', 'shotgun'], description: 'Explosive rounds' },
];

// ============================================================================
// SUFFIX AFFIXES - Secondary bonuses
// ============================================================================

export const suffixAffixes: Affix[] = [
  // ===== POWER SUFFIXES =====
  { type: 'suffix', name: 'of Might', stat: 'damage', operation: 'base_add', minValue: 3, maxValue: 10, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Minor damage bonus' },
  { type: 'suffix', name: 'of Power', stat: 'damage', operation: 'base_add', minValue: 5, maxValue: 20, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Flat damage bonus' },
  { type: 'suffix', name: 'of Force', stat: 'damage', operation: 'base_add', minValue: 15, maxValue: 35, tier: 2, rarityWeight: 75, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], description: 'Significant damage bonus' },
  { type: 'suffix', name: 'of Destruction', stat: 'damage', operation: 'base_add', minValue: 20, maxValue: 50, tier: 3, rarityWeight: 50, levelReq: 25, masteryReq: 30, weaponTypes: ['all'], description: 'Major damage bonus' },
  { type: 'suffix', name: 'of Annihilation', stat: 'damage', operation: 'base_add', minValue: 40, maxValue: 80, tier: 4, rarityWeight: 25, levelReq: 35, masteryReq: 45, weaponTypes: ['all'], description: 'Massive damage bonus' },
  { type: 'suffix', name: 'of the Apocalypse', stat: 'damage', operation: 'base_add', minValue: 60, maxValue: 120, tier: 5, rarityWeight: 10, levelReq: 45, masteryReq: 60, weaponTypes: ['all'], description: 'World-ending power' },

  // ===== SPEED SUFFIXES =====
  { type: 'suffix', name: 'of Haste', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.05, maxValue: 0.15, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['ranged'], description: 'Slightly faster reload' },
  { type: 'suffix', name: 'of Swiftness', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.10, maxValue: 0.25, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['ranged'], description: 'Faster reload' },
  { type: 'suffix', name: 'of Speed', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.20, maxValue: 0.35, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['ranged'], description: 'Quick reload' },
  { type: 'suffix', name: 'of Lightning', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.25, maxValue: 0.45, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['ranged'], description: 'Lightning fast reload' },
  { type: 'suffix', name: 'of Instant Action', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.40, maxValue: 0.60, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['ranged'], description: 'Near-instant reload' },

  // ===== PRECISION SUFFIXES =====
  { type: 'suffix', name: 'of Accuracy', stat: 'spread', operation: 'perc_subtract', minValue: 0.10, maxValue: 0.20, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['ranged'], description: 'Reduced spread' },
  { type: 'suffix', name: 'of the Marksman', stat: 'spread', operation: 'perc_subtract', minValue: 0.15, maxValue: 0.30, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 15, weaponTypes: ['ranged'], description: 'Tighter spread' },
  { type: 'suffix', name: 'of the Sharpshooter', stat: 'spread', operation: 'perc_subtract', minValue: 0.25, maxValue: 0.45, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['rifle', 'pistol'], description: 'Precision shooting' },
  { type: 'suffix', name: 'of the Sniper', stat: 'range', operation: 'perc_add', minValue: 0.20, maxValue: 0.40, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 30, weaponTypes: ['sniper', 'rifle'], description: 'Extended range' },
  { type: 'suffix', name: 'of the Eagle Eye', stat: 'range', operation: 'perc_add', minValue: 0.35, maxValue: 0.60, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 45, weaponTypes: ['sniper'], description: 'Extreme range' },

  // ===== DURABILITY SUFFIXES =====
  { type: 'suffix', name: 'of Quality', stat: 'durability', operation: 'perc_add', minValue: 0.10, maxValue: 0.20, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Better construction' },
  { type: 'suffix', name: 'of Endurance', stat: 'durability', operation: 'perc_add', minValue: 0.20, maxValue: 0.40, tier: 1, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Increased durability' },
  { type: 'suffix', name: 'of Resilience', stat: 'durability', operation: 'perc_add', minValue: 0.30, maxValue: 0.55, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 10, weaponTypes: ['all'], description: 'High durability' },
  { type: 'suffix', name: 'of the Eternal', stat: 'durability', operation: 'perc_add', minValue: 0.40, maxValue: 0.80, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['all'], description: 'Vastly increased durability' },
  { type: 'suffix', name: 'of Indestructibility', stat: 'durability', operation: 'perc_add', minValue: 0.60, maxValue: 1.00, tier: 5, rarityWeight: 10, levelReq: 40, masteryReq: 60, weaponTypes: ['all'], description: 'Nearly unbreakable' },

  // ===== SPECIAL SUFFIXES =====
  { type: 'suffix', name: 'of Bloodletting', stat: 'dismemberChance', operation: 'base_add', minValue: 0.05, maxValue: 0.15, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['melee', 'shotgun'], description: 'Dismember chance' },
  { type: 'suffix', name: 'of Gore', stat: 'dismemberChance', operation: 'base_add', minValue: 0.10, maxValue: 0.25, tier: 4, rarityWeight: 25, levelReq: 30, masteryReq: 40, weaponTypes: ['melee', 'shotgun', 'sniper'], description: 'High dismember chance' },
  { type: 'suffix', name: 'of Efficiency', stat: 'staminaLoss', operation: 'perc_subtract', minValue: 0.15, maxValue: 0.35, tier: 2, rarityWeight: 75, levelReq: 10, masteryReq: 10, weaponTypes: ['melee'], description: 'Reduced stamina cost' },
  { type: 'suffix', name: 'of Conservation', stat: 'staminaLoss', operation: 'perc_subtract', minValue: 0.30, maxValue: 0.50, tier: 3, rarityWeight: 50, levelReq: 20, masteryReq: 25, weaponTypes: ['melee'], description: 'Minimal stamina use' },
  { type: 'suffix', name: 'of the Survivor', stat: 'blockDamage', operation: 'perc_add', minValue: 0.20, maxValue: 0.40, tier: 2, rarityWeight: 75, levelReq: 15, masteryReq: 20, weaponTypes: ['all'], description: 'Better structure damage' },
  { type: 'suffix', name: 'of Breaching', stat: 'blockDamage', operation: 'perc_add', minValue: 0.35, maxValue: 0.70, tier: 3, rarityWeight: 50, levelReq: 25, masteryReq: 35, weaponTypes: ['shotgun', 'launcher'], description: 'Door breaching power' },
  { type: 'suffix', name: 'of Siege', stat: 'blockDamage', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 4, rarityWeight: 25, levelReq: 35, masteryReq: 50, weaponTypes: ['launcher', 'automatic'], description: 'Siege warfare' },

  // ===== MASTERY SUFFIXES =====
  { type: 'suffix', name: 'of the Novice', stat: 'masteryGainRate', operation: 'perc_add', minValue: 0.10, maxValue: 0.20, tier: 1, rarityWeight: 80, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Learn faster' },
  { type: 'suffix', name: 'of the Student', stat: 'masteryGainRate', operation: 'perc_add', minValue: 0.20, maxValue: 0.35, tier: 2, rarityWeight: 60, levelReq: 10, masteryReq: 10, weaponTypes: ['all'], description: 'Quick learning' },
  { type: 'suffix', name: 'of the Expert', stat: 'masteryGainRate', operation: 'perc_add', minValue: 0.30, maxValue: 0.50, tier: 3, rarityWeight: 40, levelReq: 20, masteryReq: 30, weaponTypes: ['all'], description: 'Expert training' },
  { type: 'suffix', name: 'of the Master', stat: 'masteryGainRate', operation: 'perc_add', minValue: 0.40, maxValue: 0.70, tier: 4, rarityWeight: 20, levelReq: 30, masteryReq: 50, weaponTypes: ['all'], description: 'Master\'s wisdom' },
  { type: 'suffix', name: 'of the Legend', stat: 'masteryGainRate', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 5, rarityWeight: 10, levelReq: 40, masteryReq: 75, weaponTypes: ['all'], description: 'Legendary expertise' },
];

// ============================================================================
// IMPLICIT AFFIXES - Manufacturer-specific bonuses (always present)
// ============================================================================

export const implicitAffixes: Affix[] = [
  // ===== MILSPEC IMPLICITS =====
  { type: 'implicit', name: 'Military Grade', stat: 'durability', operation: 'perc_add', minValue: 0.15, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'MilSpec reliability' },
  { type: 'implicit', name: 'Field Tested', stat: 'damage', operation: 'perc_add', minValue: 0.10, maxValue: 0.10, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'MilSpec damage' },
  { type: 'implicit', name: 'Battle Proven', stat: 'accuracy', operation: 'perc_add', minValue: 0.05, maxValue: 0.05, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'MilSpec accuracy' },

  // ===== TACTICOOL IMPLICITS =====
  { type: 'implicit', name: 'Tactical Design', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.20, maxValue: 0.20, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'TactiCool reload' },
  { type: 'implicit', name: 'Operator Enhanced', stat: 'aimSpeed', operation: 'perc_add', minValue: 0.15, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'TactiCool handling' },
  { type: 'implicit', name: 'Combat Ready', stat: 'magazineSize', operation: 'perc_add', minValue: 0.10, maxValue: 0.10, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'TactiCool capacity' },

  // ===== BANDIT IMPLICITS =====
  { type: 'implicit', name: 'Jury-Rigged', stat: 'damage', operation: 'perc_add', minValue: 0.25, maxValue: 0.25, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Bandit damage boost' },
  { type: 'implicit', name: 'Unstable', stat: 'accuracy', operation: 'perc_subtract', minValue: 0.10, maxValue: 0.10, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Bandit instability' },
  { type: 'implicit', name: 'Explosive Tendency', stat: 'explosionChance', operation: 'base_add', minValue: 0.02, maxValue: 0.02, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Bandit volatility' },

  // ===== JAKOBS IMPLICITS =====
  { type: 'implicit', name: 'Precision Crafted', stat: 'criticalChance', operation: 'base_add', minValue: 0.03, maxValue: 0.08, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['pistol', 'rifle', 'sniper'], description: 'Jakobs accuracy' },
  { type: 'implicit', name: 'One Shot Power', stat: 'criticalDamage', operation: 'perc_add', minValue: 0.15, maxValue: 0.25, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['pistol', 'rifle', 'shotgun'], description: 'Jakobs damage' },
  { type: 'implicit', name: 'Classic Design', stat: 'damage', operation: 'perc_add', minValue: 0.20, maxValue: 0.20, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Jakobs power' },

  // ===== HYPERION IMPLICITS =====
  { type: 'implicit', name: 'Stabilized', stat: 'accuracy', operation: 'perc_add', minValue: 0.30, maxValue: 0.30, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Hyperion accuracy' },
  { type: 'implicit', name: 'Smart Targeting', stat: 'criticalChance', operation: 'base_add', minValue: 0.05, maxValue: 0.05, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Hyperion tech' },
  { type: 'implicit', name: 'Recoil Dampening', stat: 'recoil', operation: 'perc_subtract', minValue: 0.25, maxValue: 0.25, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Hyperion stability' },

  // ===== VLADOF IMPLICITS =====
  { type: 'implicit', name: 'Revolution', stat: 'fireRate', operation: 'perc_add', minValue: 0.35, maxValue: 0.35, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['automatic', 'smg', 'rifle'], description: 'Vladof fire rate' },
  { type: 'implicit', name: 'High Capacity', stat: 'magazineSize', operation: 'perc_add', minValue: 0.25, maxValue: 0.25, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['automatic', 'smg', 'rifle'], description: 'Vladof magazines' },
  { type: 'implicit', name: 'Spray and Pray', stat: 'accuracy', operation: 'perc_subtract', minValue: 0.15, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Vladof spread' },

  // ===== MALIWAN IMPLICITS =====
  { type: 'implicit', name: 'Elemental Core', stat: 'elementalDamage', operation: 'base_add', minValue: 0.08, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Maliwan elements' },
  { type: 'implicit', name: 'Energy Efficient', stat: 'ammoConsumption', operation: 'perc_subtract', minValue: 0.10, maxValue: 0.18, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['energy', 'rifle', 'smg'], description: 'Maliwan efficiency' },
  { type: 'implicit', name: 'Tech Enhanced', stat: 'elementalChance', operation: 'base_add', minValue: 0.25, maxValue: 0.25, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Maliwan technology' },

  // ===== DAHL IMPLICITS =====
  { type: 'implicit', name: 'Military Precision', stat: 'spread', operation: 'perc_subtract', minValue: 0.08, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['rifle', 'automatic', 'smg'], description: 'Dahl precision' },
  { type: 'implicit', name: 'Burst Fire', stat: 'burstFireBonus', operation: 'base_add', minValue: 0.30, maxValue: 0.30, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['rifle', 'automatic'], description: 'Dahl burst mode' },
  { type: 'implicit', name: 'Combat Durability', stat: 'durability', operation: 'perc_add', minValue: 0.10, maxValue: 0.18, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['rifle', 'automatic'], description: 'Dahl reliability' },

  // ===== TEDIORE IMPLICITS =====
  { type: 'implicit', name: 'Disposable', stat: 'reloadSpeed', operation: 'perc_subtract', minValue: 0.40, maxValue: 0.40, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Tediore reload' },
  { type: 'implicit', name: 'Budget Build', stat: 'durability', operation: 'perc_subtract', minValue: 0.15, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Tediore quality' },
  { type: 'implicit', name: 'Lightweight Frame', stat: 'weight', operation: 'perc_subtract', minValue: 0.08, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Tediore design' },

  // ===== HANDMADE IMPLICITS =====
  { type: 'implicit', name: 'Handcrafted', stat: 'repairability', operation: 'perc_add', minValue: 0.20, maxValue: 0.20, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Easy to repair' },
  { type: 'implicit', name: 'Custom Built', stat: 'modSlotBonus', operation: 'base_add', minValue: 1, maxValue: 1, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Extra mod slot' },
  { type: 'implicit', name: 'Improvised', stat: 'durability', operation: 'perc_subtract', minValue: 0.10, maxValue: 0.10, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Lower durability' },

  // ===== PEARLESCENT IMPLICITS =====
  { type: 'implicit', name: 'Legendary Quality', stat: 'allStats', operation: 'perc_add', minValue: 0.15, maxValue: 0.15, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'All stats bonus' },
  { type: 'implicit', name: 'Divine Blessing', stat: 'damage', operation: 'perc_add', minValue: 0.30, maxValue: 0.30, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Pearlescent power' },
  { type: 'implicit', name: 'Perfect Creation', stat: 'criticalChance', operation: 'base_add', minValue: 0.20, maxValue: 0.20, tier: 0, rarityWeight: 100, levelReq: 1, masteryReq: 0, weaponTypes: ['all'], description: 'Pearlescent precision' },
];

// ============================================================================
// UNIQUE AFFIXES - Special legendary effects
// ============================================================================

export const uniqueAffixes: Affix[] = [
  // ===== LIFE STEAL / HEALTH =====
  { type: 'unique', name: 'Bloodthirsty', stat: 'lifeSteal', operation: 'base_add', minValue: 0.02, maxValue: 0.05, tier: 4, rarityWeight: 10, levelReq: 35, masteryReq: 45, weaponTypes: ['all'], description: 'Steal life on hit' },
  { type: 'unique', name: 'Vampiric', stat: 'healthOnKill', operation: 'base_add', minValue: 10, maxValue: 30, tier: 4, rarityWeight: 10, levelReq: 35, masteryReq: 45, weaponTypes: ['all'], description: 'Health on kill' },
  { type: 'unique', name: 'Soul Drinker', stat: 'lifeSteal', operation: 'base_add', minValue: 0.05, maxValue: 0.10, tier: 5, rarityWeight: 5, levelReq: 45, masteryReq: 60, weaponTypes: ['melee'], description: 'Powerful life steal' },
  { type: 'unique', name: 'Regenerative', stat: 'healthRegen', operation: 'base_add', minValue: 2, maxValue: 5, tier: 4, rarityWeight: 10, levelReq: 30, masteryReq: 40, weaponTypes: ['all'], description: 'Health regeneration while holding' },

  // ===== CONDITIONAL DAMAGE =====
  { type: 'unique', name: 'Berserker', stat: 'damageAtLowHealth', operation: 'perc_add', minValue: 0.30, maxValue: 0.60, tier: 5, rarityWeight: 5, levelReq: 40, masteryReq: 50, weaponTypes: ['all'], description: 'Damage when injured' },
  { type: 'unique', name: 'Rampage', stat: 'damagePerKill', operation: 'base_add', minValue: 0.05, maxValue: 0.10, tier: 4, rarityWeight: 8, levelReq: 35, masteryReq: 45, weaponTypes: ['all'], description: 'Stacking damage on kills' },
  { type: 'unique', name: 'Momentum', stat: 'damageWhileMoving', operation: 'perc_add', minValue: 0.20, maxValue: 0.40, tier: 4, rarityWeight: 10, levelReq: 30, masteryReq: 35, weaponTypes: ['smg', 'shotgun'], description: 'Damage while moving' },
  { type: 'unique', name: 'Ambush', stat: 'damageFromStealth', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 5, rarityWeight: 5, levelReq: 40, masteryReq: 55, weaponTypes: ['sniper', 'pistol'], description: 'Stealth damage bonus' },

  // ===== ELEMENTAL UNIQUES =====
  { type: 'unique', name: 'Chain Lightning', stat: 'chainLightning', operation: 'base_add', minValue: 2, maxValue: 5, tier: 5, rarityWeight: 5, levelReq: 45, masteryReq: 60, weaponTypes: ['electric'], description: 'Lightning chains to enemies' },
  { type: 'unique', name: 'Inferno', stat: 'burnDamage', operation: 'perc_add', minValue: 0.30, maxValue: 0.60, tier: 4, rarityWeight: 8, levelReq: 35, masteryReq: 45, weaponTypes: ['fire'], description: 'Enhanced burn damage' },
  { type: 'unique', name: 'Deep Freeze', stat: 'freezeDuration', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 4, rarityWeight: 8, levelReq: 35, masteryReq: 45, weaponTypes: ['ice'], description: 'Longer freeze duration' },
  { type: 'unique', name: 'Corrosive', stat: 'armorMelt', operation: 'base_add', minValue: 0.20, maxValue: 0.40, tier: 4, rarityWeight: 10, levelReq: 30, masteryReq: 40, weaponTypes: ['poison'], description: 'Melts armor' },

  // ===== EXPLOSION UNIQUES =====
  { type: 'unique', name: 'Explosive', stat: 'explosionChance', operation: 'base_add', minValue: 0.05, maxValue: 0.15, tier: 4, rarityWeight: 10, levelReq: 30, masteryReq: 40, weaponTypes: ['all'], description: 'Chance for explosions' },
  { type: 'unique', name: 'Bombastic', stat: 'explosionRadius', operation: 'perc_add', minValue: 0.30, maxValue: 0.60, tier: 5, rarityWeight: 5, levelReq: 40, masteryReq: 55, weaponTypes: ['launcher', 'shotgun'], description: 'Larger explosions' },
  { type: 'unique', name: 'Nuclear', stat: 'explosionDamage', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 6, rarityWeight: 2, levelReq: 50, masteryReq: 75, weaponTypes: ['launcher'], description: 'Nuclear devastation' },

  // ===== SPECIAL MECHANICS =====
  { type: 'unique', name: 'Ricochet', stat: 'ricochetChance', operation: 'base_add', minValue: 0.20, maxValue: 0.40, tier: 4, rarityWeight: 10, levelReq: 30, masteryReq: 35, weaponTypes: ['pistol', 'rifle'], description: 'Bullets ricochet' },
  { type: 'unique', name: 'Penetrator', stat: 'penetrateChance', operation: 'base_add', minValue: 0.30, maxValue: 0.60, tier: 4, rarityWeight: 10, levelReq: 35, masteryReq: 45, weaponTypes: ['sniper', 'rifle'], description: 'Shots penetrate enemies' },
  { type: 'unique', name: 'Seeker', stat: 'homingChance', operation: 'base_add', minValue: 0.10, maxValue: 0.25, tier: 5, rarityWeight: 5, levelReq: 45, masteryReq: 60, weaponTypes: ['launcher', 'smg'], description: 'Homing projectiles' },
  { type: 'unique', name: 'Phase Shift', stat: 'phaseShift', operation: 'base_add', minValue: 0.05, maxValue: 0.15, tier: 6, rarityWeight: 2, levelReq: 50, masteryReq: 75, weaponTypes: ['all'], description: 'Shots phase through walls' },

  // ===== LEGENDARY TIER =====
  { type: 'unique', name: 'Infinity', stat: 'infiniteAmmo', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 80, weaponTypes: ['automatic'], description: 'Chance for no ammo consumption' },
  { type: 'unique', name: 'Doom Bringer', stat: 'instantDeath', operation: 'base_add', minValue: 0.01, maxValue: 0.03, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 90, weaponTypes: ['sniper'], description: 'Instant kill chance' },
  { type: 'unique', name: 'Time Warp', stat: 'timeWarp', operation: 'base_add', minValue: 0.05, maxValue: 0.10, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 85, weaponTypes: ['all'], description: 'Slows time on critical' },
];

// ============================================================================
// MASTERCRAFTED AFFIXES - Ultimate endgame affixes
// ============================================================================

export const mastercraftedAffixes: Affix[] = [
  { type: 'mastercrafted', name: 'God Roll', stat: 'allStats', operation: 'perc_add', minValue: 0.25, maxValue: 0.50, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 100, weaponTypes: ['all'], description: 'Perfect in every way' },
  { type: 'mastercrafted', name: 'Reality Breaker', stat: 'realityBreak', operation: 'base_add', minValue: 0.05, maxValue: 0.10, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 100, weaponTypes: ['all'], description: 'Breaks the laws of physics' },
  { type: 'mastercrafted', name: 'Quantum Entangled', stat: 'quantumDamage', operation: 'perc_add', minValue: 0.50, maxValue: 1.00, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 100, weaponTypes: ['all'], description: 'Damage exists in multiple states' },
  { type: 'mastercrafted', name: 'Singularity', stat: 'singularity', operation: 'base_add', minValue: 0.10, maxValue: 0.20, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 100, weaponTypes: ['launcher'], description: 'Creates black holes' },
  { type: 'mastercrafted', name: 'Divine Intervention', stat: 'divineIntervention', operation: 'base_add', minValue: 0.05, maxValue: 0.10, tier: 6, rarityWeight: 1, levelReq: 50, masteryReq: 100, weaponTypes: ['all'], description: 'Death saves you instead' },
];

// Export all affixes as a combined database
export const allAffixes = {
  prefix: prefixAffixes,
  suffix: suffixAffixes,
  implicit: implicitAffixes,
  unique: uniqueAffixes,
  mastercrafted: mastercraftedAffixes
};

// Export convenience function to get affixes by type
export function getAffixesByType(type: Affix['type']): Affix[] {
  return allAffixes[type] || [];
}

// Export function to get compatible affixes for a weapon type
export function getCompatibleAffixes(weaponType: string, affixType: Affix['type']): Affix[] {
  return getAffixesByType(affixType).filter(affix => 
    affix.weaponTypes.includes('all') || affix.weaponTypes.includes(weaponType)
  );
}