import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { RaidBoss } from '../../../types';
import { COLORS } from '../../../constants';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side, 16px gap

interface BossCardProps {
  boss: RaidBoss;
  isSelected: boolean;
  onSelect: () => void;
}

const BossCard = ({ boss, isSelected, onSelect }: BossCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {/* TODO: Replace with actual boss sprite */}
        <View style={[styles.placeholderImage, isSelected && styles.selectedImage]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {boss.name}
        </Text>
        <View style={styles.badgeRow}>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(boss.tier) }]}>
            <Text style={styles.tierText}>{boss.tier}</Text>
          </View>
          {boss.raid_type !== 'Regular' && (
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(boss.raid_type) }]}>
              <Text style={styles.typeText}>{boss.raid_type}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getTierColor = (tier: string): string => {
  switch (tier) {
    case '1':
    case '2':
      return '#4CAF50'; // Green
    case '3':
    case '4':
      return '#FF9800'; // Orange
    case '5':
      return '#F44336'; // Red
    case 'Mega':
      return '#9C27B0'; // Purple
    case 'Max':
      return '#3F51B5'; // Indigo
    default:
      return COLORS.TEXT_SECONDARY;
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'Mega':
      return '#E91E63'; // Pink
    case 'G-max':
      return '#00BCD4'; // Cyan
    case 'Max':
      return '#673AB7'; // Deep Purple
    case 'Legendary':
      return '#FF5722'; // Deep Orange
    case 'Special':
      return '#795548'; // Brown
    default:
      return COLORS.TEXT_SECONDARY;
  }
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: '#FFF3E0', // Light orange background
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.TEXT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    backgroundColor: COLORS.PRIMARY,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default BossCard;
