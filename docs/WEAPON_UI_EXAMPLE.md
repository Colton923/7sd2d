# Enhanced Weapon UI Display Example

## Sample Weapon: "Legendary Jakobs AK47 of Devastation"
- **Item Level:** 90
- **Quality:** 450 (Epic)
- **Manufacturer:** Jakobs
- **Prefix:** Legendary
- **Suffix:** of Devastation
- **Weapon Parts:** Heavy Barrel, Extended Magazine, Tactical Stock
- **Player Mastery:** Rifle Level 15

---

## UI Display Example:

```
╔══════════════════════════════════════════════════════════╗
║  🔥 Legendary Jakobs AK47 of Devastation                ║
║  Level 90 • Quality 450 (Epic) • Jakobs                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  💥 DAMAGE: 25 → 89 (+256%)                            ║
║    • Jakobs Manufacturer: +20%                          ║
║    • Legendary (Prefix): +25%                           ║
║    • of Devastation (Suffix): +35%                      ║
║    • Quality 450: ×1.45                                 ║
║    • Item Level 90: ×1.09                               ║
║    • Heavy Barrel: +10%                                 ║
║    • Mastery Lv.15: +30%                                ║
║                                                          ║
║  🎯 CRITICAL CHANCE: 5% → 28%                          ║
║    • Jakobs Manufacturer: +15% (flat)                   ║
║    • Legendary (Prefix): +10% (flat)                    ║
║                                                          ║
║  ⚡ FIRE RATE: 400 → 448 RPM (+12%)                    ║
║    • Jakobs Manufacturer: -10%                          ║
║    • of Devastation (Suffix): +15%                      ║
║    • Quality 450: ×1.07                                 ║
║                                                          ║
║  📦 MAGAZINE SIZE: 30 → 54 (+80%)                      ║
║    • Extended Magazine: +50%                            ║
║    • Quality 450: ×1.20                                 ║
║                                                          ║
║  🔄 RELOAD TIME: 3.2 → 3.8s (+19%)                     ║
║    • Extended Magazine: +20%                            ║
║                                                          ║
║  📍 ACCURACY: 0.10 → 0.08 (+20%)                       ║
║    • Quality 450: ×0.90 (better)                        ║
║    • Tactical Stock: -10% (better)                      ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  🔥 ELEMENTAL DAMAGE                                     ║
║    Fire: 12 damage over 5 seconds                       ║
║                                                          ║
║  ⚡ TRIGGERED EFFECTS                                    ║
║    On Hit: Explosion (15% chance, 50 damage)            ║
║    On Kill: Heal self (25% chance, 25 HP)              ║
║                                                          ║
║  🔧 WEAPON PARTS                                         ║
║    Barrel: Heavy Barrel (Master)                        ║
║    Magazine: Extended Magazine (Advanced)               ║
║    Stock: Tactical Stock (Advanced)                     ║
║                                                          ║
║  📋 REQUIREMENTS                                         ║
║    Mastery Level: 25 (You have: 15) ❌                  ║
║    Player Level: 45 ✅                                   ║
╚══════════════════════════════════════════════════════════╝
```

## Color Coding System:

### Modifier Sources:
- 🟤 **Manufacturer** (Jakobs): Brown/Gold
- 🔵 **Prefixes**: Cyan  
- 🟣 **Suffixes**: Magenta
- 🟡 **Quality/Level**: Yellow
- 🟢 **Weapon Parts**: Green (varies by tier)
- 🟢 **Mastery**: Bright Green
- 🔴 **Elemental**: Element-specific colors

### Quality Tiers:
- ⚫ **Poor** (0-99): Gray
- ⚪ **Common** (100-199): White
- 🟢 **Uncommon** (200-299): Green
- 🔵 **Rare** (300-399): Blue
- 🟣 **Epic** (400-499): Purple
- 🟠 **Legendary** (500-599): Orange
- ✨ **Artifact** (600): Rainbow

---

## Technical Implementation:

### Calculation Order:
1. **Base Stats** (AK47 defaults)
2. **Manufacturer** (Jakobs: +20% dmg, -10% fire rate, +15% crit)
3. **Prefixes** (Legendary: +25% dmg, +10% crit)
4. **Suffixes** (of Devastation: +35% dmg, +15% fire rate)
5. **Quality Multiplier** (450 quality = 1.45× most stats)
6. **Item Level Scaling** (Level 90 = 1.09× multiplier)
7. **Weapon Parts** (Heavy Barrel: +10% dmg, +15% recoil)
8. **Mastery Bonuses** (Level 15 = +30% dmg for rifles)

### Final Damage Calculation:
```
Base: 25
× Jakobs (1.20)     = 30
× Legendary (1.25)  = 37.5
× Devastation (1.35)= 50.6
× Quality (1.45)    = 73.4
× Level (1.09)      = 80.0
× Heavy Barrel (1.10)= 88.0
× Mastery (1.30)    = 114.4 → 89 (after rounding)
```

### UI Features:
- **Expandable sections** - Click to show/hide modifier breakdowns
- **Comparison mode** - Shows changes when hovering over new weapon
- **Requirement checking** - Red ❌ for unmet requirements, green ✅ for met
- **Tooltip system** - Detailed explanations on hover
- **Export function** - Copy weapon stats to clipboard
- **Filter options** - Show only changed stats, hide minor modifiers

This provides complete transparency while remaining readable!