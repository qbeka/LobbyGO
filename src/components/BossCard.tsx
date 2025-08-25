import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { RaidBoss } from '../types';
import { getSpriteSource, getSpriteStyle } from '../utils/spriteHelpers';

const { width: screenWidth } = Dimensions.get('window');

interface BossCardProps {
  boss: RaidBoss;
  variant: 'grid' | 'list';
  isSelected?: boolean;
  slots?: string;
  timeLeft?: string;
  onPress?: () => void;
  onJoin?: () => void;
  showJoinButton?: boolean;
}

const BossCard: React.FC<BossCardProps> = ({
  boss,
  variant,
  isSelected = false,
  slots,
  timeLeft,
  onPress,
  onJoin,
  showJoinButton = false,
}) => {
  const getBadges = () => {
    const badges = [];
    
    // Priority: Max > Mega > G-max > Legendary > Tier
    if (boss.raid_type === 'Max' || boss.tier === 'Max') {
      badges.push({ text: 'Max', color: '#3498DB' });
    } else if (boss.raid_type === 'Mega') {
      badges.push({ text: 'Mega', color: '#9B59B6' });
    } else if (boss.raid_type === 'G-max') {
      badges.push({ text: 'G-max', color: '#9B59B6' });
    } else if (boss.raid_type === 'Legendary') {
      badges.push({ text: 'Legendary', color: '#E67E22' });
    } else if (boss.tier === '5') {
      badges.push({ text: 'Tier 5', color: '#E74C3C' });
    } else {
      badges.push({ text: `Tier ${boss.tier}`, color: '#E74C3C' });
    }
    
    return badges.slice(0, 2); // Max 2 badges
  };

  const badges = getBadges();

  if (variant === 'grid') {
    return (
      <TouchableOpacity
        style={[
          styles.gridCard,
          isSelected && styles.selectedCard
        ]}
        onPress={onPress}
      >
              {/* Sprite */}
      <View style={styles.gridSprite}>
        {getSpriteSource(boss.sprite) ? (
          <Image
            source={getSpriteSource(boss.sprite)}
            style={getSpriteStyle('medium')}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.spritePlaceholder}>
            <Text style={styles.spriteText}>🔴</Text>
            <Text style={styles.spriteLabel}>#{boss.sprite.split('/').pop()?.replace('.png', '') || 'Unknown'}</Text>
          </View>
        )}
      </View>
        
        {/* Boss Name */}
        <Text style={styles.gridBossName} numberOfLines={1}>
          {boss.name}
        </Text>
        
        {/* Badges */}
        <View style={styles.badgeRow}>
          {badges.map((badge, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          ))}
        </View>

        {/* Expanded Content (CP Stats + Join Button) */}
        {isSelected && (
          <View style={styles.expandedContent}>
            <View style={styles.cpStats}>
              <View style={styles.cpRow}>
                <Text style={styles.cpLabel}>No Weather:</Text>
                <Text style={styles.cpValue}>{boss.catch_cp_100_no_weather}</Text>
              </View>
              <View style={styles.cpRow}>
                <Text style={styles.cpLabel}>Weather Boost:</Text>
                <Text style={styles.cpValue}>{boss.catch_cp_100_weather}</Text>
              </View>
            </View>
            
            {showJoinButton && onJoin && (
              <TouchableOpacity style={styles.expandedJoinButton} onPress={onJoin}>
                <Text style={styles.expandedJoinButtonText}>Join Queue</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.listCard}>
      {/* Left: Sprite */}
      <View style={styles.listSprite}>
        {getSpriteSource(boss.sprite) ? (
          <Image
            source={getSpriteSource(boss.sprite)}
            style={getSpriteStyle('small')}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.spritePlaceholder}>
            <Text style={styles.spriteText}>🔴</Text>
          </View>
        )}
      </View>
      
      {/* Middle: Content */}
      <View style={styles.listContent}>
        <Text style={styles.listBossName} numberOfLines={1}>
          {boss.name}
        </Text>
        
        {/* Badges */}
        <View style={styles.badgeRow}>
          {badges.map((badge, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          ))}
        </View>
        
        {/* Slots and Countdown */}
        <View style={styles.metaRow}>
          {slots && <Text style={styles.metaText}>{slots}</Text>}
          {timeLeft && (
            <Text style={[
              styles.metaText,
              styles.countdown,
              { color: timeLeft.startsWith('0') ? '#E74C3C' : '#666' }
            ]}>
              {timeLeft}
            </Text>
          )}
        </View>
      </View>
      
      {/* Right: Join Button */}
      {onJoin && (
        <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Grid Card Styles
  gridCard: {
    width: (screenWidth - 16 * 2 - 12) / 2,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  gridSprite: {
    width: 64,
    height: 52,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridBossName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 6,
  },
  
  // List Card Styles
  listCard: {
    height: 90,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listSprite: {
    width: 48,
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listBossName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  
  // Shared Styles
  spriteText: {
    fontSize: 24,
    color: '#999',
  },
  spritePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spriteLabel: {
    fontSize: 8,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  countdown: {
    fontWeight: '500',
  },
  joinButton: {
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cpStats: {
    marginBottom: 12,
  },
  cpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cpLabel: {
    fontSize: 12,
    color: '#475569',
  },
  cpValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  expandedJoinButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  expandedJoinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BossCard;