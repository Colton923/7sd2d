import { Builders, ItemBuilder } from '@7d2d/mod-builder';
import { manufacturers, rarityTiers } from '../config/manufacturers';
import { allAffixes, getCompatibleAffixes, Affix } from '../data/affixes';
import { allWeaponParts, getPartsBySlotAndTier, WeaponPart } from '../data/weapon-parts';
import { ElementalType, elementalEffects, getElementalInteraction } from '../data/elemental-effects';
import { TriggeredEffect, generateRandomTriggeredEffects, getCompatibleTriggers } from '../data/triggered-effects';
import { WeaponBaseStats, WeaponClass, weaponClassStats, getWeaponTemplate, calculateTemplateStats } from '../data/weapon-base-stats';
import { scaleWeaponStats, calculateItemLevel, getItemLevelSuffix, applyStatVariance } from '../data/stat-scaling';

// Re-export types that are used externally
export { Affix, WeaponPart, ElementalType, TriggeredEffect, WeaponClass };

/**
 * Advanced Weapon Generator for achieving quadrillions of unique weapon combinations
 * 
 * PROGRESSION SYSTEM:
 * - Player Level: Gates which weapons can spawn/be equipped (NOT a stat multiplier)
 *   - Level 1-10: Tier 1 weapons, common/uncommon
 *   - Level 10-20: Tier 2 weapons, rare unlocked at 15
 *   - Level 20-30: Tier 3 weapons, epic unlocked at 25
 *   - Level 30-40: Tier 4 weapons
 *   - Level 40-50: Tier 5 weapons, legendary unlocked at 35
 *   - Level 50+: Tier 6 weapons
 * 
 * - Game Stage: Affects loot quality and tier distribution
 *   - Early (1-50): Mostly T1-T2, Q1-100
 *   - Mid (50-150): T2-T3 common, Q50-200
 *   - Late (150-300): T3-T4 common, Q100-400
 *   - End (300+): T4-T6 common, Q200-600
 * 
 * - Mastery Level (0-100): DOES scale weapon effectiveness
 *   - Improves damage, accuracy, handling
 *   - Unlocks special weapon parts
 *   - Affects affix roll quality
 * 
 * - Quality (1-600): Primary stat multiplier
 *   - Directly scales damage, durability, accuracy
 *   - Higher quality = better affix rolls
 *   - Gated by game stage progression
 * 
 * Combination Formula:
 * - Base Types: ~20 types
 * - Manufacturers: 12+
 * - Quality Levels: 600 (1-600)
 * - Rarity Tiers: 6
 * - Prefixes: ~50+ options
 * - Suffixes: ~50+ options
 * - Implicit Affixes: ~15 per manufacturer
 * - Parts: 4 tiers × 10+ parts per slot × 4-6 slots
 * - Mastery Levels: 100 levels (scaling factor)
 * - Mod Combinations: 6 slots × ~20 mods per slot
 * - Elemental Types: 8+ types
 * - Triggered Effects: ~20+ types
 * 
 * Total: 20 × 12 × 600 × 6 × 50 × 50 × 15 × (4×10)^4 × 100 × 20^6 × 8 × 20
 *      = Quadrillions+ of unique combinations
 */


// Complete weapon configuration
export interface AdvancedWeaponConfig {
  // Base properties
  baseType: string;
  weaponClass: WeaponClass;
  manufacturer: string;
  
  // Quality and rarity
  quality: number; // 1-600
  rarity: keyof typeof rarityTiers;
  tier: number; // 1-6
  
  // Player progression
  playerLevelRequirement: number; // Minimum player level to use this weapon
  playerLevelAtGeneration: number; // Player level when item was generated (for stat scaling)
  masteryLevel: number; // 0-100 - This DOES scale weapon effectiveness
  itemLevel?: number; // Calculated item level (saved with the weapon)
  
  // Affixes
  prefixes: Affix[];
  suffixes: Affix[];
  implicitAffixes: Affix[];
  uniqueAffixes?: Affix[];
  
  // Parts system
  parts: WeaponPart[];
  
  // Special properties
  elementalType: ElementalType;
  triggeredEffects: TriggeredEffect[];
  
  // Mod slots
  modSlotCount: number;
  installedMods?: string[];
  
  // Base stats (before modifications)
  baseStats: WeaponBaseStats;
}

export class AdvancedWeaponGenerator {
  private generatedWeapons: Map<string, ItemBuilder> = new Map();
  
  constructor() {
    // Databases are now imported from external files
  }

  // Databases are loaded from external files - no initialization needed

  generateWeapon(config: AdvancedWeaponConfig): ItemBuilder {
    const weaponHash = this.generateWeaponHash(config);
    
    // Check if we've already generated this exact weapon
    if (this.generatedWeapons.has(weaponHash)) {
      return this.generatedWeapons.get(weaponHash)!;
    }

    // Calculate final stats with all modifiers
    const finalStats = this.calculateFinalStats(config);
    
    // Generate unique weapon name
    const weaponName = this.generateUniqueWeaponName(config, weaponHash);
    
    // Create the weapon using 7d2d-ts builders
    const weapon = new Builders.Item(weaponName)
      .extends(config.baseType)
      .tags('weapon', config.weaponClass, config.rarity, `T${config.tier}`, `Q${config.quality}`)
      .displayType(config.weaponClass === 'melee' ? 'melee' : 'rangedGun')
      .property('CustomIcon', weaponName.toLowerCase())
      .property('CustomIconTint', rarityTiers[config.rarity].color)
      .property('QualityTier', config.tier.toString())
      .property('Quality', config.quality.toString())
      .property('EconomicValue', Math.round(this.calculateEconomicValue(config, finalStats)))
      .property('Weight', finalStats.weight.toFixed(2))
      .property('ShowQuality', 'true')
      .property('UnlockedBy', `perkLevel${config.playerLevelRequirement}`)
      .property('PlayerLevelRequirement', config.playerLevelRequirement.toString())
      .property('MasteryRequirement', config.masteryLevel.toString())
      .property('ItemLevel', (config.itemLevel || 1).toString())
      .property('GeneratedAtPlayerLevel', config.playerLevelAtGeneration.toString())
      .property('RepairTools', 'resourceRepairKit')
      .property('DegradationMax', finalStats.durability.toString())
      .property('MaxRange', finalStats.range.toString())
      .property('EntityDamage', finalStats.damage.toFixed(2))
      .property('BlockDamage', (finalStats.damage * 0.5).toFixed(2))
      .property('AttacksPerMinute', (finalStats.fireRate * 60).toString())
      .property('StaminaLoss', finalStats.staminaLoss.toFixed(2))
      .property('CritChance', finalStats.criticalChance.toFixed(3))
      .property('CritDamage', finalStats.criticalDamage.toFixed(2))
      .property('DismembermentBaseChance', finalStats.dismemberChance.toFixed(3))
      .property('Penetration', finalStats.penetration.toFixed(2))
      .property('Spread', finalStats.spread.toFixed(3))
      .property('Recoil', finalStats.recoil.toFixed(3))
      .property('MagazineSize', Math.round(finalStats.magazineSize).toString())
      .property('ReloadTime', finalStats.reloadSpeed.toFixed(2));

    // Add elemental properties
    if (config.elementalType !== ElementalType.None) {
      this.addElementalProperties(weapon, config.elementalType, finalStats);
    }

    // Add affix descriptions
    this.addAffixDescriptions(weapon, config);

    // Add triggered effects
    this.addTriggeredEffects(weapon, config.triggeredEffects);

    // Add mod slots
    weapon.property('ModSlots', this.generateModSlots(config));

    // Add part bonuses
    this.addPartBonuses(weapon, config.parts);

    // Cache the generated weapon
    this.generatedWeapons.set(weaponHash, weapon);

    return weapon;
  }

  private calculateFinalStats(config: AdvancedWeaponConfig): typeof config.baseStats {
    let stats = { ...config.baseStats };

    // CRITICAL: Apply level-based scaling FIRST
    // This is calculated ONCE when the item is generated and becomes permanent
    stats = scaleWeaponStats(
      stats,
      config.playerLevelAtGeneration,  // Player's level when this item dropped
      config.tier,
      config.quality
    );
    
    // Calculate and store the item level (represents the item's power level)
    const itemLevel = calculateItemLevel(
      config.playerLevelAtGeneration,
      config.tier,
      config.quality
    );
    (config as any).itemLevel = itemLevel;
    
    // Apply stat variance for uniqueness (makes each drop slightly different)
    stats = applyStatVariance(stats, 0.1);

    // Apply manufacturer modifiers
    const mfg = manufacturers[config.manufacturer];
    if (mfg) {
      Object.entries(mfg.statModifiers).forEach(([stat, modifier]) => {
        if (stat === 'allStats') {
          Object.keys(stats).forEach(s => {
            (stats as any)[s] *= (1 + modifier);
          });
        } else if (stat in stats) {
          (stats as any)[stat] *= (1 + modifier);
        }
      });
    }

    // Apply rarity multiplier
    const rarity = rarityTiers[config.rarity];
    stats.damage *= rarity.statMultiplier;
    stats.durability *= rarity.statMultiplier;
    stats.criticalChance += rarity.statMultiplier * 0.01;

    // Apply mastery level scaling (player's skill with this weapon type)
    const masteryMultiplier = 1 + (config.masteryLevel / 100) * 0.3; // Up to 1.3x at max mastery
    stats.damage *= masteryMultiplier;
    stats.fireRate *= (1 + config.masteryLevel / 200); // Slight fire rate boost
    stats.accuracy = Math.min(stats.accuracy * (1 + config.masteryLevel / 150), 0.99); // Accuracy improvement

    // Apply all affixes
    [...config.prefixes, ...config.suffixes, ...config.implicitAffixes, ...(config.uniqueAffixes || [])].forEach(affix => {
      const value = this.rollAffixValue(affix, config.quality, config.masteryLevel);
      this.applyAffixToStats(stats, affix, value);
    });

    // Apply part modifiers
    config.parts.forEach(part => {
      Object.entries(part.statModifiers).forEach(([stat, modifier]) => {
        if (stat in stats) {
          (stats as any)[stat] *= (1 + (modifier as number));
        }
      });
    });

    // Apply synergies (if multiple parts from same set)
    const synergies = this.calculateSynergies(config.parts);
    Object.entries(synergies).forEach(([stat, bonus]) => {
      if (stat in stats) {
        (stats as any)[stat] *= (1 + bonus);
      }
    });

    return stats;
  }

  private rollAffixValue(affix: Affix, quality: number, masteryLevel: number): number {
    // Roll within min/max range, influenced by quality and mastery
    const range = affix.maxValue - affix.minValue;
    const qualityInfluence = quality / 600; // 0 to 1
    const masteryInfluence = masteryLevel / 100; // 0 to 1
    
    // Combined influence creates bias toward higher rolls
    const rollBias = (qualityInfluence + masteryInfluence) / 2;
    const roll = Math.random() * (1 - rollBias) + rollBias; // Biased toward 1
    
    return affix.minValue + (range * roll);
  }

  private applyAffixToStats(stats: any, affix: Affix, value: number): void {
    if (!(affix.stat in stats)) {
      // Handle special stats that aren't in base stats
      (stats as any)[affix.stat] = 0;
    }

    switch (affix.operation) {
      case 'base_add':
        stats[affix.stat] += value;
        break;
      case 'perc_add':
        stats[affix.stat] *= (1 + value);
        break;
      case 'perc_subtract':
        stats[affix.stat] *= (1 - value);
        break;
      case 'base_multiply':
        stats[affix.stat] *= value;
        break;
    }
  }

  private calculateSynergies(parts: WeaponPart[]): Record<string, number> {
    const synergies: Record<string, number> = {};
    
    // Check for matching tier sets
    const tierCounts: Record<string, number> = {};
    parts.forEach(part => {
      tierCounts[part.tier] = (tierCounts[part.tier] || 0) + 1;
    });

    // 3+ parts of same tier grant bonuses
    Object.entries(tierCounts).forEach(([tier, count]) => {
      if (count >= 3) {
        switch (tier) {
          case 'legendary':
            synergies.damage = 0.15;
            synergies.criticalChance = 0.05;
            break;
          case 'master':
            synergies.accuracy = 0.10;
            synergies.durability = 0.20;
            break;
          case 'advanced':
            synergies.fireRate = 0.10;
            synergies.reloadSpeed = -0.15;
            break;
        }
      }
    });

    return synergies;
  }

  private generateWeaponHash(config: AdvancedWeaponConfig): string {
    // Generate a unique hash for this exact weapon configuration
    const hashComponents = [
      config.baseType,
      config.manufacturer,
      config.quality,
      config.rarity,
      config.tier,
      config.playerLevelRequirement,
      config.playerLevelAtGeneration,  // Include the generation level for uniqueness
      config.masteryLevel,
      ...config.prefixes.map(a => a.name),
      ...config.suffixes.map(a => a.name),
      ...config.parts.map(p => p.name),
      config.elementalType,
      ...config.triggeredEffects.map(e => e.effect)
    ];
    
    return hashComponents.join('_').replace(/\s+/g, '');
  }

  private generateUniqueWeaponName(config: AdvancedWeaponConfig, hash: string): string {
    const parts = [];
    
    // Add item level suffix for quick power identification
    if (config.itemLevel) {
      const levelSuffix = getItemLevelSuffix(config.itemLevel);
      parts.push(levelSuffix);
    }
    
    // Add most significant prefix
    if (config.prefixes.length > 0) {
      parts.push(config.prefixes[0].name);
    }
    
    // Add manufacturer
    parts.push(config.manufacturer);
    
    // Add base weapon type
    parts.push(config.weaponClass);
    
    // Add most significant suffix
    if (config.suffixes.length > 0) {
      parts.push(config.suffixes[0].name.replace('of ', ''));
    }
    
    // Add tier and quality
    parts.push(`T${config.tier}Q${config.quality}`);
    
    // Add a short hash for uniqueness
    parts.push(hash.substring(0, 6));
    
    return parts.join('_').replace(/\s+/g, '');
  }

  private addElementalProperties(weapon: ItemBuilder, element: ElementalType, stats: any): void {
    const elementalDamage = stats.damage * 0.3; // 30% of damage as elemental
    
    switch (element) {
      case ElementalType.Fire:
        weapon.property('ElementalDamageType', 'heat');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'burning');
        break;
      case ElementalType.Ice:
        weapon.property('ElementalDamageType', 'cold');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'freeze');
        break;
      case ElementalType.Electric:
        weapon.property('ElementalDamageType', 'electric');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'shock');
        break;
      case ElementalType.Poison:
        weapon.property('ElementalDamageType', 'poison');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'poisoned');
        break;
      case ElementalType.Radiation:
        weapon.property('ElementalDamageType', 'radiation');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'radiated');
        break;
      case ElementalType.Explosive:
        weapon.property('ElementalDamageType', 'explosive');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'explosion');
        break;
      case ElementalType.Bleeding:
        weapon.property('ElementalDamageType', 'bleeding');
        weapon.property('ElementalDamage', (elementalDamage * 0.5).toFixed(2));
        weapon.property('ElementalEffect', 'bleed');
        break;
      case ElementalType.Void:
        weapon.property('ElementalDamageType', 'void');
        weapon.property('ElementalDamage', elementalDamage.toFixed(2));
        weapon.property('ElementalEffect', 'void_drain');
        break;
    }
  }

  private addAffixDescriptions(weapon: ItemBuilder, config: AdvancedWeaponConfig): void {
    const descriptions: string[] = [];
    
    // Add comma-separated list of prefix names for C# to parse
    if (config.prefixes.length > 0) {
      const prefixNames = config.prefixes.map(a => a.name).join(',');
      weapon.property('Prefixes', prefixNames);
      
      config.prefixes.forEach(affix => {
        descriptions.push(`[${affix.name}] ${affix.description}`);
      });
    }
    
    // Add comma-separated list of suffix names for C# to parse
    if (config.suffixes.length > 0) {
      const suffixNames = config.suffixes.map(a => a.name).join(',');
      weapon.property('Suffixes', suffixNames);
      
      config.suffixes.forEach(affix => {
        descriptions.push(`[${affix.name}] ${affix.description}`);
      });
    }
    
    // Add comma-separated list of implicit names for C# to parse
    if (config.implicitAffixes.length > 0) {
      const implicitNames = config.implicitAffixes.map(a => a.name).join(',');
      weapon.property('Implicits', implicitNames);
      
      config.implicitAffixes.forEach(affix => {
        descriptions.push(`[Implicit: ${affix.name}] ${affix.description}`);
      });
    }
    
    // Add unique affixes if present
    if (config.uniqueAffixes && config.uniqueAffixes.length > 0) {
      const uniqueNames = config.uniqueAffixes.map(a => a.name).join(',');
      weapon.property('UniqueAffixes', uniqueNames);
      
      config.uniqueAffixes.forEach(affix => {
        descriptions.push(`[UNIQUE: ${affix.name}] ${affix.description}`);
      });
    }
    
    weapon.property('AffixDescriptions', descriptions.join(' | '));
  }

  private addTriggeredEffects(weapon: ItemBuilder, effects: TriggeredEffect[]): void {
    effects.forEach((effect, index) => {
      weapon.property(`TriggeredEffect${index}_Trigger`, effect.trigger);
      weapon.property(`TriggeredEffect${index}_Effect`, effect.effect);
      weapon.property(`TriggeredEffect${index}_Chance`, effect.chance.toString());
      
      if (effect.cooldown) {
        weapon.property(`TriggeredEffect${index}_Cooldown`, effect.cooldown.toString());
      }
      
      if (effect.stackable) {
        weapon.property(`TriggeredEffect${index}_Stackable`, 'true');
        weapon.property(`TriggeredEffect${index}_MaxStacks`, (effect.maxStacks || 1).toString());
      }
    });
  }

  private addPartBonuses(weapon: ItemBuilder, parts: WeaponPart[]): void {
    parts.forEach((part, index) => {
      weapon.property(`Part${index}_Slot`, part.slot);
      weapon.property(`Part${index}_Name`, part.name);
      weapon.property(`Part${index}_Tier`, part.tier);
      
      if (part.specialEffect) {
        weapon.property(`Part${index}_SpecialEffect`, part.specialEffect);
      }
    });
  }

  private generateModSlots(config: AdvancedWeaponConfig): string {
    const baseSlots = rarityTiers[config.rarity].modSlots;
    const tierBonus = Math.floor(config.tier / 2);
    const qualityBonus = Math.floor(config.quality / 150);
    const masteryBonus = Math.floor(config.masteryLevel / 25);
    
    const totalSlots = Math.min(6, baseSlots + tierBonus + qualityBonus + masteryBonus);
    const slots = Array(6).fill(0).map((_, i) => i < totalSlots ? config.modSlotCount : 0);
    
    return slots.join(',');
  }

  private calculateEconomicValue(config: AdvancedWeaponConfig, stats: any): number {
    let value = 100;
    
    // Base value from damage and quality
    value += stats.damage * 10;
    value *= (1 + config.quality / 100);
    
    // Rarity multiplier
    value *= rarityTiers[config.rarity].statMultiplier * 2;
    
    // Affix value
    value += config.prefixes.length * 500;
    value += config.suffixes.length * 500;
    value += (config.uniqueAffixes?.length || 0) * 2000;
    
    // Part value
    config.parts.forEach(part => {
      switch (part.tier) {
        case 'legendary': value += 5000; break;
        case 'master': value += 2000; break;
        case 'advanced': value += 500; break;
        case 'basic': value += 100; break;
      }
    });
    
    // Elemental bonus
    if (config.elementalType !== ElementalType.None) {
      value *= 1.5;
    }
    
    return Math.round(value);
  }

  // Generate a complete randomized weapon
  generateRandomWeapon(
    baseType: string,
    weaponClass: AdvancedWeaponConfig['weaponClass'],
    options?: {
      minQuality?: number;
      maxQuality?: number;
      minTier?: number;
      maxTier?: number;
      forcedManufacturer?: string;
      forcedRarity?: keyof typeof rarityTiers;
      playerLevel?: number;
      masteryLevel?: number;
    }
  ): ItemBuilder {
    const tier = this.randomBetween(options?.minTier || 1, options?.maxTier || 6);
    const rarity = options?.forcedRarity || this.getRandomRarity();
    const playerLevel = options?.playerLevel || this.randomBetween(1, 100);
    
    const config: AdvancedWeaponConfig = {
      baseType,
      weaponClass,
      manufacturer: options?.forcedManufacturer || this.getRandomManufacturer(),
      quality: this.randomBetween(options?.minQuality || 1, options?.maxQuality || 600),
      rarity,
      tier,
      playerLevelRequirement: this.calculateLevelRequirement(tier, rarity),
      playerLevelAtGeneration: playerLevel,  // The player's level when this item was generated
      masteryLevel: options?.masteryLevel || this.randomBetween(0, 100),
      prefixes: this.rollRandomAffixes('prefixes', weaponClass),
      suffixes: this.rollRandomAffixes('suffixes', weaponClass),
      implicitAffixes: this.getManufacturerImplicits(options?.forcedManufacturer || this.getRandomManufacturer()),
      uniqueAffixes: Math.random() < 0.1 ? this.rollRandomAffixes('unique', weaponClass, 1) : undefined,
      parts: this.rollRandomParts(weaponClass),
      elementalType: this.getRandomElementalType(),
      triggeredEffects: this.rollRandomTriggeredEffects(),
      modSlotCount: this.randomBetween(1, 6),
      baseStats: this.getBaseStatsForWeaponClass(weaponClass)
    };

    return this.generateWeapon(config);
  }

  private getRandomManufacturer(): string {
    const mfgs = Object.keys(manufacturers);
    return mfgs[Math.floor(Math.random() * mfgs.length)];
  }

  private getRandomRarity(): keyof typeof rarityTiers {
    const rarities = Object.keys(rarityTiers) as (keyof typeof rarityTiers)[];
    const weights = rarities.map(r => 1 / rarityTiers[r].statMultiplier);
    return this.weightedRandom(rarities, weights);
  }

  private getRandomElementalType(): ElementalType {
    const types = Object.values(ElementalType);
    return types[Math.floor(Math.random() * types.length)];
  }

  private rollRandomAffixes(type: string, weaponClass: string, count?: number): Affix[] {
    const affixes = getCompatibleAffixes(weaponClass, type as Affix['type']);
    
    const numAffixes = count || this.randomBetween(0, 3);
    const selected: Affix[] = [];
    const available = [...affixes]; // Create a copy to avoid modifying original
    
    for (let i = 0; i < numAffixes && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available[index]);
      available.splice(index, 1); // Don't select same affix twice
    }
    
    return selected;
  }

  private getManufacturerImplicits(manufacturer: string): Affix[] {
    const implicits = allAffixes.implicit;
    return implicits.filter(a => a.name.toLowerCase().includes(manufacturer.toLowerCase())).slice(0, 2);
  }

  private rollRandomParts(weaponClass: string): WeaponPart[] {
    const parts: WeaponPart[] = [];
    const slots = ['barrel', 'trigger', 'stock', 'magazine'];
    
    slots.forEach(slot => {
      const slotParts = allWeaponParts[slot as keyof typeof allWeaponParts] || [];
      if (slotParts.length > 0) {
        parts.push(slotParts[Math.floor(Math.random() * slotParts.length)]);
      }
    });
    
    return parts;
  }

  private rollRandomTriggeredEffects(): TriggeredEffect[] {
    // Use the external database function to generate random effects
    const level = Math.floor(Math.random() * 50) + 1;
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const weaponType = 'ranged'; // Could be passed as parameter
    
    return generateRandomTriggeredEffects(level, rarity, weaponType);
  }

  private getBaseStatsForWeaponClass(weaponClass: string): WeaponBaseStats {
    return { ...weaponClassStats[weaponClass as WeaponClass] };
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }

  private calculateLevelRequirement(tier: number, rarity: keyof typeof rarityTiers): number {
    // Base level requirements by tier
    const tierLevels = {
      1: 1,   // Tier 1: Level 1-10
      2: 10,  // Tier 2: Level 10-20
      3: 20,  // Tier 3: Level 20-30
      4: 30,  // Tier 4: Level 30-40
      5: 40,  // Tier 5: Level 40-50
      6: 50   // Tier 6: Level 50+
    };

    // Rarity adds additional level requirements
    const rarityModifiers = {
      'common': 0,
      'uncommon': 2,
      'rare': 5,
      'epic': 8,
      'legendary': 10
    };

    const baseLevel = tierLevels[tier as keyof typeof tierLevels] || 1;
    const rarityModifier = rarityModifiers[rarity] || 0;
    
    return Math.min(60, baseLevel + rarityModifier); // Cap at level 60
  }

  // Get weapons available for a specific player level
  getWeaponsForPlayerLevel(playerLevel: number): string[] {
    const availableWeapons: string[] = [];
    
    // Determine max tier based on player level
    let maxTier = 1;
    if (playerLevel >= 50) maxTier = 6;
    else if (playerLevel >= 40) maxTier = 5;
    else if (playerLevel >= 30) maxTier = 4;
    else if (playerLevel >= 20) maxTier = 3;
    else if (playerLevel >= 10) maxTier = 2;
    
    // Generate list of weapon configs that can spawn
    for (let tier = 1; tier <= maxTier; tier++) {
      const rarities = this.getRaritiesForPlayerLevel(playerLevel, tier);
      rarities.forEach(rarity => {
        const levelReq = this.calculateLevelRequirement(tier, rarity);
        if (levelReq <= playerLevel) {
          availableWeapons.push(`Tier${tier}_${rarity}`);
        }
      });
    }
    
    return availableWeapons;
  }

  private getRaritiesForPlayerLevel(playerLevel: number, tier: number): (keyof typeof rarityTiers)[] {
    const rarities: (keyof typeof rarityTiers)[] = ['common'];
    
    // Higher levels unlock better rarities
    if (playerLevel >= 5) rarities.push('uncommon');
    if (playerLevel >= 15) rarities.push('rare');
    if (playerLevel >= 25 && tier >= 2) rarities.push('epic');
    if (playerLevel >= 35 && tier >= 3) rarities.push('legendary');
    
    return rarities;
  }

  // Generate loot table for specific player level and game stage
  generateLootTable(playerLevel: number, gameStage: number): Map<string, number> {
    const lootTable = new Map<string, number>();
    
    // Game stage affects quality distribution
    const minQuality = Math.max(1, gameStage * 10 - 50);
    const maxQuality = Math.min(600, gameStage * 15);
    
    // Higher game stages have better tier chances
    const tierWeights = this.getTierWeightsForGameStage(gameStage);
    
    // Generate weighted loot table
    const availableWeapons = this.getWeaponsForPlayerLevel(playerLevel);
    availableWeapons.forEach(weaponConfig => {
      const [tierStr, rarity] = weaponConfig.split('_');
      const tier = parseInt(tierStr.replace('Tier', ''));
      
      // Calculate spawn weight based on tier and rarity
      const tierWeight = tierWeights[tier] || 0.1;
      const rarityWeight = 1 / rarityTiers[rarity as keyof typeof rarityTiers].statMultiplier;
      const finalWeight = tierWeight * rarityWeight;
      
      lootTable.set(weaponConfig, finalWeight);
    });
    
    return lootTable;
  }

  private getTierWeightsForGameStage(gameStage: number): Record<number, number> {
    // Early game favors low tiers, late game favors high tiers
    const weights: Record<number, number> = {};
    
    if (gameStage < 50) {
      weights[1] = 1.0;
      weights[2] = 0.3;
      weights[3] = 0.1;
      weights[4] = 0.01;
      weights[5] = 0.001;
      weights[6] = 0.0001;
    } else if (gameStage < 150) {
      weights[1] = 0.5;
      weights[2] = 1.0;
      weights[3] = 0.5;
      weights[4] = 0.2;
      weights[5] = 0.05;
      weights[6] = 0.01;
    } else if (gameStage < 300) {
      weights[1] = 0.2;
      weights[2] = 0.5;
      weights[3] = 1.0;
      weights[4] = 0.6;
      weights[5] = 0.3;
      weights[6] = 0.1;
    } else {
      weights[1] = 0.1;
      weights[2] = 0.2;
      weights[3] = 0.4;
      weights[4] = 0.8;
      weights[5] = 1.0;
      weights[6] = 0.6;
    }
    
    return weights;
  }
}