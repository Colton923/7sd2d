using System;
using System.Reflection;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public class Main : IModApi
    {
        private static Main instance;
        
        public void InitMod(Mod modInstance)
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing RPG Overhaul Mod...");

            try
            {
                // Initialize Harmony patches
                var harmony = new Harmony("com.rpgoverhaul.mod");
                harmony.PatchAll(Assembly.GetExecutingAssembly());

                // Initialize core systems
                PropertyIntegration.Initialize();
                AffixSystem.Initialize();
                ElementalDamageSystem.Initialize();
                TriggeredEffectsSystem.Initialize();
                MasterySystem.Initialize();
                WeaponPartsSystem.Initialize();

                // Initialize UI/Debug/Multiplayer systems
                WeaponInspectionSystem.Initialize();
                EffectTracker.Initialize();
                NetworkSync.Initialize();
                DebugCommands.Initialize();

                // Initialize UI components (will be created when needed)
                // Note: Legacy Unity UI components removed in favor of 7D2D-compatible WeaponInspectionSystem

                // Create update handler
                var updateHandler = new GameObject("RPG_UpdateHandler");
                updateHandler.AddComponent<RPGUpdateHandler>();
                UnityEngine.Object.DontDestroyOnLoad(updateHandler);

                instance = this;
                UnityEngine.Debug.Log("[RPG Overhaul] RPG Overhaul Mod initialized successfully!");
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Failed to initialize mod: {ex.Message}");
            }
        }

        public static Main Instance => instance;
    }

    public class RPGUpdateHandler : MonoBehaviour
    {
        void Update()
        {
            try
            {
                // Update systems that need periodic updates
                WeaponInspectionSystem.Update();
                
                // Update other systems if they exist
                try
                {
                    EffectTracker.UpdateEffects();
                    NetworkSync.Update();
                }
                catch (Exception innerEx)
                {
                    // Non-critical systems - log but don't crash
                    UnityEngine.Debug.LogWarning($"[RPG Overhaul] Non-critical system update error: {innerEx.Message}");
                }
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Critical update error: {ex.Message}");
            }
        }
    }
}
