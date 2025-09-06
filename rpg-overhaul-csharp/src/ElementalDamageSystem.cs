using System;
using System.Collections.Generic;
using System.Linq;
using HarmonyLib;
using UnityEngine;

namespace RPGOverhaul
{
    public enum ElementalType
    {
        None,
        Fire,
        Ice,
        Electric,
        Poison,
        Radiation,
        Explosive,
        Bleeding,
        Void,
        Holy,
        Chaos,
        Plasma,
        Corrosive,
        Sonic,
        Psychic,
        Quantum
    }

    public class ElementalEffect
    {
        public ElementalType Type { get; set; }
        public float Damage { get; set; }
        public float Duration { get; set; }
        public float TickRate { get; set; }
        public float SpreadChance { get; set; }

        public ElementalEffect(ElementalType type, float damage, float duration = 0, float tickRate = 1f, float spreadChance = 0)
        {
            Type = type;
            Damage = damage;
            Duration = duration;
            TickRate = tickRate;
            SpreadChance = spreadChance;
        }
    }

    public static class ElementalDamageSystem
    {
        private static readonly Dictionary<ElementalType, Color> ElementalColors = new Dictionary<ElementalType, Color>
        {
            { ElementalType.Fire, new Color(1f, 0.3f, 0f) },
            { ElementalType.Ice, new Color(0.3f, 0.8f, 1f) },
            { ElementalType.Electric, new Color(1f, 1f, 0f) },
            { ElementalType.Poison, new Color(0.3f, 1f, 0.3f) },
            { ElementalType.Radiation, new Color(0f, 1f, 0f) },
            { ElementalType.Explosive, new Color(1f, 0.5f, 0f) },
            { ElementalType.Bleeding, new Color(0.8f, 0f, 0f) },
            { ElementalType.Void, new Color(0.2f, 0f, 0.4f) }
        };

        public static void Initialize()
        {
            UnityEngine.Debug.Log("[RPG Overhaul] Initializing Elemental Damage System");
        }

        public static ElementalType ParseElementalType(string typeString)
        {
            if (Enum.TryParse(typeString, true, out ElementalType result))
                return result;
            return ElementalType.None;
        }

        public static void ApplyElementalDamage(Entity entity, ElementalEffect effect)
        {
            if (entity == null || effect.Type == ElementalType.None)
                return;

            // Apply immediate damage
            var damage = new DamageSource(EnumDamageSourceType.InternalBleeding);
            damage.SetDamage(effect.Damage);
            entity.DamageEntity(damage, false);

            // Apply DoT if duration > 0
            if (effect.Duration > 0)
            {
                var dotEffect = new ElementalDotEffect(entity, effect);
                entity.gameObject.AddComponent<ElementalDotEffect>();
            }

            // Visual effects
            CreateElementalEffect(entity, effect.Type);
        }

        public static void ApplyElementalDamage(EntityAlive target, string elementalType, float damage, EntityAlive attacker)
        {
            var type = ParseElementalType(elementalType);
            if (type == ElementalType.None || damage <= 0) return;

            // Create elemental effect with appropriate duration based on type
            float duration = GetElementalDuration(type);
            var effect = new ElementalEffect(type, damage, duration);

            // Apply to target
            ApplyElementalDamage(target, effect);

            // Track the effect in EffectTracker for UI display
            EffectTracker.AddEffect(target, elementalType.ToLower(), $"{elementalType} Damage", duration, damage, attacker);

            // Log for debugging
            UnityEngine.Debug.Log($"[RPG Overhaul] Applied {elementalType} elemental damage ({damage}) to {target.EntityName}");
        }

        public static void ProcessDoTEffects(EntityAlive target, EntityAlive attacker)
        {
            if (target == null) return;

            // Check if target has any active DoT effects that need processing
            var dotComponents = target.GetComponents<ElementalDotEffect>();
            foreach (var dot in dotComponents)
            {
                if (dot != null && dot.IsActive())
                {
                    UnityEngine.Debug.Log($"[RPG Overhaul] Processing DoT effect on {target.EntityName}");
                }
            }
        }

        private static float GetElementalDuration(ElementalType type)
        {
            switch (type)
            {
                case ElementalType.Fire: return 5.0f;
                case ElementalType.Poison: return 10.0f;
                case ElementalType.Bleeding: return 8.0f;
                case ElementalType.Ice: return 3.0f;
                case ElementalType.Radiation: return 15.0f;
                default: return 2.0f;
            }
        }

        private static void CreateElementalEffect(Entity entity, ElementalType type)
        {
            if (!ElementalColors.TryGetValue(type, out Color color))
                return;

            // Create particle effect at entity position
            var position = entity.GetPosition();
            var particleSystem = GameManager.Instance.World.CreateParticleEffect(
                "p_onDeath01", position, Quaternion.identity);

            if (particleSystem != null)
            {
                var main = particleSystem.main;
                main.startColor = color;
            }
        }
    }

    public class ElementalDotEffect : MonoBehaviour
    {
        private Entity targetEntity;
        private ElementalEffect effect;
        private float timeRemaining;
        private float nextTickTime;

        public void Initialize(Entity entity, ElementalEffect elementalEffect)
        {
            targetEntity = entity;
            effect = elementalEffect;
            timeRemaining = elementalEffect.Duration;
            nextTickTime = Time.time + elementalEffect.TickRate;
        }

        public bool IsActive()
        {
            return timeRemaining > 0 && targetEntity != null && !targetEntity.IsDead();
        }

        void Update()
        {
            if (targetEntity == null || targetEntity.IsDead())
            {
                Destroy(this);
                return;
            }

            if (Time.time >= nextTickTime)
            {
                // Apply tick damage
                var damage = new DamageSource(EnumDamageSourceType.InternalBleeding);
                damage.SetDamage(effect.Damage * 0.2f); // Reduced tick damage
                targetEntity.DamageEntity(damage, false);

                // Check for spread
                if (effect.SpreadChance > 0 && UnityEngine.Random.value < effect.SpreadChance)
                {
                    SpreadToNearbyEntities();
                }

                nextTickTime = Time.time + effect.TickRate;
            }

            timeRemaining -= Time.deltaTime;
            if (timeRemaining <= 0)
            {
                Destroy(this);
            }
        }

        private void SpreadToNearbyEntities()
        {
            var position = targetEntity.GetPosition();
            var entities = GameManager.Instance.World.GetEntitiesInBounds(
                targetEntity, new Bounds(position, new Vector3(5, 5, 5)));

            foreach (var entity in entities)
            {
                if (entity != targetEntity && !entity.IsDead())
                {
                    ElementalDamageSystem.ApplyElementalDamage(entity,
                        new ElementalEffect(effect.Type, effect.Damage * 0.5f, effect.Duration * 0.5f));
                    break; // Only spread to one entity
                }
            }
        }
    }
}
