import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../stores/appStore';
import { RaidBoss } from '../../types';
import { requireAuthForAction } from '../../utils/authHelpers';
import RaidCard from '../../components/RaidCard';
import RaidBottomSheet from '../../components/RaidBottomSheet';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = Queue, 1 = Live Raids
  const [selectedRaid, setSelectedRaid] = useState<RaidBoss | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('All Tiers');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const { bosses, setBosses } = useAppStore();

  // Load bosses from raid_bosses.json (production ready)
  useEffect(() => {
    try {
      const raidBosses = require('../../assets/bosses/raid_bosses.json');
      // Always reload to ensure we have the latest data
      setBosses(raidBosses);
      console.log(`Loaded ${raidBosses.length} raid bosses from JSON`);
    } catch (error) {
      console.error('Error loading raid bosses:', error);
      setBosses([]);
    }
  }, [setBosses]);

  // Filter data
  const tierFilters = ['All Tiers', '1', '2', '3', '4', '5', 'Mega'];
  const typeFilters = ['All Types', 'Mega', 'G-max', 'Max', 'Regular'];
  
  const filteredBosses = bosses
    .filter(boss => {
      const tierMatch = selectedTier === 'All Tiers' || 
        boss.tier === selectedTier || 
        (selectedTier === 'Mega' && boss.raid_type === 'Mega');
      
      const typeMatch = selectedType === 'All Types' || 
        boss.raid_type === selectedType ||
        (selectedType === 'Regular' && !['Mega', 'G-max', 'Max'].includes(boss.raid_type));
      
      return tierMatch && typeMatch;
    })
    .sort((a, b) => {
      // Define tier priority (highest to lowest)
      const getTierPriority = (boss: any) => {
        if (boss.raid_type === 'Legendary') return 1000; // Highest priority
        if (boss.raid_type === 'Mega' || boss.tier === 'Mega') return 900;
        if (boss.raid_type === 'G-max') return 800;
        if (boss.raid_type === 'Max' || boss.tier === 'Max') return 700;
        if (boss.tier === 'Shadow 5' || boss.tier === '5') return 500;
        if (boss.tier === 'Shadow 4' || boss.tier === '4') return 400;
        if (boss.tier === 'Shadow 3' || boss.tier === '3') return 300;
        if (boss.tier === 'Shadow 2' || boss.tier === '2') return 200;
        if (boss.tier === 'Shadow 1' || boss.tier === '1') return 100;
        return 0; // Fallback
      };
      
      return getTierPriority(b) - getTierPriority(a); // Sort descending (highest first)
    });

  // Live raids - empty by default (production ready)
  const liveRaids: any[] = [];

  const handleRaidPress = (boss: RaidBoss) => {
    setSelectedRaid(boss);
    setShowBottomSheet(true);
  };

  const handleBottomSheetClose = () => {
    setShowBottomSheet(false);
    setSelectedRaid(null);
  };

  const handleJoinLive = (boss: RaidBoss) => {
    if (requireAuthForAction('join live raid')) {
      Alert.alert('Joining Raid', `Joining live raid for ${boss.name}`);
    }
  };

  const renderFilterChip = ({ item }: { item: string }, isActive: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.activeFilterChip]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderRaidCard = ({ item }: { item: RaidBoss }) => {
    // Mock queue/room data - in real app this would come from your store/API
    const queueCount = selectedIndex === 0 ? Math.floor(Math.random() * 150) : undefined;
    const roomsOpen = selectedIndex === 1 ? Math.floor(Math.random() * 25) : undefined;
    
    return (
      <View style={styles.cardWrapper}>
        <RaidCard
          boss={item.name}
          tier={item.tier}
          raidType={item.raid_type}
          number={item.sprite.split('/').pop()?.replace('.png', '')}
          sprite={item.sprite}
          selected={selectedRaid?.id === item.id}
          onPress={() => handleRaidPress(item)}
          queueCount={queueCount}
          roomsOpen={roomsOpen}
          isQueue={selectedIndex === 0}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.headerContainer}>
        {/* Large Queue/Live Raids Buttons */}
        <View style={styles.sectionButtonsContainer}>
          <TouchableOpacity
            style={[styles.sectionButton, selectedIndex === 0 && styles.activeSectionButton]}
            onPress={() => setSelectedIndex(0)}
          >
            <Text style={[styles.sectionButtonText, selectedIndex === 0 && styles.activeSectionButtonText]}>
              Queue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sectionButton, selectedIndex === 1 && styles.activeSectionButton]}
            onPress={() => setSelectedIndex(1)}
          >
            <Text style={[styles.sectionButtonText, selectedIndex === 1 && styles.activeSectionButtonText]}>
              Live Raids
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>

      {/* Filter Controls */}
      <View style={styles.filtersHeaderContainer}>
        <TouchableOpacity
          style={[styles.filterToggleButton, showFilters && styles.filterToggleButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={[styles.filterToggleButtonText, showFilters && styles.filterToggleButtonTextActive]}>
            {showFilters ? '− Hide Filters' : '+ Show Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Rows */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Tier Filters */}
          <FlatList
            data={tierFilters}
            renderItem={({ item }) => renderFilterChip(
              { item },
              selectedTier === item,
              () => setSelectedTier(item)
            )}
            keyExtractor={(item) => `tier-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          />
          
          {/* Type Filters */}
          <FlatList
            data={typeFilters}
            renderItem={({ item }) => renderFilterChip(
              { item },
              selectedType === item,
              () => setSelectedType(item)
            )}
            keyExtractor={(item) => `type-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={selectedIndex === 0 ? filteredBosses : liveRaids}
          renderItem={renderRaidCard}
          keyExtractor={(item) => `${selectedIndex}-${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Bottom Sheet */}
      {selectedRaid && (
        <RaidBottomSheet
          visible={showBottomSheet}
          onClose={handleBottomSheetClose}
          bossName={selectedRaid.name}
          cpNoWeather={selectedRaid.catch_cp_100_no_weather}
          cpWeather={selectedRaid.catch_cp_100_weather}
          tierLabel={selectedRaid.tier}
          sprite={selectedRaid.sprite}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  activeSectionButton: {
    backgroundColor: '#2B6BED',
    borderColor: '#2B6BED',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeSectionButtonText: {
    color: '#FFFFFF',
  },
  filtersHeaderContainer: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EC',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  filterToggleButtonActive: {
    backgroundColor: '#E6F3FF',
  },
  filterToggleButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterToggleButtonTextActive: {
    color: '#2B6BED',
  },
  
  // Filters
  filtersContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 12,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
  },
  gridContent: {
    padding: 16,
    paddingBottom: 120, // Space for sticky buttons
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingVertical: 16,
  },
  
  // Actions
  hostButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  hostButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  hostButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hostPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  hostPanelContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  hostPanelHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  hostPanelHandleBar: {
    width: 32,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  hostPanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  hostPanelSubtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },
  hostPanelButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  hostPanelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Boss Expansion Panel
  bossExpansionPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  expansionContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  expansionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  expansionStats: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#475569',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  expansionJoinButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  expansionJoinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  expansionCloseButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  expansionCloseButtonText: {
    color: '#475569',
    fontSize: 14,
  },
  
  // New Grid Styles
  gridContainer: {
    padding: 16,
  },
  columnWrapper: {
    gap: 12,
  },
  cardWrapper: {
    marginBottom: 12,
  },
});

export default HomeScreen;