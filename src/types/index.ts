// User types
export interface User {
  id: string;
  auth_id: string;
  trainer_name: string;
  friend_code: string;
  team: 'Mystic' | 'Valor' | 'Instinct';
  level: number;
  created_at: string;
}

// Boss types
export interface RaidBoss {
  id: string;
  name: string;
  tier: string;
  raid_type: 'Regular' | 'Mega' | 'Legendary' | 'Max' | 'G-max' | 'Special';
  catch_cp_100_no_weather: number;
  catch_cp_100_weather: number;
  sprite: string;
  aliases: string[];
}

// Party types
export interface Party {
  id: string;
  mode: 'queue' | 'live';
  boss_id: string;
  host_user_id: string;
  max_size: number;
  additional_trainers: number;
  status: 'open' | 'active' | 'closed';
  created_at: string;
  closed_at?: string;
}

export interface PartyMember {
  party_id: string;
  user_id: string;
  role: 'host' | 'guest';
  state: 'joined' | 'ready' | 'kicked' | 'left';
  joined_at: string;
}

// Queue types
export interface QueueTicket {
  id: string;
  user_id: string;
  boss_id: string;
  status: 'waiting' | 'matched' | 'consumed' | 'cancelled' | 'expired';
  created_at: string;
  matched_at?: string;
}

// Message types
export interface PartyMessage {
  id: string;
  party_id: string;
  user_id: string;
  text: string;
  sent_at: string;
}

// Trade types
export interface Trade {
  id: string;
  poster_id: string;
  offering: string[];
  looking_for: string[];
  can_fly: boolean;
  registered: 'Registered' | 'Unregistered';
  friendship_target: 'None' | 'Good' | 'Great' | 'Ultra' | 'Best';
  notes?: string;
  status: 'open' | 'active' | 'closed';
  created_at: string;
}

export interface TradeMessage {
  id: string;
  trade_id: string;
  user_id: string;
  text: string;
  sent_at: string;
}

// Combined types for UI
export interface PartyWithBoss extends Party {
  boss: RaidBoss;
  members: PartyMemberWithUser[];
  host: User;
}

export interface PartyMemberWithUser extends PartyMember {
  user: User;
}

export interface TradeWithUser extends Trade {
  poster: User;
  messages: TradeMessageWithUser[];
}

export interface TradeMessageWithUser extends TradeMessage {
  user: User;
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Party: { partyId: string };
  FriendGate: {
    partyId: string;
    hostFriendCode: string;
    deadlineEpoch: number;
  };
  TradeDetail: { tradeId: string };
  TradeChat: { tradeId: string };
  Host: { mode?: 'queue' | 'live' };
  Auth: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
  TipsAndRules: undefined;
};

export type TabParamList = {
  Home: undefined;
  MyRaids: undefined;
  Trade: undefined;
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    trainer_name: string;
    friend_code: string;
    level: number;
    team: 'Mystic' | 'Valor' | 'Instinct';
  };
}

// Notification types
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: {
    type: 'queue_match' | 'party_mention' | 'trade_message';
    partyId?: string;
    tradeId?: string;
  };
}
