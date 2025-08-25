# Sprite Management Guide

## Adding New Pokemon Sprites

When you add a new raid boss to `raid_bosses.json`, you'll need to add the corresponding sprite to the sprite mapping system.

### Step 1: Add Boss to raid_bosses.json
```json
{
  "id": "new_boss_id",
  "name": "New Boss Name",
  "tier": "5",
  "raid_type": "Legendary",
  "sprite": "assets/sprites/NEW_NUMBER.png",
  // ... other properties
}
```

### Step 2: Add Sprite to Mapping
In `src/utils/spriteHelpers.ts`, uncomment or add the line:

```typescript
const SPRITE_MAP: { [key: string]: any } = {
  'NEW_NUMBER.png': require('../assets/sprites/NEW_NUMBER.png'), // New Boss Name
  // ... other sprites
};
```

### Current Available Sprites
The following sprites are ready to be enabled:

- `888.png` - Zacian
- `889.png` - Zamazenta  
- `18.png` - Pidgeot
- `870.png` - Falinks
- `25.png` - Pikachu
- `69.png` - Bellsprout
- `190.png` - Aipom
- `216.png` - Teddiursa
- `273.png` - Seedot
- `203.png` - Girafarig
- `359.png` - Absol
- `544.png` - Whirlipede
- `377.png` - Regirock

### Placeholder System
If a sprite is not added to the mapping, the app will show:
- 🔴 Red circle placeholder
- Pokemon number (for debugging)
- This ensures the app never crashes from missing sprites

### Example: Adding Charizard
1. Add to raid_bosses.json: `"sprite": "assets/sprites/6.png"`
2. Add to spriteHelpers.ts: `'6.png': require('../assets/sprites/6.png'), // Charizard`
3. Restart the app to see the real sprite
