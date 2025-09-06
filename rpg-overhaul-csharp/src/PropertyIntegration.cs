using System;
using UnityEngine;

namespace RPGOverhaul
{
    /// <summary>
    /// Handles integration between TypeScript-generated XML properties and C# runtime
    /// Provides the bridge between XML data and game mechanics
    /// </summary>
    public static class PropertyIntegration
    {
        private static bool initialized = false;

        public static void Initialize()
        {
            if (initialized) return;
            
            UnityEngine.Debug.Log("[RPG Overhaul] Property Integration initialized");
            initialized = true;
        }

        /// <summary>
        /// Reads and processes all RPG properties from a weapon
        /// This is the main entry point for XML-to-runtime integration
        /// </summary>
        public static void ProcessWeapon(ItemValue weapon)
        {
            if (weapon == null) return;

            try
            {
                // Read and log elemental damage properties
                var elementalType = weapon.GetPropertyOverride("ElementalDamageType", "");
                var elementalDamage = weapon.GetPropertyOverride("ElementalDamage", "0");
                if (!string.IsNullOrEmpty(elementalType))
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] Weapon has {elementalType} damage: {elementalDamage}");
                }

                // Read affix properties (comma-separated from TypeScript)
                var prefixes = weapon.GetPropertyOverride("Prefixes", "");
                var suffixes = weapon.GetPropertyOverride("Suffixes", "");
                if (!string.IsNullOrEmpty(prefixes))
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] Weapon prefixes: {prefixes}");
                }
                if (!string.IsNullOrEmpty(suffixes))
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] Weapon suffixes: {suffixes}");
                }

                // Read weapon parts
                for (int i = 0; i < 8; i++) // TypeScript generates 8 weapon part slots
                {
                    var partSlot = weapon.GetPropertyOverride($"Part{i}_Slot", "");
                    var partName = weapon.GetPropertyOverride($"Part{i}_Name", "");
                    if (string.IsNullOrEmpty(partSlot)) break;
                    
                    UnityEngine.Debug.Log($"[RPG Overhaul] Weapon part {i}: {partSlot} = {partName}");
                }

                // Read triggered effects
                for (int i = 0; i < 10; i++)
                {
                    var trigger = weapon.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                    var effect = weapon.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                    if (string.IsNullOrEmpty(trigger)) break;
                    
                    UnityEngine.Debug.Log($"[RPG Overhaul] Triggered effect {i}: {trigger} -> {effect}");
                }

                // Read mastery requirement
                var masteryReq = weapon.GetPropertyOverride("MasteryRequirement", "0");
                if (masteryReq != "0")
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] Mastery requirement: {masteryReq}");
                }

                // Apply weapon parts and synergies
                WeaponPartsSystem.ApplyParts(weapon);

                // Apply mastery bonuses
                MasterySystem.ApplyMasteryBonuses(weapon);

                // Apply affixes last (they should have highest priority)
                AffixSystem.ApplyAffixes(weapon);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Error processing weapon: {ex.Message}");
            }
        }

        /// <summary>
        /// Calculates elemental damage modifier based on weapon properties
        /// </summary>
        public static float GetElementalDamageModifier(ItemValue weapon, EntityAlive target)
        {
            if (weapon == null || target == null) return 1.0f;

            var elementalType = weapon.GetPropertyOverride("ElementalDamageType", "");
            var elementalDamage = weapon.GetPropertyOverride("ElementalDamage", "0");
            
            if (string.IsNullOrEmpty(elementalType)) return 1.0f;
            
            if (float.TryParse(elementalDamage, out float damage) && damage > 0)
            {
                // Apply elemental damage bonus based on type
                switch (elementalType.ToLower())
                {
                    case "fire":
                    case "heat":
                        return 1.0f + (damage / 100f); // Fire does full percentage damage
                    case "ice":
                    case "cold":
                        return 1.0f + (damage / 150f); // Ice is slightly weaker but can slow
                    case "electric":
                        return 1.0f + (damage / 120f); // Electric can chain/stun
                    case "poison":
                        return 1.0f + (damage / 200f); // Poison is DoT style, less immediate
                    case "radiation":
                        return 1.0f + (damage / 180f); // Radiation has lasting effects
                    case "explosive":
                        return 1.0f + (damage / 80f);  // Explosive does more immediate damage
                    case "bleeding":
                        return 1.0f + (damage / 160f); // Bleeding is DoT
                    case "void":
                        return 1.0f + (damage / 90f);  // Void bypasses some defenses
                    default:
                        return 1.0f + (damage / 100f);
                }
            }

            return 1.0f;
        }

        /// <summary>
        /// Checks if a trigger should activate and applies effects
        /// </summary>
        public static bool CheckTrigger(ItemValue weapon, string triggerType, EntityAlive attacker = null, EntityAlive target = null)
        {
            if (weapon == null) return false;

            for (int i = 0; i < 10; i++)
            {
                var trigger = weapon.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                var chance = weapon.GetPropertyOverride($"TriggeredEffect{i}_Chance", "0");
                
                if (string.IsNullOrEmpty(trigger)) break;
                
                if (trigger.Equals(triggerType, StringComparison.OrdinalIgnoreCase))
                {
                    if (float.TryParse(chance, out float chanceValue) && chanceValue > 0)
                    {
                        if (UnityEngine.Random.value < chanceValue)
                        {
                            var effect = weapon.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                            var power = weapon.GetPropertyOverride($"TriggeredEffect{i}_Power", "1");
                            
                            UnityEngine.Debug.Log($"[RPG Overhaul] Triggered {effect} (power: {power}) from {trigger}!");
                            
                            // Use the TriggeredEffectsSystem for proper effect application
                            TriggeredEffectsSystem.ApplyTriggeredEffect(effect, power, attacker, target);
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// Applies a triggered effect (simplified implementation)
        /// </summary>
        private static void ApplyTriggeredEffect(string effect, string power)
        {
            // Simple effect application - can be expanded later
            switch (effect.ToLower())
            {
                case "heal":
                    UnityEngine.Debug.Log($"[RPG Overhaul] Applied heal effect (power: {power})");
                    break;
                case "damage":
                    UnityEngine.Debug.Log($"[RPG Overhaul] Applied damage effect (power: {power})");
                    break;
                case "stun":
                    UnityEngine.Debug.Log($"[RPG Overhaul] Applied stun effect (power: {power})");
                    break;
                case "speed":
                    UnityEngine.Debug.Log($"[RPG Overhaul] Applied speed effect (power: {power})");
                    break;
                default:
                    UnityEngine.Debug.Log($"[RPG Overhaul] Applied unknown effect: {effect} (power: {power})");
                    break;
            }
        }

        /// <summary>
        /// Gets comma-separated affixes and returns them as an array
        /// </summary>
        public static string[] GetAffixes(ItemValue weapon, string affixType)
        {
            if (weapon == null) return new string[0];

            var affixString = weapon.GetPropertyOverride(affixType, "");
            if (string.IsNullOrEmpty(affixString))
                return new string[0];

            return affixString.Split(',');
        }

        /// <summary>
        /// Checks if weapon has a specific affix
        /// </summary>
        public static bool HasAffix(ItemValue weapon, string affixName)
        {
            var prefixes = GetAffixes(weapon, "Prefixes");
            var suffixes = GetAffixes(weapon, "Suffixes");

            foreach (var prefix in prefixes)
            {
                if (prefix.Trim().Equals(affixName, StringComparison.OrdinalIgnoreCase))
                    return true;
            }

            foreach (var suffix in suffixes)
            {
                if (suffix.Trim().Equals(affixName, StringComparison.OrdinalIgnoreCase))
                    return true;
            }

            return false;
        }
    }
}