import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { COLORS, TIMING, UI } from '../../constants';
import { useAppStore } from '../../stores/appStore';
import * as Haptics from 'expo-haptics';

interface RouteParams {
  partyId: string;
  hostFriendCode: string;
  deadlineEpoch: number;
}

const FriendGateScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyId, hostFriendCode, deadlineEpoch } = route.params as RouteParams;

  const { user, setCurrentPartyId, setShowPartyPill } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  useEffect(() => {
    // Calculate initial time left
    const now = Math.floor(Date.now() / 1000);
    const initialTimeLeft = Math.max(0, deadlineEpoch - now);
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft === 0) {
      handleTimeout();
    }
  }, [deadlineEpoch]);

  const handleCopyCode = async () => {
    try {
      await Clipboard.setString(hostFriendCode);
      setHasCopiedCode(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Show feedback
      Alert.alert(
        'Copied',
        'Friend code copied to clipboard',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error copying code:', error);
      Alert.alert('Error', 'Failed to copy friend code');
    }
  };

  const handleAddedHost = async () => {
    try {
      // TODO: Call API to set user as ready
      console.log('Setting user as ready for party:', partyId);

      // Update app state
      setCurrentPartyId(partyId);
      setShowPartyPill(true);

      // Navigate to party screen
      navigation.replace('Party', { partyId });

      // Analytics event
      console.log('Friend gate completed');
    } catch (error) {
      console.error('Error setting ready status:', error);
      Alert.alert('Error', 'Failed to join party. Please try again.');
    }
  };

  const handleTimeout = () => {
    setIsTimerRunning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(
      'Timed Out',
      'You took too long to add the host. Try joining again.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColors = () => {
    if (timeLeft > 60) {
      return [COLORS.SUCCESS, COLORS.SUCCESS];
    } else if (timeLeft > 30) {
      return [COLORS.WARNING, COLORS.WARNING];
    } else {
      return [COLORS.ERROR, COLORS.ERROR];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add the host in Pokémon GO</Text>
        </View>

        {/* Friend Code Display */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Host Friend Code:</Text>
          <TouchableOpacity
            style={[styles.codeDisplay, hasCopiedCode && styles.codeCopied]}
            onPress={handleCopyCode}
            activeOpacity={0.7}
          >
            <Text style={styles.codeText}>{hostFriendCode}</Text>
            <Text style={styles.copyText}>
              {hasCopiedCode ? 'Copied!' : 'Tap to Copy'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap "Added Host" after you send a friend request in Pokémon GO
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <CountdownCircleTimer
            isPlaying={isTimerRunning && timeLeft > 0}
            duration={TIMING.FRIEND_GATE_TIMEOUT / 1000}
            initialRemainingTime={timeLeft}
            colors={getTimerColors()}
            colorsTime={[120, 0]}
            size={120}
            strokeWidth={8}
            trailColor={COLORS.TEXT_LIGHT}
            onComplete={handleTimeout}
          >
            {({ remainingTime }) => (
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>
                  {formatTime(remainingTime)}
                </Text>
                <Text style={styles.timerLabel}>seconds left</Text>
              </View>
            )}
          </CountdownCircleTimer>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAddedHost}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Added Host</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  codeLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  codeDisplay: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.TEXT_LIGHT,
    width: '100%',
    maxWidth: 280,
  },
  codeCopied: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: '#E8F5E8',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 2,
    marginBottom: 8,
  },
  copyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  instructions: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  timerLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default FriendGateScreen;
