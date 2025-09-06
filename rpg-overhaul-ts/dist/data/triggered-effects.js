"use strict";
/**
 * Triggered Effects Database
 *
 * Defines all possible triggered effects that can occur on weapons
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggeredEffectTemplates = void 0;
exports.generateRandomTriggeredEffects = generateRandomTriggeredEffects;
exports.getCompatibleTriggers = getCompatibleTriggers;
exports.triggeredEffectTemplates = {
    // ========== OFFENSIVE EFFECTS ==========
    heal: {
        effect: 'heal',
        name: 'Life Steal',
        description: 'Restore health',
        category: 'defensive',
        validTriggers: ['onKill', 'onHit', 'onCrit', 'onHeadshot'],
        baseChance: 0.1,
        baseDuration: 0,
        baseValue: 10,
        stackable: false,
        levelScaling: {
            valuePerLevel: 2
        }
    },
    explosion: {
        effect: 'explosion',
        name: 'Explosive',
        description: 'Cause an explosion',
        category: 'offensive',
        validTriggers: ['onKill', 'onCrit', 'onHeadshot', 'onLastShot'],
        baseChance: 0.15,
        baseCooldown: 5,
        baseValue: 50,
        stackable: false,
        levelScaling: {
            valuePerLevel: 10,
            cooldownReduction: 0.1
        }
    },
    instantKill: {
        effect: 'instantKill',
        name: 'Execute',
        description: 'Instantly kill target',
        category: 'offensive',
        validTriggers: ['onHeadshot', 'onCrit', 'onLowHealth'],
        baseChance: 0.01,
        baseCooldown: 30,
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.002,
            cooldownReduction: 0.5
        }
    },
    chainLightning: {
        effect: 'chainLightning',
        name: 'Chain Lightning',
        description: 'Lightning jumps between enemies',
        category: 'offensive',
        validTriggers: ['onHit', 'onCrit', 'onKill'],
        baseChance: 0.2,
        baseCooldown: 3,
        baseValue: 3, // number of jumps
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.5,
            chancePerLevel: 0.02
        }
    },
    ricochet: {
        effect: 'ricochet',
        name: 'Ricochet',
        description: 'Bullets bounce to nearby enemies',
        category: 'offensive',
        validTriggers: ['onHit', 'onCrit', 'onMiss'],
        baseChance: 0.25,
        baseValue: 1, // number of bounces
        stackable: true,
        maxStacks: 5,
        levelScaling: {
            chancePerLevel: 0.03
        }
    },
    bleed: {
        effect: 'bleed',
        name: 'Hemorrhage',
        description: 'Cause bleeding damage over time',
        category: 'offensive',
        validTriggers: ['onHit', 'onCrit', 'onMelee'],
        baseChance: 0.3,
        baseDuration: 5,
        baseValue: 5, // damage per second
        stackable: true,
        maxStacks: 10,
        levelScaling: {
            valuePerLevel: 1,
            chancePerLevel: 0.02
        }
    },
    pierce: {
        effect: 'pierce',
        name: 'Penetrate',
        description: 'Shot goes through enemies',
        category: 'offensive',
        validTriggers: ['onHit', 'onCrit', 'onHeadshot'],
        baseChance: 0.4,
        baseValue: 1, // enemies to pierce
        stackable: true,
        maxStacks: 3,
        levelScaling: {
            chancePerLevel: 0.03
        }
    },
    // ========== DEFENSIVE EFFECTS ==========
    shield: {
        effect: 'shield',
        name: 'Shield',
        description: 'Generate protective shield',
        category: 'defensive',
        validTriggers: ['onKill', 'onReload', 'onDamaged', 'onLowHealth'],
        baseChance: 0.15,
        baseDuration: 10,
        baseValue: 50, // shield points
        stackable: false,
        levelScaling: {
            valuePerLevel: 10,
            chancePerLevel: 0.01
        }
    },
    dodge: {
        effect: 'dodge',
        name: 'Evasion',
        description: 'Chance to dodge attacks',
        category: 'defensive',
        validTriggers: ['onDamaged', 'onLowHealth', 'onSprint'],
        baseChance: 0.2,
        baseDuration: 5,
        baseValue: 0.3, // dodge chance
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.02,
            chancePerLevel: 0.015
        }
    },
    regeneration: {
        effect: 'regeneration',
        name: 'Regeneration',
        description: 'Health regeneration over time',
        category: 'defensive',
        validTriggers: ['onKill', 'onLowHealth', 'onCrouch'],
        baseChance: 0.25,
        baseDuration: 10,
        baseValue: 2, // health per second
        stackable: true,
        maxStacks: 5,
        levelScaling: {
            valuePerLevel: 0.5
        }
    },
    damageReduction: {
        effect: 'damageReduction',
        name: 'Armor',
        description: 'Reduce incoming damage',
        category: 'defensive',
        validTriggers: ['onDamaged', 'onLowHealth', 'onBlock'],
        baseChance: 0.3,
        baseDuration: 5,
        baseValue: 0.2, // damage reduction %
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.02,
            chancePerLevel: 0.02
        }
    },
    // ========== UTILITY EFFECTS ==========
    speedBoost: {
        effect: 'speedBoost',
        name: 'Speed Boost',
        description: 'Increase movement speed',
        category: 'utility',
        validTriggers: ['onKill', 'onReload', 'onDodge', 'onSprint'],
        baseChance: 0.25,
        baseDuration: 5,
        baseValue: 0.3, // speed increase %
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.03,
            chancePerLevel: 0.02
        }
    },
    invisibility: {
        effect: 'invisibility',
        name: 'Cloak',
        description: 'Become invisible',
        category: 'utility',
        validTriggers: ['onKill', 'onCrouch', 'onReload'],
        baseChance: 0.1,
        baseDuration: 3,
        baseCooldown: 20,
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.01,
            cooldownReduction: 0.3
        }
    },
    ammoReturn: {
        effect: 'ammoReturn',
        name: 'Ammo Return',
        description: 'Return ammo to magazine',
        category: 'utility',
        validTriggers: ['onCrit', 'onHeadshot', 'onKill'],
        baseChance: 0.3,
        baseValue: 1, // bullets returned
        stackable: true,
        maxStacks: 10,
        levelScaling: {
            chancePerLevel: 0.03,
            valuePerLevel: 0.2
        }
    },
    instantReload: {
        effect: 'instantReload',
        name: 'Instant Reload',
        description: 'Instantly reload weapon',
        category: 'utility',
        validTriggers: ['onKill', 'onEmptyMag', 'onCrit'],
        baseChance: 0.15,
        baseCooldown: 10,
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.02,
            cooldownReduction: 0.2
        }
    },
    markTarget: {
        effect: 'markTarget',
        name: 'Mark Target',
        description: 'Mark enemies for bonus damage',
        category: 'utility',
        validTriggers: ['onHit', 'onFirstShot', 'onHeadshot'],
        baseChance: 0.35,
        baseDuration: 10,
        baseValue: 0.25, // damage bonus
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.03,
            chancePerLevel: 0.02
        }
    },
    // ========== SPECIAL EFFECTS ==========
    timeWarp: {
        effect: 'timeWarp',
        name: 'Time Warp',
        description: 'Slow down time',
        category: 'special',
        validTriggers: ['onCrit', 'onLowHealth', 'onHeadshot'],
        baseChance: 0.05,
        baseDuration: 3,
        baseCooldown: 30,
        baseValue: 0.5, // time scale
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.005,
            cooldownReduction: 0.5
        }
    },
    berserk: {
        effect: 'berserk',
        name: 'Berserk',
        description: 'Enter rage mode',
        category: 'special',
        validTriggers: ['onLowHealth', 'onKill', 'onMelee'],
        baseChance: 0.2,
        baseDuration: 10,
        baseCooldown: 20,
        baseValue: 0.5, // damage increase
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.05,
            chancePerLevel: 0.015
        }
    },
    summon: {
        effect: 'summon',
        name: 'Summon',
        description: 'Summon allies',
        category: 'special',
        validTriggers: ['onKill', 'onReload', 'onLowHealth'],
        baseChance: 0.1,
        baseCooldown: 30,
        baseValue: 'zombieDog', // entity to summon
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.01,
            cooldownReduction: 0.5
        }
    },
    teleport: {
        effect: 'teleport',
        name: 'Teleport',
        description: 'Teleport to target',
        category: 'special',
        validTriggers: ['onKill', 'onMelee', 'onDodge'],
        baseChance: 0.15,
        baseCooldown: 10,
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.01,
            cooldownReduction: 0.2
        }
    },
    blackHole: {
        effect: 'blackHole',
        name: 'Black Hole',
        description: 'Create gravity well',
        category: 'special',
        validTriggers: ['onKill', 'onCrit', 'onLastShot'],
        baseChance: 0.05,
        baseDuration: 5,
        baseCooldown: 45,
        baseValue: 10, // pull radius
        stackable: false,
        levelScaling: {
            chancePerLevel: 0.005,
            valuePerLevel: 1,
            cooldownReduction: 0.5
        }
    },
    duplicate: {
        effect: 'duplicate',
        name: 'Duplicate',
        description: 'Duplicate projectiles',
        category: 'special',
        validTriggers: ['onCrit', 'onFirstShot', 'onFullMag'],
        baseChance: 0.2,
        baseValue: 1, // extra projectiles
        stackable: true,
        maxStacks: 5,
        levelScaling: {
            chancePerLevel: 0.02
        }
    },
    vampiric: {
        effect: 'vampiric',
        name: 'Vampiric',
        description: 'Steal enemy stats',
        category: 'special',
        validTriggers: ['onKill', 'onCrit', 'onMelee'],
        baseChance: 0.15,
        baseDuration: 20,
        baseValue: 0.1, // stat steal %
        stackable: true,
        maxStacks: 10,
        levelScaling: {
            valuePerLevel: 0.01,
            chancePerLevel: 0.015
        }
    },
    // ========== ENVIRONMENTAL EFFECTS ==========
    bloodMoonPower: {
        effect: 'bloodMoonPower',
        name: 'Blood Moon Power',
        description: 'Power during blood moon',
        category: 'special',
        validTriggers: ['onBloodMoon'],
        baseChance: 1.0,
        baseDuration: -1, // lasts entire blood moon
        baseValue: 0.5, // damage bonus
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.05
        }
    },
    nightStalker: {
        effect: 'nightStalker',
        name: 'Night Stalker',
        description: 'Bonuses at night',
        category: 'special',
        validTriggers: ['onNightfall'],
        baseChance: 1.0,
        baseDuration: -1, // lasts entire night
        baseValue: 0.25, // stealth and damage bonus
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.03
        }
    },
    daybreaker: {
        effect: 'daybreaker',
        name: 'Daybreaker',
        description: 'Bonuses during day',
        category: 'special',
        validTriggers: ['onDaybreak'],
        baseChance: 1.0,
        baseDuration: -1, // lasts entire day
        baseValue: 0.2, // stamina and speed bonus
        stackable: false,
        levelScaling: {
            valuePerLevel: 0.02
        }
    }
};
// Generate random triggered effects for a weapon
function generateRandomTriggeredEffects(level, rarity, weaponType) {
    const effects = [];
    // Determine number of effects based on rarity
    let numEffects = 0;
    switch (rarity) {
        case 'common':
            numEffects = Math.random() < 0.1 ? 1 : 0;
            break;
        case 'uncommon':
            numEffects = Math.random() < 0.3 ? 1 : 0;
            break;
        case 'rare':
            numEffects = Math.random() < 0.6 ? 1 : Math.random() < 0.2 ? 2 : 0;
            break;
        case 'epic':
            numEffects = Math.random() < 0.8 ? 2 : 1;
            break;
        case 'legendary':
            numEffects = Math.random() < 0.5 ? 3 : 2;
            break;
        default: numEffects = 0;
    }
    const availableEffects = Object.values(exports.triggeredEffectTemplates);
    const selectedEffects = new Set();
    for (let i = 0; i < numEffects && availableEffects.length > 0; i++) {
        // Pick a random effect that hasn't been selected
        let effect;
        do {
            effect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
        } while (selectedEffects.has(effect.effect) && selectedEffects.size < availableEffects.length);
        selectedEffects.add(effect.effect);
        // Pick a valid trigger for this effect
        const trigger = effect.validTriggers[Math.floor(Math.random() * effect.validTriggers.length)];
        // Calculate scaled values
        const levelScaling = effect.levelScaling || {};
        const scaledChance = effect.baseChance + (levelScaling.chancePerLevel || 0) * level;
        const scaledValue = typeof effect.baseValue === 'number'
            ? effect.baseValue + (levelScaling.valuePerLevel || 0) * level
            : effect.baseValue;
        const scaledCooldown = effect.baseCooldown
            ? Math.max(1, effect.baseCooldown - (levelScaling.cooldownReduction || 0) * level)
            : undefined;
        effects.push({
            trigger,
            effect: effect.effect,
            chance: Math.min(1, scaledChance),
            cooldown: scaledCooldown,
            duration: effect.baseDuration,
            value: scaledValue,
            stackable: effect.stackable,
            maxStacks: effect.maxStacks,
            description: effect.description
        });
    }
    return effects;
}
// Get compatible triggers for a weapon type
function getCompatibleTriggers(weaponType) {
    const allTriggers = [
        'onKill', 'onHit', 'onCrit', 'onReload', 'onDamaged',
        'onLowHealth', 'onHeadshot', 'onMiss'
    ];
    // Add weapon-specific triggers
    if (weaponType === 'melee') {
        allTriggers.push('onMelee', 'onBlock');
    }
    else {
        allTriggers.push('onFirstShot', 'onLastShot', 'onEmptyMag', 'onFullMag');
    }
    // Add universal triggers
    allTriggers.push('onDodge', 'onSprint', 'onCrouch', 'onJump', 'onSwapWeapon', 'onNightfall', 'onDaybreak', 'onBloodMoon');
    return allTriggers;
}
//# sourceMappingURL=triggered-effects.js.map