import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { getSpriteSource } from '../utils/spriteHelpers';

interface RaidBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  bossName: string;
  cpNoWeather: number;
  cpWeather: number;
  tierLabel: string;
  sprite: string;
  timeLeft?: string;
  slots?: string;
}

const { height: screenHeight } = Dimensions.get('window');

const RaidBottomSheet: React.FC<RaidBottomSheetProps> = ({
  visible,
  onClose,
  bossName,
  cpNoWeather,
  cpWeather,
  tierLabel,
  sprite,
  timeLeft,
  slots,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Scrim */}
      <Animated.View style={[styles.scrim, { opacity }]}>
        <TouchableOpacity style={styles.scrimTouchable} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{bossName}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

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

            {/* CP Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>No Weather:</Text>
                <Text style={styles.statValue}>{cpNoWeather} CP</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Weather Boost:</Text>
                <Text style={styles.statValue}>{cpWeather} CP</Text>
              </View>
            </View>

            {/* Live Raid Info */}
            {(timeLeft || slots) && (
              <View style={styles.liveInfo}>
                {timeLeft && (
                  <Text style={styles.liveInfoText}>Time: {timeLeft}</Text>
                )}
                {slots && (
                  <Text style={styles.liveInfoText}>Slots: {slots}</Text>
                )}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Join Queue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Host</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrimTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  safeArea: {
    maxHeight: screenHeight * 0.6,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1220',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  spriteContainer: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sprite: {
    width: 60,
    height: 60,
  },
  placeholderSprite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8B8F98',
  },
  statsContainer: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1220',
  },
  liveInfo: {
    marginBottom: 16,
    alignItems: 'center',
  },
  liveInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2B6BED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B6BED',
  },
});

export default RaidBottomSheet;
