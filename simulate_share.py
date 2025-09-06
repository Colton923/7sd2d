#!/usr/bin/env python3
"""
Simulate the in-game Share experience
This script simulates what would happen when a player:
1. Inspects a weapon  
2. Presses G to share
3. The JSON appears in server logs
4. The bot detects it and creates a Discord embed

For testing without running the full game server.
"""

import json
import asyncio
import logging
from pathlib import Path
from datetime import datetime

# Setup path for imports  
import sys
sys.path.append(str(Path(__file__).parent / "discord-bot"))

from item_share_monitor import ItemShareMonitor

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_test_weapon(player_name: str, weapon_type: str = "rifle") -> dict:
    """Create realistic test weapon data"""
    weapons = {
        "rifle": {
            "name": "Pearlescent_Vladof_AK47_T5Q480", 
            "rarity": "Legendary",
            "quality": 480,
            "tier": 5,
            "class": "rifle",
            "manufacturer": "Vladof",
            "element": "electric",
            "damage": 142.6,
            "crit": 0.21,
            "mods": 4,
            "affixes": [
                "Brutal +32% damage",
                "Keen +6% crit chance", 
                "Shocking +15% electric damage",
                "Rapid +10% fire rate",
                "Piercing +20% armor penetration"
            ],
            "parts": [
                "Heavy Barrel (Advanced)",
                "Drum Magazine (Master)",
                "Electric Sight (Epic)",
                "Tactical Stock (Rare)"
            ]
        },
        "pistol": {
            "name": "Crimson_Torgue_Revolver_T3Q320",
            "rarity": "Epic", 
            "quality": 320,
            "tier": 3,
            "class": "pistol", 
            "manufacturer": "Torgue",
            "element": "fire",
            "damage": 89.2,
            "crit": 0.35,
            "mods": 2,
            "affixes": [
                "Incendiary +25% fire damage",
                "Critical +15% crit damage"
            ],
            "parts": [
                "Long Barrel (Rare)",
                "Speed Loader (Advanced)"
            ]
        },
        "shotgun": {
            "name": "Devastating_Jakobs_Shotgun_T4Q400",
            "rarity": "Epic",
            "quality": 400, 
            "tier": 4,
            "class": "shotgun",
            "manufacturer": "Jakobs",
            "element": "none",
            "damage": 256.8,
            "crit": 0.18,
            "mods": 3,
            "affixes": [
                "Devastating +40% damage",
                "Wide Spread +3 pellets",
                "Knockback +50% knockback"
            ],
            "parts": [
                "Sawed-off Barrel (Master)",
                "Shell Holder (Advanced)", 
                "Wooden Stock (Vintage)"
            ]
        }
    }
    
    weapon = weapons.get(weapon_type, weapons["rifle"]).copy()
    weapon["player"] = player_name
    return weapon

async def simulate_game_session():
    """Simulate multiple players sharing weapons during a game session"""
    
    # Config similar to real Discord bot
    config = {
        'item_sharing': {
            'enabled': True,
            'cooldown_seconds': 10,  # Shorter for demo
            'max_affixes_display': 3,
            'max_parts_display': 3,
            'show_enhanced_embeds': True
        }
    }
    
    # Create monitor
    monitor = ItemShareMonitor(Path("test"), config)
    
    # Mock Discord embed creation (simulating bot.py functionality)
    async def create_discord_embed(data):
        item = data['item']
        player = data['player']
        
        print("\n" + "="*60)
        print(f"DISCORD EMBED SIMULATION")
        print("="*60)
        print(f"WEAPON: {item['name']}")
        print(f"PLAYER: {player} shared their {item['rarity'].lower()} {item['type']}!")
        print()
        print(f"Core Stats          Details           Combat")  
        print(f"Quality: {item['quality']}          Manufacturer: {item['manufacturer']}    Damage: {item['damage']:.1f}")
        print(f"Tier: {item['tier']}               Element: {item['element'].title()}         Crit: {item['crit_chance']:.1%}")
        print(f"Class: {item['type'].title()}         Mods: {item['mod_count']}              Rarity: {item['rarity']}")
        
        if item.get('affixes'):
            print(f"\nAffixes:")
            for i, affix in enumerate(item['affixes'][:3]):
                print(f"  - {affix}")
            if len(item['affixes']) > 3:
                print(f"  *...and {len(item['affixes']) - 3} more*")
        
        if item.get('parts'):
            print(f"\nParts:")
            for i, part in enumerate(item['parts'][:3]):
                print(f"  - {part}")
            if len(item['parts']) > 3:
                print(f"  *...and {len(item['parts']) - 3} more*")
        
        print(f"\nPress G after inspecting a weapon to share • RPG Overhaul Mod")
        print("="*60)
        
    monitor.on_share(create_discord_embed)
    
    # Simulate game events
    game_events = [
        ("Player1", "rifle", "Found an awesome legendary rifle!"),
        ("Player2", "pistol", "This revolver is sick!"),
        ("Player1", "shotgun", "Just got this from a boss!"),  # Should be blocked by cooldown
        ("Player3", "rifle", "My first legendary weapon!"),
        ("Player2", "shotgun", "Another epic drop!")  # Should be blocked by cooldown
    ]
    
    print("SIMULATING IN-GAME WEAPON SHARING SESSION")
    print("Players inspect weapons and press G to share...")
    print()
    
    for i, (player, weapon_type, comment) in enumerate(game_events, 1):
        print(f"[Event {i}] {player}: {comment}")
        
        # Create weapon data
        weapon_data = create_test_weapon(player, weapon_type)
        
        # Simulate the C# mod emitting JSON to server log
        rpg_share_log = f"[RPGShare] {json.dumps(weapon_data)}"
        print(f"Server Log: {rpg_share_log[:80]}...")
        
        # Process the log line (simulating bot monitoring)
        await monitor.process_log_line(rpg_share_log)
        
        # Small delay to see the flow
        await asyncio.sleep(2)
    
    print("\nGame session simulation complete!")
    print("In the real game:")
    print("   1. Players would inspect weapons in their inventory") 
    print("   2. Press G hotkey or type /share command")
    print("   3. Mod emits JSON to server log")
    print("   4. Discord bot detects and posts rich embed")

if __name__ == "__main__":
    asyncio.run(simulate_game_session())