// Loot System Type Definitions for RPG Overhaul

export interface LootCategory {
  description: string;
  spawn_locations: string[];
  gamestage_min: number;
  gamestage_max: number;
  base_probability: number;
}

export interface SpawnLocation {
  containers: string[];
  base_loot_stage: number;
  loot_abundance: number;
}

export interface RarityMultipliers {
  [rarity: string]: number;
}

export interface ProgressionScaling {
  gamestage_range: [number, number];
  quality_bias: [number, number];
  rarity_penalty: number;
}

export interface ZombieDropTier {
  difficulty_tiers: number[];
  drop_categories: string[];
  drop_chance: number;
  max_items: number;
  special_drops?: { [itemName: string]: number };
}

export interface SpecialEvent {
  guaranteed_categories?: string[];
  bonus_multiplier: number;
  min_gamestage?: number;
}

export interface LootConfig {
  loot_categories: { [category: string]: LootCategory };
  spawn_locations: { [location: string]: SpawnLocation };
  rarity_multipliers: RarityMultipliers;
  progression_scaling: {
    early_game: ProgressionScaling;
    mid_game: ProgressionScaling;
    late_game: ProgressionScaling;
    end_game: ProgressionScaling;
  };
  zombie_drops: { [tier: string]: ZombieDropTier };
  special_events: {
    supply_drops: SpecialEvent;
    trader_quests: SpecialEvent;
    dungeon_loot: SpecialEvent;
  };
}

// Tier-based loot types
export interface TierLootConfig {
  drop_chance: number;
  max_items: number;
  quality_range: [number, number];
  loot_groups: string[];
}

export interface WeaponRarityScaling {
  drop_chance: number;
  description: string;
  [rarity: string]: number | string; // Allow both number and string for mixed properties
}

export interface EquipmentByTier {
  armor_pieces: string[];
  accessories: string[];
  weapons: string[];
  quality_range: [number, number];
}

export interface SpecialDropByBiome {
  common: string[];
  uncommon: string[];
  rare: string[];
}

export interface EconomyTierBasedLoot {
  weapon_rarity_scaling: { [tier: string]: WeaponRarityScaling };
  equipment_by_tier: { [tier: string]: EquipmentByTier };
  special_drops_by_biome: { [biome: string]: SpecialDropByBiome };
  economic_scaling: { [tier: string]: number };
  loot_quantity_scaling: { [tier: string]: { min: number; max: number } };
}

// Loot generation result types
export interface LootGenerationResult {
  items: GeneratedLootItem[];
  totalValue: number;
  rarityDistribution: { [rarity: string]: number };
  categoryBreakdown: { [category: string]: number };
}

export interface GeneratedLootItem {
  name: string;
  category: string;
  rarity: string;
  quantity: number;
  value: number;
  properties: { [key: string]: any };
}

// Weapon audit types
export interface WeaponAuditEntry {
  base_weapon: string;
  manufacturer: string;
  rarity: string;
  tier: number;
  final_damage: number;
  final_durability: number;
  final_rate_of_fire: number;
  final_accuracy: number;
  final_range: number;
  final_magazine_size: number;
  final_weight: number;
  final_economic_value: number;
  material: string;
  weapon_type: string;
  ammo_type: string;
  generatedAt?: Date;
  [key: string]: any; // Allow indexing for dynamic property access
}

// Loot generation context
export interface LootGenerationContext {
  gamestage: number;
  location: string;
  containerType: string;
  difficulty: number;
  biome?: string;
  isSpecialEvent?: boolean;
  playerLevel?: number;
}

// Loot table entry
export interface LootTableEntry {
  itemName: string;
  probability: number;
  quantity: {
    min: number;
    max: number;
  };
  quality?: {
    min: number;
    max: number;
  };
  conditions?: {
    gamestage_min?: number;
    gamestage_max?: number;
    location?: string[];
    biome?: string[];
  };
}
