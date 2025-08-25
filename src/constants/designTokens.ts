/**
 * Modern Design Tokens - Consistent styling across all screens
 * Based on the new crisp, modern design system
 */

export const MODERN_COLORS = {
  // Text Colors
  TEXT_PRIMARY: '#0B1220',
  TEXT_SECONDARY: '#6B7280',
  TEXT_LIGHT: '#94A3B8',

  // Background Colors
  BACKGROUND: '#F8FAFC',
  CARD_BACKGROUND: '#FFFFFF',
  
  // Border Colors
  BORDER_LIGHT: '#E6E8EC',
  BORDER_MEDIUM: '#CBD5E1',
  
  // Brand Colors
  PRIMARY: '#2B6BED',
  SUCCESS: '#059669',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  
  // Badge Colors
  LEGENDARY: '#F59E0B',
  MEGA: '#7C3AED',
  TIER: '#EF4444',
  SHADOW: '#EF4444',
  
  // Utility
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

export const MODERN_TYPOGRAPHY = {
  // Font Sizes
  SIZE_11: 11,
  SIZE_12: 12,
  SIZE_15: 15,
  SIZE_20: 20,
  
  // Font Weights
  WEIGHT_NORMAL: '400' as const,
  WEIGHT_MEDIUM: '500' as const,
  WEIGHT_SEMIBOLD: '600' as const,
  WEIGHT_BOLD: 'bold' as const,
} as const;

export const MODERN_SPACING = {
  // Common spacing values
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  
  // Specific component spacing
  CARD_PADDING: 16,
  GRID_GAP: 12,
  CONTAINER_PADDING: 16,
} as const;

export const MODERN_RADIUS = {
  // Border radius values
  SM: 6,
  MD: 8,
  LG: 12,
  XL: 15,
  PILL: 15,
} as const;

export const MODERN_SHADOWS = {
  // Consistent shadow styling
  CARD: {
    shadowColor: MODERN_COLORS.BLACK,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  BUTTON: {
    shadowColor: MODERN_COLORS.BLACK,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const MODERN_BUTTONS = {
  // Standard button heights
  HEIGHT_SM: 30,
  HEIGHT_MD: 44,
  HEIGHT_LG: 56,
  
  // Button styles
  PRIMARY: {
    backgroundColor: MODERN_COLORS.PRIMARY,
    borderRadius: MODERN_RADIUS.LG,
    ...MODERN_SHADOWS.BUTTON,
  },
  SECONDARY: {
    backgroundColor: MODERN_COLORS.WHITE,
    borderWidth: 1,
    borderColor: MODERN_COLORS.BORDER_LIGHT,
    borderRadius: MODERN_RADIUS.LG,
  },
  FILTER_PILL: {
    height: MODERN_BUTTONS.HEIGHT_SM,
    borderRadius: MODERN_RADIUS.PILL,
    borderWidth: 1,
    borderColor: MODERN_COLORS.BORDER_LIGHT,
    backgroundColor: MODERN_COLORS.WHITE,
  },
} as const;

export const MODERN_CARDS = {
  // Standard card styling
  BASE: {
    backgroundColor: MODERN_COLORS.CARD_BACKGROUND,
    borderRadius: MODERN_RADIUS.LG,
    borderWidth: 1,
    borderColor: MODERN_COLORS.BORDER_LIGHT,
    ...MODERN_SHADOWS.CARD,
  },
  SELECTED: {
    borderColor: MODERN_COLORS.PRIMARY,
    borderWidth: 2,
  },
} as const;
