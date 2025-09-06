"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rarityTiers = exports.manufacturers = void 0;
exports.manufacturers = {
    // Military Grade Manufacturers
    MilSpec: {
        name: 'MilSpec',
        tier: 'uncommon',
        specialization: ['weapons', 'armor', 'tactical'],
        statModifiers: {
            durability: 0.15,
            damage: 0.1,
            accuracy: 0.05
        },
        description: 'Military specification equipment with enhanced durability'
    },
    TactiCool: {
        name: 'TactiCool',
        tier: 'rare',
        specialization: ['weapons', 'mods'],
        statModifiers: {
            reloadSpeed: 0.2,
            aimSpeed: 0.15,
            magazineSize: 0.1
        },
        description: 'Tactical equipment focused on operational efficiency'
    },
    // Survival & Craftsmanship
    Handmade: {
        name: 'Handmade',
        tier: 'common',
        specialization: ['tools', 'melee', 'basic'],
        statModifiers: {
            durability: -0.1,
            repairability: 0.2,
            craftingSpeed: 0.15
        },
        description: 'Handcrafted items that are easy to repair and modify'
    },
    Improvised: {
        name: 'Improvised',
        tier: 'common',
        specialization: ['tools', 'weapons', 'basic'],
        statModifiers: {
            durability: -0.2,
            damage: -0.1,
            economicValue: -0.3
        },
        description: 'Makeshift equipment cobbled together from scrap'
    },
    // High-Tech Manufacturers
    Bandit: {
        name: 'Bandit',
        tier: 'epic',
        specialization: ['weapons', 'explosives'],
        statModifiers: {
            damage: 0.25,
            fireRate: 0.15,
            accuracy: -0.1
        },
        description: 'High damage weapons with aggressive modifications'
    },
    Jakobs: {
        name: 'Jakobs',
        tier: 'rare',
        specialization: ['weapons', 'precision'],
        statModifiers: {
            damage: 0.2,
            accuracy: 0.15,
            criticalChance: 0.1
        },
        description: 'Precision firearms with exceptional stopping power'
    },
    Hyperion: {
        name: 'Hyperion',
        tier: 'epic',
        specialization: ['weapons', 'shields', 'tech'],
        statModifiers: {
            accuracy: 0.3,
            stability: 0.25,
            shieldCapacity: 0.2
        },
        description: 'High-tech equipment with superior accuracy systems'
    },
    // Specialty Manufacturers
    Dahl: {
        name: 'Dahl',
        tier: 'uncommon',
        specialization: ['weapons', 'military'],
        statModifiers: {
            burstFireRate: 0.3,
            stability: 0.15,
            recoil: -0.2
        },
        description: 'Military contractor specializing in burst-fire weapons'
    },
    Tediore: {
        name: 'Tediore',
        tier: 'common',
        specialization: ['weapons', 'disposable'],
        statModifiers: {
            reloadSpeed: 0.4,
            durability: -0.15,
            economicValue: -0.2
        },
        description: 'Disposable weapons with unique reload mechanics'
    },
    Maliwan: {
        name: 'Maliwan',
        tier: 'rare',
        specialization: ['weapons', 'elemental'],
        statModifiers: {
            elementalDamage: 0.35,
            elementalChance: 0.25,
            damage: -0.1
        },
        description: 'Elemental weapons manufacturer'
    },
    Vladof: {
        name: 'Vladof',
        tier: 'uncommon',
        specialization: ['weapons', 'automatic'],
        statModifiers: {
            fireRate: 0.35,
            magazineSize: 0.25,
            accuracy: -0.15
        },
        description: 'High fire-rate automatic weapons'
    },
    // Legendary Tier
    Pearlescent: {
        name: 'Pearlescent',
        tier: 'legendary',
        specialization: ['weapons', 'unique'],
        statModifiers: {
            allStats: 0.15,
            damage: 0.3,
            durability: 0.3,
            criticalChance: 0.2
        },
        description: 'Ultra-rare manufacturer producing legendary equipment'
    }
};
exports.rarityTiers = {
    common: {
        color: '#FFFFFF',
        statMultiplier: 1.0,
        modSlots: 1,
        dropChance: 0.6
    },
    uncommon: {
        color: '#00FF00',
        statMultiplier: 1.15,
        modSlots: 2,
        dropChance: 0.25
    },
    rare: {
        color: '#0080FF',
        statMultiplier: 1.3,
        modSlots: 3,
        dropChance: 0.1
    },
    epic: {
        color: '#9932CC',
        statMultiplier: 1.5,
        modSlots: 4,
        dropChance: 0.04
    },
    legendary: {
        color: '#FF8C00',
        statMultiplier: 1.75,
        modSlots: 5,
        dropChance: 0.01
    }
};
//# sourceMappingURL=manufacturers.js.map