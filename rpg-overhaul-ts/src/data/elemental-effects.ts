/**
 * Elemental Types and Effects Database
 * 
 * Defines all elemental damage types, their effects, and interactions
 */

export enum ElementalType {
  None = 'none',
  Fire = 'fire',
  Ice = 'ice',
  Electric = 'electric',
  Poison = 'poison',
  Radiation = 'radiation',
  Explosive = 'explosive',
  Bleeding = 'bleeding',
  Void = 'void',
  Holy = 'holy',
  Chaos = 'chaos',
  Plasma = 'plasma',
  Corrosive = 'corrosive',
  Sonic = 'sonic',
  Psychic = 'psychic',
  Quantum = 'quantum'
}

export interface ElementalEffect {
  type: ElementalType;
  name: string;
  description: string;
  color: string;
  damageType: string;
  effectName: string;
  
  // Damage properties
  damageMultiplier: number;  // How much of weapon damage becomes elemental
  dotDamage?: number;        // Damage over time per second
  dotDuration?: number;      // Duration of DoT effect
  
  // Special properties
  spreadChance?: number;     // Chance to spread to nearby enemies
  stackable?: boolean;       // Can stack multiple instances
  maxStacks?: number;        // Maximum stack count
  
  // Status effects
  statusEffects?: {
    slow?: number;           // Movement speed reduction
    blind?: number;          // Accuracy reduction
    weaken?: number;         // Damage reduction
    stun?: number;           // Stun duration
    fear?: number;           // Fear duration
    confuse?: number;        // Confusion duration
  };
  
  // Interactions
  combinesWith?: ElementalType[];  // Creates combo effects
  neutralizes?: ElementalType[];   // Cancels out other elements
  strongAgainst?: string[];        // Enemy types vulnerable
  weakAgainst?: string[];          // Enemy types resistant
}

export const elementalEffects: Record<ElementalType, ElementalEffect> = {
  [ElementalType.None]: {
    type: ElementalType.None,
    name: 'Physical',
    description: 'Pure physical damage',
    color: '#CCCCCC',
    damageType: 'physical',
    effectName: 'none',
    damageMultiplier: 0
  },

  [ElementalType.Fire]: {
    type: ElementalType.Fire,
    name: 'Fire',
    description: 'Burns enemies over time',
    color: '#FF4500',
    damageType: 'heat',
    effectName: 'burning',
    damageMultiplier: 0.3,
    dotDamage: 10,
    dotDuration: 5,
    spreadChance: 0.15,
    stackable: true,
    maxStacks: 3,
    statusEffects: {
      fear: 0.1
    },
    combinesWith: [ElementalType.Explosive],
    neutralizes: [ElementalType.Ice],
    strongAgainst: ['organic', 'plant', 'cloth'],
    weakAgainst: ['fire_elemental', 'metal', 'stone']
  },

  [ElementalType.Ice]: {
    type: ElementalType.Ice,
    name: 'Ice',
    description: 'Freezes and slows enemies',
    color: '#00CED1',
    damageType: 'cold',
    effectName: 'freeze',
    damageMultiplier: 0.25,
    dotDamage: 5,
    dotDuration: 3,
    stackable: true,
    maxStacks: 5,
    statusEffects: {
      slow: 0.3,
      stun: 0.5
    },
    combinesWith: [ElementalType.Electric],
    neutralizes: [ElementalType.Fire],
    strongAgainst: ['fire_elemental', 'desert', 'hot'],
    weakAgainst: ['ice_elemental', 'arctic', 'mechanical']
  },

  [ElementalType.Electric]: {
    type: ElementalType.Electric,
    name: 'Electric',
    description: 'Shocks and chains between enemies',
    color: '#FFD700',
    damageType: 'electric',
    effectName: 'shock',
    damageMultiplier: 0.35,
    dotDamage: 8,
    dotDuration: 2,
    spreadChance: 0.25,
    stackable: false,
    statusEffects: {
      stun: 0.25,
      confuse: 0.15
    },
    combinesWith: [ElementalType.Ice, ElementalType.Plasma],
    strongAgainst: ['mechanical', 'robotic', 'wet'],
    weakAgainst: ['insulated', 'grounded', 'rubber']
  },

  [ElementalType.Poison]: {
    type: ElementalType.Poison,
    name: 'Poison',
    description: 'Poisons enemies, dealing damage over time',
    color: '#32CD32',
    damageType: 'poison',
    effectName: 'poisoned',
    damageMultiplier: 0.2,
    dotDamage: 15,
    dotDuration: 10,
    stackable: true,
    maxStacks: 10,
    statusEffects: {
      weaken: 0.2,
      slow: 0.1
    },
    combinesWith: [ElementalType.Corrosive],
    strongAgainst: ['organic', 'living', 'human'],
    weakAgainst: ['undead', 'mechanical', 'elemental']
  },

  [ElementalType.Radiation]: {
    type: ElementalType.Radiation,
    name: 'Radiation',
    description: 'Irradiates enemies, causing mutations',
    color: '#7FFF00',
    damageType: 'radiation',
    effectName: 'radiated',
    damageMultiplier: 0.4,
    dotDamage: 12,
    dotDuration: 8,
    spreadChance: 0.1,
    stackable: true,
    maxStacks: 5,
    statusEffects: {
      weaken: 0.3,
      confuse: 0.2
    },
    combinesWith: [ElementalType.Poison, ElementalType.Void],
    strongAgainst: ['organic', 'living'],
    weakAgainst: ['radiated', 'lead_lined', 'hazmat']
  },

  [ElementalType.Explosive]: {
    type: ElementalType.Explosive,
    name: 'Explosive',
    description: 'Causes explosions on impact',
    color: '#FF8C00',
    damageType: 'explosive',
    effectName: 'explosion',
    damageMultiplier: 0.5,
    spreadChance: 0.5,
    stackable: false,
    statusEffects: {
      stun: 0.5
    },
    combinesWith: [ElementalType.Fire],
    strongAgainst: ['structure', 'vehicle', 'grouped'],
    weakAgainst: ['scattered', 'flying', 'ethereal']
  },

  [ElementalType.Bleeding]: {
    type: ElementalType.Bleeding,
    name: 'Bleeding',
    description: 'Causes hemorrhaging',
    color: '#8B0000',
    damageType: 'bleeding',
    effectName: 'bleed',
    damageMultiplier: 0.15,
    dotDamage: 20,
    dotDuration: 6,
    stackable: true,
    maxStacks: 5,
    statusEffects: {
      weaken: 0.1
    },
    strongAgainst: ['organic', 'living', 'flesh'],
    weakAgainst: ['undead', 'mechanical', 'elemental']
  },

  [ElementalType.Void]: {
    type: ElementalType.Void,
    name: 'Void',
    description: 'Drains life force and energy',
    color: '#4B0082',
    damageType: 'void',
    effectName: 'void_drain',
    damageMultiplier: 0.45,
    dotDamage: 10,
    dotDuration: 5,
    stackable: false,
    statusEffects: {
      weaken: 0.4,
      fear: 0.3
    },
    combinesWith: [ElementalType.Radiation, ElementalType.Chaos],
    strongAgainst: ['holy', 'living', 'magical'],
    weakAgainst: ['void_touched', 'demonic', 'soulless']
  },

  [ElementalType.Holy]: {
    type: ElementalType.Holy,
    name: 'Holy',
    description: 'Divine power that purifies',
    color: '#FFFACD',
    damageType: 'holy',
    effectName: 'purify',
    damageMultiplier: 0.35,
    stackable: false,
    statusEffects: {
      blind: 0.2
    },
    neutralizes: [ElementalType.Void, ElementalType.Chaos],
    strongAgainst: ['undead', 'demonic', 'evil'],
    weakAgainst: ['holy', 'divine', 'blessed']
  },

  [ElementalType.Chaos]: {
    type: ElementalType.Chaos,
    name: 'Chaos',
    description: 'Unpredictable random effects',
    color: '#FF1493',
    damageType: 'chaos',
    effectName: 'chaos_surge',
    damageMultiplier: 0.2 + Math.random() * 0.6, // 0.2-0.8 random
    stackable: true,
    maxStacks: 99,
    statusEffects: {
      confuse: 0.5,
      fear: 0.2,
      stun: 0.1
    },
    combinesWith: [ElementalType.Void, ElementalType.Quantum],
    strongAgainst: ['ordered', 'mechanical', 'predictable'],
    weakAgainst: ['chaotic', 'random', 'entropic']
  },

  [ElementalType.Plasma]: {
    type: ElementalType.Plasma,
    name: 'Plasma',
    description: 'Superheated matter that melts armor',
    color: '#FF00FF',
    damageType: 'plasma',
    effectName: 'melt',
    damageMultiplier: 0.4,
    dotDamage: 18,
    dotDuration: 4,
    stackable: false,
    statusEffects: {
      weaken: 0.25
    },
    combinesWith: [ElementalType.Electric],
    strongAgainst: ['armored', 'metal', 'shield'],
    weakAgainst: ['energy_shield', 'plasma_resistant', 'ceramic']
  },

  [ElementalType.Corrosive]: {
    type: ElementalType.Corrosive,
    name: 'Corrosive',
    description: 'Acid that eats through everything',
    color: '#9ACD32',
    damageType: 'corrosive',
    effectName: 'corrode',
    damageMultiplier: 0.3,
    dotDamage: 25,
    dotDuration: 7,
    stackable: true,
    maxStacks: 3,
    statusEffects: {
      weaken: 0.35
    },
    combinesWith: [ElementalType.Poison],
    strongAgainst: ['metal', 'armor', 'structure'],
    weakAgainst: ['acid_resistant', 'plastic', 'glass']
  },

  [ElementalType.Sonic]: {
    type: ElementalType.Sonic,
    name: 'Sonic',
    description: 'Sound waves that disorient',
    color: '#87CEEB',
    damageType: 'sonic',
    effectName: 'deafen',
    damageMultiplier: 0.25,
    spreadChance: 0.3,
    stackable: false,
    statusEffects: {
      stun: 0.3,
      confuse: 0.4,
      blind: 0.2
    },
    strongAgainst: ['glass', 'crystal', 'hearing'],
    weakAgainst: ['deaf', 'soundproof', 'underwater']
  },

  [ElementalType.Psychic]: {
    type: ElementalType.Psychic,
    name: 'Psychic',
    description: 'Mental attacks that bypass armor',
    color: '#DDA0DD',
    damageType: 'psychic',
    effectName: 'mindbreak',
    damageMultiplier: 0.35,
    stackable: false,
    statusEffects: {
      confuse: 0.6,
      fear: 0.4,
      weaken: 0.2
    },
    strongAgainst: ['intelligent', 'living', 'sentient'],
    weakAgainst: ['mindless', 'mechanical', 'psychic_resistant']
  },

  [ElementalType.Quantum]: {
    type: ElementalType.Quantum,
    name: 'Quantum',
    description: 'Exists in multiple states simultaneously',
    color: '#00FFFF',
    damageType: 'quantum',
    effectName: 'quantum_flux',
    damageMultiplier: Math.random() * 0.8, // 0-0.8 random each hit
    stackable: true,
    maxStacks: Infinity,
    statusEffects: {
      // Random effect each time
      slow: Math.random() * 0.5,
      stun: Math.random() * 0.3,
      confuse: Math.random() * 0.4
    },
    combinesWith: [ElementalType.Chaos, ElementalType.Void],
    strongAgainst: ['reality_bound', 'physical', 'stable'],
    weakAgainst: ['quantum_entangled', 'probabilistic', 'uncertain']
  }
};

// Elemental combination effects
export interface ElementalCombo {
  elements: ElementalType[];
  name: string;
  description: string;
  effect: string;
  damageBonus: number;
  specialEffect?: string;
}

export const elementalCombos: ElementalCombo[] = [
  {
    elements: [ElementalType.Fire, ElementalType.Explosive],
    name: 'Inferno Blast',
    description: 'Explosive fire damage',
    effect: 'inferno_blast',
    damageBonus: 1.5,
    specialEffect: 'AreaBurn'
  },
  {
    elements: [ElementalType.Ice, ElementalType.Electric],
    name: 'Storm',
    description: 'Freezing lightning',
    effect: 'ice_storm',
    damageBonus: 1.3,
    specialEffect: 'ChainFreeze'
  },
  {
    elements: [ElementalType.Poison, ElementalType.Corrosive],
    name: 'Toxic Waste',
    description: 'Highly corrosive poison',
    effect: 'toxic_waste',
    damageBonus: 1.4,
    specialEffect: 'ArmorMelt'
  },
  {
    elements: [ElementalType.Radiation, ElementalType.Void],
    name: 'Nuclear Void',
    description: 'Reality-warping radiation',
    effect: 'nuclear_void',
    damageBonus: 1.6,
    specialEffect: 'Disintegrate'
  },
  {
    elements: [ElementalType.Chaos, ElementalType.Quantum],
    name: 'Reality Break',
    description: 'Complete unpredictability',
    effect: 'reality_break',
    damageBonus: 2.0,
    specialEffect: 'ChaosField'
  },
  {
    elements: [ElementalType.Holy, ElementalType.Plasma],
    name: 'Divine Plasma',
    description: 'Purifying plasma burn',
    effect: 'divine_plasma',
    damageBonus: 1.5,
    specialEffect: 'Consecrate'
  }
];

// Get elemental interaction result
export function getElementalInteraction(
  element1: ElementalType, 
  element2: ElementalType
): ElementalCombo | null {
  return elementalCombos.find(combo => 
    combo.elements.includes(element1) && combo.elements.includes(element2)
  ) || null;
}

// Calculate elemental damage
export function calculateElementalDamage(
  baseDamage: number,
  elementalType: ElementalType,
  enemyType?: string
): number {
  const effect = elementalEffects[elementalType];
  let damage = baseDamage * effect.damageMultiplier;
  
  // Apply enemy type modifiers
  if (enemyType) {
    if (effect.strongAgainst?.includes(enemyType)) {
      damage *= 1.5;
    } else if (effect.weakAgainst?.includes(enemyType)) {
      damage *= 0.5;
    }
  }
  
  return damage;
}