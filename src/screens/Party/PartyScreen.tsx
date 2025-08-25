import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../stores/appStore';

interface RouteParams {
  partyId: string;
}

interface PartyMember {
  id: string;
  trainer_name: string;
  level: number;
  role: 'host' | 'guest';
  state: 'joined' | 'ready' | 'kicked' | 'left';
  joined_at: string;
}

interface Message {
  id: string;
  user_id: string;
  trainer_name: string;
  text: string;
  sent_at: string;
}

const PartyScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyId } = route.params as RouteParams;
  const { user } = useAppStore();

  // Party state
  const [party, setParty] = useState<any>(null);
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample data for demo
  useEffect(() => {
    // Mock party data
    const mockParty = {
      id: partyId,
      boss_id: 'zacian_crowned_sword',
      boss_name: 'Zacian (Crowned Sword)',
      mode: 'live',
      max_size: 10,
      additional_trainers: 2,
      status: 'active',
    };

    const mockMembers: PartyMember[] = [
      {
        id: '1',
        trainer_name: 'HostTrainer',
        level: 48,
        role: 'host',
        state: 'ready',
        joined_at: new Date().toISOString(),
      },
      {
        id: '2',
        trainer_name: 'MysticMaster',
        level: 45,
        role: 'guest',
        state: 'ready',
        joined_at: new Date().toISOString(),
      },
      {
        id: '3',
        trainer_name: 'ValorKnight',
        level: 42,
        role: 'guest',
        state: 'joined',
        joined_at: new Date().toISOString(),
      },
      {
        id: '4',
        trainer_name: 'InstinctAce',
        level: 46,
        role: 'guest',
        state: 'ready',
        joined_at: new Date().toISOString(),
      },
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        user_id: '1',
        trainer_name: 'HostTrainer',
        text: 'Welcome everyone! Let\'s get this raid started!',
        sent_at: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: '2',
        user_id: '2',
        trainer_name: 'MysticMaster',
        text: 'Ready to go! 💪',
        sent_at: new Date(Date.now() - 30000).toISOString(),
      },
    ];

    setParty(mockParty);
    setMembers(mockMembers);
    setMessages(mockMessages);
    setLoading(false);
  }, [partyId]);

  const getStatusColor = (state: string, role: string) => {
    if (role === 'host') return '#7C3AED'; // Purple for host
    switch (state) {
      case 'ready': return '#059669'; // Green
      case 'joined': return '#0EA5E9'; // Blue
      default: return '#6B7280'; // Gray
    }
  };

  const getStatusText = (state: string, role: string) => {
    if (role === 'host') return 'Host';
    switch (state) {
      case 'ready': return 'Ready';
      case 'joined': return 'Joined';
      case 'kicked': return 'Kicked';
      case 'left': return 'Left';
      default: return 'Unknown';
    }
  };

  const getPartyStatus = () => {
    const readyCount = members.filter(m => m.state === 'ready').length;
    const totalCount = members.length;
    
    if (readyCount === totalCount) {
      return 'All trainers ready! Waiting for host to start.';
    } else {
      return 'Waiting for everyone to add host and get ready.';
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user_id: user?.id || 'current_user',
      trainer_name: user?.trainer_name || 'You',
      text: messageText.trim(),
      sent_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const handleLeaveParty = () => {
    Alert.alert(
      'Leave Party',
      'Are you sure you want to leave this party?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            // TODO: Call API to leave party
          },
        },
      ]
    );
  };

  const renderMember = ({ item, index }: { item: PartyMember; index: number }) => {
    const needsDivider = (index + 1) % 5 === 0 && index < members.length - 1;
    
    return (
      <>
        <View style={styles.memberRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
          <Text style={styles.trainerName} numberOfLines={1}>
            {item.trainer_name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.state, item.role) }]}>
            <Text style={styles.statusText}>
              {getStatusText(item.state, item.role)}
            </Text>
          </View>
        </View>
        {needsDivider && <View style={styles.memberDivider} />}
      </>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageRow}>
      <Text style={styles.messageAuthor}>{item.trainer_name}:</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.sent_at).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading party...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.bossIcon}>
              <Text style={styles.bossIconText}>🔷</Text>
            </View>
            <Text style={styles.bossName}>{party?.boss_name}</Text>
          </View>
          <TouchableOpacity onPress={handleLeaveParty}>
            <Text style={styles.menuButton}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Roster */}
        <View style={styles.rosterSection}>
          <Text style={styles.sectionTitle}>Party Members ({members.length}/{party?.max_size})</Text>
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            style={styles.membersList}
            showsVerticalScrollIndicator={false}
          />
          
          {party?.additional_trainers > 0 && (
            <View style={styles.additionalTrainers}>
              <Text style={styles.additionalTrainersText}>
                Additional Trainers: {party.additional_trainers}
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <Text style={styles.statusText}>{getPartyStatus()}</Text>
        </View>

        {/* Chat */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Chat</Text>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.chatInput}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#475569',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bossIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bossIconText: {
    fontSize: 20,
  },
  bossName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  menuButton: {
    fontSize: 20,
    color: '#475569',
    padding: 4,
  },
  rosterSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  membersList: {
    maxHeight: 200,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  levelBadge: {
    width: 32,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  trainerName: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  memberDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  additionalTrainers: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  additionalTrainersText: {
    fontSize: 14,
    color: '#475569',
  },
  statusSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  chatSection: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messagesList: {
    flex: 1,
    marginBottom: 12,
  },
  messageRow: {
    paddingVertical: 6,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  messageText: {
    fontSize: 14,
    color: '#0F172A',
    marginTop: 2,
    lineHeight: 18,
  },
  messageTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 16,
    gap: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#0F172A',
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PartyScreen;