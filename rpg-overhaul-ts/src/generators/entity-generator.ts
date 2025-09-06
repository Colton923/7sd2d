import { Builders, EntityBuilder } from '@7d2d/mod-builder';

export interface ZombieStats {
  health: number;
  speed: number;
  damage: number;
  armor: number;
  experience: number;
  sightRange: number;
  hearingRange: number;
}

export interface ZombieVariant {
  name: string;
  type: 'normal' | 'feral' | 'radiated' | 'boss' | 'special';
  tier: number;
  baseStats: ZombieStats;
  abilities?: string[];
  lootTable?: string;
  specialBehaviors?: string[];
}

export class EntityGenerator {
  private entities: EntityBuilder[] = [];

  generateZombie(variant: ZombieVariant): EntityBuilder {
    const zombieName = this.generateZombieName(variant);
    const stats = this.calculateZombieStats(variant);
    
    const zombie = new Builders.Entity(zombieName)
      .extends(this.getBaseZombieType(variant.type))
      .class('EntityZombie')
      .archetype('Zombie')
      .faction('undead')
      .tags('entity', 'zombie', 'hostile', variant.type)
      .userSpawnType('Menu')
      .health(stats.health)
      .speed({
        base: stats.speed,
        aggro: stats.speed * 1.5,
        night: stats.speed * 1.2,
        panic: stats.speed * 2
      })
      .sight({
        range: stats.sightRange,
        scale: variant.type === 'boss' ? 2 : 1,
        lightThreshold: variant.type === 'radiated' ? -3 : -2,
        maxViewAngle: variant.type === 'feral' ? 240 : 210
      })
      .property('PhysicalDamageResist', Math.round(stats.armor).toString())
      .property('ExperienceGain', stats.experience.toString())
      .property('HandItem', this.getHandItem(variant))
      .property('PainResistPerHit', variant.type === 'boss' ? '0.95' : '0.5');

    // Add sounds
    zombie.sounds({
      alert: `zombie${variant.type}alert`,
      attack: `zombie${variant.type}attack`,
      death: `zombie${variant.type}death`,
      hurt: `zombie${variant.type}hurt`,
      idle: `zombie${variant.type}idle`
    });

    // Add loot
    if (variant.lootTable) {
      zombie.loot({
        onDeath: variant.lootTable,
        prob: 1
      });
    } else {
      zombie.loot({
        onDeath: this.getDefaultLootTable(variant.type, variant.tier),
        prob: variant.type === 'boss' ? 1 : 0.5
      });
    }

    // Add special abilities
    if (variant.abilities) {
      this.addAbilities(zombie, variant.abilities);
    }

    // Add dismember resistance for tougher zombies
    if (variant.type === 'boss' || variant.type === 'radiated') {
      zombie.dismemberMultipliers({
        head: 0.3,
        arms: 0.5,
        legs: 0.5
      });
    }

    // Add special behaviors
    if (variant.specialBehaviors) {
      variant.specialBehaviors.forEach(behavior => {
        this.addSpecialBehavior(zombie, behavior);
      });
    }

    this.entities.push(zombie);
    return zombie;
  }

  private calculateZombieStats(variant: ZombieVariant): ZombieStats {
    const stats = { ...variant.baseStats };
    
    // Apply tier scaling
    const tierMultiplier = 1 + (variant.tier - 1) * 0.5;
    stats.health *= tierMultiplier;
    stats.damage *= tierMultiplier;
    stats.experience *= tierMultiplier;
    
    // Apply type modifiers
    switch (variant.type) {
      case 'feral':
        stats.speed *= 1.3;
        stats.damage *= 1.2;
        stats.health *= 0.9;
        break;
      case 'radiated':
        stats.health *= 2;
        stats.damage *= 1.5;
        stats.armor *= 2;
        stats.experience *= 3;
        break;
      case 'boss':
        stats.health *= 5;
        stats.damage *= 2;
        stats.armor *= 3;
        stats.experience *= 10;
        stats.sightRange *= 1.5;
        break;
      case 'special':
        stats.experience *= 2;
        break;
    }
    
    return stats;
  }

  private generateZombieName(variant: ZombieVariant): string {
    const parts = ['zombie'];
    
    if (variant.type !== 'normal') {
      parts.push(variant.type);
    }
    
    parts.push(variant.name);
    parts.push(`T${variant.tier}`);
    
    return parts.join('_').replace(/\s+/g, '_');
  }

  private getBaseZombieType(type: string): string {
    switch (type) {
      case 'feral':
        return 'zombieFeralBase';
      case 'radiated':
        return 'zombieRadiatedBase';
      case 'boss':
        return 'zombieBossBase';
      default:
        return 'zombieMoe';
    }
  }

  private getHandItem(variant: ZombieVariant): string {
    if (variant.type === 'boss') {
      return 'meleeHandZombieBoss';
    } else if (variant.type === 'radiated') {
      return 'meleeHandZombieRadiated';
    } else if (variant.type === 'feral') {
      return 'meleeHandZombieFeral';
    }
    return 'meleeHandZombie';
  }

  private getDefaultLootTable(type: string, tier: number): string {
    if (type === 'boss') {
      return `entityLootBossT${tier}`;
    } else if (type === 'radiated') {
      return `entityLootRadiatedT${tier}`;
    } else if (type === 'feral') {
      return `entityLootFeralT${tier}`;
    }
    return `entityLootZombieT${tier}`;
  }

  private addAbilities(zombie: EntityBuilder, abilities: string[]): void {
    abilities.forEach(ability => {
      switch (ability) {
        case 'rage':
          zombie.property('RageMode', 'true');
          zombie.property('RageTriggerHealth', '0.5');
          zombie.property('RageSpeedMultiplier', '1.5');
          break;
        case 'explosive':
          zombie.property('ExplosionOnDeath', 'true');
          zombie.property('ExplosionDamage', '100');
          zombie.property('ExplosionRadius', '5');
          break;
        case 'regeneration':
          zombie.property('HealthRegen', '5');
          zombie.property('HealthRegenDelay', '3');
          break;
        case 'summon':
          zombie.property('CanSummon', 'true');
          zombie.property('SummonEntity', 'zombieCrawler');
          zombie.property('SummonCount', '3');
          zombie.property('SummonCooldown', '30');
          break;
        case 'acidSpit':
          zombie.property('RangedAttack', 'true');
          zombie.property('RangedProjectile', 'zombieProjectileAcid');
          zombie.property('RangedDamage', '30');
          zombie.property('RangedCooldown', '5');
          break;
      }
    });
  }

  private addSpecialBehavior(zombie: EntityBuilder, behavior: string): void {
    switch (behavior) {
      case 'nocturnal':
        zombie.property('NocturnalBonus', 'true');
        zombie.property('NightSpeedMultiplier', '1.5');
        zombie.property('NightDamageMultiplier', '1.3');
        break;
      case 'pack_leader':
        zombie.property('PackLeader', 'true');
        zombie.property('PackRadius', '20');
        zombie.property('PackBuffs', 'speed,damage');
        break;
      case 'wall_climber':
        zombie.property('CanClimbWalls', 'true');
        zombie.property('ClimbSpeed', '2');
        break;
      case 'door_breaker':
        zombie.property('DoorDamageMultiplier', '3');
        zombie.property('TargetsDoors', 'true');
        break;
    }
  }

  generateZombieHorde(
    baseVariant: ZombieVariant,
    count: number,
    options: {
      tierRange?: [number, number];
      includeSpecials?: boolean;
      includeBoss?: boolean;
    } = {}
  ): EntityBuilder[] {
    const zombies: EntityBuilder[] = [];
    const tierMin = options.tierRange?.[0] || 1;
    const tierMax = options.tierRange?.[1] || 6;

    // Generate regular zombies
    for (let i = 0; i < count; i++) {
      const tier = Math.floor(Math.random() * (tierMax - tierMin + 1)) + tierMin;
      const variant: ZombieVariant = {
        ...baseVariant,
        name: `${baseVariant.name}_${i}`,
        tier
      };
      zombies.push(this.generateZombie(variant));
    }

    // Add special zombies
    if (options.includeSpecials) {
      const specialCount = Math.ceil(count * 0.1);
      for (let i = 0; i < specialCount; i++) {
        const specialVariant: ZombieVariant = {
          ...baseVariant,
          name: `${baseVariant.name}_special_${i}`,
          type: 'special',
          tier: tierMax,
          abilities: ['rage', 'regeneration']
        };
        zombies.push(this.generateZombie(specialVariant));
      }
    }

    // Add boss
    if (options.includeBoss) {
      const bossVariant: ZombieVariant = {
        ...baseVariant,
        name: `${baseVariant.name}_boss`,
        type: 'boss',
        tier: tierMax,
        abilities: ['rage', 'summon', 'regeneration'],
        specialBehaviors: ['pack_leader']
      };
      zombies.push(this.generateZombie(bossVariant));
    }

    return zombies;
  }

  build(): any[] {
    return this.entities.map(e => e.build());
  }

  getEntities(): EntityBuilder[] {
    return this.entities;
  }
}