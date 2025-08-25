import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useAppStore } from '../../stores/appStore';
import { COLORS, TIERS } from '../../constants';
import { RaidBoss } from '../../types';
import { requireAuthForAction } from '../../utils/authHelpers';
import BossCard from '../Home/components/BossCard';
import FilterChips from '../Home/components/FilterChips';

interface RouteParams {
  mode?: 'queue' | 'live';
}

const HostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mode: initialMode } = (route.params as RouteParams) || {};

  const [mode, setMode] = useState<'queue' | 'live'>(initialMode || 'live');
  const [selectedBoss, setSelectedBoss] = useState<RaidBoss | null>(null);
  const [maxSize, setMaxSize] = useState('10');
  const [additionalTrainers, setAdditionalTrainers] = useState('0');
  const [notes, setNotes] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedMega, setSelectedMega] = useState<string>('All');

  const { bosses, user, setCurrentPartyId, setShowPartyPill } = useAppStore();

  useEffect(() => {
    if (!requireAuthForAction('host a raid')) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleModeChange = (index: number) => {
    setMode(index === 0 ? 'queue' : 'live');
  };

  const handleBossSelect = (boss: RaidBoss) => {
    setSelectedBoss(boss);
  };

  const handleCreateParty = async () => {
    if (!selectedBoss) {
      Alert.alert('Boss Required', 'Please select a boss for your raid.');
      return;
    }

    const maxSizeNum = parseInt(maxSize);
    const additionalTrainersNum = parseInt(additionalTrainers);

    if (isNaN(maxSizeNum) || maxSizeNum < 1 || maxSizeNum > 20) {
      Alert.alert('Invalid Size', 'Party size must be between 1 and 20.');
      return;
    }

    if (isNaN(additionalTrainersNum) || additionalTrainersNum < 0 || additionalTrainersNum > 9) {
      Alert.alert('Invalid Count', 'Additional trainers must be between 0 and 9.');
      return;
    }

    try {
      // TODO: Implement actual party creation API call
      const partyId = `party_${Date.now()}`;
      
      console.log('Creating party:', {
        mode,
        boss_id: selectedBoss.id,
        max_size: maxSizeNum,
        additional_trainers: additionalTrainersNum,
        notes: notes.trim(),
      });

      // Set current party state
      setCurrentPartyId(partyId);
      setShowPartyPill(true);

      Alert.alert(
        'Party Created!', 
        `Your ${selectedBoss.name} raid party has been created.`,
        [
          {
            text: 'Go to Party',
            onPress: () => {
              navigation.navigate('Party', { partyId });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating party:', error);
      Alert.alert('Error', 'Failed to create party. Please try again.');
    }
  };

  const filteredBosses = bosses.filter(boss => {
    const tierMatch = selectedTier === 'All' || boss.tier === selectedTier;
    const megaMatch = selectedMega === 'All' ||
      (selectedMega === 'Mega' && boss.raid_type === 'Mega') ||
      (selectedMega === 'G-max' && boss.raid_type === 'G-max') ||
      (selectedMega === 'Max' && boss.raid_type === 'Max') ||
      (selectedMega === 'Regular' && boss.raid_type === 'Regular');
    return tierMatch && megaMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Host a Raid</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raid Mode</Text>
          <SegmentedControlTab
            values={['Queue', 'Live']}
            selectedIndex={mode === 'queue' ? 0 : 1}
            onTabPress={handleModeChange}
            borderRadius={8}
            tabsContainerStyle={styles.segmentedControl}
            tabStyle={styles.segmentedTab}
            activeTabStyle={styles.activeSegmentedTab}
            tabTextStyle={styles.segmentedTabText}
            activeTabTextStyle={styles.activeSegmentedTabText}
          />
          <Text style={styles.modeDescription}>
            {mode === 'queue' 
              ? 'Queue raids match trainers automatically based on boss selection'
              : 'Live raids are visible immediately and trainers can join instantly'
            }
          </Text>
        </View>

        {/* Boss Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Boss</Text>
          
          <FilterChips
            filters={[
              { label: 'All Tiers', value: 'All' },
              ...TIERS.map(tier => ({ label: tier, value: tier }))
            ]}
            selectedValue={selectedTier}
            onSelect={setSelectedTier}
          />
          
          <FilterChips
            filters={[
              { label: 'All Types', value: 'All' },
              { label: 'Mega', value: 'Mega' },
              { label: 'G-max', value: 'G-max' },
              { label: 'Max', value: 'Max' },
              { label: 'Regular', value: 'Regular' },
            ]}
            selectedValue={selectedMega}
            onSelect={setSelectedMega}
          />

          <FlatList
            data={filteredBosses}
            renderItem={({ item }) => (
              <BossCard
                boss={item}
                isSelected={selectedBoss?.id === item.id}
                onSelect={() => handleBossSelect(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.bossGrid}
          />

          {selectedBoss && (
            <View style={styles.selectedBossInfo}>
              <Text style={styles.selectedBossText}>
                Selected: {selectedBoss.name} (Tier {selectedBoss.tier})
              </Text>
            </View>
          )}
        </View>

        {/* Party Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Party Settings</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Maximum Party Size (1-20)</Text>
            <TextInput
              style={styles.numberInput}
              value={maxSize}
              onChangeText={setMaxSize}
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor={COLORS.TEXT_LIGHT}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Trainers (0-9)</Text>
            <Text style={styles.inputDescription}>
              Trainers joining outside the app (friends, family, etc.)
            </Text>
            <TextInput
              style={styles.numberInput}
              value={additionalTrainers}
              onChangeText={setAdditionalTrainers}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={COLORS.TEXT_LIGHT}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any special instructions or requirements..."
              placeholderTextColor={COLORS.TEXT_LIGHT}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Summary */}
        {selectedBoss && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Boss:</Text>
                <Text style={styles.summaryValue}>{selectedBoss.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Mode:</Text>
                <Text style={styles.summaryValue}>{mode === 'queue' ? 'Queue' : 'Live Raid'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Max Size:</Text>
                <Text style={styles.summaryValue}>{maxSize} trainers</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Additional:</Text>
                <Text style={styles.summaryValue}>{additionalTrainers} trainers</Text>
              </View>
              {notes.trim() && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Notes:</Text>
                  <Text style={styles.summaryValue}>"{notes.trim()}"</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, !selectedBoss && styles.disabledButton]}
          onPress={handleCreateParty}
          disabled={!selectedBoss}
        >
          <Text style={styles.createButtonText}>
            {mode === 'queue' ? 'Join Queue' : 'Create Live Raid'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_LIGHT,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  section: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  segmentedControl: {
    marginBottom: 12,
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
  modeDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  bossGrid: {
    paddingVertical: 8,
  },
  selectedBossInfo: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  selectedBossText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  inputDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    lineHeight: 16,
  },
  numberInput: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  notesInput: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
    height: 80,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 2,
    textAlign: 'right',
  },
  createButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HostScreen;
