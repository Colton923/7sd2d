# RPG Overhaul - Full Implementation Integration Guide

This guide explains how to combine the **TypeScript XML generation** with the **C# game patches** to create a fully functional RPG weapon system.

## System Overview

```
TypeScript Generator → XML Files → C# Patches → Game Features
     ↓                    ↓             ↓             ↓
- Weapon data        - items.xml     - Harmony      - Elemental damage
- Affix definitions  - Config files  - patches      - Affix bonuses
- Part stats         - Properties    - Systems      - Part synergies
- Mastery tables     - Values        - Classes      - Mastery bonuses
```

## 1. XML Generation (TypeScript)

### Current Status ✅

The TypeScript system generates comprehensive XML files with all necessary properties:

```xml
<item name="Legendary_Plasma_Rifle">
  <!-- Vanilla 7D2D properties -->
  <property name="EntityDamage" value="125.5" />
  <property name="MagazineSize" value="24" />

  <!-- Custom RPG properties -->
  <property name="ElementalDamageType" value="plasma" />
  <property name="ElementalDamage" value="25.5" />
  <property name="Prefixes" value="Devastating,Laser-Guided" />
  <property name="Part0_Slot" value="barrel" />
  <property name="Part0_Name" value="Plasma Barrel" />
</item>
```

### Required Properties for C# Integration

#### Elemental System

```xml
<property name="ElementalDamageType" value="[fire|ice|electric|poison|radiation|explosive|bleeding|void]" />
<property name="ElementalDamage" value="[damage_amount]" />
<property name="ElementalEffect" value="[burning|freeze|shock|poisoned|radiated|explosion|bleed|void_drain]" />
```

#### Affixes System

```xml
<property name="Prefixes" value="Affix1,Affix2,Affix3" />
<property name="Suffixes" value="Suffix1,Suffix2" />
<property name="Implicits" value="Implicit1,Implicit2" />
```

#### Weapon Parts System

```xml
<property name="Part0_Slot" value="barrel" />
<property name="Part0_Name" value="Heavy Barrel" />
<property name="Part0_Tier" value="advanced" />
<property name="Part0_SpecialEffect" value="Stability" />
```

#### Triggered Effects

```xml
<property name="TriggeredEffect0_Trigger" value="onKill" />
<property name="TriggeredEffect0_Effect" value="explosion" />
<property name="TriggeredEffect0_Chance" value="0.25" />
<property name="TriggeredEffect0_Value" value="5.0" />
```

## 2. C# Patch Implementation

### Core Architecture

#### Main Entry Point

```csharp
public class Main : IModApi
{
    public void InitMod(Mod modInstance)
    {
        // Initialize Harmony
        var harmony = new Harmony("com.rpgoverhaul.mod");
        harmony.PatchAll(Assembly.GetExecutingAssembly());

        // Initialize RPG systems
        ElementalDamageSystem.Initialize();
        AffixSystem.Initialize();
        WeaponPartsSystem.Initialize();
        MasterySystem.Initialize();
    }
}
```

#### Harmony Patches

```csharp
[HarmonyPatch(typeof(ItemActionAttack), "Hit")]
[HarmonyPrefix]
public static void PreHit(ItemActionAttack __instance, EntityAlive _attacker, EntityAlive _target, ItemValue _weapon)
{
    // Read elemental properties from weapon
    var elementalType = _weapon.GetPropertyOverride("ElementalDamageType", "");
    if (!string.IsNullOrEmpty(elementalType))
    {
        // Apply elemental damage
        ElementalDamageSystem.ApplyElementalDamage(_target,
            new ElementalEffect(ParseElementalType(elementalType), elementalDamage));
    }
}
```

## 3. Complete Integration Workflow

### Step 1: Generate XML Content

```bash
# In the TypeScript project directory
cd ../rpg-overhaul-ts
npm run build
npm run generate

# This creates:
# ../rpg-overhaul/output/mods/7D2D-RPGOverhaul/Config/items.xml
# ../rpg-overhaul/output/mods/7D2D-RPGOverhaul/Config/entityclasses.xml
```

### Step 2: Build C# Patches

```bash
# In the C# project directory
cd ../rpg-overhaul-csharp
build.bat

# This creates:
# bin/Release/net48/RPGOverhaul.dll
```

### Step 3: Deploy to Game

```batch
# Copy files to 7D2D Mods directory
xcopy "../rpg-overhaul/output/mods/7D2D-RPGOverhaul" "C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die\Mods\7D2D-RPGOverhaul\" /E /I /Y
copy "bin\Release\net48\RPGOverhaul.dll" "C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die\Mods\7D2D-RPGOverhaul\"
```

### Step 4: Install Dependencies

```batch
# Ensure Harmony is installed
copy "path\to\0Harmony.dll" "C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die\7DaysToDie_Data\Managed\"
```

## 4. Property Processing Flow

### Weapon Equip Process

1. **Player equips weapon** → `ItemValue.Clone` patch triggers
2. **Read custom properties** from XML
3. **Apply affixes** → Modify base stats
4. **Apply parts** → Add part modifiers and synergies
5. **Apply mastery** → Add player skill bonuses
6. **Cache final stats** for combat use

### Combat Process

1. **Weapon fires** → `ItemActionRanged.Fire` patch
2. **Check triggered effects** → Apply onFire effects
3. **Projectile hits** → `ItemActionAttack.Hit` patch
4. **Apply elemental damage** → Create DoT effects
5. **Check kill triggers** → Apply onKill effects

## 5. Advanced Features Implementation

### Mastery Persistence

```csharp
// Save/Load mastery data with player saves
[HarmonyPatch(typeof(EntityPlayer), "Save")]
[HarmonyPostfix]
public static void PostSave(EntityPlayer __instance)
{
    MasterySystem.SaveMasteryData(__instance.entityId.ToString());
}
```

### Network Synchronization

```csharp
// Sync elemental effects in multiplayer
[HarmonyPatch(typeof(EntityAlive), "DamageEntity")]
[HarmonyPrefix]
public static void PreDamageEntity(EntityAlive __instance, DamageResponse _dmResponse)
{
    if (ConnectionManager.Instance.IsServer)
    {
        // Broadcast elemental damage to clients
        SingletonMonoBehaviour<ConnectionManager>.Instance.SendPackage(
            NetPackageManager.GetPackage<NetPackageDamageEntity>().Setup(__instance, _dmResponse));
    }
}
```

### Custom UI Integration

```csharp
// Add mastery display to inventory
[HarmonyPatch(typeof(XUiC_ItemStack), "Update")]
[HarmonyPostfix]
public static void PostUpdate(XUiC_ItemStack __instance)
{
    if (__instance.ItemStack?.itemValue == null) return;

    var mastery = MasterySystem.GetMasteryLevel(
        __instance.xui.playerUI.entityPlayer.entityId.ToString(),
        __instance.ItemStack.itemValue.GetPropertyOverride("WeaponClass", ""));

    if (mastery > 0)
    {
        __instance.description += $"\nMastery Level: {mastery}";
    }
}
```

## 6. Testing and Validation

### Unit Testing Setup

```csharp
[TestFixture]
public class RPGOverhaulTests
{
    [Test]
    public void TestElementalDamageApplication()
    {
        // Mock entities and test elemental damage
        var mockEntity = new Mock<EntityAlive>();
        var effect = new ElementalEffect(ElementalType.Fire, 10f, 5f);

        ElementalDamageSystem.ApplyElementalDamage(mockEntity.Object, effect);

        // Assert damage applied and DoT created
        mockEntity.Verify(e => e.DamageEntity(It.IsAny<DamageSource>(), false), Times.Once);
    }
}
```

### Integration Testing

1. **Load generated XML** files
2. **Spawn weapons** with custom properties
3. **Verify stat calculations** match expectations
4. **Test combat scenarios** with elemental effects
5. **Validate multiplayer sync** of custom effects

## 7. Performance Optimization

### Memory Management

- **Object pooling** for effect instances
- **Lazy initialization** of weapon data
- **Dictionary caching** for property lookups

### Patch Optimization

- **Early returns** for vanilla items
- **Conditional patching** based on game state
- **Batch processing** for multiple modifications

## 8. Troubleshooting

### Common Issues

#### Harmony Not Loading

```
Error: Method not found: HarmonyLib.Harmony
```

**Solution**: Ensure 0Harmony.dll is in the Managed folder and correct version.

#### Properties Not Found

```
NullReferenceException in patch
```

**Solution**: Verify XML property names match C# expectations exactly.

#### Memory Leaks

**Solution**: Implement proper cleanup for effect components and cached data.

### Debug Commands

```csharp
// Add console commands for debugging
[HarmonyPatch(typeof(SDCSConsole), "Execute")]
[HarmonyPrefix]
public static bool PreExecute(string _command)
{
    if (_command.StartsWith("rpg_debug"))
    {
        HandleRPGDebugCommand(_command);
        return false; // Suppress original command
    }
    return true;
}
```

## 9. Future Expansion

### Modular Architecture

The system is designed for easy expansion:

- **New elemental types** → Add to enum and effect handlers
- **Additional affixes** → Extend affix database
- **Custom effects** → Implement new triggered effect types
- **Advanced synergies** → Enhance parts system logic

### Performance Scaling

- **LOD system** for distant effects
- **Configurable quality settings** for visual effects
- **Background processing** for heavy calculations

This integration creates a complete RPG weapon system that seamlessly combines XML-driven content with runtime C# modifications.
