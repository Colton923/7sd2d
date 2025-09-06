using System;
using System.Collections.Generic;
using System.Linq;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public class MasteryData
    {
        public string WeaponType { get; set; }
        public int Level { get; set; }
        public float Experience { get; set; }
        public Dictionary<string, float> Bonuses { get; set; }

        public MasteryData()
        {
            Bonuses = new Dictionary<string, float>();
        }
    }

    public static class MasterySystem
    {
        private static readonly Dictionary<string, MasteryData> PlayerMasteries =
            new Dictionary<string, MasteryData>();

        private static readonly Dictionary<string, Dictionary<string, float>> MasteryBonuses =
            new Dictionary<string, Dictionary<string, float>>
        {
            ["pistol"] = new Dictionary<string, float>
            {
                ["Damage"] = 0.02f,      // 2% per level
                ["Accuracy"] = 0.015f,   // 1.5% per level
                ["FireRate"] = 0.01f     // 1% per level
            },
            ["rifle"] = new Dictionary<string, float>
            {
                ["Damage"] = 0.025f,
                ["Accuracy"] = 0.02f,
                ["Recoil"] = -0.015f     // Negative for reduction
            },
            ["shotgun"] = new Dictionary<string, float>
            {
                ["Damage"] = 0.03f,
                ["ReloadTime"] = -0.02f,
                ["PelletCount"] = 0.01f
            },
            ["sniper"] = new Dictionary<string, float>
            {
                ["Damage"] = 0.04f,
                ["Accuracy"] = 0.025f,
                ["CritChance"] = 0.005f
            },
            ["automatic"] = new Dictionary<string, float>
            {
                ["FireRate"] = 0.02f,
                ["Recoil"] = -0.02f,
                ["MagazineSize"] = 0.01f
            }
        };

        public static void Initialize()
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing Mastery System");
        }

        public static MasteryData GetMastery(string playerId, string weaponType)
        {
            var key = $"{playerId}_{weaponType}";
            if (!PlayerMasteries.TryGetValue(key, out MasteryData mastery))
            {
                mastery = new MasteryData
                {
                    WeaponType = weaponType,
                    Level = 0,
                    Experience = 0
                };
                PlayerMasteries[key] = mastery;
            }
            return mastery;
        }

        public static void AddMasteryExperience(string playerId, string weaponType, float experience)
        {
            var mastery = GetMastery(playerId, weaponType);
            mastery.Experience += experience;

            // Show XP gain in UI
            var player = GameManager.Instance.World.GetPlayerById(playerId);
            if (player != null && player == GameManager.Instance.World.GetPrimaryPlayer())
            {
                MasteryProgressBar.Instance?.ShowMasteryGain(weaponType, experience);
            }

            // Check for level up
            var requiredExp = GetExperienceForLevel(mastery.Level + 1);
            if (mastery.Experience >= requiredExp)
            {
                mastery.Level++;
                mastery.Experience -= requiredExp;
                OnMasteryLevelUp(playerId, weaponType, mastery.Level);
            }

            // Save mastery data
            SaveMasteryData(playerId);

            // Sync to network for multiplayer
            NetworkSync.SyncMasteryData(playerId);
        }

        private static int GetExperienceForLevel(int level)
        {
            return level * 1000; // 1000 XP per level, could be made more complex
        }

        public static int GetRequiredExperienceForLevel(int level)
        {
            return level * 1000; // 1000 XP per level, could be made more complex
        }

        private static void OnMasteryLevelUp(string playerId, string weaponType, int newLevel)
        {
            UnityEngine.Debug.Log($"[RPG Overhaul] {playerId} reached {weaponType} mastery level {newLevel}");

            // Could add level up effects, notifications, etc.
            var player = GameManager.Instance.World.GetPlayerById(playerId);
            if (player != null)
            {
                // Send notification to player
                GameManager.Instance.ChatMessageServer(null, EChatType.Global,
                    player.entityId, $"Reached {weaponType} mastery level {newLevel}!", "", false);
            }
        }

        public static void ApplyMasteryBonuses(ItemValue item)
        {
            if (item == null) return;

            // Get current player (this is a simplified example)
            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var playerId = player.entityId.ToString();
            var weaponClass = item.GetPropertyOverride("WeaponClass", "");

            if (string.IsNullOrEmpty(weaponClass)) return;

            var mastery = GetMastery(playerId, weaponClass);

            if (mastery.Level <= 0) return;

            // Apply level-based bonuses
            if (MasteryBonuses.TryGetValue(weaponClass, out Dictionary<string, float> bonuses))
            {
                foreach (var bonus in bonuses)
                {
                    var bonusValue = bonus.Value * mastery.Level;
                    ApplyMasteryBonus(item, bonus.Key, bonusValue);
                }
            }
        }

        private static void ApplyMasteryBonus(ItemValue item, string stat, float value)
        {
            var propertyName = GetPropertyNameForStat(stat);
            if (string.IsNullOrEmpty(propertyName)) return;

            var currentValue = item.GetPropertyOverride(propertyName, "0");
            if (float.TryParse(currentValue, out float current))
            {
                var newValue = current * (1 + value);
                item.SetPropertyOverride(propertyName, newValue.ToString());
            }
        }

        private static string GetPropertyNameForStat(string stat)
        {
            switch (stat)
            {
                case "Damage": return "EntityDamage";
                case "Accuracy": return "Spread";
                case "FireRate": return "AttacksPerMinute";
                case "Recoil": return "Recoil";
                case "ReloadTime": return "ReloadTime";
                case "MagazineSize": return "MagazineSize";
                case "CritChance": return "CritChance";
                case "PelletCount": return "PelletCount"; // For shotguns
                default: return "";
            }
        }

        public static void SaveMasteryData(string playerId)
        {
            // Save to player's .ttp file (7D2D's player data format)
            var player = GameManager.Instance.World.GetPlayerById(playerId);
            if (player == null) return;

            // Add custom data to player's persistent data
            var customData = player.GetPersistentPlayerData();
            if (customData == null)
            {
                customData = new PersistentPlayerData();
                player.SetPersistentPlayerData(customData);
            }

            // Store mastery data as JSON string
            var masteryJson = SerializeMasteryData(playerId);
            customData.SetString("RPGOverhaul_MasteryData", masteryJson);

            UnityEngine.Debug.Log($"[RPG Overhaul] Saved mastery data for player {playerId}");
        }

        public static int GetMasteryLevel(string playerId, string weaponType)
        {
            return GetMastery(playerId, weaponType).Level;
        }

        public static bool HasRequiredMastery(string playerId, string weaponType, int requiredLevel)
        {
            return GetMasteryLevel(playerId, weaponType) >= requiredLevel;
        }

        private static string SerializeMasteryData(string playerId)
        {
            var masteries = new Dictionary<string, MasteryData>();
            foreach (var kvp in PlayerMasteries)
            {
                if (kvp.Key.StartsWith($"{playerId}_"))
                {
                    masteries[kvp.Key] = kvp.Value;
                }
            }
            return JsonUtility.ToJson(masteries);
        }


        public static void LoadMasteryData(string playerId)
        {
            var player = GameManager.Instance.World.GetPlayerById(playerId);
            if (player == null) return;

            var customData = player.GetPersistentPlayerData();
            if (customData == null) return;

            var masteryJson = customData.GetString("RPGOverhaul_MasteryData");
            if (string.IsNullOrEmpty(masteryJson)) return;

            var masteries = JsonUtility.FromJson<Dictionary<string, MasteryData>>(masteryJson);
            foreach (var kvp in masteries)
            {
                PlayerMasteries[kvp.Key] = kvp.Value;
            }

            UnityEngine.Debug.Log($"[RPG Overhaul] Loaded mastery data for player {playerId}");
        }

        public static void GrantWeaponUseXP(string playerId, ItemValue weapon)
        {
            if (weapon == null) return;

            var weaponClass = weapon.GetPropertyOverride("WeaponClass", "");
            if (string.IsNullOrEmpty(weaponClass)) return;

            // Grant small XP for weapon use
            AddMasteryExperience(playerId, weaponClass, 1.0f);
        }

        public static void GrantCriticalHitXP(string playerId, ItemValue weapon)
        {
            if (weapon == null) return;

            var weaponClass = weapon.GetPropertyOverride("WeaponClass", "");
            if (string.IsNullOrEmpty(weaponClass)) return;

            // Grant bonus XP for critical hits
            AddMasteryExperience(playerId, weaponClass, 5.0f);
            UnityEngine.Debug.Log($"[RPG Overhaul] Granted critical hit XP for {weaponClass} to {playerId}");
        }

        public static void GrantKillXP(string playerId, ItemValue weapon, EntityAlive killedEntity)
        {
            if (weapon == null || killedEntity == null) return;

            var weaponClass = weapon.GetPropertyOverride("WeaponClass", "");
            if (string.IsNullOrEmpty(weaponClass)) return;

            // Grant XP based on killed entity type
            float xpAmount = 10.0f; // Base XP
            
            // Bonus XP for stronger enemies
            if (killedEntity.GetMaxHealth() > 100)
                xpAmount += 5.0f;
            
            AddMasteryExperience(playerId, weaponClass, xpAmount);
            UnityEngine.Debug.Log($"[RPG Overhaul] Granted kill XP ({xpAmount}) for {weaponClass} to {playerId}");
        }

        public static void SyncMasteryToClients(string playerId)
        {
            // Send mastery data to all connected clients
            var masteryJson = SerializeMasteryData(playerId);

            // Use 7D2D's network system to broadcast
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null && player.entityId.ToString() != playerId)
                {
                    // Send custom network message with mastery data
                    var netPackage = NetPackageManager.GetPackage<NetPackagePlayerStats>();
                    if (netPackage != null)
                    {
                        // This is a simplified example - you'd need to implement custom network packages
                        // for full mastery data synchronization
                        UnityEngine.Debug.Log($"[RPG Overhaul] Would sync mastery data for {playerId} to client {player.entityId}");
                    }
                }
            }
        }
    }
}
