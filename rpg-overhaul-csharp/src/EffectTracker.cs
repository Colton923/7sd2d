using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace RPGOverhaul
{
    public class ActiveEffect
    {
        public string Id { get; set; }
        public string Type { get; set; } // "DoT", "Buff", "Triggered"
        public string Name { get; set; }
        public float Duration { get; set; }
        public float RemainingTime { get; set; }
        public float Power { get; set; }
        public string Description { get; set; }
        public Color DisplayColor { get; set; }
        public EntityAlive Target { get; set; }
        public EntityAlive Source { get; set; }
        public DateTime StartTime { get; set; }

        public ActiveEffect(string id, string type, string name, float duration, float power = 1.0f)
        {
            Id = id;
            Type = type;
            Name = name;
            Duration = duration;
            RemainingTime = duration;
            Power = power;
            StartTime = DateTime.Now;
            DisplayColor = GetColorForType(type);
        }

        private Color GetColorForType(string type)
        {
            switch (type.ToLower())
            {
                case "fire": return new Color(1f, 0.3f, 0f);
                case "ice": return new Color(0.3f, 0.8f, 1f);
                case "electric": return new Color(1f, 1f, 0f);
                case "poison": return new Color(0.3f, 1f, 0.3f);
                case "bleeding": return new Color(0.8f, 0f, 0f);
                case "buff": return new Color(0f, 1f, 0f);
                case "debuff": return new Color(1f, 0.5f, 0f);
                default: return Color.white;
            }
        }

        public bool IsExpired => RemainingTime <= 0;
    }

    public static class EffectTracker
    {
        private static readonly Dictionary<string, List<ActiveEffect>> PlayerEffects = 
            new Dictionary<string, List<ActiveEffect>>();

        private static readonly Dictionary<string, List<ActiveEffect>> EntityEffects = 
            new Dictionary<string, List<ActiveEffect>>();

        public static event Action<ActiveEffect> OnEffectAdded;
        public static event Action<ActiveEffect> OnEffectRemoved;
        public static event Action<ActiveEffect> OnEffectUpdated;

        public static void Initialize()
        {
            Log.Out("[RPG Overhaul] Initializing Effect Tracker");
        }

        public static void AddEffect(EntityAlive target, string effectType, string effectName, 
            float duration, float power = 1.0f, EntityAlive source = null)
        {
            if (target == null || string.IsNullOrEmpty(effectName)) return;

            var targetId = GetEntityId(target);
            var effectId = $"{effectName}_{DateTime.Now.Ticks}";
            
            var effect = new ActiveEffect(effectId, effectType, effectName, duration, power)
            {
                Target = target,
                Source = source,
                Description = GenerateDescription(effectType, effectName, power)
            };

            if (target is EntityPlayer)
            {
                if (!PlayerEffects.ContainsKey(targetId))
                    PlayerEffects[targetId] = new List<ActiveEffect>();
                PlayerEffects[targetId].Add(effect);
            }
            else
            {
                if (!EntityEffects.ContainsKey(targetId))
                    EntityEffects[targetId] = new List<ActiveEffect>();
                EntityEffects[targetId].Add(effect);
            }

            OnEffectAdded?.Invoke(effect);
            Log.Out($"[RPG Overhaul] Added effect {effectName} to {target.EntityName} for {duration}s");
        }

        public static void RemoveEffect(string effectId)
        {
            var effect = FindEffect(effectId);
            if (effect == null) return;

            var targetId = GetEntityId(effect.Target);

            if (effect.Target is EntityPlayer)
            {
                PlayerEffects[targetId]?.Remove(effect);
                if (PlayerEffects[targetId]?.Count == 0)
                    PlayerEffects.Remove(targetId);
            }
            else
            {
                EntityEffects[targetId]?.Remove(effect);
                if (EntityEffects[targetId]?.Count == 0)
                    EntityEffects.Remove(targetId);
            }

            OnEffectRemoved?.Invoke(effect);
            Log.Out($"[RPG Overhaul] Removed effect {effect.Name} from {effect.Target.EntityName}");
        }

        public static void UpdateEffects()
        {
            var expiredEffects = new List<ActiveEffect>();

            // Update player effects
            foreach (var playerEffects in PlayerEffects.Values)
            {
                foreach (var effect in playerEffects.ToList())
                {
                    effect.RemainingTime -= Time.deltaTime;
                    
                    if (effect.IsExpired || effect.Target == null || effect.Target.IsDead())
                    {
                        expiredEffects.Add(effect);
                    }
                    else
                    {
                        OnEffectUpdated?.Invoke(effect);
                    }
                }
            }

            // Update entity effects
            foreach (var entityEffects in EntityEffects.Values)
            {
                foreach (var effect in entityEffects.ToList())
                {
                    effect.RemainingTime -= Time.deltaTime;
                    
                    if (effect.IsExpired || effect.Target == null || effect.Target.IsDead())
                    {
                        expiredEffects.Add(effect);
                    }
                    else
                    {
                        OnEffectUpdated?.Invoke(effect);
                    }
                }
            }

            // Remove expired effects
            foreach (var effect in expiredEffects)
            {
                RemoveEffect(effect.Id);
            }
        }

        public static List<ActiveEffect> GetPlayerEffects(string playerId)
        {
            return PlayerEffects.TryGetValue(playerId, out List<ActiveEffect> effects) 
                ? effects.ToList() 
                : new List<ActiveEffect>();
        }

        public static List<ActiveEffect> GetEntityEffects(string entityId)
        {
            return EntityEffects.TryGetValue(entityId, out List<ActiveEffect> effects) 
                ? effects.ToList() 
                : new List<ActiveEffect>();
        }

        public static List<ActiveEffect> GetAllPlayerEffects()
        {
            var allEffects = new List<ActiveEffect>();
            foreach (var effects in PlayerEffects.Values)
            {
                allEffects.AddRange(effects);
            }
            return allEffects;
        }

        public static void ClearPlayerEffects(string playerId)
        {
            if (PlayerEffects.TryGetValue(playerId, out List<ActiveEffect> effects))
            {
                foreach (var effect in effects.ToList())
                {
                    OnEffectRemoved?.Invoke(effect);
                }
                PlayerEffects.Remove(playerId);
            }
        }

        public static void ClearAllEffects()
        {
            foreach (var effects in PlayerEffects.Values)
            {
                foreach (var effect in effects)
                {
                    OnEffectRemoved?.Invoke(effect);
                }
            }

            foreach (var effects in EntityEffects.Values)
            {
                foreach (var effect in effects)
                {
                    OnEffectRemoved?.Invoke(effect);
                }
            }

            PlayerEffects.Clear();
            EntityEffects.Clear();
            Log.Out("[RPG Overhaul] Cleared all active effects");
        }

        private static ActiveEffect FindEffect(string effectId)
        {
            foreach (var effects in PlayerEffects.Values)
            {
                var effect = effects.FirstOrDefault(e => e.Id == effectId);
                if (effect != null) return effect;
            }

            foreach (var effects in EntityEffects.Values)
            {
                var effect = effects.FirstOrDefault(e => e.Id == effectId);
                if (effect != null) return effect;
            }

            return null;
        }

        private static string GetEntityId(EntityAlive entity)
        {
            return entity is EntityPlayer ? entity.entityId.ToString() : $"entity_{entity.entityId}";
        }

        private static string GenerateDescription(string effectType, string effectName, float power)
        {
            switch (effectType.ToLower())
            {
                case "fire":
                    return $"Burning for {power} damage per second";
                case "ice":
                    return $"Slowed by {power * 100:F0}%";
                case "poison":
                    return $"Poisoned for {power} damage over time";
                case "bleeding":
                    return $"Bleeding for {power} damage per second";
                case "buff":
                    return $"Enhanced {effectName} by {power * 100:F0}%";
                case "debuff":
                    return $"Reduced {effectName} by {power * 100:F0}%";
                default:
                    return $"{effectName} effect active";
            }
        }

        public static bool HasEffect(EntityAlive target, string effectName)
        {
            var targetId = GetEntityId(target);
            var effects = target is EntityPlayer 
                ? GetPlayerEffects(targetId) 
                : GetEntityEffects(targetId);

            return effects.Any(e => e.Name.Equals(effectName, StringComparison.OrdinalIgnoreCase));
        }

        public static void ExtendEffect(EntityAlive target, string effectName, float additionalTime)
        {
            var targetId = GetEntityId(target);
            var effects = target is EntityPlayer 
                ? GetPlayerEffects(targetId) 
                : GetEntityEffects(targetId);

            var effect = effects.FirstOrDefault(e => e.Name.Equals(effectName, StringComparison.OrdinalIgnoreCase));
            if (effect != null)
            {
                effect.RemainingTime += additionalTime;
                effect.Duration += additionalTime;
                OnEffectUpdated?.Invoke(effect);
            }
        }
    }
}