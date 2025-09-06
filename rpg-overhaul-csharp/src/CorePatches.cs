using System;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    /// <summary>
    /// Essential Harmony patches for weapon processing and RPG integration
    /// </summary>
    [HarmonyPatch]
    public static class CorePatches
    {
        // Patch for weapon processing when items are used
        [HarmonyPatch(typeof(ItemActionAttack), "ExecuteAction")]
        [HarmonyPrefix]
        public static void PreExecuteAction(ItemActionData _actionData)
        {
            if (_actionData?.invData?.itemValue == null) return;

            try
            {
                // Process weapon for RPG features using property integration
                PropertyIntegration.ProcessWeapon(_actionData.invData.itemValue);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] Error processing weapon: {ex.Message}");
            }
        }

        // Patch for weapon attacks to apply RPG effects
        [HarmonyPatch(typeof(ItemActionAttack), "Hit")]
        [HarmonyPostfix]
        public static void PostHit(ItemActionAttack __instance, WorldRayHitInfo hitInfo, int _attackerEntityId)
        {
            try
            {
                var attacker = GameManager.Instance.World.GetEntity(_attackerEntityId) as EntityAlive;
                if (attacker == null) return;

                var holdingItem = attacker.inventory.holdingItemItemValue;
                if (holdingItem == null) return;

                // Get target entity
                var target = hitInfo.transform?.GetComponent<EntityAlive>();
                if (target == null) return;

                // Check for onHit triggers first
                PropertyIntegration.CheckTrigger(holdingItem, "onHit", attacker, target);

                // Apply elemental damage at hit time
                ApplyElementalDamageAtHit(holdingItem, attacker, target);

                // Check for headshot and apply triggered effects
                bool isHeadshot = IsHeadshot(hitInfo);
                if (isHeadshot)
                {
                    PropertyIntegration.CheckTrigger(holdingItem, "onHeadshot", attacker, target);
                }

                // Grant mastery XP for weapon use
                if (attacker is EntityPlayer player)
                {
                    MasterySystem.GrantWeaponUseXP(player.entityId.ToString(), holdingItem);
                }
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] PostHit error: {ex.Message}");
            }
        }

        // Apply elemental damage directly at hit time
        private static void ApplyElementalDamageAtHit(ItemValue weapon, EntityAlive attacker, EntityAlive target)
        {
            var elementalType = weapon.GetPropertyOverride("ElementalDamageType", "");
            var elementalDamage = weapon.GetPropertyOverride("ElementalDamage", "0");
            
            if (string.IsNullOrEmpty(elementalType) || elementalDamage == "0") return;

            if (float.TryParse(elementalDamage, out float damage) && damage > 0)
            {
                // Apply immediate elemental damage
                ElementalDamageSystem.ApplyElementalDamage(target, elementalType, damage, attacker);
                
                UnityEngine.Debug.Log($"[RPG Overhaul] Applied {elementalType} damage ({damage}) to {target.EntityName}");
            }
        }

        // Check if hit was a headshot
        private static bool IsHeadshot(WorldRayHitInfo hitInfo)
        {
            // Check if hit part is head (7D2D uses bodyPart index)
            return hitInfo.hit.bodyPart == 0; // Head is typically bodyPart 0
        }

        // Patch for ranged weapon firing to trigger effects
        [HarmonyPatch(typeof(ItemActionRanged), "Fire")]
        [HarmonyPrefix]
        public static void PreFire(ItemActionRanged __instance, ItemActionData _actionData)
        {
            try
            {
                if (_actionData == null || _actionData.invData.itemValue == null)
                    return;

                var weapon = _actionData.invData.itemValue;
                var holder = _actionData.invData.holdingEntity;

                // Check for onFire triggers
                PropertyIntegration.CheckTrigger(weapon, "onFire", holder, null);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] PreFire error: {ex.Message}");
            }
        }

        // Patch for damage application to handle DoT effects and critical hits
        [HarmonyPatch(typeof(EntityAlive), "DamageEntity")]
        [HarmonyPostfix]
        public static void PostDamageEntity(EntityAlive __instance, DamageResponse _dmResponse)
        {
            try
            {
                if (__instance == null || _dmResponse.Source == null) return;

                var attacker = _dmResponse.Source.getEntityAlive();
                if (attacker == null) return;

                // Check if this was a critical hit based on damage multiplier
                bool isCritical = _dmResponse.CritMultiplier > 1.0f;
                
                if (isCritical && attacker is EntityPlayer player)
                {
                    var weapon = player.inventory.holdingItemItemValue;
                    if (weapon != null)
                    {
                        // Trigger critical hit effects
                        PropertyIntegration.CheckTrigger(weapon, "onCritical", attacker, __instance);
                        
                        // Grant critical hit mastery XP
                        MasterySystem.GrantCriticalHitXP(player.entityId.ToString(), weapon);
                    }
                }

                // Handle elemental DoT application
                ElementalDamageSystem.ProcessDoTEffects(__instance, attacker);

            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] PostDamageEntity error: {ex.Message}");
            }
        }

        // Patch for entity death to handle kill triggers and XP
        [HarmonyPatch(typeof(EntityAlive), "OnEntityDeath")]
        [HarmonyPostfix]
        public static void PostEntityDeath(EntityAlive __instance)
        {
            try
            {
                if (__instance == null) return;

                // Find the killer (last damage source)
                var killer = __instance.attackingPlayers?.Count > 0 ? 
                    __instance.attackingPlayers[0] as EntityPlayer : null;

                if (killer != null)
                {
                    var weapon = killer.inventory.holdingItemItemValue;
                    if (weapon != null)
                    {
                        // Trigger kill effects
                        PropertyIntegration.CheckTrigger(weapon, "onKill", killer, __instance);
                        
                        // Grant kill mastery XP
                        MasterySystem.GrantKillXP(killer.entityId.ToString(), weapon, __instance);
                    }
                }
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.LogWarning($"[RPG Overhaul] PostEntityDeath error: {ex.Message}");
            }
        }
    }
}