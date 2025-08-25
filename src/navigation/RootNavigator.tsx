import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { RootStackParamList } from '../types';

// Import screens
import AuthScreen from '../screens/Auth/AuthScreen';
import MainTabNavigator from './MainTabNavigator';
import PartyScreen from '../screens/Party/PartyScreen';
import FriendGateScreen from '../screens/FriendGate/FriendGateScreen';
import TradeDetailScreen from '../screens/Trade/TradeDetailScreen';
import TradeChatScreen from '../screens/Trade/TradeChatScreen';
import HostScreen from '../screens/Host/HostScreen';
import { 
  TermsOfServiceScreen, 
  PrivacyPolicyScreen, 
  AboutScreen, 
  TipsAndRulesScreen 
} from '../screens/Legal';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) {
    // Show loading screen while checking auth state
    return (
      <View style={styles.loadingContainer}>
        {/* Add loading component here */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth stack
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : (
          // Main app stack
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
            />
            <Stack.Screen
              name="Party"
              component={PartyScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="FriendGate"
              component={FriendGateScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="TradeDetail"
              component={TradeDetailScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="Host"
              component={HostScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="TradeChat"
              component={TradeChatScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="TipsAndRules"
              component={TipsAndRulesScreen}
              options={{
                presentation: 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default RootNavigator;
