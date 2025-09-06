using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace RPGOverhaul
{
    public class WeaponStatModifier
    {
        public string Source { get; set; }
        public string StatName { get; set; }
        public float BaseValue { get; set; }
        public float ModifierValue { get; set; }
        public string ModifierType { get; set; }
        public float FinalValue { get; set; }
        public string DisplayColor { get; set; } // Hex color string instead of Unity Color
        
        public string GetDisplayText()
        {
            switch (ModifierType?.ToLower())
            {
                case "percentage":
                    var sign = ModifierValue >= 0 ? "+" : "";
                    return $"{sign}{ModifierValue * 100:F0}%";
                case "flat":
                    var flatSign = ModifierValue >= 0 ? "+" : "";
                    return $"{flatSign}{ModifierValue:F1}";
                case "multiplier":
                    return $"×{ModifierValue:F2}";
                default:
                    return ModifierValue.ToString("F2");
            }
        }
    }

    public class WeaponStatCalculation
    {
        public string StatName { get; set; }
        public float BaseValue { get; set; }
        public float FinalValue { get; set; }
        public List<WeaponStatModifier> Modifiers { get; set; } = new List<WeaponStatModifier>();
        
        public string GetStatDisplayName()
        {
            switch (StatName)
            {
                case "EntityDamage": return "Damage";
                case "CritChance": return "Critical Chance";
                case "AttacksPerMinute": return "Fire Rate";
                case "Spread": return "Accuracy";
                case "MagazineSize": return "Magazine Size";
                case "ReloadTime": return "Reload Time";
                case "Recoil": return "Recoil";
                case "Range": return "Range";
                case "Noise": return "Noise Level";
                default: return StatName;
            }
        }

        public float GetImprovementPercentage()
        {
            if (BaseValue <= 0) return 0f;
            return ((FinalValue - BaseValue) / BaseValue) * 100f;
        }
    }

    public static class WeaponStatsCalculator
    {
        private static readonly string[] TrackedStats = {
            "EntityDamage", "CritChance", "AttacksPerMinute", "Spread", 
            "MagazineSize", "ReloadTime", "Recoil", "Range"
        };
        
        // Map AffixSystem stat names to item property names
        private static readonly Dictionary<string, string> AffixStatMappings = new Dictionary<string, string>
        {
            ["Damage"] = "EntityDamage",
            ["CritChance"] = "CritChance", 
            ["CritDamage"] = "CritDamage",
            ["Accuracy"] = "Spread",
            ["FireRate"] = "AttacksPerMinute",
            ["ReloadSpeed"] = "ReloadTime",
            ["Magazine"] = "MagazineSize",
            ["Range"] = "Range"
        };

        public static List<WeaponStatCalculation> CalculateWeaponStats(ItemValue weapon)
        {
            if (weapon == null)
            {
                Log.Warning("[RPG Overhaul] CalculateWeaponStats called with null weapon");
                return new List<WeaponStatCalculation>();
            }

            var calculations = new List<WeaponStatCalculation>();

            try
            {
                foreach (var statName in TrackedStats)
                {
                    var calculation = CalculateStatModifiers(weapon, statName);
                    if (calculation != null && (calculation.Modifiers.Count > 0 || calculation.BaseValue > 0))
                    {
                        calculations.Add(calculation);
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error calculating weapon stats: {ex.Message}");
            }

            return calculations;
        }

        private static WeaponStatCalculation CalculateStatModifiers(ItemValue weapon, string statName)
        {
            var calculation = new WeaponStatCalculation
            {
                StatName = statName,
                BaseValue = GetBaseStatFromItem(weapon, statName)
            };

            if (calculation.BaseValue <= 0)
                return null; // Skip stats that don't exist on this weapon

            var currentValue = calculation.BaseValue;

            try
            {
                // Layer 1: Manufacturer bonuses
                var manufacturer = weapon.GetPropertyOverride("Manufacturer", "");
                if (!string.IsNullOrEmpty(manufacturer))
                {
                    var manufacturerMod = GetManufacturerModifier(manufacturer, statName);
                    if (manufacturerMod != null)
                    {
                        manufacturerMod.Source = $"{manufacturer} Manufacturer";
                        manufacturerMod.DisplayColor = GetManufacturerColor(manufacturer);
                        calculation.Modifiers.Add(manufacturerMod);
                        currentValue = ApplyModifier(currentValue, manufacturerMod);
                    }
                }

                // Layer 2: Affix bonuses (prefixes and suffixes)
                ApplyAffixModifiers(weapon, calculation, ref currentValue);

                // Layer 3: Quality multiplier
                ApplyQualityModifier(weapon, calculation, ref currentValue);

                // Layer 4: Item level scaling
                ApplyItemLevelModifier(weapon, calculation, ref currentValue);

                // Layer 5: Weapon parts
                ApplyWeaponPartsModifiers(weapon, calculation, ref currentValue);

                // Layer 6: Mastery bonuses
                ApplyMasteryModifiers(weapon, calculation, ref currentValue);

                calculation.FinalValue = currentValue;
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error calculating {statName} modifiers: {ex.Message}");
                calculation.FinalValue = calculation.BaseValue; // Fallback to base value
            }

            return calculation;
        }

        private static float GetBaseStatFromItem(ItemValue weapon, string statName)
        {
            try
            {
                // Try to get the actual base stat from the item first
                var baseValue = weapon.GetPropertyOverride($"Base{statName}", "");
                if (!string.IsNullOrEmpty(baseValue) && float.TryParse(baseValue, out float parsed))
                {
                    return parsed;
                }

                // Fallback: Get current stat value (this includes all modifications)
                var currentValue = weapon.GetPropertyOverride(statName, "");
                if (!string.IsNullOrEmpty(currentValue) && float.TryParse(currentValue, out float current))
                {
                    // For now, use current value as base - in a perfect world we'd reverse-calculate
                    return current;
                }

                // Last resort: Use weapon class defaults
                return GetWeaponClassDefault(weapon.ItemClass, statName);
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error getting base stat {statName}: {ex.Message}");
                return 0f;
            }
        }

        private static float GetWeaponClassDefault(ItemClass itemClass, string statName)
        {
            if (itemClass == null) return 0f;

            try
            {
                // Try to get the stat from the item class properties
                var property = itemClass.Properties.GetValueOrDefault(statName);
                if (property != null && float.TryParse(property, out float value))
                {
                    return value;
                }
            }
            catch (Exception ex)
            {
                Log.Warning($"[RPG Overhaul] Could not get default for {statName}: {ex.Message}");
            }

            return 0f;
        }

        private static void ApplyAffixModifiers(ItemValue weapon, WeaponStatCalculation calculation, ref float currentValue)
        {
            // Process prefixes
            var prefixes = weapon.GetPropertyOverride("Prefixes", "");
            if (!string.IsNullOrEmpty(prefixes))
            {
                foreach (var prefix in prefixes.Split(','))
                {
                    var trimmedPrefix = prefix.Trim();
                    if (string.IsNullOrEmpty(trimmedPrefix)) continue;

                    var prefixMod = GetAffixModifierFromDatabase(trimmedPrefix, calculation.StatName);
                    if (prefixMod != null)
                    {
                        prefixMod.Source = $"{trimmedPrefix} (Prefix)";
                        prefixMod.DisplayColor = "#00FFFF"; // Cyan
                        calculation.Modifiers.Add(prefixMod);
                        currentValue = ApplyModifier(currentValue, prefixMod);
                    }
                }
            }

            // Process suffixes
            var suffixes = weapon.GetPropertyOverride("Suffixes", "");
            if (!string.IsNullOrEmpty(suffixes))
            {
                foreach (var suffix in suffixes.Split(','))
                {
                    var trimmedSuffix = suffix.Trim();
                    if (string.IsNullOrEmpty(trimmedSuffix)) continue;

                    var suffixMod = GetAffixModifierFromDatabase(trimmedSuffix, calculation.StatName);
                    if (suffixMod != null)
                    {
                        suffixMod.Source = $"{trimmedSuffix} (Suffix)";
                        suffixMod.DisplayColor = "#FF00FF"; // Magenta
                        calculation.Modifiers.Add(suffixMod);
                        currentValue = ApplyModifier(currentValue, suffixMod);
                    }
                }
            }
        }

        private static void ApplyQualityModifier(ItemValue weapon, WeaponStatCalculation calculation, ref float currentValue)
        {
            var qualityStr = weapon.GetPropertyOverride("Quality", "1");
            if (int.TryParse(qualityStr, out int quality) && quality > 1)
            {
                var qualityMultiplier = GetQualityMultiplier(quality, calculation.StatName);
                if (Math.Abs(qualityMultiplier - 1.0f) > 0.001f) // Only add if significant
                {
                    var qualityMod = new WeaponStatModifier
                    {
                        Source = $"Quality {quality}",
                        StatName = calculation.StatName,
                        BaseValue = currentValue,
                        ModifierValue = qualityMultiplier,
                        ModifierType = "multiplier",
                        DisplayColor = GetQualityColor(quality)
                    };
                    calculation.Modifiers.Add(qualityMod);
                    currentValue = ApplyModifier(currentValue, qualityMod);
                }
            }
        }

        private static void ApplyItemLevelModifier(ItemValue weapon, WeaponStatCalculation calculation, ref float currentValue)
        {
            var itemLevelStr = weapon.GetPropertyOverride("ItemLevel", "1");
            if (int.TryParse(itemLevelStr, out int itemLevel) && itemLevel > 1)
            {
                var levelMultiplier = GetItemLevelMultiplier(itemLevel, calculation.StatName);
                if (Math.Abs(levelMultiplier - 1.0f) > 0.001f)
                {
                    var levelMod = new WeaponStatModifier
                    {
                        Source = $"Item Level {itemLevel}",
                        StatName = calculation.StatName,
                        BaseValue = currentValue,
                        ModifierValue = levelMultiplier,
                        ModifierType = "multiplier",
                        DisplayColor = "#FFFF00" // Yellow
                    };
                    calculation.Modifiers.Add(levelMod);
                    currentValue = ApplyModifier(currentValue, levelMod);
                }
            }
        }

        private static void ApplyWeaponPartsModifiers(ItemValue weapon, WeaponStatCalculation calculation, ref float currentValue)
        {
            for (int i = 0; i < 8; i++)
            {
                var partName = weapon.GetPropertyOverride($"Part{i}_Name", "");
                if (string.IsNullOrEmpty(partName)) continue;

                var partMod = GetWeaponPartModifier(partName, calculation.StatName);
                if (partMod != null)
                {
                    var partTier = weapon.GetPropertyOverride($"Part{i}_Tier", "Basic");
                    partMod.Source = $"{partName} ({partTier})";
                    partMod.DisplayColor = GetTierColor(partTier);
                    calculation.Modifiers.Add(partMod);
                    currentValue = ApplyModifier(currentValue, partMod);
                }
            }
        }

        private static void ApplyMasteryModifiers(ItemValue weapon, WeaponStatCalculation calculation, ref float currentValue)
        {
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player == null) return;

                var weaponClass = weapon.GetPropertyOverride("WeaponClass", "");
                if (string.IsNullOrEmpty(weaponClass)) return;

                var masteryLevel = MasterySystem.GetMasteryLevel(player.entityId.ToString(), weaponClass);
                if (masteryLevel > 0)
                {
                    var masteryMod = GetMasteryModifier(weaponClass, masteryLevel, calculation.StatName);
                    if (masteryMod != null)
                    {
                        masteryMod.Source = $"Mastery Lv.{masteryLevel}";
                        masteryMod.DisplayColor = "#00FF00"; // Green
                        calculation.Modifiers.Add(masteryMod);
                        currentValue = ApplyModifier(currentValue, masteryMod);
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Warning($"[RPG Overhaul] Error applying mastery modifiers: {ex.Message}");
            }
        }

        private static float ApplyModifier(float currentValue, WeaponStatModifier modifier)
        {
            switch (modifier.ModifierType?.ToLower())
            {
                case "percentage":
                    return currentValue * (1f + modifier.ModifierValue);
                case "flat":
                    return currentValue + modifier.ModifierValue;
                case "multiplier":
                    return currentValue * modifier.ModifierValue;
                default:
                    Log.Warning($"[RPG Overhaul] Unknown modifier type: {modifier.ModifierType}");
                    return currentValue;
            }
        }

        // Modifier lookup methods
        private static WeaponStatModifier GetManufacturerModifier(string manufacturer, string statName)
        {
            var modifiers = GetManufacturerModifiers();
            if (modifiers.TryGetValue(manufacturer, out var manufacturerMods) && 
                manufacturerMods.TryGetValue(statName, out var modifier))
            {
                return new WeaponStatModifier
                {
                    StatName = statName,
                    ModifierValue = modifier.value,
                    ModifierType = modifier.type
                };
            }
            return null;
        }

        private static WeaponStatModifier GetAffixModifierFromDatabase(string affixName, string statName)
        {
            try
            {
                // Try to use the actual AffixSystem database
                var affix = AffixSystem.GetAffix(affixName);
                if (affix != null)
                {
                    // Check if this affix affects the requested stat (with mapping)
                    if (AffixStatMappings.TryGetValue(affix.Stat, out string mappedStat) && 
                        mappedStat.Equals(statName, StringComparison.OrdinalIgnoreCase))
                    {
                        var modifierType = ConvertAffixOperationToModifierType(affix.Operation);
                        var value = affix.Value > 0 ? affix.Value : UnityEngine.Random.Range(affix.MinValue, affix.MaxValue);
                        
                        return new WeaponStatModifier
                        {
                            StatName = statName,
                            ModifierValue = value,
                            ModifierType = modifierType
                        };
                    }
                    // Direct match without mapping
                    else if (affix.Stat.Equals(statName, StringComparison.OrdinalIgnoreCase))
                    {
                        var modifierType = ConvertAffixOperationToModifierType(affix.Operation);
                        var value = affix.Value > 0 ? affix.Value : UnityEngine.Random.Range(affix.MinValue, affix.MaxValue);
                        
                        return new WeaponStatModifier
                        {
                            StatName = statName,
                            ModifierValue = value,
                            ModifierType = modifierType
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Warning($"[RPG Overhaul] Error accessing AffixSystem for {affixName}: {ex.Message}");
            }

            // Fallback to hardcoded values
            return GetHardcodedAffixModifier(affixName, statName);
        }
        
        private static string ConvertAffixOperationToModifierType(string operation)
        {
            switch (operation?.ToLower())
            {
                case "perc_add": 
                case "perc_subtract": 
                    return "percentage";
                case "base_add": 
                    return "flat";
                case "multiply": 
                    return "multiplier";
                default: 
                    return "percentage"; // Default fallback
            }
        }

        private static WeaponStatModifier GetHardcodedAffixModifier(string affixName, string statName)
        {
            var affixMods = new Dictionary<string, Dictionary<string, (float value, string type)>>
            {
                ["Brutal"] = new Dictionary<string, (float, string)>
                {
                    ["EntityDamage"] = (0.25f, "percentage")
                },
                ["Vicious"] = new Dictionary<string, (float, string)>
                {
                    ["EntityDamage"] = (0.35f, "percentage")
                },
                ["Precise"] = new Dictionary<string, (float, string)>
                {
                    ["Spread"] = (-0.15f, "percentage") // Better accuracy = lower spread
                },
                ["Keen"] = new Dictionary<string, (float, string)>
                {
                    ["CritChance"] = (0.05f, "flat")
                }
            };

            if (affixMods.TryGetValue(affixName, out var affixModifiers) && 
                affixModifiers.TryGetValue(statName, out var modifier))
            {
                return new WeaponStatModifier
                {
                    StatName = statName,
                    ModifierValue = modifier.value,
                    ModifierType = modifier.type
                };
            }
            return null;
        }

        private static WeaponStatModifier GetWeaponPartModifier(string partName, string statName)
        {
            // Use WeaponPartsSystem if available, otherwise fallback
            var partMods = new Dictionary<string, Dictionary<string, (float value, string type)>>
            {
                ["Heavy Barrel"] = new Dictionary<string, (float, string)>
                {
                    ["EntityDamage"] = (0.10f, "percentage"),
                    ["Recoil"] = (0.15f, "percentage")
                },
                ["Extended Magazine"] = new Dictionary<string, (float, string)>
                {
                    ["MagazineSize"] = (0.50f, "percentage"),
                    ["ReloadTime"] = (0.20f, "percentage")
                }
            };

            if (partMods.TryGetValue(partName, out var partModifiers) && 
                partModifiers.TryGetValue(statName, out var modifier))
            {
                return new WeaponStatModifier
                {
                    StatName = statName,
                    ModifierValue = modifier.value,
                    ModifierType = modifier.type
                };
            }
            return null;
        }

        private static WeaponStatModifier GetMasteryModifier(string weaponClass, int masteryLevel, string statName)
        {
            var bonusPerLevel = GetMasteryBonusForStat(weaponClass, statName);
            if (bonusPerLevel > 0)
            {
                return new WeaponStatModifier
                {
                    StatName = statName,
                    ModifierValue = bonusPerLevel * masteryLevel,
                    ModifierType = "percentage"
                };
            }
            return null;
        }

        // Data lookup methods
        private static Dictionary<string, Dictionary<string, (float value, string type)>> GetManufacturerModifiers()
        {
            return new Dictionary<string, Dictionary<string, (float value, string type)>>
            {
                ["Jakobs"] = new Dictionary<string, (float, string)>
                {
                    ["EntityDamage"] = (0.20f, "percentage"),
                    ["AttacksPerMinute"] = (-0.10f, "percentage"),
                    ["CritChance"] = (0.15f, "flat")
                },
                ["Tediore"] = new Dictionary<string, (float, string)>
                {
                    ["ReloadTime"] = (-0.25f, "percentage"),
                    ["MagazineSize"] = (0.15f, "percentage")
                },
                ["Maliwan"] = new Dictionary<string, (float, string)>
                {
                    ["EntityDamage"] = (0.15f, "percentage"), // Elemental focus
                    ["AttacksPerMinute"] = (-0.15f, "percentage")
                }
            };
        }

        private static float GetQualityMultiplier(int quality, string statName)
        {
            // Scale quality impact based on stat type
            var baseMultiplier = 1.0f + (quality / 100f * 0.08f); // 8% per 100 quality
            
            // Some stats scale differently
            switch (statName)
            {
                case "ReloadTime":
                case "Recoil":
                case "Spread":
                    // For "lower is better" stats, invert the bonus
                    return 2.0f - baseMultiplier;
                default:
                    return baseMultiplier;
            }
        }

        private static float GetItemLevelMultiplier(int itemLevel, string statName)
        {
            return 1.0f + (itemLevel / 50f * 0.04f); // 4% per 50 levels
        }

        private static float GetMasteryBonusForStat(string weaponClass, string statName)
        {
            var masteryBonuses = new Dictionary<string, Dictionary<string, float>>
            {
                ["rifle"] = new Dictionary<string, float>
                {
                    ["EntityDamage"] = 0.02f, // 2% per level
                    ["Spread"] = -0.015f     // Better accuracy
                },
                ["pistol"] = new Dictionary<string, float>
                {
                    ["AttacksPerMinute"] = 0.015f,
                    ["CritChance"] = 0.01f
                }
            };

            if (masteryBonuses.TryGetValue(weaponClass.ToLower(), out var classBonuses) &&
                classBonuses.TryGetValue(statName, out var bonus))
            {
                return Math.Abs(bonus); // Return absolute value, sign handled in modifier type
            }

            return 0f;
        }

        // Color methods
        private static string GetManufacturerColor(string manufacturer)
        {
            switch (manufacturer.ToLower())
            {
                case "jakobs": return "#D2691E"; // SaddleBrown
                case "tediore": return "#4169E1"; // RoyalBlue  
                case "maliwan": return "#8A2BE2"; // BlueViolet
                case "vladof": return "#DC143C";  // Crimson
                case "hyperion": return "#FFD700"; // Gold
                default: return "#FFFFFF"; // White
            }
        }

        private static string GetQualityColor(int quality)
        {
            if (quality < 100) return "#808080";      // Gray - Poor
            if (quality < 200) return "#FFFFFF";      // White - Common
            if (quality < 300) return "#00FF00";      // Green - Uncommon
            if (quality < 400) return "#0080FF";      // Blue - Rare
            if (quality < 500) return "#8000FF";      // Purple - Epic
            return "#FF8000";                         // Orange - Legendary
        }

        private static string GetTierColor(string tier)
        {
            switch (tier.ToLower())
            {
                case "basic": return "#808080";       // Gray
                case "advanced": return "#00FF00";    // Green
                case "master": return "#0080FF";      // Blue
                case "legendary": return "#FF8000";   // Orange
                default: return "#FFFFFF";            // White
            }
        }

        // Utility method for formatting stats display
        public static string FormatStatComparison(WeaponStatCalculation calc)
        {
            if (calc == null) return "";

            var improvement = calc.GetImprovementPercentage();
            var color = improvement > 0 ? "#00FF00" : (improvement < 0 ? "#FF0000" : "#FFFFFF");
            
            var result = $"<color=#FFFFFF>{calc.GetStatDisplayName()}:</color> ";
            result += $"<color=#CCCCCC>{calc.BaseValue:F1}</color>";
            
            if (Math.Abs(improvement) > 1f) // Only show if >1% change
            {
                result += $" → <color={color}>{calc.FinalValue:F1}</color>";
                result += $" <color={color}>({improvement:+F0}%)</color>";
            }

            return result;
        }
    }
}