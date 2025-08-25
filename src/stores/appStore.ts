import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Party, QueueTicket, Trade, RaidBoss } from '../types';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBrowsingWithoutAccount: boolean;

  // Data state
  bosses: RaidBoss[];
  parties: Party[];
  userParties: Party[];
  queueTickets: QueueTicket[];
  trades: Trade[];

  // UI state
  currentPartyId: string | null;
  activeTab: 'Home' | 'Parties' | 'MyRaids' | 'Trade' | 'Profile';
  showPartyPill: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setBrowsingWithoutAccount: (browsing: boolean) => void;

  setBosses: (bosses: RaidBoss[]) => void;
  setParties: (parties: Party[]) => void;
  setUserParties: (parties: Party[]) => void;
  setQueueTickets: (tickets: QueueTicket[]) => void;
  setTrades: (trades: Trade[]) => void;

  setCurrentPartyId: (partyId: string | null) => void;
  setActiveTab: (tab: 'Home' | 'Parties' | 'MyRaids' | 'Trade' | 'Profile') => void;
  setShowPartyPill: (show: boolean) => void;

  // Data operations
  addParty: (party: Party) => void;
  updateParty: (partyId: string, updates: Partial<Party>) => void;
  removeParty: (partyId: string) => void;

  addQueueTicket: (ticket: QueueTicket) => void;
  updateQueueTicket: (ticketId: string, updates: Partial<QueueTicket>) => void;
  removeQueueTicket: (ticketId: string) => void;

  addTrade: (trade: Trade) => void;
  updateTrade: (tradeId: string, updates: Partial<Trade>) => void;
  removeTrade: (tradeId: string) => void;

  // Utility actions
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isBrowsingWithoutAccount: false,
  bosses: [],
  parties: [],
  userParties: [],
  queueTickets: [],
  trades: [],
  currentPartyId: null,
  activeTab: 'Home' as const,
  showPartyPill: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setBrowsingWithoutAccount: (browsing) => set({ isBrowsingWithoutAccount: browsing }),

      setBosses: (bosses) => set({ bosses }),
      setParties: (parties) => set({ parties }),
      setUserParties: (parties) => set({ userParties: parties }),
      setQueueTickets: (tickets) => set({ queueTickets: tickets }),
      setTrades: (trades) => set({ trades }),

      setCurrentPartyId: (partyId) => set({ currentPartyId: partyId }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowPartyPill: (show) => set({ showPartyPill: show }),

      addParty: (party) => set((state) => ({
        parties: [...state.parties, party]
      })),

      updateParty: (partyId, updates = {}) => set((state) => ({
        parties: state.parties.map(party =>
          party.id === partyId ? { ...party, ...(updates || {}) } : party
        ),
        userParties: state.userParties.map(party =>
          party.id === partyId ? { ...party, ...(updates || {}) } : party
        )
      })),

      removeParty: (partyId) => set((state) => ({
        parties: state.parties.filter(party => party.id !== partyId),
        userParties: state.userParties.filter(party => party.id !== partyId),
        currentPartyId: state.currentPartyId === partyId ? null : state.currentPartyId,
        showPartyPill: state.currentPartyId === partyId ? false : state.showPartyPill
      })),

      addQueueTicket: (ticket) => set((state) => ({
        queueTickets: [...state.queueTickets, ticket]
      })),

      updateQueueTicket: (ticketId, updates = {}) => set((state) => ({
        queueTickets: state.queueTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, ...(updates || {}) } : ticket
        )
      })),

      removeQueueTicket: (ticketId) => set((state) => ({
        queueTickets: state.queueTickets.filter(ticket => ticket.id !== ticketId)
      })),

      addTrade: (trade) => set((state) => ({
        trades: [trade, ...state.trades]
      })),

      updateTrade: (tradeId, updates = {}) => set((state) => ({
        trades: state.trades.map(trade =>
          trade.id === tradeId ? { ...trade, ...(updates || {}) } : trade
        )
      })),

      removeTrade: (tradeId) => set((state) => ({
        trades: state.trades.filter(trade => trade.id !== tradeId)
      })),

      reset: () => set(initialState),
    }),
    {
      name: 'lobbygo-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        bosses: state.bosses,
        currentPartyId: state.currentPartyId,
        activeTab: state.activeTab,
        showPartyPill: state.showPartyPill,
      }),
    }
  )
);
