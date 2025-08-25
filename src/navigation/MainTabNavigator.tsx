import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { COLORS } from '../constants';

// Import screen components (we'll create these next)
import HomeScreen from '../screens/Home/HomeScreen';
import MyRaidsScreen from '../screens/MyRaids/MyRaidsScreen';
import TradeScreen from '../screens/Trade/TradeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Import icons (we'll use text for now, can be replaced with actual icons later)
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { showPartyPill } = useAppStore();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'MyRaids') {
              iconName = 'list';
            } else if (route.name === 'Trade') {
              iconName = 'swap-horiz';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            } else {
              iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
          }}
        />

        <Tab.Screen
          name="MyRaids"
          component={MyRaidsScreen}
          options={{
            title: 'My Raids',
          }}
        />
        <Tab.Screen
          name="Trade"
          component={TradeScreen}
          options={{
            title: 'Trade',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
      </Tab.Navigator>

      {showPartyPill && <PartyPill />}
    </View>
  );
};

// Party Pill component - floating indicator when user is in a party
const PartyPill = () => {
  const { currentPartyId } = useAppStore();

  if (!currentPartyId) return null;

  return (
    <View style={styles.partyPill}>
      <Icon name="group" size={16} color={COLORS.TEXT_PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopColor: COLORS.TEXT_LIGHT,
    borderTopWidth: 1,
    height: 90,
    paddingBottom: 30,
    paddingTop: 5,
  },
  partyPill: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
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
});

export default MainTabNavigator;
