using System;
using System.Collections.Generic;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public enum PartSlot
    {
        Barrel,
        Trigger,
        Stock,
        Magazine,
        Scope,
        Grip,
        Muzzle,
        Underbarrel
    }

    public enum PartTier
    {
        Basic,
        Advanced,
        Master,
        Legendary
    }

    public class WeaponPart
    {
        public string Name { get; set; }
        public PartSlot Slot { get; set; }
        public PartTier Tier { get; set; }
        public Dictionary<string, float> StatModifiers { get; set; }
        public string SpecialEffect { get; set; }
        public List<string> Synergies { get; set; }

        public WeaponPart()
        {
            StatModifiers = new Dictionary<string, float>();
            Synergies = new List<string>();
        }
    }

    public static class WeaponPartsSystem
    {
        private static readonly Dictionary<string, WeaponPart> PartDatabase = new Dictionary<string, WeaponPart>();

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Weapon Parts System");
            LoadPartDatabase();
        }

        private static void LoadPartDatabase()
        {
            // This would typically load from the generated XML files
            CreateDefaultParts();
        }

        private static void CreateDefaultParts()
        {
            // Barrel parts
            var heavyBarrel = new WeaponPart
            {
                Name = "Heavy Barrel",
                Slot = PartSlot.Barrel,
                Tier = PartTier.Advanced,
                SpecialEffect = "Stability"
            };
            heavyBarrel.StatModifiers["Damage"] = 0.10f;
            heavyBarrel.StatModifiers["Recoil"] = 0.15f;
            heavyBarrel.StatModifiers["Weight"] = 0.20f;
            heavyBarrel.StatModifiers["Accuracy"] = 0.10f;
            PartDatabase["Heavy Barrel"] = heavyBarrel;

            var whisperBarrel = new WeaponPart
            {
                Name = "Whisper Barrel",
                Slot = PartSlot.Barrel,
                Tier = PartTier.Master,
                SpecialEffect = "Silent"
            };
            whisperBarrel.StatModifiers["Damage"] = -0.10f;
            whisperBarrel.StatModifiers["Noise"] = -0.80f;
            whisperBarrel.StatModifiers["CritChance"] = 0.05f;
            PartDatabase["Whisper Barrel"] = whisperBarrel;

            // Trigger parts
            var hairTrigger = new WeaponPart
            {
                Name = "Hair Trigger",
                Slot = PartSlot.Trigger,
                Tier = PartTier.Basic,
                SpecialEffect = "FastAction"
            };
            hairTrigger.StatModifiers["FireRate"] = 0.15f;
            hairTrigger.StatModifiers["Accuracy"] = -0.05f; // Slight accuracy penalty
            PartDatabase["Hair Trigger"] = hairTrigger;

            // Magazine parts
            var drumMagazine = new WeaponPart
            {
                Name = "Drum Magazine",
                Slot = PartSlot.Magazine,
                Tier = PartTier.Master,
                SpecialEffect = "HighCapacity"
            };
            drumMagazine.StatModifiers["MagazineSize"] = 0.50f; // 50% more capacity
            drumMagazine.StatModifiers["ReloadTime"] = 0.20f; // 20% slower reload
            drumMagazine.StatModifiers["Weight"] = 0.30f;
            PartDatabase["Drum Magazine"] = drumMagazine;
        }

        public static void ApplyParts(ItemValue item)
        {
            if (item == null) return;

            var appliedParts = GetPartsFromItem(item);
            var synergies = CalculateSynergies(appliedParts);

            // Apply individual part modifiers
            foreach (var part in appliedParts)
            {
                ApplyPartModifiers(item, part);
            }

            // Apply synergy bonuses
            ApplySynergyModifiers(item, synergies);
        }

        private static List<WeaponPart> GetPartsFromItem(ItemValue item)
        {
            var parts = new List<WeaponPart>();

            // Check for part properties (Part0_Slot, Part0_Name, etc.)
            for (int i = 0; ; i++)
            {
                var slotProperty = item.GetPropertyOverride($"Part{i}_Slot", "");
                var nameProperty = item.GetPropertyOverride($"Part{i}_Name", "");

                if (string.IsNullOrEmpty(slotProperty) || string.IsNullOrEmpty(nameProperty))
                    break;

                if (PartDatabase.TryGetValue(nameProperty, out WeaponPart part))
                {
                    parts.Add(part);
                }
            }

            return parts;
        }

        private static void ApplyPartModifiers(ItemValue item, WeaponPart part)
        {
            foreach (var modifier in part.StatModifiers)
            {
                ApplyStatModifier(item, modifier.Key, modifier.Value);
            }

            // Apply special effects
            ApplySpecialEffect(item, part);
        }

        private static void ApplyStatModifier(ItemValue item, string stat, float value)
        {
            string propertyName = GetPropertyNameForStat(stat);
            if (string.IsNullOrEmpty(propertyName)) return;

            var currentValue = item.GetPropertyOverride(propertyName, "0");
            if (float.TryParse(currentValue, out float current))
            {
                float newValue;
                if (stat == "MagazineSize" || stat == "Weight")
                {
                    // Additive modifiers for these stats
                    newValue = current * (1 + value);
                }
                else
                {
                    // Percentage modifiers for most stats
                    newValue = current * (1 + value);
                }

                item.SetPropertyOverride(propertyName, newValue.ToString());
            }
        }

        private static string GetPropertyNameForStat(string stat)
        {
            switch (stat)
            {
                case "Damage": return "EntityDamage";
                case "FireRate": return "AttacksPerMinute";
                case "Accuracy": return "Spread";
                case "Recoil": return "Recoil";
                case "MagazineSize": return "MagazineSize";
                case "ReloadTime": return "ReloadTime";
                case "Weight": return "Weight";
                case "Noise": return "Noise"; // Custom property
                case "CritChance": return "CritChance";
                default: return "";
            }
        }

        private static void ApplySpecialEffect(ItemValue item, WeaponPart part)
        {
            if (string.IsNullOrEmpty(part.SpecialEffect)) return;

            switch (part.SpecialEffect)
            {
                case "Silent":
                    item.SetPropertyOverride("NoiseMultiplier", "0.2");
                    break;
                case "Stability":
                    item.SetPropertyOverride("RecoilMultiplier", "0.8");
                    break;
                case "FastAction":
                    item.SetPropertyOverride("FireRateMultiplier", "1.15");
                    break;
                case "HighCapacity":
                    item.SetPropertyOverride("ReloadPenalty", "1.2");
                    break;
            }
        }

        private static Dictionary<string, float> CalculateSynergies(List<WeaponPart> parts)
        {
            var synergies = new Dictionary<string, float>();
            var tierCounts = new Dictionary<PartTier, int>();

            // Count parts by tier
            foreach (var part in parts)
            {
                if (!tierCounts.ContainsKey(part.Tier))
                    tierCounts[part.Tier] = 0;
                tierCounts[part.Tier]++;
            }

            // Apply tier set bonuses
            foreach (var tierCount in tierCounts)
            {
                if (tierCount.Value >= 3) // 3+ parts of same tier
                {
                    switch (tierCount.Key)
                    {
                        case PartTier.Legendary:
                            synergies["Damage"] = 0.15f;
                            synergies["CritChance"] = 0.05f;
                            break;
                        case PartTier.Master:
                            synergies["Accuracy"] = 0.10f;
                            synergies["Durability"] = 0.20f;
                            break;
                        case PartTier.Advanced:
                            synergies["FireRate"] = 0.08f;
                            synergies["ReloadTime"] = -0.10f; // Faster reload
                            break;
                    }
                }
            }

            return synergies;
        }

        private static void ApplySynergyModifiers(ItemValue item, Dictionary<string, float> synergies)
        {
            foreach (var synergy in synergies)
            {
                ApplyStatModifier(item, synergy.Key, synergy.Value);
            }
        }
    }
}
