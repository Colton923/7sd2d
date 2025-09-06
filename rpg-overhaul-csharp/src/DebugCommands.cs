using System;
using System.Collections.Generic;
using System.Linq;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public static class DebugCommands
    {
        private static bool debugMode = false;
        private static readonly Dictionary<string, Action<string[]>> Commands = new Dictionary<string, Action<string[]>>();

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Debug Commands");
            RegisterCommands();
        }

        private static void RegisterCommands()
        {
            Commands["rpg_spawnloot"] = SpawnTestLoot;
            Commands["rpg_forcetrigger"] = ForceTrigger;
            Commands["rpg_dumpitem"] = DumpItemProperties;
            Commands["rpg_setmastery"] = SetMastery;
            Commands["rpg_cleareffects"] = ClearEffects;
            Commands["rpg_debugmode"] = ToggleDebugMode;
            Commands["rpg_addeffect"] = AddTestEffect;
            Commands["rpg_listeffects"] = ListActiveEffects;
            Commands["rpg_testweapon"] = TestWeaponGeneration;
            Commands["rpg_syncdata"] = SyncPlayerData;
            Commands["rpg_help"] = ShowHelp;
        }

        [HarmonyPatch(typeof(ConsoleCmdHelp), "Execute")]
        [HarmonyPostfix]
        public static void AddRPGCommands(List<string> _params, CommandSenderInfo _senderInfo)
        {
            if (_params.Count > 0 && _params[0].StartsWith("rpg_"))
            {
                var command = _params[0].ToLower();
                if (Commands.TryGetValue(command, out Action<string[]> handler))
                {
                    try
                    {
                        handler(_params.Skip(1).ToArray());
                    }
                    catch (Exception ex)
                    {
                        SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"[RPG Overhaul] Command error: {ex.Message}");
                    }
                }
                else
                {
                    SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"[RPG Overhaul] Unknown command: {command}");
                    ShowHelp(new string[0]);
                }
            }
        }

        private static void SpawnTestLoot(string[] args)
        {
            if (args.Length < 2)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Usage: rpg_spawnloot <tier> <type>");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Tiers: 1-5, Types: pistol, rifle, shotgun, sniper, automatic");
                return;
            }

            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("No primary player found");
                return;
            }

            int tier = StringParsers.ParseSInt32(args[0], 1, 5, 1);
            string weaponType = args[1].ToLower();

            // Generate test weapon with specific properties
            var testWeapon = GenerateTestWeapon(tier, weaponType);
            if (testWeapon != null)
            {
                var itemStack = new ItemStack(testWeapon, 1);
                GameManager.Instance.ItemDropServer(itemStack, player.GetPosition(), Vector3.up);
                
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output(
                    $"Spawned tier {tier} {weaponType} with test properties");
                
                if (debugMode)
                {
                    DumpItemProperties(new string[] { testWeapon.type.ToString() });
                }
            }
        }

        private static ItemValue GenerateTestWeapon(int tier, string weaponType)
        {
            // This is a simplified test weapon generator
            ItemValue weapon = null;
            
            switch (weaponType)
            {
                case "pistol":
                    weapon = new ItemValue(ItemClass.GetItem("gunPistol").Id, false);
                    break;
                case "rifle":
                    weapon = new ItemValue(ItemClass.GetItem("gunAK47").Id, false);
                    break;
                case "shotgun":
                    weapon = new ItemValue(ItemClass.GetItem("gunPumpShotgun").Id, false);
                    break;
                case "sniper":
                    weapon = new ItemValue(ItemClass.GetItem("gunSniperRifle").Id, false);
                    break;
                default:
                    weapon = new ItemValue(ItemClass.GetItem("gunPistol").Id, false);
                    break;
            }

            if (weapon != null)
            {
                // Add test properties based on tier
                weapon.SetPropertyOverride("WeaponClass", weaponType);
                weapon.SetPropertyOverride("Tier", tier.ToString());
                
                // Add elemental damage
                var elementalTypes = new[] { "Fire", "Ice", "Electric", "Poison", "Bleeding" };
                var randomElemental = elementalTypes[UnityEngine.Random.Range(0, elementalTypes.Length)];
                weapon.SetPropertyOverride("ElementalDamageType", randomElemental);
                weapon.SetPropertyOverride("ElementalDamage", (tier * 10 + UnityEngine.Random.Range(5, 15)).ToString());
                
                // Add triggered effects
                weapon.SetPropertyOverride("TriggeredEffect0_Trigger", "onHit");
                weapon.SetPropertyOverride("TriggeredEffect0_Effect", "damage");
                weapon.SetPropertyOverride("TriggeredEffect0_Chance", (0.1f + tier * 0.05f).ToString());
                weapon.SetPropertyOverride("TriggeredEffect0_Power", (tier * 20).ToString());
                
                // Add affixes
                var prefixes = new[] { "Brutal", "Vicious", "Devastating", "Precise", "Keen" };
                var suffixes = new[] { "of Power", "of Precision", "of Speed", "of Destruction" };
                
                if (tier >= 2)
                {
                    weapon.SetPropertyOverride("Prefixes", prefixes[UnityEngine.Random.Range(0, prefixes.Length)]);
                }
                if (tier >= 3)
                {
                    weapon.SetPropertyOverride("Suffixes", suffixes[UnityEngine.Random.Range(0, suffixes.Length)]);
                }
                
                // Add weapon parts
                if (tier >= 2)
                {
                    weapon.SetPropertyOverride("Part0_Slot", "Barrel");
                    weapon.SetPropertyOverride("Part0_Name", "Heavy Barrel");
                    weapon.SetPropertyOverride("Part0_Tier", "Advanced");
                }
                
                weapon.SetPropertyOverride("MasteryRequirement", (tier * 10).ToString());
            }

            return weapon;
        }

        private static void ForceTrigger(string[] args)
        {
            if (args.Length < 1)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Usage: rpg_forcetrigger <effect> [target_entity_id]");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Effects: instantkill, heal, damage, explosion, slow, buff, chainlightning");
                return;
            }

            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var effectName = args[0];
            EntityAlive target = player;

            if (args.Length > 1 && int.TryParse(args[1], out int targetId))
            {
                target = GameManager.Instance.World.GetEntity(targetId) as EntityAlive;
                if (target == null)
                {
                    SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Entity {targetId} not found");
                    return;
                }
            }

            // Force trigger the effect
            TriggeredEffectsSystem.ApplyTriggeredEffect(effectName, "100", player, target);
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Forced trigger: {effectName} on {target.EntityName}");
        }

        private static void DumpItemProperties(string[] args)
        {
            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var heldItem = player.inventory.holdingItemItemValue;
            if (heldItem == null)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("No item held");
                return;
            }

            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("=== ITEM PROPERTIES ===");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Item: {heldItem.ItemClass.GetItemName()}");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Type: {heldItem.type}");
            
            // Dump all custom properties
            var properties = new[]
            {
                "WeaponClass", "Tier", "ElementalDamageType", "ElementalDamage",
                "Prefixes", "Suffixes", "Implicits", "MasteryRequirement"
            };

            foreach (var prop in properties)
            {
                var value = heldItem.GetPropertyOverride(prop, "");
                if (!string.IsNullOrEmpty(value))
                {
                    SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"{prop}: {value}");
                }
            }

            // Dump triggered effects
            for (int i = 0; i < 10; i++)
            {
                var trigger = heldItem.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                if (string.IsNullOrEmpty(trigger)) break;
                
                var effect = heldItem.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                var chance = heldItem.GetPropertyOverride($"TriggeredEffect{i}_Chance", "");
                var power = heldItem.GetPropertyOverride($"TriggeredEffect{i}_Power", "");
                
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output(
                    $"Trigger {i}: {trigger} -> {effect} ({chance}% chance, {power} power)");
            }

            // Dump parts
            for (int i = 0; i < 8; i++)
            {
                var slot = heldItem.GetPropertyOverride($"Part{i}_Slot", "");
                if (string.IsNullOrEmpty(slot)) break;
                
                var name = heldItem.GetPropertyOverride($"Part{i}_Name", "");
                var tier = heldItem.GetPropertyOverride($"Part{i}_Tier", "");
                
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Part {i}: {slot} = {name} ({tier})");
            }
        }

        private static void SetMastery(string[] args)
        {
            if (args.Length < 2)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Usage: rpg_setmastery <weapon_class> <level>");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Classes: pistol, rifle, shotgun, sniper, automatic");
                return;
            }

            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var weaponClass = args[0];
            int level = StringParsers.ParseSInt32(args[1], 0, 100, 1);

            var playerId = player.entityId.ToString();
            var mastery = MasterySystem.GetMastery(playerId, weaponClass);
            mastery.Level = level;
            mastery.Experience = MasterySystem.GetRequiredExperienceForLevel(level);

            MasterySystem.SaveMasteryData(playerId);
            
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output(
                $"Set {weaponClass} mastery to level {level} for {player.EntityName}");
        }

        private static void ClearEffects(string[] args)
        {
            EffectTracker.ClearAllEffects();
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Cleared all active effects");
        }

        private static void ToggleDebugMode(string[] args)
        {
            if (args.Length > 0)
            {
                debugMode = args[0].ToLower() == "on" || args[0] == "1" || args[0].ToLower() == "true";
            }
            else
            {
                debugMode = !debugMode;
            }
            
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Debug mode: {(debugMode ? "ON" : "OFF")}");
        }

        private static void AddTestEffect(string[] args)
        {
            if (args.Length < 2)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Usage: rpg_addeffect <type> <duration> [power]");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("Types: fire, ice, poison, bleeding, buff, debuff");
                return;
            }

            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var effectType = args[0];
            float duration = StringParsers.ParseFloat(args[1]);
            float power = args.Length > 2 ? StringParsers.ParseFloat(args[2]) : 1.0f;

            EffectTracker.AddEffect(player, effectType, $"Test {effectType}", duration, power);
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Added {effectType} effect for {duration}s");
        }

        private static void ListActiveEffects(string[] args)
        {
            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var effects = EffectTracker.GetPlayerEffects(player.entityId.ToString());
            if (effects.Count == 0)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output("No active effects");
                return;
            }

            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("=== ACTIVE EFFECTS ===");
            foreach (var effect in effects)
            {
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output(
                    $"{effect.Name}: {effect.RemainingTime:F1}s remaining (Power: {effect.Power})");
            }
        }

        private static void TestWeaponGeneration(string[] args)
        {
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("=== WEAPON GENERATION TEST ===");
            
            for (int tier = 1; tier <= 5; tier++)
            {
                var testWeapon = GenerateTestWeapon(tier, "rifle");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Tier {tier} weapon generated with:");
                
                var elemental = testWeapon.GetPropertyOverride("ElementalDamageType", "None");
                var damage = testWeapon.GetPropertyOverride("ElementalDamage", "0");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"  Elemental: {elemental} ({damage} damage)");
                
                var prefixes = testWeapon.GetPropertyOverride("Prefixes", "None");
                var suffixes = testWeapon.GetPropertyOverride("Suffixes", "None");
                SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"  Affixes: {prefixes} / {suffixes}");
            }
        }

        private static void SyncPlayerData(string[] args)
        {
            var player = GameManager.Instance.World.GetPrimaryPlayer();
            if (player == null) return;

            var playerId = player.entityId.ToString();
            
            // Force sync mastery data
            MasterySystem.SyncMasteryToClients(playerId);
            
            // Clear and reload effects
            EffectTracker.ClearPlayerEffects(playerId);
            
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output($"Synced data for player {player.EntityName}");
        }

        private static void ShowHelp(string[] args)
        {
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("=== RPG OVERHAUL DEBUG COMMANDS ===");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_spawnloot <tier> <type> - Spawn test weapon");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_forcetrigger <effect> [target] - Force trigger effect");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_dumpitem - Show held item properties");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_setmastery <class> <level> - Set mastery level");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_cleareffects - Clear all active effects");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_debugmode [on/off] - Toggle debug mode");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_addeffect <type> <duration> [power] - Add test effect");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_listeffects - List active effects");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_testweapon - Test weapon generation");
            SingletonMonoBehaviour<SdtdConsole>.Instance.Output("rpg_syncdata - Sync player data");
        }

        public static bool IsDebugMode => debugMode;
    }
}