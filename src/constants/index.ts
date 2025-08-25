// App constants
export const APP_CONFIG = {
  NAME: 'LobbyGO',
  VERSION: '1.0.0',
  SCHEME: 'raidlink',
} as const;

// API constants
export const API_ENDPOINTS = {
  AUTH_LINK: '/auth/link',
  BOSSES: '/bosses',
  QUEUE_JOIN: '/queue/join',
  QUEUE_CANCEL: '/queue/cancel',
  QUEUE_ME: '/queue/me',
  PARTY: '/party',
  PARTY_JOIN: (id: string) => `/party/${id}/join`,
  PARTY_ADDED_HOST: (id: string) => `/party/${id}/added-host`,
  PARTY_LEAVE: (id: string) => `/party/${id}/leave`,
  PARTY_CLOSE: (id: string) => `/party/${id}/close`,
  PARTIES: '/parties',
  PARTY_DETAIL: (id: string) => `/party/${id}`,
  PARTY_MESSAGE: (id: string) => `/party/${id}/message`,
  TRADES: '/trades',
  TRADE_MESSAGE: (id: string) => `/trades/${id}/message`,
  TRADE_CLOSE: (id: string) => `/trades/${id}/close`,
} as const;

// Timing constants
export const TIMING = {
  FRIEND_GATE_TIMEOUT: 120000, // 2 minutes in milliseconds
  PARTY_UPDATE_INTERVAL: 300, // 300ms for real-time updates
  KICK_CHECK_INTERVAL: 10000, // 10 seconds for kick checks
} as const;

// UI constants
export const UI = {
  MAX_PARTY_SIZE: 20,
  MIN_PARTY_SIZE: 1,
  DEFAULT_ADDITIONAL_TRAINERS: 0,
  MAX_ADDITIONAL_TRAINERS: 9,
  MAX_POKEMON_PER_LISTING: 6,
  MIN_TRAINER_LEVEL: 1,
  MAX_TRAINER_LEVEL: 50,
  CHAT_MESSAGE_LIMIT: 10,
} as const;

// Colors - Modern Design System (Updated)
export const COLORS = {
  // Brand Colors
  PRIMARY: '#2B6BED',          // Modern blue (updated)
  SECONDARY: '#10B981',        // Clean green
  SUCCESS: '#059669',          // Success green
  WARNING: '#F59E0B',          // Warning amber (updated)
  ERROR: '#EF4444',            // Error red (updated)
  INFO: '#0EA5E9',             // Info blue

  // Status colors
  READY: '#059669',            // Green
  JOINED: '#0EA5E9',           // Blue
  NOT_READY: '#6B7280',        // Gray (updated)
  HOST: '#7C3AED',             // Purple for host

  // Team colors
  MYSTIC: '#3B82F6',           // Blue
  VALOR: '#DC2626',            // Red
  INSTINCT: '#F59E0B',         // Amber

  // Background colors
  BACKGROUND: '#F8FAFC',       // Very light blue-gray
  CARD_BACKGROUND: '#FFFFFF',  // White
  MODAL_BACKGROUND: 'rgba(0, 0, 0, 0.5)',

  // Text colors (updated to match design tokens)
  TEXT_PRIMARY: '#0B1220',     // Dark slate (updated)
  TEXT_SECONDARY: '#6B7280',   // Medium slate (updated)
  TEXT_LIGHT: '#94A3B8',       // Light slate

  // Border colors (updated to match design tokens)
  BORDER_LIGHT: '#E6E8EC',     // Light border (updated)
  BORDER_MEDIUM: '#CBD5E1',    // Medium border

  // Badge colors (new)
  LEGENDARY: '#F59E0B',        // Orange
  MEGA: '#7C3AED',             // Purple
  TIER: '#EF4444',             // Red
} as const;

// Teams
export const TEAMS = ['Mystic', 'Valor', 'Instinct'] as const;

// Tier filters
export const TIERS = ['1', '2', '3', '4', '5', 'Mega', 'Max'] as const;

// Friendship targets
export const FRIENDSHIP_TARGETS = ['None', 'Good', 'Great', 'Ultra', 'Best'] as const;

// Registration options
export const REGISTRATION_OPTIONS = ['Registered', 'Unregistered'] as const;

// Party statuses
export const PARTY_STATUSES = {
  LOBBY_FILLING: 'Lobby filling.',
  WAITING_FOR_READY: 'Waiting for everyone to add host and get ready.',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  QUEUE_MATCH: 'queue_match',
  PARTY_MENTION: 'party_mention',
  TRADE_MESSAGE: 'trade_message',
} as const;

// Deep link schemes
export const DEEP_LINKS = {
  PARTY: (id: string) => `raidlink://party/${id}`,
  TRADE: (id: string) => `raidlink://trade/${id}`,
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  VIEW_HOME: 'view_home',
  QUEUE_JOIN: 'queue_join',
  QUEUE_MATCH: 'queue_match',
  FRIEND_GATE_OPEN: 'friend_gate_open',
  ADDED_HOST_TAP: 'added_host_tap',
  KICK_120S: 'kick_120s',
  PARTY_MESSAGE: 'party_message',
  PARTY_START: 'party_start',
  TRADE_CREATE: 'trade_create',
  TRADE_FILTER: 'trade_filter',
  TRADE_MESSAGE: 'trade_message',
} as const;
