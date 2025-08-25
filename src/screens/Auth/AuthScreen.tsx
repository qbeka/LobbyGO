import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { authService } from '../../services/auth';
import { useAppStore } from '../../stores/appStore';
import { COLORS } from '../../constants';

const AuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setLoading, setAuthenticated, setBrowsingWithoutAccount } = useAppStore();

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      const { error } = await authService.signInWithApple();

      if (error) {
        console.error('Apple sign in error:', error);
        Alert.alert(
          'Sign In Error',
          `Failed to sign in with Apple: ${error.message}`
        );
      }
    } catch (error) {
      console.error('Apple sign in error:', error);
      Alert.alert(
        'Sign In Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      const { error } = await authService.signInWithGoogle();

      if (error) {
        console.error('Google sign in error:', error);
        Alert.alert(
          'Sign In Error',
          `Failed to sign in with Google: ${error.message}`
        );
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Sign In Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleBrowseWithoutAccount = () => {
    // Set flags that user is browsing without authentication
    // This allows them to see all features but will prompt for auth when trying to use them
    setBrowsingWithoutAccount(true);
    setAuthenticated(true); // This will allow navigation to main app
    // Note: We're not setting a user, so auth checks will still catch this
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>LobbyGO</Text>
          <Text style={styles.subtitle}>
            Host and join Pokémon GO raids, trade Pokémon, and connect with trainers worldwide
          </Text>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInTitle}>Get Started</Text>
          <Text style={styles.signInSubtitle}>
            Sign in to host raids, join parties, and trade Pokémon
          </Text>

          <View style={styles.buttonContainer}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.signInButton, styles.appleButton]}
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.appleButtonText]}>
                  {isLoading ? 'Signing In...' : 'Continue with Apple'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.signInButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, styles.googleButtonText]}>
                {isLoading ? 'Signing In...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBrowseWithoutAccount}
              disabled={isLoading}
              style={styles.browseButtonContainer}
            >
              <Text style={styles.browseButtonText}>
                Browse Without Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can browse raids and trades without an account. Sign in required for actions.
          </Text>
        </View>
      </View>
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  signInTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  signInSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  signInButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appleButtonText: {
    color: '#FFFFFF',
  },
  googleButtonText: {
    color: '#FFFFFF',
  },
  browseButtonContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  browseButtonText: {
    color: COLORS.ERROR,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthScreen;
