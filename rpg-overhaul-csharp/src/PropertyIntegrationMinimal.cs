using System;
using System.Collections.Generic;
using UnityEngine;

namespace RPGOverhaul
{
    public static class PropertyIntegrationMinimal
    {
        private static readonly Dictionary<string, Action<ItemValue>> PropertyHandlers 
            = new Dictionary<string, Action<ItemValue>>();

        public static void Initialize()
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing Minimal Property Integration");
            
            // Register basic property handlers
            RegisterPropertyHandler("Manufacturer", ApplyManufacturerProperties);
            RegisterPropertyHandler("Prefixes", ApplyPrefixProperties);
            RegisterPropertyHandler("Suffixes", ApplySuffixProperties);
            RegisterPropertyHandler("Quality", ApplyQualityProperties);
            RegisterPropertyHandler("ItemLevel", ApplyItemLevelProperties);
        }

        public static void RegisterPropertyHandler(string property, Action<ItemValue> handler)
        {
            PropertyHandlers[property] = handler;
            UnityEngine.Debug.Log($"[RPG Overhaul] Registered property handler: {property}");
        }

        public static void ProcessItemProperties(ItemValue item)
        {
            if (item == null) return;

            try
            {
                foreach (var handler in PropertyHandlers)
                {
                    try
                    {
                        handler.Value(item);
                    }
                    catch (Exception ex)
                    {
                        UnityEngine.Debug.LogWarning($"[RPG Overhaul] Error in property handler {handler.Key}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Error processing item properties: {ex.Message}");
            }
        }

        private static void ApplyManufacturerProperties(ItemValue item)
        {
            var manufacturer = item.GetPropertyOverride("Manufacturer", "");
            if (string.IsNullOrEmpty(manufacturer)) return;

            // Apply manufacturer-specific bonuses
            switch (manufacturer.ToLower())
            {
                case "jakobs":
                    ApplyJakobsProperties(item);
                    break;
                case "tediore":
                    ApplyTedioreProperties(item);
                    break;
                case "maliwan":
                    ApplyMaliwanProperties(item);
                    break;
            }
        }

        private static void ApplyJakobsProperties(ItemValue item)
        {
            // Jakobs: +20% damage, -10% fire rate, +15% crit chance
            ModifyItemProperty(item, "EntityDamage", 1.20f, "multiply");
            ModifyItemProperty(item, "AttacksPerMinute", 0.90f, "multiply");
            ModifyItemProperty(item, "CritChance", 0.15f, "add");
        }

        private static void ApplyTedioreProperties(ItemValue item)
        {
            // Tediore: -25% reload time, +15% magazine size
            ModifyItemProperty(item, "ReloadTime", 0.75f, "multiply");
            ModifyItemProperty(item, "MagazineSize", 1.15f, "multiply");
        }

        private static void ApplyMaliwanProperties(ItemValue item)
        {
            // Maliwan: +15% damage, -15% fire rate (elemental focus)
            ModifyItemProperty(item, "EntityDamage", 1.15f, "multiply");
            ModifyItemProperty(item, "AttacksPerMinute", 0.85f, "multiply");
        }

        private static void ApplyPrefixProperties(ItemValue item)
        {
            var prefixes = item.GetPropertyOverride("Prefixes", "");
            if (string.IsNullOrEmpty(prefixes)) return;

            foreach (var prefix in prefixes.Split(','))
            {
                ApplyAffixProperties(item, prefix.Trim(), "prefix");
            }
        }

        private static void ApplySuffixProperties(ItemValue item)
        {
            var suffixes = item.GetPropertyOverride("Suffixes", "");
            if (string.IsNullOrEmpty(suffixes)) return;

            foreach (var suffix in suffixes.Split(','))
            {
                ApplyAffixProperties(item, suffix.Trim(), "suffix");
            }
        }

        private static void ApplyAffixProperties(ItemValue item, string affixName, string type)
        {
            if (string.IsNullOrEmpty(affixName)) return;

            // Basic affix effects
            switch (affixName.ToLower())
            {
                case "brutal":
                case "devastating":
                    ModifyItemProperty(item, "EntityDamage", 1.25f, "multiply");
                    break;
                case "precise":
                case "accurate":
                    ModifyItemProperty(item, "Spread", 0.85f, "multiply"); // Lower spread = better accuracy
                    break;
                case "keen":
                    ModifyItemProperty(item, "CritChance", 0.05f, "add");
                    break;
                case "swift":
                case "rapid":
                    ModifyItemProperty(item, "AttacksPerMinute", 1.15f, "multiply");
                    break;
            }
        }

        private static void ApplyQualityProperties(ItemValue item)
        {
            var qualityStr = item.GetPropertyOverride("Quality", "1");
            if (int.TryParse(qualityStr, out int quality) && quality > 1)
            {
                // Quality scaling: 8% improvement per 100 quality
                var multiplier = 1.0f + (quality / 100f * 0.08f);
                
                ModifyItemProperty(item, "EntityDamage", multiplier, "multiply");
                ModifyItemProperty(item, "AttacksPerMinute", multiplier, "multiply");
                ModifyItemProperty(item, "MagazineSize", multiplier, "multiply");
            }
        }

        private static void ApplyItemLevelProperties(ItemValue item)
        {
            var levelStr = item.GetPropertyOverride("ItemLevel", "1");
            if (int.TryParse(levelStr, out int level) && level > 1)
            {
                // Item level scaling: 4% improvement per 50 levels
                var multiplier = 1.0f + (level / 50f * 0.04f);
                
                ModifyItemProperty(item, "EntityDamage", multiplier, "multiply");
            }
        }

        private static void ModifyItemProperty(ItemValue item, string propertyName, float value, string operation)
        {
            try
            {
                var currentValue = item.GetPropertyOverride(propertyName, "0");
                if (float.TryParse(currentValue, out float current))
                {
                    float newValue = current;
                    
                    switch (operation.ToLower())
                    {
                        case "multiply":
                            newValue = current * value;
                            break;
                        case "add":
                            newValue = current + value;
                            break;
                    }
                    
                    item.SetPropertyOverride(propertyName, newValue.ToString("F2"));
                }
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] Error modifying property {propertyName}: {ex.Message}");
            }
        }

        public static void LogItemProperties(ItemValue item)
        {
            if (item == null) return;

            UnityEngine.Debug.Log($"[RPG Overhaul] Item: {item.ItemClass.GetItemName()}");
            
            var properties = new[] { 
                "Manufacturer", "Prefixes", "Suffixes", "Quality", "ItemLevel",
                "EntityDamage", "AttacksPerMinute", "CritChance", "MagazineSize", "ReloadTime"
            };

            foreach (var prop in properties)
            {
                var value = item.GetPropertyOverride(prop, "");
                if (!string.IsNullOrEmpty(value))
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul]   {prop}: {value}");
                }
            }
        }
    }
}