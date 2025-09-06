using System;
using System.Collections.Generic;
using System.Text;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public enum RPGSyncType
    {
        MasteryData,
        ActiveEffects,
        WeaponProperties,
        PlayerJoin,
        PlayerRespawn,
        ItemClone
    }

    [Serializable]
    public class RPGSyncData
    {
        public RPGSyncType Type;
        public string PlayerId;
        public string Data;
        public long Timestamp;

        public RPGSyncData(RPGSyncType type, string playerId, string data)
        {
            Type = type;
            PlayerId = playerId;
            Data = data;
            Timestamp = DateTime.Now.Ticks;
        }
    }

    public static class NetworkSync
    {
        private static readonly Dictionary<string, long> LastSyncTimes = new Dictionary<string, long>();
        private static readonly Queue<RPGSyncData> PendingSyncs = new Queue<RPGSyncData>();
        private static float syncTimer = 0f;
        private const float SYNC_INTERVAL = 1.0f; // Sync every second
        private const int MAX_PENDING_SYNCS = 50;

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Network Synchronization");
        }

        public static void Update()
        {
            syncTimer += Time.deltaTime;
            if (syncTimer >= SYNC_INTERVAL)
            {
                ProcessPendingSyncs();
                syncTimer = 0f;
            }
        }

        public static void SyncMasteryData(string playerId)
        {
            if (ShouldSkipSync(playerId, RPGSyncType.MasteryData)) return;

            var masteryJson = SerializeMasteryData(playerId);
            var syncData = new RPGSyncData(RPGSyncType.MasteryData, playerId, masteryJson);
            
            QueueSync(syncData);
            LastSyncTimes[$"{playerId}_mastery"] = DateTime.Now.Ticks;
        }

        public static void SyncActiveEffects(string playerId)
        {
            if (ShouldSkipSync(playerId, RPGSyncType.ActiveEffects)) return;

            var effects = EffectTracker.GetPlayerEffects(playerId);
            var effectsJson = SerializeEffects(effects);
            var syncData = new RPGSyncData(RPGSyncType.ActiveEffects, playerId, effectsJson);
            
            QueueSync(syncData);
            LastSyncTimes[$"{playerId}_effects"] = DateTime.Now.Ticks;
        }

        public static void SyncWeaponProperties(string playerId, ItemValue weapon)
        {
            if (weapon == null) return;

            var weaponData = SerializeWeaponProperties(weapon);
            var syncData = new RPGSyncData(RPGSyncType.WeaponProperties, playerId, weaponData);
            
            QueueSync(syncData);
        }

        public static void OnPlayerJoin(string playerId)
        {
            Log.Out($"[RPG Overhaul] Player {playerId} joined - syncing data");
            
            // Clear any existing sync data for this player
            LastSyncTimes.Remove($"{playerId}_mastery");
            LastSyncTimes.Remove($"{playerId}_effects");
            
            // Load player's mastery data from storage
            MasterySystem.LoadMasteryData(playerId);
            
            // Clear any stale effects
            EffectTracker.ClearPlayerEffects(playerId);
            
            // Queue full sync
            var joinData = new RPGSyncData(RPGSyncType.PlayerJoin, playerId, "");
            QueueSync(joinData);
            
            // Sync to all other players
            BroadcastPlayerJoin(playerId);
        }

        public static void OnPlayerRespawn(string playerId)
        {
            Log.Out($"[RPG Overhaul] Player {playerId} respawned - clearing temporary effects");
            
            // Clear effects that shouldn't persist through death
            var effects = EffectTracker.GetPlayerEffects(playerId);
            foreach (var effect in effects)
            {
                if (ShouldClearOnDeath(effect))
                {
                    EffectTracker.RemoveEffect(effect.Id);
                }
            }
            
            var respawnData = new RPGSyncData(RPGSyncType.PlayerRespawn, playerId, "");
            QueueSync(respawnData);
        }

        public static void OnItemCloned(string playerId, ItemValue originalItem, ItemValue clonedItem)
        {
            if (originalItem == null || clonedItem == null) return;
            
            // Copy all RPG properties from original to clone
            CopyRPGProperties(originalItem, clonedItem);
            
            var cloneData = new RPGSyncData(RPGSyncType.ItemClone, playerId, 
                $"{originalItem.type}:{clonedItem.type}");
            QueueSync(cloneData);
        }

        private static void QueueSync(RPGSyncData syncData)
        {
            if (PendingSyncs.Count >= MAX_PENDING_SYNCS)
            {
                Log.Warning("[RPG Overhaul] Sync queue full, dropping oldest sync");
                PendingSyncs.Dequeue();
            }
            
            PendingSyncs.Enqueue(syncData);
        }

        private static void ProcessPendingSyncs()
        {
            if (!ConnectionManager.Instance.IsServer) return;
            
            int processed = 0;
            while (PendingSyncs.Count > 0 && processed < 10) // Process up to 10 per frame
            {
                var syncData = PendingSyncs.Dequeue();
                ProcessSyncData(syncData);
                processed++;
            }
        }

        private static void ProcessSyncData(RPGSyncData syncData)
        {
            try
            {
                switch (syncData.Type)
                {
                    case RPGSyncType.MasteryData:
                        BroadcastMasteryData(syncData);
                        break;
                    case RPGSyncType.ActiveEffects:
                        BroadcastEffectData(syncData);
                        break;
                    case RPGSyncType.WeaponProperties:
                        BroadcastWeaponData(syncData);
                        break;
                    case RPGSyncType.PlayerJoin:
                        HandlePlayerJoinSync(syncData);
                        break;
                    case RPGSyncType.PlayerRespawn:
                        BroadcastPlayerRespawn(syncData);
                        break;
                    case RPGSyncType.ItemClone:
                        HandleItemCloneSync(syncData);
                        break;
                }
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Error processing sync data: {ex.Message}");
            }
        }

        private static void BroadcastMasteryData(RPGSyncData syncData)
        {
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null && player.entityId.ToString() != syncData.PlayerId)
                {
                    // Send mastery data to client
                    SendCustomNetworkMessage(player, "RPG_MasterySync", syncData.Data);
                }
            }
        }

        private static void BroadcastEffectData(RPGSyncData syncData)
        {
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null)
                {
                    SendCustomNetworkMessage(player, "RPG_EffectSync", syncData.Data);
                }
            }
        }

        private static void BroadcastWeaponData(RPGSyncData syncData)
        {
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null)
                {
                    SendCustomNetworkMessage(player, "RPG_WeaponSync", syncData.Data);
                }
            }
        }

        private static void BroadcastPlayerJoin(string playerId)
        {
            // Notify all clients about new player joining
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null && player.entityId.ToString() != playerId)
                {
                    SendCustomNetworkMessage(player, "RPG_PlayerJoin", playerId);
                }
            }
        }

        private static void HandlePlayerJoinSync(RPGSyncData syncData)
        {
            // Send full data package to joining player
            SyncMasteryData(syncData.PlayerId);
            SyncActiveEffects(syncData.PlayerId);
        }

        private static void BroadcastPlayerRespawn(RPGSyncData syncData)
        {
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null)
                {
                    SendCustomNetworkMessage(player, "RPG_PlayerRespawn", syncData.PlayerId);
                }
            }
        }

        private static void HandleItemCloneSync(RPGSyncData syncData)
        {
            // Broadcast item clone event to all clients
            var players = GameManager.Instance.World.Players.list;
            foreach (var player in players)
            {
                if (player != null)
                {
                    SendCustomNetworkMessage(player, "RPG_ItemClone", syncData.Data);
                }
            }
        }

        private static void SendCustomNetworkMessage(EntityPlayer player, string messageType, string data)
        {
            try
            {
                // This is a simplified network message - in a real implementation,
                // you'd need to create proper network packages for 7D2D
                var bytes = Encoding.UTF8.GetBytes($"{messageType}:{data}");
                
                // For now, just log the message
                if (DebugCommands.IsDebugMode)
                {
                    Log.Out($"[RPG Overhaul] Would send {messageType} to {player.EntityName}: {data.Substring(0, Math.Min(100, data.Length))}...");
                }
            }
            catch (Exception ex)
            {
                Log.Error($"[RPG Overhaul] Failed to send network message: {ex.Message}");
            }
        }

        private static bool ShouldSkipSync(string playerId, RPGSyncType type)
        {
            var key = $"{playerId}_{type.ToString().ToLower()}";
            if (LastSyncTimes.TryGetValue(key, out long lastSync))
            {
                var timeSinceLastSync = new TimeSpan(DateTime.Now.Ticks - lastSync);
                return timeSinceLastSync.TotalSeconds < SYNC_INTERVAL;
            }
            return false;
        }

        private static bool ShouldClearOnDeath(ActiveEffect effect)
        {
            // Don't clear permanent buffs or masteries on death
            switch (effect.Type.ToLower())
            {
                case "mastery":
                case "permanent":
                    return false;
                default:
                    return true;
            }
        }

        private static void CopyRPGProperties(ItemValue source, ItemValue target)
        {
            var properties = new[]
            {
                "WeaponClass", "Tier", "ElementalDamageType", "ElementalDamage",
                "Prefixes", "Suffixes", "Implicits", "MasteryRequirement"
            };

            foreach (var prop in properties)
            {
                var value = source.GetPropertyOverride(prop, "");
                if (!string.IsNullOrEmpty(value))
                {
                    target.SetPropertyOverride(prop, value);
                }
            }

            // Copy triggered effects
            for (int i = 0; i < 10; i++)
            {
                var triggerProp = $"TriggeredEffect{i}_Trigger";
                var effectProp = $"TriggeredEffect{i}_Effect";
                var chanceProp = $"TriggeredEffect{i}_Chance";
                var powerProp = $"TriggeredEffect{i}_Power";

                var trigger = source.GetPropertyOverride(triggerProp, "");
                if (string.IsNullOrEmpty(trigger)) break;

                target.SetPropertyOverride(triggerProp, trigger);
                target.SetPropertyOverride(effectProp, source.GetPropertyOverride(effectProp, ""));
                target.SetPropertyOverride(chanceProp, source.GetPropertyOverride(chanceProp, ""));
                target.SetPropertyOverride(powerProp, source.GetPropertyOverride(powerProp, ""));
            }

            // Copy weapon parts
            for (int i = 0; i < 8; i++)
            {
                var slotProp = $"Part{i}_Slot";
                var slot = source.GetPropertyOverride(slotProp, "");
                if (string.IsNullOrEmpty(slot)) break;

                target.SetPropertyOverride(slotProp, slot);
                target.SetPropertyOverride($"Part{i}_Name", source.GetPropertyOverride($"Part{i}_Name", ""));
                target.SetPropertyOverride($"Part{i}_Tier", source.GetPropertyOverride($"Part{i}_Tier", ""));
            }
        }

        private static string SerializeMasteryData(string playerId)
        {
            // Serialize player's mastery data to JSON
            var masteryData = new Dictionary<string, object>();
            
            var weaponTypes = new[] { "pistol", "rifle", "shotgun", "sniper", "automatic" };
            foreach (var weaponType in weaponTypes)
            {
                var level = MasterySystem.GetMasteryLevel(playerId, weaponType);
                if (level > 0)
                {
                    masteryData[weaponType] = level;
                }
            }
            
            return JsonUtility.ToJson(masteryData);
        }

        private static string SerializeEffects(List<ActiveEffect> effects)
        {
            var effectData = new List<Dictionary<string, object>>();
            
            foreach (var effect in effects)
            {
                var data = new Dictionary<string, object>
                {
                    ["id"] = effect.Id,
                    ["name"] = effect.Name,
                    ["type"] = effect.Type,
                    ["duration"] = effect.Duration,
                    ["remaining"] = effect.RemainingTime,
                    ["power"] = effect.Power
                };
                effectData.Add(data);
            }
            
            return JsonUtility.ToJson(effectData);
        }

        private static string SerializeWeaponProperties(ItemValue weapon)
        {
            var weaponData = new Dictionary<string, string>();
            
            var properties = new[]
            {
                "WeaponClass", "Tier", "ElementalDamageType", "ElementalDamage",
                "Prefixes", "Suffixes", "MasteryRequirement"
            };

            foreach (var prop in properties)
            {
                var value = weapon.GetPropertyOverride(prop, "");
                if (!string.IsNullOrEmpty(value))
                {
                    weaponData[prop] = value;
                }
            }
            
            return JsonUtility.ToJson(weaponData);
        }

        public static void CleanupDisconnectedPlayer(string playerId)
        {
            // Clean up data for disconnected player
            LastSyncTimes.Remove($"{playerId}_mastery");
            LastSyncTimes.Remove($"{playerId}_effects");
            EffectTracker.ClearPlayerEffects(playerId);
            
            Log.Out($"[RPG Overhaul] Cleaned up data for disconnected player {playerId}");
        }
    }

    // Harmony patches for multiplayer events
    [HarmonyPatch]
    public static class NetworkSyncPatches
    {
        [HarmonyPatch(typeof(GameManager), "PlayerLogin")]
        [HarmonyPostfix]
        public static void OnPlayerLogin(ClientInfo _cInfo, bool _bFirstTimeLogin)
        {
            if (_cInfo?.playerId != null)
            {
                NetworkSync.OnPlayerJoin(_cInfo.playerId);
            }
        }

        [HarmonyPatch(typeof(GameManager), "PlayerDisconnected")]
        [HarmonyPostfix]
        public static void OnPlayerDisconnect(ClientInfo _cInfo, bool _bShutdown)
        {
            if (_cInfo?.playerId != null)
            {
                NetworkSync.CleanupDisconnectedPlayer(_cInfo.playerId);
            }
        }

        [HarmonyPatch(typeof(EntityPlayer), "OnEntityDeath")]
        [HarmonyPostfix]
        public static void OnPlayerDeath(EntityPlayer __instance)
        {
            NetworkSync.OnPlayerRespawn(__instance.entityId.ToString());
        }

        [HarmonyPatch(typeof(ItemStack), "Clone")]
        [HarmonyPostfix]
        public static void OnItemClone(ItemStack __result, ItemStack __instance)
        {
            if (__result?.itemValue != null && __instance?.itemValue != null)
            {
                var player = GameManager.Instance.World.GetPrimaryPlayer();
                if (player != null)
                {
                    NetworkSync.OnItemCloned(player.entityId.ToString(), __instance.itemValue, __result.itemValue);
                }
            }
        }
    }
}