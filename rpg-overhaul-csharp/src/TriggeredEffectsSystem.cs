using System;
using System.Collections.Generic;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public enum TriggerType
    {
        OnFire,
        OnHit,
        OnKill,
        OnHeadshot,
        OnCritical,
        OnReload,
        OnDamageTaken,
        OnLowHealth,
        OnDeath
    }

    public class TriggeredEffect
    {
        public TriggerType Trigger { get; set; }
        public string Effect { get; set; }
        public float Chance { get; set; }
        public float Value { get; set; }
        public float Cooldown { get; set; }
        public float LastTriggered { get; set; }

        public TriggeredEffect(TriggerType trigger, string effect, float chance, float value, float cooldown = 0)
        {
            Trigger = trigger;
            Effect = effect;
            Chance = chance;
            Value = value;
            Cooldown = cooldown;
            LastTriggered = 0;
        }
    }

    public static class TriggeredEffectsSystem
    {
        private static readonly Dictionary<string, List<TriggeredEffect>> WeaponEffects =
            new Dictionary<string, List<TriggeredEffect>>();

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Triggered Effects System");
        }

        public static void CheckTrigger(ItemValue weapon, string triggerName, EntityAlive entity)
        {
            if (weapon == null || entity == null) return;

            // Parse trigger type
            if (!Enum.TryParse(triggerName, true, out TriggerType triggerType))
                return;

            // Read triggered effects directly from weapon properties
            var effects = GetTriggeredEffectsFromWeapon(weapon);
            
            // Check each effect
            foreach (var effect in effects)
            {
                if (effect.Trigger == triggerType && CanTrigger(effect))
                {
                    if (UnityEngine.Random.value < effect.Chance)
                    {
                        ApplyEffect(effect, entity);
                        effect.LastTriggered = Time.time;
                    }
                }
            }
        }
        
        private static List<TriggeredEffect> GetTriggeredEffectsFromWeapon(ItemValue weapon)
        {
            var effects = new List<TriggeredEffect>();
            
            // Read triggered effects from properties (TriggeredEffect0_Trigger, TriggeredEffect1_Trigger, etc.)
            for (int i = 0; i < 10; i++) // Support up to 10 triggered effects
            {
                var triggerProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                var effectProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                var chanceProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Chance", "0");
                var cooldownProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Cooldown", "0");
                
                if (string.IsNullOrEmpty(triggerProp) || string.IsNullOrEmpty(effectProp))
                    break; // No more effects
                    
                if (Enum.TryParse(triggerProp, true, out TriggerType trigger))
                {
                    float chance = StringParsers.ParseFloat(chanceProp);
                    float cooldown = StringParsers.ParseFloat(cooldownProp);
                    
                    effects.Add(new TriggeredEffect(trigger, effectProp, chance, 0, cooldown));
                }
            }
            
            return effects;
        }

        private static bool CanTrigger(TriggeredEffect effect)
        {
            if (effect.Cooldown <= 0) return true;
            return (Time.time - effect.LastTriggered) >= effect.Cooldown;
        }

        private static void ApplyEffect(TriggeredEffect effect, EntityAlive entity)
        {
            switch (effect.Effect)
            {
                case "instantKill":
                    ApplyInstantKill(entity);
                    break;
                case "heal":
                    ApplyHeal(entity, effect.Value);
                    break;
                case "damage":
                    ApplyDamage(entity, effect.Value);
                    break;
                case "explosion":
                    ApplyExplosion(entity, effect.Value);
                    break;
                case "slow":
                    ApplySlow(entity, effect.Value);
                    break;
                case "buff":
                    ApplyBuff(entity, effect.Value);
                    break;
                case "chainLightning":
                    ApplyChainLightning(entity, effect.Value);
                    break;
                default:
                    Log.Warning($"[RPG Overhaul] Unknown triggered effect: {effect.Effect}");
                    break;
            }
        }

        private static void ApplyInstantKill(EntityAlive entity)
        {
            if (entity == null || entity.IsDead()) return;

            var damage = new DamageSource(EnumDamageSourceType.InternalBleeding);
            damage.SetDamage(entity.GetMaxHealth() * 2); // Overkill to ensure death
            entity.DamageEntity(damage, false);

            // Visual effect
            CreateEffect(entity, "p_onDeath01");
        }

        private static void ApplyHeal(EntityAlive entity, float amount)
        {
            if (entity == null || !(entity is EntityPlayer)) return;

            var player = entity as EntityPlayer;
            player.AddHealth(amount);

            // Visual effect
            CreateEffect(entity, "p_playerHealthIncrease");
        }

        private static void ApplyDamage(EntityAlive entity, float amount)
        {
            if (entity == null || entity.IsDead()) return;

            var damage = new DamageSource(EnumDamageSourceType.InternalBleeding);
            damage.SetDamage(amount);
            entity.DamageEntity(damage, false);

            // Visual effect
            CreateEffect(entity, "p_damage01");
        }

        private static void ApplyExplosion(EntityAlive entity, float radius)
        {
            if (entity == null) return;

            var position = entity.GetPosition();
            var explosion = new Explosion();
            explosion.center = position;
            explosion.radius = radius;
            explosion.damage = 50;
            explosion.falloff = 0.5f;

            GameManager.Instance.ExplosionServer(explosion, entity, false);
        }

        private static void ApplySlow(EntityAlive entity, float duration)
        {
            if (entity == null) return;

            // Apply slow buff
            var buff = new Buff();
            buff.BuffName = "Slow";
            buff.Duration = duration;
            buff.Effects.Add(new BuffModifier("MovementSpeed", -0.5f));

            entity.AddBuff(buff);
        }

        private static void ApplyBuff(EntityAlive entity, float duration)
        {
            if (entity == null) return;

            // Apply random positive buff
            var buffs = new[] { "DamageBoost", "SpeedBoost", "DefenseBoost" };
            var randomBuff = buffs[UnityEngine.Random.Range(0, buffs.Length)];

            var buff = new Buff();
            buff.BuffName = randomBuff;
            buff.Duration = duration;

            switch (randomBuff)
            {
                case "DamageBoost":
                    buff.Effects.Add(new BuffModifier("Damage", 0.25f));
                    break;
                case "SpeedBoost":
                    buff.Effects.Add(new BuffModifier("MovementSpeed", 0.2f));
                    break;
                case "DefenseBoost":
                    buff.Effects.Add(new BuffModifier("PhysicalDamageResist", 0.15f));
                    break;
            }

            entity.AddBuff(buff);
        }

        private static void ApplyChainLightning(EntityAlive entity, float damage)
        {
            if (entity == null) return;

            var position = entity.GetPosition();
            var entities = GameManager.Instance.World.GetEntitiesInBounds(
                entity, new Bounds(position, new Vector3(10, 10, 10)));

            foreach (var target in entities)
            {
                if (target != entity && !target.IsDead())
                {
                    var lightningDamage = new DamageSource(EnumDamageSourceType.Electric);
                    lightningDamage.SetDamage(damage);
                    target.DamageEntity(lightningDamage, false);

                    // Create lightning effect
                    CreateLightningEffect(entity, target);
                    break; // Only chain to one target
                }
            }
        }

        private static void CreateEffect(EntityAlive entity, string effectName)
        {
            var position = entity.GetPosition();
            GameManager.Instance.World.CreateParticleEffect(effectName, position, Quaternion.identity);
        }

        private static void CreateLightningEffect(EntityAlive from, EntityAlive to)
        {
            var startPos = from.GetPosition();
            var endPos = to.GetPosition();

            // Create lightning particle effect between entities
            var direction = (endPos - startPos).normalized;
            var distance = Vector3.Distance(startPos, endPos);
            var midPoint = startPos + (direction * distance * 0.5f);

            GameManager.Instance.World.CreateParticleEffect("p_electricBolt", midPoint, Quaternion.identity);
        }

        public static void LoadWeaponEffects(ItemValue weapon)
        {
            if (weapon == null) return;

            var weaponId = weapon.GetPropertyOverride("ItemID", "");
            var effects = new List<TriggeredEffect>();

            // Load effects from weapon properties
            for (int i = 0; ; i++)
            {
                var triggerProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Trigger", "");
                var effectProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Effect", "");
                var chanceProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Chance", "0");
                var valueProp = weapon.GetPropertyOverride($"TriggeredEffect{i}_Value", "0");

                if (string.IsNullOrEmpty(triggerProp) || string.IsNullOrEmpty(effectProp))
                    break;

                if (Enum.TryParse(triggerProp, true, out TriggerType triggerType) &&
                    float.TryParse(chanceProp, out float chance) &&
                    float.TryParse(valueProp, out float value))
                {
                    effects.Add(new TriggeredEffect(triggerType, effectProp, chance, value));
                }
            }

            if (effects.Count > 0)
            {
                WeaponEffects[weaponId] = effects;
            }
        }

        public static void ApplyTriggeredEffect(string effectName, string power, EntityAlive attacker, EntityAlive target)
        {
            if (string.IsNullOrEmpty(effectName)) return;

            float powerValue = StringParsers.ParseFloat(power);
            
            // Track triggered effects in EffectTracker
            var effectTarget = target ?? attacker;
            if (effectTarget != null)
            {
                float duration = GetEffectDuration(effectName, powerValue);
                if (duration > 0)
                {
                    EffectTracker.AddEffect(effectTarget, "triggered", effectName, duration, powerValue, attacker);
                }
            }
            
            switch (effectName.ToLower())
            {
                case "instantkill":
                    if (target != null) ApplyInstantKill(target);
                    break;
                case "heal":
                    if (attacker != null) ApplyHeal(attacker, powerValue);
                    break;
                case "damage":
                    if (target != null) ApplyDamage(target, powerValue);
                    break;
                case "explosion":
                    if (target != null) ApplyExplosion(target, powerValue);
                    break;
                case "slow":
                    if (target != null) ApplySlow(target, powerValue);
                    break;
                case "buff":
                    if (attacker != null) ApplyBuff(attacker, powerValue);
                    break;
                case "chainlightning":
                    if (target != null) ApplyChainLightning(target, powerValue);
                    break;
                default:
                    Log.Out($"[RPG Overhaul] Applied unknown triggered effect: {effectName} (power: {power})");
                    break;
            }
        }

        private static float GetEffectDuration(string effectName, float power)
        {
            switch (effectName.ToLower())
            {
                case "slow": return 5.0f;
                case "buff": return 10.0f;
                case "heal": return 0.1f; // Instant but show briefly
                case "damage": return 0.1f; // Instant but show briefly
                default: return 0f; // No duration tracking
            }
        }
    }
}
