/**
 * Sprite helper utilities for Pokemon sprites
 * All sprites are numbered by Pokédex number (e.g., 6.png for Charizard)
 * Alternate forms (Mega, G-max, Shadow, etc.) use the base form sprite
 */

// Static sprite mapping - only including core Pokemon numbers that exist
// This ensures Metro bundler compatibility without dynamic requires
const SPRITE_MAP: { [key: string]: any } = {
  // Generation 1 (1-151) - Core starter Pokemon and raid bosses
  '1.png': require('../assets/sprites/1.png'),     // Bulbasaur
  '2.png': require('../assets/sprites/2.png'),     // Ivysaur
  '3.png': require('../assets/sprites/3.png'),     // Venusaur
  '4.png': require('../assets/sprites/4.png'),     // Charmander
  '5.png': require('../assets/sprites/5.png'),     // Charmeleon
  '6.png': require('../assets/sprites/6.png'),     // Charizard
  '7.png': require('../assets/sprites/7.png'),     // Squirtle
  '8.png': require('../assets/sprites/8.png'),     // Wartortle
  '9.png': require('../assets/sprites/9.png'),     // Blastoise
  '10.png': require('../assets/sprites/10.png'),   // Caterpie
  '11.png': require('../assets/sprites/11.png'),   // Metapod
  '12.png': require('../assets/sprites/12.png'),   // Butterfree
  '13.png': require('../assets/sprites/13.png'),   // Weedle
  '14.png': require('../assets/sprites/14.png'),   // Kakuna
  '15.png': require('../assets/sprites/15.png'),   // Beedrill
  '16.png': require('../assets/sprites/16.png'),   // Pidgey
  '17.png': require('../assets/sprites/17.png'),   // Pidgeotto
  '18.png': require('../assets/sprites/18.png'),   // Pidgeot
  '19.png': require('../assets/sprites/19.png'),   // Rattata
  '20.png': require('../assets/sprites/20.png'),   // Raticate
  '21.png': require('../assets/sprites/21.png'),   // Spearow
  '22.png': require('../assets/sprites/22.png'),   // Fearow
  '23.png': require('../assets/sprites/23.png'),   // Ekans
  '24.png': require('../assets/sprites/24.png'),   // Arbok
  '25.png': require('../assets/sprites/25.png'),   // Pikachu
  '68.png': require('../assets/sprites/68.png'),   // Machamp
  '69.png': require('../assets/sprites/69.png'),   // Bellsprout
  '80.png': require('../assets/sprites/80.png'),   // Slowbro
  '94.png': require('../assets/sprites/94.png'),   // Gengar
  '99.png': require('../assets/sprites/99.png'),   // Kingler
  '131.png': require('../assets/sprites/131.png'), // Lapras
  '143.png': require('../assets/sprites/143.png'), // Snorlax
  
  // Generation 2 - Key raid bosses
  '181.png': require('../assets/sprites/181.png'), // Ampharos
  '190.png': require('../assets/sprites/190.png'), // Aipom
  '203.png': require('../assets/sprites/203.png'), // Girafarig
  '216.png': require('../assets/sprites/216.png'), // Teddiursa
  
  // Generation 3 - Key raid bosses
  '273.png': require('../assets/sprites/273.png'), // Seedot
  '359.png': require('../assets/sprites/359.png'), // Absol
  '373.png': require('../assets/sprites/373.png'), // Salamence
  '377.png': require('../assets/sprites/377.png'), // Regirock
  
  // Generation 5 - Key raid bosses
  '544.png': require('../assets/sprites/544.png'), // Whirlipede
  
  // Generation 8 - Current raid bosses (verified to exist)
  '812.png': require('../assets/sprites/812.png'), // Rillaboom
  '815.png': require('../assets/sprites/815.png'), // Cinderace
  '818.png': require('../assets/sprites/818.png'), // Inteleon
  '834.png': require('../assets/sprites/834.png'), // Drednaw
  '849.png': require('../assets/sprites/849.png'), // Toxtricity
  '854.png': require('../assets/sprites/854.png'), // Sinistea
  '870.png': require('../assets/sprites/870.png'), // Falinks
  '888.png': require('../assets/sprites/888.png'), // Zacian
  '889.png': require('../assets/sprites/889.png'), // Zamazenta
  '890.png': require('../assets/sprites/890.png'), // Eternatus
};

/**
 * Extract Pokédex number from sprite path or Pokémon name
 * Maps alternate forms to base form (e.g., Mega Charizard → 6.png)
 */
const extractPokedexNumber = (spritePath: string): string | null => {
  const filename = spritePath.split('/').pop();
  if (!filename) return null;
  
  // If already a Pokédex number format (6.png, 25.png, etc.)
  const numberMatch = filename.match(/^(\d+)\.png$/);
  if (numberMatch) {
    return numberMatch[1] + '.png';
  }
  
  // Handle alternate form sprites (e.g., 18-mega.png → 18.png)
  const formMatch = filename.match(/^(\d+)-.*\.png$/);
  if (formMatch) {
    return formMatch[1] + '.png';
  }
  
  // Handle known Pokémon name to number mappings for common raid bosses
  const nameToNumberMap: { [key: string]: string } = {
    // Generation 1
    'charizard': '6',
    'blastoise': '9', 
    'butterfree': '12',
    'pidgeot': '18',
    'pikachu': '25',
    'machamp': '68',
    'bellsprout': '69',
    'slowbro': '80',
    'gengar': '94',
    'kingler': '99',
    'lapras': '131',
    'snorlax': '143',
    
    // Generation 2 
    'ampharos': '181',
    'aipom': '190',
    'girafarig': '203',
    'teddiursa': '216',
    
    // Generation 3
    'seedot': '273',
    'absol': '359',
    'salamence': '373',
    'regirock': '377',
    
    // Generation 5
    'whirlipede': '544',
    
    // Generation 8
    'rillaboom': '812',
    'cinderace': '815', 
    'inteleon': '818',
    'drednaw': '834',
    'toxtricity': '849',
    'sinistea': '854',
    'falinks': '870',
    'zacian': '888',
    'zamazenta': '889', 
    'eternatus': '890',
  };
  
  // Try to extract from common Pokémon name patterns
  const baseName = filename.toLowerCase()
    .replace(/\.png$/, '')
    .replace(/[-_](mega|gmax|max|shadow|shiny|crowned|amped|low-key|hero|many|battles|sword|shield|eternamax|gigantamax).*/, '');
  
  const pokedexNumber = nameToNumberMap[baseName];
  if (pokedexNumber) {
    return pokedexNumber + '.png';
  }
  
  return null;
};

export const getSpriteSource = (spritePath: string) => {
  // First, try to get the base Pokédex number sprite
  const pokedexSprite = extractPokedexNumber(spritePath);
  
  if (pokedexSprite && SPRITE_MAP[pokedexSprite]) {
    return SPRITE_MAP[pokedexSprite];
  }
  
  // Fallback: try the original filename
  const filename = spritePath.split('/').pop();
  if (filename && SPRITE_MAP[filename]) {
    return SPRITE_MAP[filename];
  }
  
  // If no sprite found, log warning and return null for placeholder
  if (filename) {
    console.warn(`Sprite not found for: ${filename} (mapped to: ${pokedexSprite || 'unknown'})`);
  }
  
  return null;
};

export const getSpriteDimensions = () => ({
  width: 68,
  height: 56,
});

export const getSpriteStyle = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const dimensions = getSpriteDimensions();
  
  const scales = {
    small: 0.6,
    medium: 0.8,
    large: 1.0,
  };
  
  const scale = scales[size];
  
  return {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
  };
};

/**
 * Helper function to check if a sprite is available
 * Use this to verify sprites before adding new raid bosses
 */
export const isSpriteAvailable = (spritePath: string): boolean => {
  const filename = spritePath.split('/').pop();
  return filename ? filename in SPRITE_MAP : false;
};

/**
 * Get all available sprite filenames
 * Useful for debugging sprite availability
 */
export const getAvailableSprites = (): string[] => {
  return Object.keys(SPRITE_MAP);
};