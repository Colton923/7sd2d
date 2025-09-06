using System;
using System.Collections.Generic;
using System.Text;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public static class WeaponInspectionSystem
    {
        private static bool inspectionEnabled = true;
        private static KeyCode inspectionKey = KeyCode.I;
        private static float lastInspectionTime = 0f;
        private static readonly float InspectionCooldown = 0.5f;

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Weapon Inspection System");
        }

        public static void Update()
        {
            if (!inspectionEnabled) return;

            // Check for inspection key press
            if (Input.GetKeyDown(inspectionKey) && Time.time - lastInspectionTime > InspectionCooldown)
            {
                TryInspectHeldWeapon();
                lastInspectionTime = Time.time;
            }
        }

        public static void TryInspectHeldWeapon()
        {
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player == null)
                {
                    ShowMessage("No player found", 2f);
                    return;
                }

                var heldItem = player.inventory.holdingItemItemValue;
                if (heldItem == null)
                {
                    ShowMessage("No item held", 2f);
                    return;
                }

                if (!IsWeapon(heldItem))
                {
                    ShowMessage("Hold a weapon to inspect", 2f);
                    return;
                }

                InspectWeapon(heldItem);
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error inspecting weapon: {ex.Message}");
            }
        }

        public static void InspectWeapon(ItemValue weapon)
        {
            try
            {
                var inspection = GenerateWeaponInspection(weapon);
                ShowDetailedInspection(inspection);
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error generating weapon inspection: {ex.Message}");
                ShowMessage("Error inspecting weapon", 3f);
            }
        }

        private static WeaponInspectionData GenerateWeaponInspection(ItemValue weapon)
        {
            var inspection = new WeaponInspectionData
            {
                WeaponName = GetWeaponDisplayName(weapon),
                BaseItemName = weapon.ItemClass.GetItemName(),
                Quality = weapon.GetPropertyOverride("Quality", "1"),
                ItemLevel = weapon.GetPropertyOverride("ItemLevel", "1"),
                Manufacturer = weapon.GetPropertyOverride("Manufacturer", ""),
                WeaponClass = weapon.GetPropertyOverride("WeaponClass", ""),
                Tier = weapon.GetPropertyOverride("Tier", "1"),
                
                // RPG Properties
                Prefixes = weapon.GetPropertyOverride("Prefixes", ""),
                Suffixes = weapon.GetPropertyOverride("Suffixes", ""),
                ElementalType = weapon.GetPropertyOverride("ElementalDamageType", ""),
                ElementalDamage = weapon.GetPropertyOverride("ElementalDamage", "0"),
                MasteryRequirement = weapon.GetPropertyOverride("MasteryRequirement", "0"),

                // Calculate all stat modifications
                StatCalculations = WeaponStatsCalculator.CalculateWeaponStats(weapon)
            };

            // Get triggered effects
            inspection.TriggeredEffects = GetTriggeredEffects(weapon);
            
            // Get weapon parts
            inspection.WeaponParts = GetWeaponParts(weapon);
            
            // Get requirements and player status
            inspection.Requirements = GetWeaponRequirements(weapon);

            return inspection;
        }

        private static void ShowDetailedInspection(WeaponInspectionData inspection)
        {
            // Use 7D2D's chat system for detailed display
            var lines = FormatInspectionForChat(inspection);
            
            foreach (var line in lines)
            {
                ShowMessage(line, 15f); // Long display time for detailed info
            }

            // Also log to console for reference
            LogInspectionToConsole(inspection);
        }

        private static List<string> FormatInspectionForChat(WeaponInspectionData inspection)
        {
            var lines = new List<string>();

            // Header
            lines.Add($"=== {inspection.WeaponName} ===");
            
            // Basic info
            if (!string.IsNullOrEmpty(inspection.Manufacturer))
                lines.Add($"Manufacturer: {inspection.Manufacturer}");
            lines.Add($"Quality: {inspection.Quality} | Level: {inspection.ItemLevel} | Tier: {inspection.Tier}");

            // RPG Properties
            if (!string.IsNullOrEmpty(inspection.Prefixes))
                lines.Add($"Prefix: {inspection.Prefixes}");
            if (!string.IsNullOrEmpty(inspection.Suffixes))  
                lines.Add($"Suffix: {inspection.Suffixes}");

            // Elemental damage
            if (!string.IsNullOrEmpty(inspection.ElementalType) && inspection.ElementalDamage != "0")
                lines.Add($"Elemental: {inspection.ElementalType} ({inspection.ElementalDamage} damage)");

            // Stats (show top 5 most significant)
            if (inspection.StatCalculations.Count > 0)
            {
                lines.Add("--- Stats ---");
                var significantStats = inspection.StatCalculations
                    .Where(s => Math.Abs(s.GetImprovementPercentage()) > 1f)
                    .OrderByDescending(s => Math.Abs(s.GetImprovementPercentage()))
                    .Take(5);

                foreach (var stat in significantStats)
                {
                    var improvement = stat.GetImprovementPercentage();
                    var sign = improvement > 0 ? "+" : "";
                    lines.Add($"{stat.GetStatDisplayName()}: {stat.BaseValue:F0} -> {stat.FinalValue:F0} ({sign}{improvement:F0}%)");
                    
                    // Show most significant modifiers (top 2)
                    var topMods = stat.Modifiers.OrderByDescending(m => Math.Abs(m.ModifierValue)).Take(2);
                    foreach (var mod in topMods)
                    {
                        lines.Add($"  • {mod.Source}: {mod.GetDisplayText()}");
                    }
                }
            }

            // Triggered effects
            if (inspection.TriggeredEffects.Count > 0)
            {
                lines.Add("--- Triggered Effects ---");
                foreach (var effect in inspection.TriggeredEffects)
                {
                    lines.Add($"On {effect.Trigger}: {effect.Effect} ({effect.Chance}% chance)");
                }
            }

            // Weapon parts
            if (inspection.WeaponParts.Count > 0)
            {
                lines.Add("--- Weapon Parts ---");
                foreach (var part in inspection.WeaponParts)
                {
                    lines.Add($"{part.Slot}: {part.Name} ({part.Tier})");
                }
            }

            // Requirements
            if (inspection.Requirements.Count > 0)
            {
                lines.Add("--- Requirements ---");
                foreach (var req in inspection.Requirements)
                {
                    var status = req.Met ? "[✓]" : "[✗]";
                    lines.Add($"{status} {req.Type}: {req.Required} (You have: {req.Current})");
                }
            }

            return lines;
        }

        private static void LogInspectionToConsole(WeaponInspectionData inspection)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"[RPG Overhaul] Detailed Inspection: {inspection.WeaponName}");
            
            // Log all stat calculations for debugging
            foreach (var stat in inspection.StatCalculations)
            {
                sb.AppendLine($"  {stat.StatName}: {stat.BaseValue:F2} -> {stat.FinalValue:F2}");
                foreach (var mod in stat.Modifiers)
                {
                    sb.AppendLine($"    {mod.Source}: {mod.GetDisplayText()} ({mod.ModifierType})");
                }
            }

            Log.Out(sb.ToString());
        }

        private static void ShowMessage(string message, float duration)
        {
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player != null)
                {
                    // Use game's message system
                    GameManager.ShowTooltip(player, message);
                    
                    // Also send to chat for persistence
                    if (SingletonMonoBehaviour<ConnectionManager>.Instance.IsServer)
                    {
                        GameManager.Instance.ChatMessageServer(
                            null, EChatType.Whisper, player.entityId, message, "", false, null);
                    }
                }
            }
            catch (Exception ex)
            {
                // Fallback to console if UI fails
                Log.Out($"[RPG Overhaul] {message}");
                Log.Warning($"[RPG Overhaul] Could not show UI message: {ex.Message}");
            }
        }

        private static string GetWeaponDisplayName(ItemValue weapon)
        {
            var baseName = weapon.ItemClass.GetItemName();
            var manufacturer = weapon.GetPropertyOverride("Manufacturer", "");
            var prefixes = weapon.GetPropertyOverride("Prefixes", "");
            var suffixes = weapon.GetPropertyOverride("Suffixes", "");

            var displayName = "";
            
            if (!string.IsNullOrEmpty(prefixes))
                displayName += prefixes + " ";
            
            if (!string.IsNullOrEmpty(manufacturer))
                displayName += manufacturer + " ";
                
            displayName += baseName;
            
            if (!string.IsNullOrEmpty(suffixes))
                displayName += " " + suffixes;

            return displayName;
        }

        private static bool IsWeapon(ItemValue item)
        {
            if (item?.ItemClass == null) return false;
            
            var weaponClass = item.GetPropertyOverride("WeaponClass", "");
            if (!string.IsNullOrEmpty(weaponClass)) return true;

            // Check item class properties for weapon indicators
            var itemClass = item.ItemClass;
            return itemClass.HasProperty("EntityDamage") || 
                   itemClass.HasProperty("AttacksPerMinute") ||
                   itemClass.Actions?.Length > 0;
        }

        private static List<TriggeredEffectInfo> GetTriggeredEffects(ItemValue weapon)
        {
            var effects = new List<TriggeredEffectInfo>();
            
            for (int i = 0; i < 10; i++)
            {
                var trigger = weapon.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                if (string.IsNullOrEmpty(trigger)) break;

                var effect = weapon.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                var chance = weapon.GetPropertyOverride($"TriggeredEffect{i}_Chance", "0");
                var power = weapon.GetPropertyOverride($"TriggeredEffect{i}_Power", "1");

                if (!string.IsNullOrEmpty(effect))
                {
                    effects.Add(new TriggeredEffectInfo
                    {
                        Trigger = trigger,
                        Effect = effect,
                        Chance = chance,
                        Power = power
                    });
                }
            }

            return effects;
        }

        private static List<WeaponPartInfo> GetWeaponParts(ItemValue weapon)
        {
            var parts = new List<WeaponPartInfo>();
            
            for (int i = 0; i < 8; i++)
            {
                var slot = weapon.GetPropertyOverride($"Part{i}_Slot", "");
                if (string.IsNullOrEmpty(slot)) break;

                var name = weapon.GetPropertyOverride($"Part{i}_Name", "");
                var tier = weapon.GetPropertyOverride($"Part{i}_Tier", "Basic");

                if (!string.IsNullOrEmpty(name))
                {
                    parts.Add(new WeaponPartInfo
                    {
                        Slot = slot,
                        Name = name,
                        Tier = tier
                    });
                }
            }

            return parts;
        }

        private static List<RequirementInfo> GetWeaponRequirements(ItemValue weapon)
        {
            var requirements = new List<RequirementInfo>();
            
            try
            {
                var player = GameManager.Instance?.World?.GetPrimaryPlayer();
                if (player == null) return requirements;

                // Mastery requirement
                var masteryReq = weapon.GetPropertyOverride("MasteryRequirement", "0");
                if (int.TryParse(masteryReq, out int requiredMastery) && requiredMastery > 0)
                {
                    var weaponClass = weapon.GetPropertyOverride("WeaponClass", "");
                    var currentMastery = MasterySystem.GetMasteryLevel(player.entityId.ToString(), weaponClass);
                    
                    requirements.Add(new RequirementInfo
                    {
                        Type = $"{weaponClass} Mastery",
                        Required = masteryReq,
                        Current = currentMastery.ToString(),
                        Met = currentMastery >= requiredMastery
                    });
                }

                // Player level requirement
                var playerLevelReq = weapon.GetPropertyOverride("PlayerLevelRequirement", "0");
                if (int.TryParse(playerLevelReq, out int requiredLevel) && requiredLevel > 0)
                {
                    var currentLevel = player.Progression.GetLevel();
                    
                    requirements.Add(new RequirementInfo
                    {
                        Type = "Player Level",
                        Required = playerLevelReq,
                        Current = currentLevel.ToString(),
                        Met = currentLevel >= requiredLevel
                    });
                }
            }
            catch (Exception ex)
            {
                Log.Warning($"[RPG Overhaul] Error checking requirements: {ex.Message}");
            }

            return requirements;
        }

        // Configuration
        public static void SetInspectionKey(KeyCode keyCode)
        {
            inspectionKey = keyCode;
            Log.Out($"[RPG Overhaul] Inspection key set to: {keyCode}");
        }

        public static void SetInspectionEnabled(bool enabled)
        {
            inspectionEnabled = enabled;
            Log.Out($"[RPG Overhaul] Inspection system {(enabled ? "enabled" : "disabled")}");
        }
    }

    // Data classes
    public class WeaponInspectionData
    {
        public string WeaponName { get; set; }
        public string BaseItemName { get; set; }
        public string Quality { get; set; }
        public string ItemLevel { get; set; }
        public string Manufacturer { get; set; }
        public string WeaponClass { get; set; }
        public string Tier { get; set; }
        public string Prefixes { get; set; }
        public string Suffixes { get; set; }
        public string ElementalType { get; set; }
        public string ElementalDamage { get; set; }
        public string MasteryRequirement { get; set; }
        public List<WeaponStatCalculation> StatCalculations { get; set; } = new List<WeaponStatCalculation>();
        public List<TriggeredEffectInfo> TriggeredEffects { get; set; } = new List<TriggeredEffectInfo>();
        public List<WeaponPartInfo> WeaponParts { get; set; } = new List<WeaponPartInfo>();
        public List<RequirementInfo> Requirements { get; set; } = new List<RequirementInfo>();
    }

    public class TriggeredEffectInfo
    {
        public string Trigger { get; set; }
        public string Effect { get; set; }
        public string Chance { get; set; }
        public string Power { get; set; }
    }

    public class WeaponPartInfo
    {
        public string Slot { get; set; }
        public string Name { get; set; }
        public string Tier { get; set; }
    }

    public class RequirementInfo
    {
        public string Type { get; set; }
        public string Required { get; set; }
        public string Current { get; set; }
        public bool Met { get; set; }
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
                WeaponInspectionSystem.Update();
            }
            catch (Exception ex)
            {
                // Fail silently to avoid spamming logs
            }
        }
    }
}