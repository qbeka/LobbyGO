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
import { authService, TEST_ACCOUNTS } from '../../services/auth';
import { useAppStore } from '../../stores/appStore';
import { COLORS } from '../../constants';

const AuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
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
          'Failed to sign in with Apple. Please try again.'
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
          'Failed to sign in with Google. Please try again.'
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

  const handleTestAccountSignIn = async (accountKey: keyof typeof TEST_ACCOUNTS) => {
    try {
      setIsLoading(true);
      setLoading(true);

      const account = TEST_ACCOUNTS[accountKey];
      const { error } = await authService.signInWithTestAccount(
        account.email,
        account.password
      );

      if (error) {
        // Try to create the account if it doesn't exist
        const { error: createError } = await authService.createTestAccount(
          account.email,
          account.password,
          account.userData
        );

        if (createError) {
          console.error('Test account creation error:', createError);
          Alert.alert(
            'Test Account Error',
            `Failed to create test account: ${createError.message}`
          );
          return;
        }

        // Try signing in again after creating the account
        const { error: signInError } = await authService.signInWithTestAccount(
          account.email,
          account.password
        );

        if (signInError) {
          console.error('Test account sign in error:', signInError);
          Alert.alert(
            'Test Account Error',
            `Failed to sign in with test account: ${signInError.message}`
          );
        }
      }
    } catch (error) {
      console.error('Test account error:', error);
      Alert.alert(
        'Test Account Error',
        'An unexpected error occurred with the test account.'
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
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

            {/* Development Test Accounts */}
            <TouchableOpacity
              onPress={() => setShowTestAccounts(!showTestAccounts)}
              style={styles.devButtonContainer}
            >
              <Text style={styles.devButtonText}>
                🧪 Development Test Accounts
              </Text>
            </TouchableOpacity>

            {showTestAccounts && (
              <View style={styles.testAccountsContainer}>
                <Text style={styles.testAccountsTitle}>Test Accounts for Multi-User Testing:</Text>
                
                <View style={styles.testAccountsGrid}>
                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('HOST_1')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>🏠 Host 1</Text>
                    <Text style={styles.testAccountSubtext}>RaidHost_1 (Mystic L45)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('HOST_2')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>🏠 Host 2</Text>
                    <Text style={styles.testAccountSubtext}>RaidHost_2 (Valor L42)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('TRADER_1')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>🔄 Trader 1</Text>
                    <Text style={styles.testAccountSubtext}>PokéTrader_1 (Instinct L38)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('TRADER_2')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>🔄 Trader 2</Text>
                    <Text style={styles.testAccountSubtext}>PokéTrader_2 (Mystic L40)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('GUEST_1')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>👤 Guest 1</Text>
                    <Text style={styles.testAccountSubtext}>RaidGuest_1 (Valor L35)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.testAccountButton}
                    onPress={() => handleTestAccountSignIn('GUEST_2')}
                    disabled={isLoading}
                  >
                    <Text style={styles.testAccountButtonText}>👤 Guest 2</Text>
                    <Text style={styles.testAccountSubtext}>RaidGuest_2 (Instinct L37)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  devButtonContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  devButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  testAccountsContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  testAccountsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  testAccountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  testAccountButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  testAccountButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  testAccountSubtext: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default AuthScreen;
