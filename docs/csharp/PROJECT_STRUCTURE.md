# RPG Overhaul C# Project Structure

## Complete Implementation Overview

This C# project implements the core game mechanics for a comprehensive RPG weapon system in 7 Days to Die, working alongside the TypeScript XML generation system.

## Directory Structure

```
rpg-overhaul-csharp/
├── src/                          # Source code
│   ├── Main.cs                  # Mod entry point
│   ├── HarmonyPatches.cs        # Core game patches
│   ├── ElementalDamageSystem.cs # Elemental damage implementation
│   ├── AffixSystem.cs           # Weapon affixes
│   ├── WeaponPartsSystem.cs     # Modular weapon parts
│   ├── MasterySystem.cs         # Player progression
│   └── TriggeredEffectsSystem.cs # Triggered effects
├── lib/                         # Game assemblies
│   ├── Assembly-CSharp.dll      # 7D2D core
│   ├── UnityEngine.dll          # Unity engine
│   └── UnityEngine.CoreModule.dll
├── bin/                         # Build output
│   └── Release/net48/
│       └── RPGOverhaul.dll      # Compiled mod
├── RPGOverhaul.csproj          # Project file
├── build.bat                   # Build script
├── README.md                   # Documentation
├── INTEGRATION_GUIDE.md        # Integration instructions
└── PROJECT_STRUCTURE.md        # This file
```

## System Components

### 1. Main Entry Point (`Main.cs`)

- **IModApi implementation** for 7D2D mod loading
- **Harmony initialization** for runtime patching
- **System initialization** coordination

### 2. Harmony Patches (`HarmonyPatches.cs`)

- **ItemActionAttack.Hit** - Elemental damage application
- **EntityAlive.DamageEntity** - Damage processing
- **ItemValue.Clone** - Stat modification application
- **ItemActionRanged.Fire** - Trigger activation
- **EntityAlive.OnEntityDeath** - Kill triggers

### 3. Elemental Damage System (`ElementalDamageSystem.cs`)

- **8 elemental types**: Fire, Ice, Electric, Poison, Radiation, Explosive, Bleeding, Void
- **Damage over time (DoT)** with configurable duration and tick rates
- **Spread mechanics** for chain effects
- **Visual particle effects** for each element

### 4. Affixes System (`AffixSystem.cs`)

- **Multiple affix types**: Prefix, Suffix, Implicit, Unique, Mastercrafted
- **Stat operations**: base_add, perc_add, perc_subtract, multiply
- **Tier requirements** and level restrictions
- **Real-time stat calculation**

### 5. Weapon Parts System (`WeaponPartsSystem.cs`)

- **8 part slots** with 4 tiers each (Basic, Advanced, Master, Legendary)
- **Stat modifiers** and special effects
- **Synergy bonuses** for matching part sets
- **Quality and mastery requirements**

### 6. Mastery System (`MasterySystem.cs`)

- **Per-weapon-type progression** (pistol, rifle, shotgun, etc.)
- **Experience-based leveling** with persistent storage
- **Stat bonuses** that scale with mastery level
- **Level-up notifications** and effects

### 7. Triggered Effects System (`TriggeredEffectsSystem.cs`)

- **Multiple trigger types**: onFire, onHit, onKill, onHeadshot, onCritical
- **Various effects**: Instant Kill, Heal, Explosion, Chain Lightning, Slow, Buff
- **Probability and cooldown** management
- **Visual feedback** for effect activation

## Key Features

### ✅ Fully Implemented

- Complete elemental damage system with DoT effects
- Comprehensive affixes system with all operations
- Weapon parts with synergies and special effects
- Mastery progression with persistent data
- Triggered effects with probability system
- Harmony patches for seamless integration

### 🔄 Integration Ready

- Reads properties from generated XML files
- Applies modifications to vanilla game objects
- Maintains compatibility with existing save files
- Supports multiplayer synchronization

### 📈 Performance Optimized

- Minimal memory footprint
- Efficient patch implementations
- Conditional execution for vanilla items
- Object pooling for frequently used effects

## Build and Deployment

### Prerequisites

- **.NET Framework 4.8** or **.NET Core 3.1+**
- **7 Days to Die game installation** (for reference assemblies)
- **Harmony library** (0Harmony.dll)

### Build Process

```batch
# 1. Copy game assemblies to lib/
copy "7D2D/Managed/Assembly-CSharp.dll" lib/
copy "7D2D/Managed/UnityEngine.dll" lib/

# 2. Build the project
build.bat

# 3. Deploy to mod directory
copy bin/Release/net48/RPGOverhaul.dll "7D2D/Mods/7D2D-RPGOverhaul/"
```

## Integration with TypeScript Generator

### Data Flow

1. **TypeScript generates** weapon data with custom properties
2. **XML files contain** all necessary configuration
3. **C# mod reads** properties and applies game effects
4. **Harmony patches** modify vanilla game behavior

### Property Mapping

```xml
<!-- TypeScript Generated -->
<item name="Legendary_Rifle">
  <property name="ElementalDamageType" value="fire" />
  <property name="Prefixes" value="Devastating,Lethal" />
  <property name="Part0_Name" value="Heavy Barrel" />
  <property name="TriggeredEffect0_Trigger" value="onKill" />
</item>
```

```csharp
// C# Implementation Reads
var elementalType = weapon.GetPropertyOverride("ElementalDamageType", "");
var prefixes = weapon.GetPropertyOverride("Prefixes", "").Split(',');
var partName = weapon.GetPropertyOverride("Part0_Name", "");
```

## Testing and Validation

### Debug Features

- Comprehensive logging throughout all systems
- Property validation and error handling
- Performance monitoring and profiling
- Memory leak detection

### Compatibility

- **Single-player and multiplayer** tested
- **Save file compatibility** maintained
- **Mod coexistence** with other modifications
- **Version update handling**

## Future Enhancements

### Planned Features

- Custom UI panels for weapon inspection
- Advanced networking for effect synchronization
- Shader-based visual effects
- Dynamic difficulty scaling
- Achievement and unlock systems

### Performance Improvements

- GPU-accelerated particle effects
- Spatial partitioning for area effects
- Background processing for heavy calculations
- Memory pool optimization

This implementation provides a complete foundation for an RPG weapon system that seamlessly integrates with 7 Days to Die's existing mechanics while adding deep progression and customization features.
