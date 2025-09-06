using System;
using System.Collections.Generic;
using System.Text;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public static class WeaponInspectionMinimal
    {
        private static bool inspectionEnabled = true;
        private static KeyCode inspectionKey = KeyCode.I;
        private static float lastInspectionTime = 0f;
        private static readonly float InspectionCooldown = 0.5f;

        public static void Initialize()
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing Minimal Weapon Inspection System");
        }

        public static void Update()
        {
            // TODO: Input handling will be added once we have proper Unity Input references
            // For now, weapon inspection can be triggered via console commands
        }

        public static void TryInspectHeldWeapon()
        {
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player == null)
                {
                    ShowMessage("No player found");
                    return;
                }

                var heldItem = player.inventory.holdingItemItemValue;
                if (heldItem == null)
                {
                    ShowMessage("No item held");
                    return;
                }

                if (!IsWeapon(heldItem))
                {
                    ShowMessage("Hold a weapon to inspect");
                    return;
                }

                InspectWeapon(heldItem);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Error inspecting weapon: {ex.Message}");
            }
        }

        public static void InspectWeapon(ItemValue weapon)
        {
            try
            {
                var inspection = GenerateBasicInspection(weapon);
                ShowWeaponInfo(inspection);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Error generating weapon inspection: {ex.Message}");
                ShowMessage("Error inspecting weapon");
            }
        }

        private static string GenerateBasicInspection(ItemValue weapon)
        {
            var sb = new StringBuilder();
            
            // Basic weapon info
            var weaponName = weapon.ItemClass.GetItemName();
            var quality = weapon.GetPropertyOverride("Quality", "1");
            var itemLevel = weapon.GetPropertyOverride("ItemLevel", "1");
            
            sb.AppendLine($"=== {weaponName} ===");
            sb.AppendLine($"Quality: {quality} | Level: {itemLevel}");
            
            // RPG Properties
            var manufacturer = weapon.GetPropertyOverride("Manufacturer", "");
            if (!string.IsNullOrEmpty(manufacturer))
                sb.AppendLine($"Manufacturer: {manufacturer}");
                
            var prefixes = weapon.GetPropertyOverride("Prefixes", "");
            if (!string.IsNullOrEmpty(prefixes))
                sb.AppendLine($"Prefix: {prefixes}");
                
            var suffixes = weapon.GetPropertyOverride("Suffixes", "");
            if (!string.IsNullOrEmpty(suffixes))
                sb.AppendLine($"Suffix: {suffixes}");

            // Basic stats
            var damage = weapon.GetPropertyOverride("EntityDamage", "");
            if (!string.IsNullOrEmpty(damage))
                sb.AppendLine($"Damage: {damage}");
                
            var critChance = weapon.GetPropertyOverride("CritChance", "");
            if (!string.IsNullOrEmpty(critChance))
                sb.AppendLine($"Crit Chance: {critChance}");
                
            var attacksPerMinute = weapon.GetPropertyOverride("AttacksPerMinute", "");
            if (!string.IsNullOrEmpty(attacksPerMinute))
                sb.AppendLine($"Fire Rate: {attacksPerMinute}");

            // Elemental damage
            var elementalType = weapon.GetPropertyOverride("ElementalDamageType", "");
            var elementalDamage = weapon.GetPropertyOverride("ElementalDamage", "0");
            if (!string.IsNullOrEmpty(elementalType) && elementalDamage != "0")
                sb.AppendLine($"Elemental: {elementalType} ({elementalDamage} damage)");

            return sb.ToString();
        }

        private static void ShowWeaponInfo(string info)
        {
            // Split into multiple messages for better readability
            var lines = info.Split('\n');
            
            foreach (var line in lines)
            {
                if (!string.IsNullOrEmpty(line.Trim()))
                {
                    ShowMessage(line.Trim());
                }
            }
        }

        private static void ShowMessage(string message)
        {
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player != null)
                {
                    // Use game's tooltip system
                    GameManager.ShowTooltip(player, message);
                    
                    // Also log to console for debugging
                    UnityEngine.Debug.Log($"[RPG Overhaul] {message}");
                }
                else
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] {message}");
                }
            }
            catch (Exception ex)
            {
                // Fallback to console if UI fails
                UnityEngine.Debug.Log($"[RPG Overhaul] {message}");
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] Could not show UI message: {ex.Message}");
            }
        }

        private static bool IsWeapon(ItemValue item)
        {
            if (item?.ItemClass == null) return false;
            
            // Check if it has weapon-like properties
            var weaponClass = item.GetPropertyOverride("WeaponClass", "");
            if (!string.IsNullOrEmpty(weaponClass)) return true;

            // Check for damage property
            var damage = item.GetPropertyOverride("EntityDamage", "");
            if (!string.IsNullOrEmpty(damage)) return true;

            // Check item name for weapon indicators
            var itemName = item.ItemClass.GetItemName().ToLower();
            return itemName.Contains("gun") || itemName.Contains("rifle") || 
                   itemName.Contains("pistol") || itemName.Contains("sword") ||
                   itemName.Contains("knife") || itemName.Contains("axe") ||
                   itemName.Contains("club") || itemName.Contains("bow");
        }

        // Configuration
        public static void SetInspectionKey(KeyCode keyCode)
        {
            inspectionKey = keyCode;
            UnityEngine.Debug.Log($"[RPG Overhaul] Inspection key set to: {keyCode}");
        }

        public static void SetInspectionEnabled(bool enabled)
        {
            inspectionEnabled = enabled;
            UnityEngine.Debug.Log($"[RPG Overhaul] Inspection system {(enabled ? "enabled" : "disabled")}");
        }
    }

    // Harmony patch to handle input
    [HarmonyPatch(typeof(GameManager), "Update")]
    public static class WeaponInspectionInputPatch
    {
        [HarmonyPostfix]
        public static void PostUpdate()
        {
            try
            {
                WeaponInspectionMinimal.Update();
            }
            catch (Exception)
            {
                // Fail silently to avoid spamming logs
            }
        }
    }
}