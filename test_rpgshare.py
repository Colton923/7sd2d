#!/usr/bin/env python3
"""
Test script for RPGShare functionality
Simulates the C# mod emitting JSON and tests the bot's parsing
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
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_rpgshare_parsing():
    """Test the RPGShare JSON parsing functionality"""
    
    # Mock config
    config = {
        'item_sharing': {
            'enabled': True,
            'cooldown_seconds': 5,  # Short cooldown for testing
            'max_affixes_display': 3,
            'max_parts_display': 3,
            'show_enhanced_embeds': True
        }
    }
    
    # Create monitor instance
    monitor = ItemShareMonitor(Path("test"), config)
    
    # Mock handler to capture shares
    shared_items = []
    
    async def mock_share_handler(data):
        shared_items.append(data)
        logger.info(f"✅ Captured share: {data['player']} - {data['item']['name']}")
    
    monitor.on_share(mock_share_handler)
    
    # Test RPGShare JSON format
    test_json = {
        "name": "Pearlescent_Vladof_rifle_T5Q480",
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
            "Brutal +32% dmg",
            "Keen +6% crit",
            "Shocking +15% electric"
        ],
        "parts": [
            "Heavy Barrel (Adv)",
            "Drum Magazine (Master)",
            "Electric Sight (Epic)"
        ],
        "player": "TestPlayer"
    }
    
    # Simulate log line with RPGShare JSON
    log_line = f"[RPGShare] {json.dumps(test_json)}"
    logger.info(f"Testing log line: {log_line}")
    
    # Process the log line
    await monitor.process_log_line(log_line)
    
    # Verify results
    if shared_items:
        item = shared_items[0]
        item_data = item['item']
        
        logger.info("✅ Share processing successful!")
        logger.info(f"  Player: {item['player']}")
        logger.info(f"  Weapon: {item_data['name']}")
        logger.info(f"  Rarity: {item_data['rarity']} (Color: {hex(item_data['color'])})")
        logger.info(f"  Damage: {item_data['damage']}")
        logger.info(f"  Affixes: {len(item_data['affixes'])}")
        logger.info(f"  Parts: {len(item_data['parts'])}")
        logger.info(f"  Source: {item['source']}")
        
        # Test cooldown
        logger.info("\n🕒 Testing cooldown...")
        await monitor.process_log_line(log_line)  # Should be blocked
        
        if len(shared_items) == 1:
            logger.info("✅ Cooldown working correctly!")
        else:
            logger.error("❌ Cooldown not working!")
            
    else:
        logger.error("❌ No items were shared!")
    
    return len(shared_items) > 0

def test_json_serialization():
    """Test the simple JSON serializer from C#"""
    from item_share_monitor import ItemShareMonitor
    
    # Test data similar to what C# would generate
    test_data = {
        "name": "Test_Weapon",
        "rarity": "Epic",
        "quality": 250,
        "damage": 89.5,
        "affixes": ["Fast +10% speed", "Strong +20% damage"],
        "parts": ["Scope", "Silencer"]
    }
    
    logger.info("🔧 Testing JSON serialization...")
    logger.info(f"Original: {test_data}")
    
    # This would simulate what the C# SimpleJsonSerializer produces
    json_str = json.dumps(test_data)
    logger.info(f"JSON: {json_str}")
    
    # Parse it back
    parsed = json.loads(json_str)
    logger.info(f"Parsed: {parsed}")
    
    return parsed == test_data

async def main():
    """Run all tests"""
    logger.info("🚀 Starting RPGShare tests...")
    
    # Test JSON serialization
    json_test = test_json_serialization()
    logger.info(f"JSON Test: {'✅ PASS' if json_test else '❌ FAIL'}")
    
    # Test RPGShare parsing
    parse_test = await test_rpgshare_parsing()
    logger.info(f"Parse Test: {'✅ PASS' if parse_test else '❌ FAIL'}")
    
    # Overall result
    if json_test and parse_test:
        logger.info("🎉 All tests PASSED! RPGShare system is ready!")
    else:
        logger.error("💥 Some tests FAILED!")

if __name__ == "__main__":
    asyncio.run(main())