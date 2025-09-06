using System;
using System.Reflection;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public class MainMinimal : IModApi
    {
        private static MainMinimal instance;
        
        public void InitMod(Mod modInstance)
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing RPG Overhaul Mod (Minimal)...");

            try
            {
                // Initialize Harmony patches
                var harmony = new Harmony("com.rpgoverhaul.mod.minimal");
                harmony.PatchAll(Assembly.GetExecutingAssembly());

                // Initialize minimal systems
                PropertyIntegrationMinimal.Initialize();
                WeaponInspectionMinimal.Initialize();

                // Create update handler
                var updateHandler = new GameObject("RPG_UpdateHandler_Minimal");
                updateHandler.AddComponent<RPGUpdateHandlerMinimal>();
                UnityEngine.Object.DontDestroyOnLoad(updateHandler);

                instance = this;
                UnityEngine.Debug.Log("[RPG Overhaul] RPG Overhaul Mod (Minimal) initialized successfully!");
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Failed to initialize mod: {ex.Message}");
                UnityEngine.Debug.LogError($"[RPG Overhaul] Stack trace: {ex.StackTrace}");
            }
        }

        public static MainMinimal Instance => instance;
    }

    public class RPGUpdateHandlerMinimal : MonoBehaviour
    {
        void Update()
        {
            try
            {
                // Update minimal systems
                WeaponInspectionMinimal.Update();
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogError($"[RPG Overhaul] Update error: {ex.Message}");
            }
        }
    }
}