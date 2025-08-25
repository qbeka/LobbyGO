import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '../../stores/appStore';
import { auth } from '../../services/supabase';
import { COLORS, TEAMS } from '../../constants';
import { RootStackParamList } from '../../types';
import FilterChips from '../Home/components/FilterChips';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, setAuthenticated, reset, isBrowsingWithoutAccount } = useAppStore();
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTrainerName, setEditTrainerName] = useState(user?.trainer_name || '');
  const [editFriendCode, setEditFriendCode] = useState(user?.friend_code || '');
  const [editLevel, setEditLevel] = useState(user?.level?.toString() || '1');
  const [editTeam, setEditTeam] = useState<'Mystic' | 'Valor' | 'Instinct'>(user?.team || 'Mystic');
  
  // Notification settings
  const [queueMatchNotifications, setQueueMatchNotifications] = useState(true);
  const [partyMentionNotifications, setPartyMentionNotifications] = useState(true);

  const handleSaveProfile = async () => {
    const level = parseInt(editLevel);
    
    if (!editTrainerName.trim()) {
      Alert.alert('Error', 'Trainer name is required.');
      return;
    }
    
    if (!editFriendCode.trim()) {
      Alert.alert('Error', 'Friend code is required.');
      return;
    }
    
    if (isNaN(level) || level < 1 || level > 50) {
      Alert.alert('Error', 'Level must be between 1 and 50.');
      return;
    }

    try {
      // TODO: Implement profile update API call
      console.log('Updating profile:', {
        trainer_name: editTrainerName.trim(),
        friend_code: editFriendCode.trim(),
        level,
        team: editTeam,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditTrainerName(user?.trainer_name || '');
    setEditFriendCode(user?.friend_code || '');
    setEditLevel(user?.level?.toString() || '1');
    setEditTeam(user?.team || 'Mystic');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              reset();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? This will delete your account permanently.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // TODO: Implement account deletion API call
                      console.log('Deleting account...');
                      Alert.alert('Account Deleted', 'Your account has been deleted.');
                      reset();
                    } catch (error) {
                      console.error('Error deleting account:', error);
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {user && !isBrowsingWithoutAccount && (
            <TouchableOpacity 
              onPress={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {user && !isBrowsingWithoutAccount ? (
          <View style={styles.profileSection}>
            <View style={styles.userInfo}>
              {isEditing ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Trainer Name:</Text>
                    <TextInput
                      style={styles.input}
                      value={editTrainerName}
                      onChangeText={setEditTrainerName}
                      placeholder="Enter trainer name"
                      placeholderTextColor={COLORS.TEXT_LIGHT}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Friend Code:</Text>
                    <TextInput
                      style={styles.input}
                      value={editFriendCode}
                      onChangeText={setEditFriendCode}
                      placeholder="0000 0000 0000"
                      placeholderTextColor={COLORS.TEXT_LIGHT}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Level (1-50):</Text>
                    <TextInput
                      style={styles.input}
                      value={editLevel}
                      onChangeText={setEditLevel}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor={COLORS.TEXT_LIGHT}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Team (locked after creation):</Text>
                    <FilterChips
                      filters={TEAMS.map(team => ({ label: team, value: team }))}
                      selectedValue={editTeam}
                      onSelect={(value) => setEditTeam(value as any)}
                    />
                  </View>

                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveProfile}
                    >
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Trainer Name:</Text>
                  <Text style={styles.value}>{user.trainer_name}</Text>

                  <Text style={styles.label}>Friend Code:</Text>
                  <Text style={styles.value}>{user.friend_code}</Text>

                  <Text style={styles.label}>Team:</Text>
                  <Text style={styles.value}>{user.team}</Text>

                  <Text style={styles.label}>Level:</Text>
                  <Text style={styles.value}>{user.level}</Text>
                </>
              )}
            </View>
          </View>
        ) : isBrowsingWithoutAccount ? (
          <View style={styles.signInPrompt}>
            <Text style={styles.signInPromptTitle}>Sign In to Access Profile</Text>
            <Text style={styles.signInPromptText}>
              Create an account to save your trainer information, manage notifications, and access all features.
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => reset()} // This will show auth screen
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Please sign in to view your profile</Text>
          </View>
        )}

        {/* Notification Settings */}
        {user && !isBrowsingWithoutAccount && (
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Queue Match Notifications</Text>
              <Switch
                value={queueMatchNotifications}
                onValueChange={setQueueMatchNotifications}
                trackColor={{ false: COLORS.TEXT_LIGHT, true: COLORS.PRIMARY }}
                thumbColor={queueMatchNotifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Party Mention Notifications</Text>
              <Switch
                value={partyMentionNotifications}
                onValueChange={setPartyMentionNotifications}
                trackColor={{ false: COLORS.TEXT_LIGHT, true: COLORS.PRIMARY }}
                thumbColor={partyMentionNotifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        )}

        {/* Legal & Support */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <Text style={styles.settingText}>Terms of Service</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.settingText}>About LobbyGO</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('TipsAndRules')}
          >
            <Text style={styles.settingText}>Tips & Rules</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Contact Support', 'Email: support@lobbygo.app\nDiscord: discord.gg/lobbygo')}
          >
            <Text style={styles.settingText}>Contact Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        {user && !isBrowsingWithoutAccount && (
          <View style={styles.dangerSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleSignOut}
            >
              <Text style={styles.dangerButtonText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileSection: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    // User info styles
  },
  label: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
    marginTop: 8,
  },
  editActions: {
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInPrompt: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInPromptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  signInPromptText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_LIGHT,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  settingArrow: {
    fontSize: 20,
    color: COLORS.TEXT_LIGHT,
    marginLeft: 8,
  },
  dangerSection: {
    marginBottom: 32,
  },
  dangerButton: {
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;
