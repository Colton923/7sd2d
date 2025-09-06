# 7D2D-RL Mod Validation Guide

## In-Game Validation Steps

### 1. Check Mod Loading (F1 Console)
Press F1 to open the console and look for:
- "Mod '7D2D-RL' loaded successfully"
- Any XML parsing errors or warnings
- Check for "Loaded Mod: 7D2D-RL"

### 2. Test Custom Items
Open creative menu (U key) and search for these custom items:
- **Weapons**: Search for "RL_" prefix items (e.g., RL_pistol_tier1)
- **Blocks**: Look for new crafting stations or building blocks
- **Items**: Check for new consumables and materials

Console commands to spawn items:
```
giveself RL_pistol_tier1 1
giveself RL_rifle_tier2 1
giveself RL_melee_tier3 1
```

### 3. Test Custom Zombies
Spawn custom zombies using console:
```
spawnentity 81 RL_zombie_walker
spawnentity 81 RL_zombie_runner
spawnentity 81 RL_zombie_tank
```

### 4. Check Loot Containers
- Break loot containers (cars, garbage, mailboxes)
- Verify custom items appear in loot
- Check trader inventories for new items

### 5. Test Crafting Recipes
- Open crafting menu (Tab)
- Search for "RL_" items
- Verify new recipes are available
- Check progression unlocks

### 6. Monitor Performance
- Check FPS (F8 for debug info)
- Monitor for any stuttering or lag
- Check console for repeated errors

## Quick Console Commands

Enable debug mode and god mode for testing:
```
dm
god
fly
```

Give yourself XP to test progression:
```
givexp 10000
```

Spawn items for testing:
```
giveself RL_pistol_tier1 1
giveself RL_ammo_9mm 500
```

## Common Issues & Fixes

### Mod Not Loading
- Check ModInfo.xml is in Mods/7D2D-RL/
- Verify all XML files are in Config folder
- Look for parsing errors in console

### Items Not Appearing
- Restart the game completely
- Start a new world to ensure clean load
- Check item IDs don't conflict with vanilla

### Zombies Not Spawning
- Verify entityclasses.xml loaded
- Check spawn probability in gamestages.xml
- Use direct spawn commands first

## Validation Checklist
- [ ] Mod shows as loaded in console
- [ ] Can spawn at least 3 custom weapons
- [ ] Can spawn at least 3 custom zombies
- [ ] Custom items appear in loot
- [ ] Crafting recipes are accessible
- [ ] No console errors during gameplay
- [ ] Performance is acceptable