import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { useAppStore } from '../../stores/appStore';
import { RaidBoss } from '../../types';

interface RaidHistory {
  id: string;
  party_id: string;
  boss_id: string;
  boss_name: string;
  role: 'host' | 'guest';
  status: 'Started' | 'Abandoned' | 'Completed';
  date: string;
  participants: number;
  notes?: string;
}

const MyRaidsScreen = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [raidHistory, setRaidHistory] = useState<RaidHistory[]>([]);
  const { user, bosses, isBrowsingWithoutAccount } = useAppStore();

  useEffect(() => {
    // Load sample raid history
    const sampleHistory: RaidHistory[] = [
      {
        id: '1',
        party_id: 'party_1',
        boss_id: 'eternatus_max',
        boss_name: 'Eternamax Eternatus',
        role: 'host',
        status: 'Completed',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        participants: 8,
        notes: 'Great group!',
      },
      {
        id: '2',
        party_id: 'party_2',
        boss_id: 'charizard_gmax',
        boss_name: 'G-max Charizard',
        role: 'guest',
        status: 'Started',
        date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        participants: 5,
      },
      {
        id: '3',
        party_id: 'party_3',
        boss_id: 'mewtwo',
        boss_name: 'Mewtwo',
        role: 'host',
        status: 'Abandoned',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        participants: 3,
        notes: 'Not enough people joined',
      },
      {
        id: '4',
        party_id: 'party_4',
        boss_id: 'rayquaza',
        boss_name: 'Rayquaza',
        role: 'guest',
        status: 'Completed',
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        participants: 10,
      },
    ];
    setRaidHistory(sampleHistory);
  }, []);

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
  };

  const hostedRaids = raidHistory.filter(raid => raid.role === 'host');
  const joinedRaids = raidHistory.filter(raid => raid.role === 'guest');

  const renderRaidItem = ({ item }: { item: RaidHistory }) => {
    const boss = bosses.find(b => b.id === item.boss_id);
    
    return (
      <TouchableOpacity 
        style={styles.raidCard}
        onPress={() => {
          // TODO: Navigate to raid details/summary
          console.log('View raid details:', item.id);
        }}
      >
        <View style={styles.raidHeader}>
          <View style={styles.raidInfo}>
            <Text style={styles.bossName}>{item.boss_name}</Text>
            <Text style={styles.raidDate}>
              {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
          <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.raidDetails}>
          <View style={styles.raidDetail}>
            <Text style={styles.detailLabel}>Role:</Text>
            <Text style={styles.detailValue}>{item.role === 'host' ? 'Host' : 'Joined'}</Text>
          </View>
          <View style={styles.raidDetail}>
            <Text style={styles.detailLabel}>Participants:</Text>
            <Text style={styles.detailValue}>{item.participants}</Text>
          </View>
          {boss && (
            <View style={styles.raidDetail}>
              <Text style={styles.detailLabel}>Tier:</Text>
              <Text style={styles.detailValue}>{boss.tier}</Text>
            </View>
          )}
        </View>

        {item.notes && (
          <Text style={styles.raidNotes}>"{item.notes}"</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (isBrowsingWithoutAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>My Raids</Text>
          <View style={styles.signInPrompt}>
            <Text style={styles.signInPromptTitle}>Sign In to View Your Raids</Text>
            <Text style={styles.signInPromptText}>
              Track your raid history, see completed raids, and manage your hosting activity.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Raids</Text>
        
        <SegmentedControlTab
          values={['Joined', 'Hosted']}
          selectedIndex={selectedIndex}
          onTabPress={handleIndexChange}
          borderRadius={8}
          tabsContainerStyle={styles.segmentedControl}
          tabStyle={styles.segmentedTab}
          activeTabStyle={styles.activeSegmentedTab}
          tabTextStyle={styles.segmentedTabText}
          activeTabTextStyle={styles.activeSegmentedTabText}
        />

        <View style={styles.listContainer}>
          <FlatList
            data={selectedIndex === 0 ? joinedRaids : hostedRaids}
            renderItem={renderRaidItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No {selectedIndex === 0 ? 'joined' : 'hosted'} raids yet
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {selectedIndex === 0 
                    ? 'Join your first raid from the Home screen'
                    : 'Host your first raid from the Home screen'
                  }
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  segmentedTab: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderColor: COLORS.TEXT_LIGHT,
  },
  activeSegmentedTab: {
    backgroundColor: COLORS.PRIMARY,
  },
  segmentedTabText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeSegmentedTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  raidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  raidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  raidInfo: {
    flex: 1,
  },
  bossName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  raidDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusStarted: {
    backgroundColor: COLORS.INFO,
  },
  statusAbandoned: {
    backgroundColor: COLORS.ERROR,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  raidDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  raidDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  raidNotes: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  signInPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  signInPromptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  signInPromptText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MyRaidsScreen;