import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { COLORS, FRIENDSHIP_TARGETS, REGISTRATION_OPTIONS } from '../../constants';
import { Trade, TradeWithUser, RootStackParamList } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { requireAuthForAction } from '../../utils/authHelpers';
import PokemonDropdown from '../../components/PokemonDropdown';

type TradeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TradeScreen = () => {
  const navigation = useNavigation<TradeScreenNavigationProp>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [trades, setTrades] = useState<TradeWithUser[]>([]);
  
  // Listings filters
  const [searchOffering, setSearchOffering] = useState('');
  const [searchLookingFor, setSearchLookingFor] = useState('');
  const [filterCanFly, setFilterCanFly] = useState('Any');
  const [filterFriendship, setFilterFriendship] = useState('None');
  const [filterRegistered, setFilterRegistered] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Create listing form
  const [offering, setOffering] = useState<string[]>(['']);
  const [lookingFor, setLookingFor] = useState<string[]>(['']);
  const [canFly, setCanFly] = useState(false);
  const [registered, setRegistered] = useState<'Registered' | 'Unregistered'>('Registered');
  const [friendshipTarget, setFriendshipTarget] = useState<'None' | 'Good' | 'Great' | 'Ultra' | 'Best'>('None');
  const [notes, setNotes] = useState('');

  const { user, trades: storeTrades, setTrades: setStoreTrades } = useAppStore();

  const renderMyListingsView = () => {
    const myListings = trades.filter(trade => trade.poster_id === user?.id);
    
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.sectionTitle}>My Trade Listings</Text>
        <FlatList
          data={myListings}
          renderItem={({ item }) => (
            <View style={styles.tradeCard}>
              <View style={styles.tradeHeader}>
                <Text style={styles.trainerName}>My Listing</Text>
                <Text style={styles.tradeDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.tradeContent}>
                <View style={styles.tradeSection}>
                  <Text style={styles.tradeSectionTitle}>Offering:</Text>
                  <Text style={styles.pokemonList}>
                    {item.offering.join(', ') || 'Nothing specific'}
                  </Text>
                </View>

                <View style={styles.tradeSection}>
                  <Text style={styles.tradeSectionTitle}>Looking For:</Text>
                  <Text style={styles.pokemonList}>
                    {item.looking_for.join(', ') || 'Nothing specific'}
                  </Text>
                </View>
              </View>

              <View style={styles.tradeBadges}>
                {item.can_fly && (
                  <View style={[styles.badge, styles.canFlyBadge]}>
                    <Text style={styles.badgeText}>Can Fly</Text>
                  </View>
                )}
                <View style={[styles.badge, styles.registeredBadge]}>
                  <Text style={styles.badgeText}>{item.registered}</Text>
                </View>
                {item.friendship_target !== 'None' && (
                  <View style={[styles.badge, styles.friendshipBadge]}>
                    <Text style={styles.badgeText}>{item.friendship_target} Friend</Text>
                  </View>
                )}
              </View>

              {item.notes && (
                <Text style={styles.tradeNotes}>"{item.notes}"</Text>
              )}

              <View style={styles.tradeActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      'Delete Listing',
                      'Are you sure you want to delete this listing?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => {
                            setTrades(trades.filter(t => t.id !== item.id));
                            Alert.alert('Success', 'Listing deleted');
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No listings yet</Text>
              <Text style={styles.emptyStateSubtext}>Create your first trade listing</Text>
            </View>
          }
        />
      </View>
    );
  };

  const renderActiveTradesView = () => {
    // Production ready - no sample data
    const activeTradesData: any[] = [];
    
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.sectionTitle}>Active Trades</Text>
        <FlatList
          data={activeTradesData}
          renderItem={({ item }) => (
            <View style={styles.activeTradeCard}>
              <View style={styles.activeTradeHeader}>
                <Text style={styles.activeTradeTitle}>
                  {item.type === 'proposal_received' ? 'Trade Proposal Received' : 'Trade Proposal Sent'}
                </Text>
                <View style={[styles.badge, item.status === 'accepted' ? styles.statusAccepted : styles.statusPending]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.otherTrainer}>With: {item.other_trainer}</Text>

              <View style={styles.tradeExchange}>
                <View style={styles.exchangeSection}>
                  <Text style={styles.exchangeLabel}>You Give:</Text>
                  <Text style={styles.exchangeValue}>{item.my_offer.join(', ')}</Text>
                </View>
                <Text style={styles.exchangeArrow}>⇄</Text>
                <View style={styles.exchangeSection}>
                  <Text style={styles.exchangeLabel}>You Get:</Text>
                  <Text style={styles.exchangeValue}>{item.their_offer.join(', ')}</Text>
                </View>
              </View>

              <View style={styles.activeTradeActions}>
                {item.type === 'proposal_received' && item.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={styles.acceptButton}
                      onPress={() => Alert.alert('Accept', 'Trade proposal accepted! Navigate to trade screen.')}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.declineButton}
                      onPress={() => Alert.alert('Decline', 'Trade proposal declined')}
                    >
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.status === 'accepted' && (
                  <TouchableOpacity 
                    style={styles.goToTradeButton}
                    onPress={() => navigation.navigate('TradeChat', { tradeId: item.trade_id })}
                  >
                    <Text style={styles.goToTradeButtonText}>Go to Trade</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active trades</Text>
              <Text style={styles.emptyStateSubtext}>Propose trades or wait for proposals on your listings</Text>
            </View>
          }
        />
      </View>
    );
  };

  useEffect(() => {
    // Production ready - no sample data
    // TODO: Load trades from API when live
  }, []);

  const handleIndexChange = (index: number) => {
    setSelectedIndex(index);
  };

  const addOfferingItem = () => {
    if (offering.length < 6) {
      setOffering([...offering, '']);
    }
  };

  const removeOfferingItem = (index: number) => {
    if (offering.length > 1) {
      setOffering(offering.filter((_, i) => i !== index));
    }
  };

  const updateOfferingItem = (index: number, value: string) => {
    const newOffering = [...offering];
    newOffering[index] = value;
    setOffering(newOffering);
  };

  const addLookingForItem = () => {
    if (lookingFor.length < 6) {
      setLookingFor([...lookingFor, '']);
    }
  };

  const removeLookingForItem = (index: number) => {
    if (lookingFor.length > 1) {
      setLookingFor(lookingFor.filter((_, i) => i !== index));
    }
  };

  const updateLookingForItem = (index: number, value: string) => {
    const newLookingFor = [...lookingFor];
    newLookingFor[index] = value;
    setLookingFor(newLookingFor);
  };

  const handleCreateListing = () => {
    if (!requireAuthForAction('create a trade listing')) {
      return;
    }

    const hasOffering = offering.some(item => item.trim().length > 0);
    const hasLookingFor = lookingFor.some(item => item.trim().length > 0);

    if (!hasOffering && !hasLookingFor) {
      Alert.alert('Error', 'Please add at least one Pokémon to offering or looking for.');
      return;
    }

    try {
      const newTrade: TradeWithUser = {
        id: Date.now().toString(),
        poster_id: user?.id || 'temp_user',
        offering: offering.filter(item => item.trim().length > 0),
        looking_for: lookingFor.filter(item => item.trim().length > 0),
        can_fly: canFly,
        registered,
        friendship_target: friendshipTarget,
        notes: notes.trim(),
        status: 'open',
        created_at: new Date().toISOString(),
        poster: user || {
          id: 'temp_user',
          auth_id: 'temp_user',
          trainer_name: 'Anonymous',
          friend_code: '0000 0000 0000',
          team: 'Mystic',
          level: 1,
          created_at: new Date().toISOString(),
        },
        messages: [],
      };

      setTrades([newTrade, ...trades]);
      
      // Reset form
      setOffering(['']);
      setLookingFor(['']);
      setCanFly(false);
      setRegistered('Registered');
      setFriendshipTarget('None');
      setNotes('');

      Alert.alert('Success', 'Trade listing created successfully!');
      setSelectedIndex(1); // Switch to my listings tab
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    }
  };

  const filteredTrades = trades.filter(trade => {
    const offeringMatch = !searchOffering || 
      trade.offering.some(item => item.toLowerCase().includes(searchOffering.toLowerCase()));
    
    const lookingForMatch = !searchLookingFor || 
      trade.looking_for.some(item => item.toLowerCase().includes(searchLookingFor.toLowerCase()));
    
    const canFlyMatch = filterCanFly === 'Any' || 
      (filterCanFly === 'Yes' && trade.can_fly) || 
      (filterCanFly === 'No' && !trade.can_fly);
    
    const friendshipMatch = filterFriendship === 'None' || trade.friendship_target === filterFriendship;
    
    const registeredMatch = filterRegistered === 'Any' || trade.registered === filterRegistered;

    return offeringMatch && lookingForMatch && canFlyMatch && friendshipMatch && registeredMatch;
  });

  const renderTradeCard = ({ item }: { item: TradeWithUser }) => (
    <View style={styles.tradeCard}>
      <View style={styles.tradeHeader}>
        <Text style={styles.trainerName}>{item.poster.trainer_name}</Text>
        <Text style={styles.tradeDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.tradeContent}>
        <View style={styles.tradeSection}>
          <Text style={styles.tradeSectionTitle}>Offering:</Text>
          <Text style={styles.pokemonList}>
            {item.offering.join(', ') || 'Nothing specific'}
          </Text>
        </View>

        <View style={styles.tradeSection}>
          <Text style={styles.tradeSectionTitle}>Looking For:</Text>
          <Text style={styles.pokemonList}>
            {item.looking_for.join(', ') || 'Nothing specific'}
          </Text>
        </View>
      </View>

      <View style={styles.tradeBadges}>
        {item.can_fly && (
          <View style={[styles.badge, styles.canFlyBadge]}>
            <Text style={styles.badgeText}>Can Fly</Text>
          </View>
        )}
        <View style={[styles.badge, styles.registeredBadge]}>
          <Text style={styles.badgeText}>{item.registered}</Text>
        </View>
        {item.friendship_target !== 'None' && (
          <View style={[styles.badge, styles.friendshipBadge]}>
            <Text style={styles.badgeText}>{item.friendship_target} Friend</Text>
          </View>
        )}
      </View>

      {item.notes && (
        <Text style={styles.tradeNotes}>"{item.notes}"</Text>
      )}

      <View style={styles.tradeActions}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => {
            if (requireAuthForAction('message a trader')) {
              Alert.alert('Message', `Would message ${item.poster.trainer_name}`);
            }
          }}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.proposeButton}
          onPress={() => {
            if (requireAuthForAction('propose a trade')) {
              Alert.alert('Propose Trade', `Would propose trade with ${item.poster.trainer_name}`);
            }
          }}
        >
          <Text style={styles.proposeButtonText}>Propose Trade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListingsView = () => (
    <View style={styles.viewContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={[styles.unifiedSearchBar, showSearchDropdown && styles.unifiedSearchBarActive]}
          onPress={() => setShowSearchDropdown(!showSearchDropdown)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <View style={styles.searchTextContainer}>
            {searchOffering || searchLookingFor ? (
              <View style={styles.activeSearchContainer}>
                {searchOffering && (
                  <View style={styles.searchChip}>
                    <Text style={styles.searchChipLabel}>Offering:</Text>
                    <Text style={styles.searchChipValue}>{searchOffering}</Text>
                  </View>
                )}
                {searchLookingFor && (
                  <View style={styles.searchChip}>
                    <Text style={styles.searchChipLabel}>Looking for:</Text>
                    <Text style={styles.searchChipValue}>{searchLookingFor}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.searchPlaceholder}>Search trades...</Text>
            )}
          </View>
          <Text style={styles.dropdownArrow}>
            {showSearchDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        
        {showSearchDropdown && (
          <View style={styles.searchDropdown}>
            <View style={styles.dropdownContent}>
              <View style={styles.dropdownRow}>
                <View style={styles.dropdownInputContainer}>
                  <Text style={styles.dropdownInputLabel}>Offering</Text>
                  <PokemonDropdown
                    value={searchOffering}
                    onSelect={setSearchOffering}
                    placeholder="Type Pokémon name..."
                    style={styles.dropdownPokemonInput}
                  />
                </View>
                <View style={styles.dropdownInputContainer}>
                  <Text style={styles.dropdownInputLabel}>Looking For</Text>
                  <PokemonDropdown
                    value={searchLookingFor}
                    onSelect={setSearchLookingFor}
                    placeholder="Type Pokémon name..."
                    style={styles.dropdownPokemonInput}
                  />
                </View>
              </View>
              
              <View style={styles.dropdownActions}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchOffering('');
                    setSearchLookingFor('');
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setShowSearchDropdown(false)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Filter Toggle Button */}
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

      {/* Filters */}
      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Can Fly:</Text>
          <View style={styles.chipContainer}>
            {['Any', 'Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  filterCanFly === option && styles.activeFilterChip
                ]}
                onPress={() => setFilterCanFly(option)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterCanFly === option && styles.activeFilterChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Friendship:</Text>
          <View style={styles.chipContainer}>
            {['Any', 'Good', 'Great', 'Ultra', 'Best'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  filterFriendship === (option === 'Any' ? 'None' : option) && styles.activeFilterChip
                ]}
                onPress={() => setFilterFriendship(option === 'Any' ? 'None' : option)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterFriendship === (option === 'Any' ? 'None' : option) && styles.activeFilterChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Registered:</Text>
          <View style={styles.chipContainer}>
            {['Any', 'Registered', 'Unregistered'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  filterRegistered === option && styles.activeFilterChip
                ]}
                onPress={() => setFilterRegistered(option)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterRegistered === option && styles.activeFilterChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </ScrollView>
      )}

      {/* Trade Listings */}
      <FlatList
        data={filteredTrades}
        renderItem={renderTradeCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No trades found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your filters or create a new listing</Text>
          </View>
        }
      />
    </View>
  );

  const renderCreateView = () => (
    <ScrollView style={styles.viewContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Create Trade Listing</Text>

      {/* Offering Section */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Offering (1-6 Pokémon):</Text>
        {offering.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.pokemonInputContainer}>
              <PokemonDropdown
                value={item}
                onSelect={(value) => updateOfferingItem(index, value)}
                placeholder={`Pokémon ${index + 1}`}
                style={styles.pokemonDropdown}
              />
            </View>
            {offering.length > 1 && (
              <TouchableOpacity 
                onPress={() => removeOfferingItem(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {offering.length < 6 && (
          <TouchableOpacity onPress={addOfferingItem} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Pokémon</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Looking For Section */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Looking For (1-6 Pokémon):</Text>
        {lookingFor.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={styles.pokemonInputContainer}>
              <PokemonDropdown
                value={item}
                onSelect={(value) => updateLookingForItem(index, value)}
                placeholder={`Pokémon ${index + 1}`}
                style={styles.pokemonDropdown}
              />
            </View>
            {lookingFor.length > 1 && (
              <TouchableOpacity 
                onPress={() => removeLookingForItem(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {lookingFor.length < 6 && (
          <TouchableOpacity onPress={addLookingForItem} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Pokémon</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Options */}
      <View style={styles.formSection}>
        <TouchableOpacity 
          style={styles.toggleRow}
          onPress={() => setCanFly(!canFly)}
        >
          <Text style={styles.toggleLabel}>Can Fly</Text>
          <View style={[styles.toggle, canFly && styles.toggleActive]}>
            <View style={[styles.toggleButton, canFly && styles.toggleButtonActive]} />
          </View>
        </TouchableOpacity>

        <View style={styles.pickerSection}>
          <Text style={styles.pickerLabel}>Registered Status:</Text>
          <View style={styles.chipContainer}>
            {['Registered', 'Unregistered'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  registered === option && styles.activeFilterChip
                ]}
                onPress={() => setRegistered(option as 'Registered' | 'Unregistered')}
              >
                <Text style={[
                  styles.filterChipText,
                  registered === option && styles.activeFilterChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.pickerSection}>
          <Text style={styles.pickerLabel}>Friendship Target:</Text>
          <View style={styles.chipContainer}>
            {['None', 'Good', 'Great', 'Ultra', 'Best'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  friendshipTarget === option && styles.activeFilterChip
                ]}
                onPress={() => setFriendshipTarget(option as any)}
              >
                <Text style={[
                  styles.filterChipText,
                  friendshipTarget === option && styles.activeFilterChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Notes (Optional):</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Any additional details..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.TEXT_LIGHT}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateListing}
      >
        <Text style={styles.createButtonText}>Create Listing</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <SegmentedControlTab
            values={['Browse', 'My Trades', 'Active', 'Create']}
            selectedIndex={selectedIndex}
            onTabPress={handleIndexChange}
            borderRadius={6}
            tabsContainerStyle={styles.segmentedControl}
            tabStyle={styles.segmentedTab}
            activeTabStyle={styles.activeSegmentedTab}
            tabTextStyle={styles.segmentedTabText}
            activeTabTextStyle={styles.activeSegmentedTabText}
          />
        </View>
      </View>

      {selectedIndex === 0 && renderListingsView()}
      {selectedIndex === 1 && renderMyListingsView()}
      {selectedIndex === 2 && renderActiveTradesView()}
      {selectedIndex === 3 && renderCreateView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentedControl: {
    marginBottom: 0,
    flex: 1,
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
  segmentedTab: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderColor: COLORS.TEXT_LIGHT,
  },
  activeSegmentedTab: {
    backgroundColor: '#2563EB',
  },
  segmentedTabText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeSegmentedTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
  },
  unifiedSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  unifiedSearchBarActive: {
    borderColor: '#2B6BED',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#6B7280',
  },
  searchTextContainer: {
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activeSearchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchChipLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 4,
  },
  searchChipValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  searchDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownContent: {
    padding: 20,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  dropdownInputContainer: {
    flex: 1,
  },
  dropdownInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dropdownPokemonInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6E8EC',
  },
  dropdownActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2B6BED',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  filtersContainer: {
    marginBottom: 16,
    paddingTop: 16,
  },
  filterGroup: {
    marginRight: 20,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  tradeCard: {
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
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1220',
  },
  tradeDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  tradeContent: {
    marginBottom: 12,
  },
  tradeSection: {
    marginBottom: 8,
  },
  tradeSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  pokemonList: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  tradeBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  canFlyBadge: {
    backgroundColor: COLORS.INFO,
  },
  registeredBadge: {
    backgroundColor: COLORS.SUCCESS,
  },
  friendshipBadge: {
    backgroundColor: COLORS.WARNING,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tradeNotes: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 16,
  },
  tradeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  proposeButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  proposeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pokemonInputContainer: {
    flex: 1,
  },
  pokemonDropdown: {
    flex: 1,
  },
  pokemonInput: {
    flex: 1,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
  },
  removeButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.TEXT_LIGHT,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    alignSelf: 'flex-end',
  },
  pickerSection: {
    marginTop: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
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
  createButton: {
    backgroundColor: '#2B6BED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  // My Listings styles
  editButton: {
    flex: 1,
    backgroundColor: COLORS.INFO,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 4,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 4,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Active Trades styles
  activeTradeCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  activeTradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeTradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  statusAccepted: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusPending: {
    backgroundColor: COLORS.WARNING,
  },
  otherTrainer: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  tradeExchange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: 12,
  },
  exchangeSection: {
    flex: 1,
  },
  exchangeLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  exchangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  exchangeArrow: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    marginHorizontal: 16,
  },
  activeTradeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  goToTradeButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
  },
  goToTradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TradeScreen;
