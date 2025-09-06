/**
 * Weapon Base Stats Database
 * 
 * Defines base statistics for all weapon types and classes
 */

import { 
  WeaponTemplate, 
  WeaponClass, 
  WeaponBaseStats,
  getWeaponTemplate as getTemplate, 
  calculateTemplateStats as calcTemplateStats 
} from './weapon-templates';

// Re-export for backward compatibility
export { 
  WeaponTemplate, 
  WeaponClass, 
  WeaponBaseStats,
  getTemplate as getWeaponTemplate 
};

// Base stats for each weapon class
export const weaponClassStats: Record<WeaponClass, WeaponBaseStats> = {
  pistol: {
    damage: 25,
    fireRate: 2.0,
    accuracy: 0.85,
    range: 50,
    magazineSize: 12,
    reloadSpeed: 2.0,
    durability: 1000,
    staminaLoss: 5,
    criticalChance: 0.05,
    criticalDamage: 2.0,
    dismemberChance: 0.05,
    penetration: 1,
    spread: 0.02,
    recoil: 0.1,
    weight: 2
  },
  
  rifle: {
    damage: 45,
    fireRate: 1.2,
    accuracy: 0.9,
    range: 100,
    magazineSize: 30,
    reloadSpeed: 2.5,
    durability: 1500,
    staminaLoss: 8,
    criticalChance: 0.1,
    criticalDamage: 2.5,
    dismemberChance: 0.15,
    penetration: 2,
    spread: 0.015,
    recoil: 0.15,
    weight: 4
  },
  
  shotgun: {
    damage: 80,
    fireRate: 0.8,
    accuracy: 0.6,
    range: 20,
    magazineSize: 8,
    reloadSpeed: 3.0,
    durability: 1200,
    staminaLoss: 12,
    criticalChance: 0.08,
    criticalDamage: 1.8,
    dismemberChance: 0.3,
    penetration: 0,
    spread: 0.1,
    recoil: 0.3,
    weight: 5
  },
  
  sniper: {
    damage: 120,
    fireRate: 0.5,
    accuracy: 0.98,
    range: 200,
    magazineSize: 5,
    reloadSpeed: 3.5,
    durability: 1800,
    staminaLoss: 10,
    criticalChance: 0.15,
    criticalDamage: 3.0,
    dismemberChance: 0.2,
    penetration: 5,
    spread: 0.005,
    recoil: 0.25,
    weight: 6
  },
  
  smg: {
    damage: 18,
    fireRate: 10,
    accuracy: 0.7,
    range: 60,
    magazineSize: 40,
    reloadSpeed: 2.2,
    durability: 800,
    staminaLoss: 6,
    criticalChance: 0.06,
    criticalDamage: 1.8,
    dismemberChance: 0.08,
    penetration: 1,
    spread: 0.04,
    recoil: 0.08,
    weight: 3
  },
  
  automatic: {
    damage: 35,
    fireRate: 8,
    accuracy: 0.75,
    range: 80,
    magazineSize: 60,
    reloadSpeed: 3.0,
    durability: 1200,
    staminaLoss: 10,
    criticalChance: 0.08,
    criticalDamage: 2.0,
    dismemberChance: 0.12,
    penetration: 2,
    spread: 0.03,
    recoil: 0.12,
    weight: 5
  },
  
  launcher: {
    damage: 300,
    fireRate: 0.3,
    accuracy: 0.8,
    range: 150,
    magazineSize: 1,
    reloadSpeed: 5.0,
    durability: 500,
    staminaLoss: 20,
    criticalChance: 0.01,
    criticalDamage: 1.5,
    dismemberChance: 0.5,
    penetration: 10,
    spread: 0.05,
    recoil: 0.5,
    weight: 10
  },
  
  melee: {
    damage: 30,
    fireRate: 1.5,
    accuracy: 1.0,
    range: 2,
    magazineSize: 0,
    reloadSpeed: 0,
    durability: 800,
    staminaLoss: 15,
    criticalChance: 0.1,
    criticalDamage: 2.5,
    dismemberChance: 0.25,
    penetration: 0,
    spread: 0,
    recoil: 0,
    weight: 3
  },
  
  bow: {
    damage: 40,
    fireRate: 1.0,
    accuracy: 0.9,
    range: 80,
    magazineSize: 1,
    reloadSpeed: 1.5,
    durability: 600,
    staminaLoss: 10,
    criticalChance: 0.15,
    criticalDamage: 2.5,
    dismemberChance: 0.18,
    penetration: 2,
    spread: 0.02,
    recoil: 0,
    weight: 2
  },
  
  crossbow: {
    damage: 60,
    fireRate: 0.5,
    accuracy: 0.95,
    range: 90,
    magazineSize: 1,
    reloadSpeed: 2.5,
    durability: 800,
    staminaLoss: 8,
    criticalChance: 0.2,
    criticalDamage: 2.8,
    dismemberChance: 0.25,
    penetration: 3,
    spread: 0.01,
    recoil: 0.05,
    weight: 4
  },
  
  special: {
    damage: 50,
    fireRate: 1.0,
    accuracy: 0.8,
    range: 75,
    magazineSize: 20,
    reloadSpeed: 3.0,
    durability: 1000,
    staminaLoss: 10,
    criticalChance: 0.1,
    criticalDamage: 2.0,
    dismemberChance: 0.15,
    penetration: 2,
    spread: 0.025,
    recoil: 0.15,
    weight: 5
  }
};

// Get base stats for a weapon class
export function getWeaponClassStats(weaponClass: WeaponClass): WeaponBaseStats {
  return { ...weaponClassStats[weaponClass] };
}

// Calculate final base stats for a weapon template
export function calculateTemplateStats(template: WeaponTemplate): WeaponBaseStats {
  const baseStats = getWeaponClassStats(template.weaponClass);
  return calcTemplateStats(template, baseStats);
}