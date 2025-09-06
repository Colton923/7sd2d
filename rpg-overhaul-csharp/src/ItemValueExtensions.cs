using System;
using System.Collections.Generic;
using System.Reflection;

namespace RPGOverhaul
{
    public static class ItemValueExtensions
    {
        // Dictionary to store custom properties per ItemValue instance
        private static Dictionary<ItemValue, Dictionary<string, string>> customProperties = 
            new Dictionary<ItemValue, Dictionary<string, string>>();

        /// <summary>
        /// Sets a property override on an ItemValue
        /// Uses reflection to modify internal properties or stores in custom dictionary
        /// </summary>
        public static void SetPropertyOverride(this ItemValue item, string propertyName, string value)
        {
            try
            {
                // Store in our custom dictionary (simplest approach that works)
                if (!customProperties.ContainsKey(item))
                {
                    customProperties[item] = new Dictionary<string, string>();
                }
                customProperties[item][propertyName] = value;
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] Failed to set property {propertyName} on item: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a property override from an ItemValue
        /// </summary>
        public static string GetPropertyOverrideExtended(this ItemValue item, string propertyName, string defaultValue)
        {
            try
            {
                // First check built-in GetPropertyOverride
                var value = item.GetPropertyOverride(propertyName, null);
                if (!string.IsNullOrEmpty(value))
                    return value;

                // Check metadata
                if (item.Metadata != null && item.Metadata.ContainsKey(propertyName))
                {
                    return item.Metadata[propertyName].ToString();
                }

                // Check our custom dictionary
                if (customProperties.ContainsKey(item) && customProperties[item].ContainsKey(propertyName))
                {
                    return customProperties[item][propertyName];
                }

                return defaultValue;
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] Failed to get property {propertyName} from item: {ex.Message}");
                return defaultValue;
            }
        }

        /// <summary>
        /// Modifies an existing property value
        /// </summary>
        public static void ModifyProperty(this ItemValue item, string propertyName, Func<float, float> modifier)
        {
            var currentValue = item.GetPropertyOverrideExtended(propertyName, "0");
            if (float.TryParse(currentValue, out float value))
            {
                var newValue = modifier(value);
                item.SetPropertyOverride(propertyName, newValue.ToString());
            }
        }
    }
}