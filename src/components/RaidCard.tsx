import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { getSpriteSource, getSpriteStyle } from '../utils/spriteHelpers';

interface RaidCardProps {
  id?: string;
  boss: string;
  tier: string;
  raidType?: string;
  number?: string;
  sprite: string;
  selected: boolean;
  onPress: () => void;
  queueCount?: number;
  roomsOpen?: number;
  isQueue?: boolean;
}

const RaidCard: React.FC<RaidCardProps> = ({
  boss,
  tier,
  raidType,
  number,
  sprite,
  selected,
  onPress,
  queueCount,
  roomsOpen,
  isQueue = false,
}) => {
  // Extract number from sprite path if not provided
  const displayNumber = number || sprite.split('/').pop()?.replace('.png', '') || '';

  // Badge logic
  const getBadge = () => {
    if (tier === 'Shadow 1' || tier === 'Shadow 3' || tier === 'Shadow 5') {
      const tierNum = tier.split(' ')[1];
      return { text: `Tier ${tierNum} - Shadow`, color: '#EF4444' };
    }
    if (tier >= '1' && tier <= '5') {
      return { text: `Tier ${tier}`, color: '#EF4444' };
    }
    if (raidType === 'Legendary') {
      return { text: 'Legendary', color: '#F59E0B' };
    }
    if (raidType === 'Mega' || tier === 'Mega') {
      return { text: 'Mega', color: '#7C3AED' };
    }
    return { text: tier, color: '#EF4444' };
  };

  const badge = getBadge();

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      activeOpacity={0.7}
    >
      {/* Sprite */}
      <View style={styles.spriteContainer}>
        {getSpriteSource(sprite) ? (
          <Image
            source={getSpriteSource(sprite)}
            style={styles.sprite}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderSprite}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </View>

      {/* Number */}
      {displayNumber && (
        <Text style={styles.number}>#{displayNumber}</Text>
      )}

      {/* Name */}
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {boss}
      </Text>

      {/* Tier text under name (no colored tag) */}
      <Text style={styles.tierText} numberOfLines={1}>
        {badge.text}
      </Text>

      {/* Queue/Room status */}
      {isQueue ? (
        queueCount !== undefined && (
          <Text style={styles.statusText} numberOfLines={1}>
            {queueCount === 0 ? 'No queue' : `${queueCount} in queue`}
          </Text>
        )
      ) : (
        roomsOpen !== undefined && (
          <Text style={styles.statusText} numberOfLines={1}>
            {roomsOpen === 0 ? 'No rooms' : `${roomsOpen} rooms open`}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};

const SCREEN_PADDING = 16; // from gridContainer
const COLUMN_GAP = 12;     // from columnWrapper
const NUM_COLUMNS = 2;
const AVAILABLE_WIDTH = Dimensions.get('window').width - SCREEN_PADDING * 2 - COLUMN_GAP;
const CARD_WIDTH = Math.floor(AVAILABLE_WIDTH / NUM_COLUMNS);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#2B6BED',
    borderWidth: 2,
    shadowOpacity: 0.08,
  },
  spriteContainer: {
    width: 36,
    height: 36,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    width: 36,
    height: 36,
  },
  placeholderSprite: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E6E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#8B8F98',
  },
  number: {
    fontSize: 12,
    color: '#8B8F98',
    textAlign: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1220',
    textAlign: 'center',
  },
  tierText: {
    fontSize: 12,
    color: '#8B8F98',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 11,
    color: '#2B6BED',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RaidCard;
