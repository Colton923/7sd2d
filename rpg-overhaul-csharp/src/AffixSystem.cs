using System;
using System.Collections.Generic;
using System.Linq;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public enum AffixType
    {
        Prefix,
        Suffix,
        Implicit,
        Unique,
        Mastercrafted
    }

    public class Affix
    {
        public string Name { get; set; }
        public AffixType Type { get; set; }
        public string Stat { get; set; }
        public string Operation { get; set; }
        public float MinValue { get; set; }
        public float MaxValue { get; set; }
        public int Tier { get; set; }
        public int LevelReq { get; set; }
        public int MasteryReq { get; set; }
        public float Value { get; set; } // Calculated value for this instance

        public Affix(string name, AffixType type, string stat, string operation,
                    float minValue, float maxValue, int tier, int levelReq, int masteryReq)
        {
            Name = name;
            Type = type;
            Stat = stat;
            Operation = operation;
            MinValue = minValue;
            MaxValue = maxValue;
            Tier = tier;
            LevelReq = levelReq;
            MasteryReq = masteryReq;
        }
    }

    public static class AffixSystem
    {
        private static readonly Dictionary<string, Affix> AffixDatabase = new Dictionary<string, Affix>();
        
        // Public access for other systems
        public static Affix GetAffix(string name)
        {
            return AffixDatabase.TryGetValue(name, out Affix affix) ? affix : null;
        }
        
        public static Dictionary<string, Affix> GetAllAffixes()
        {
            return new Dictionary<string, Affix>(AffixDatabase);
        }

        public static void Initialize()
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing Affix System");
            LoadAffixDatabase();
        }

        private static void LoadAffixDatabase()
        {
            // Load affixes from XML or define them programmatically
            // This would typically read from the generated XML files
            CreateDefaultAffixes();
        }

        private static void CreateDefaultAffixes()
        {
            // Damage affixes
            AffixDatabase["Brutal"] = new Affix("Brutal", AffixType.Prefix, "Damage", "perc_add",
                0.15f, 0.35f, 1, 1, 0);
            AffixDatabase["Vicious"] = new Affix("Vicious", AffixType.Prefix, "Damage", "perc_add",
                0.25f, 0.40f, 2, 10, 15);
            AffixDatabase["Devastating"] = new Affix("Devastating", AffixType.Prefix, "Damage", "perc_add",
                0.35f, 0.55f, 3, 20, 25);

            // Accuracy affixes
            AffixDatabase["Precise"] = new Affix("Precise", AffixType.Prefix, "Accuracy", "perc_add",
                0.08f, 0.18f, 1, 1, 0);
            AffixDatabase["Surgical"] = new Affix("Surgical", AffixType.Prefix, "Accuracy", "perc_add",
                0.18f, 0.35f, 3, 20, 30);

            // Critical affixes
            AffixDatabase["Keen"] = new Affix("Keen", AffixType.Prefix, "CritChance", "base_add",
                0.03f, 0.08f, 2, 10, 15);
            AffixDatabase["Lethal"] = new Affix("Lethal", AffixType.Prefix, "CritDamage", "perc_add",
                0.20f, 0.50f, 3, 25, 35);
        }

        public static void ApplyAffixes(ItemValue item)
        {
            if (item == null) return;

            // Get affixes from item properties
            var prefixes = GetAffixesFromItem(item, "Prefixes");
            var suffixes = GetAffixesFromItem(item, "Suffixes");
            var implicits = GetAffixesFromItem(item, "Implicits");

            // Apply each affix
            foreach (var affix in prefixes.Concat(suffixes).Concat(implicits))
            {
                ApplyAffixToItem(item, affix);
            }
        }

        private static List<Affix> GetAffixesFromItem(ItemValue item, string propertyName)
        {
            var affixes = new List<Affix>();
            var affixString = item.GetPropertyOverride(propertyName, "");

            if (string.IsNullOrEmpty(affixString))
                return affixes;

            var affixNames = affixString.Split(',');
            foreach (var name in affixNames)
            {
                var trimmedName = name.Trim();
                if (AffixDatabase.TryGetValue(trimmedName, out Affix affix))
                {
                    // Calculate random value within range
                    affix.Value = UnityEngine.Random.Range(affix.MinValue, affix.MaxValue);
                    affixes.Add(affix);
                }
            }

            return affixes;
        }

        private static void ApplyAffixToItem(ItemValue item, Affix affix)
        {
            // Apply the affix based on its operation type
            switch (affix.Operation)
            {
                case "base_add":
                    ApplyBaseAdd(item, affix);
                    break;
                case "perc_add":
                    ApplyPercAdd(item, affix);
                    break;
                case "perc_subtract":
                    ApplyPercSubtract(item, affix);
                    break;
                case "multiply":
                    ApplyMultiply(item, affix);
                    break;
            }
        }

        private static void ApplyBaseAdd(ItemValue item, Affix affix)
        {
            switch (affix.Stat)
            {
                case "Damage":
                    var currentDamage = item.GetPropertyOverride("EntityDamage", "0");
                    if (float.TryParse(currentDamage, out float damage))
                    {
                        item.SetPropertyOverride("EntityDamage", (damage + affix.Value).ToString());
                    }
                    break;
                case "CritChance":
                    var currentCrit = item.GetPropertyOverride("CritChance", "0");
                    if (float.TryParse(currentCrit, out float crit))
                    {
                        item.SetPropertyOverride("CritChance", (crit + affix.Value).ToString());
                    }
                    break;
                // Add more stats as needed
            }
        }

        private static void ApplyPercAdd(ItemValue item, Affix affix)
        {
            switch (affix.Stat)
            {
                case "Damage":
                    var currentDamage = item.GetPropertyOverride("EntityDamage", "0");
                    if (float.TryParse(currentDamage, out float damage))
                    {
                        var newDamage = damage * (1 + affix.Value);
                        item.SetPropertyOverride("EntityDamage", newDamage.ToString());
                    }
                    break;
                case "Accuracy":
                    var currentAccuracy = item.GetPropertyOverride("Spread", "1");
                    if (float.TryParse(currentAccuracy, out float spread))
                    {
                        var newSpread = spread * (1 - affix.Value); // Lower spread = better accuracy
                        item.SetPropertyOverride("Spread", newSpread.ToString());
                    }
                    break;
                // Add more stats as needed
            }
        }

        private static void ApplyPercSubtract(ItemValue item, Affix affix)
        {
            // Similar to perc_add but subtracts
            ApplyPercAdd(item, new Affix(affix.Name, affix.Type, affix.Stat, "perc_add",
                -affix.Value, -affix.Value, affix.Tier, affix.LevelReq, affix.MasteryReq));
        }

        private static void ApplyMultiply(ItemValue item, Affix affix)
        {
            switch (affix.Stat)
            {
                case "Damage":
                    var currentDamage = item.GetPropertyOverride("EntityDamage", "0");
                    if (float.TryParse(currentDamage, out float damage))
                    {
                        var newDamage = damage * affix.Value;
                        item.SetPropertyOverride("EntityDamage", newDamage.ToString());
                    }
                    break;
            }
        }
    }
}
