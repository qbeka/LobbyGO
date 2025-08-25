import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { useAppStore } from '../../stores/appStore';

interface TradeMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  timestamp: string;
}

interface TradeData {
  id: string;
  my_offer: string[];
  their_offer: string[];
  other_trainer: {
    name: string;
    friend_code: string;
    can_fly: boolean;
  };
  my_trainer: {
    name: string;
    friend_code: string;
    can_fly: boolean;
  };
  friendship_target: string;
  status: 'coordinating' | 'friendship_building' | 'ready' | 'completed';
}

const TradeChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAppStore();
  
  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const [friendshipDays, setFriendshipDays] = useState(0);

  // Sample trade data
  const [tradeData] = useState<TradeData>({
    id: '1',
    my_offer: ['✨ Charizard'],
    their_offer: ['Mewtwo'],
    other_trainer: {
      name: 'MysticTrainer',
      friend_code: '1234 5678 9012',
      can_fly: true,
    },
    my_trainer: {
      name: user?.trainer_name || 'TrainerName',
      friend_code: user?.friend_code || '0000 0000 0000',
      can_fly: false,
    },
    friendship_target: 'Great',
    status: 'coordinating',
  });

  useEffect(() => {
    // Load sample messages
    const sampleMessages: TradeMessage[] = [
      {
        id: '1',
        sender_id: 'other',
        sender_name: 'MysticTrainer',
        message: 'Hi! Ready to make this trade?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        sender_id: 'me',
        sender_name: user?.trainer_name || 'Me',
        message: 'Yes! Since you can fly, could you come to my location?',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: '3',
        sender_id: 'other',
        sender_name: 'MysticTrainer',
        message: 'Sure! Just send me the coordinates and time.',
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
    ];
    setMessages(sampleMessages);

    // Calculate friendship building days
    if (tradeData.friendship_target === 'Good') setFriendshipDays(1);
    else if (tradeData.friendship_target === 'Great') setFriendshipDays(7);
    else if (tradeData.friendship_target === 'Ultra') setFriendshipDays(30);
    else if (tradeData.friendship_target === 'Best') setFriendshipDays(90);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: TradeMessage = {
      id: Date.now().toString(),
      sender_id: 'me',
      sender_name: user?.trainer_name || 'Me',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const sendCoordinates = () => {
    if (!coordinates.trim()) {
      Alert.alert('Error', 'Please enter coordinates.');
      return;
    }

    const coordMessage: TradeMessage = {
      id: Date.now().toString(),
      sender_id: 'me',
      sender_name: user?.trainer_name || 'Me',
      message: `📍 Coordinates: ${coordinates}`,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, coordMessage]);
    setCoordinates('');
  };

  const suggestTime = () => {
    if (!suggestedTime.trim()) {
      Alert.alert('Error', 'Please enter a suggested time.');
      return;
    }

    const timeMessage: TradeMessage = {
      id: Date.now().toString(),
      sender_id: 'me',
      sender_name: user?.trainer_name || 'Me',
      message: `🕐 Suggested time: ${suggestedTime}`,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, timeMessage]);
    setSuggestedTime('');
  };

  const buildFriendship = () => {
    Alert.alert(
      'Build Friendship',
      `You need to be ${tradeData.friendship_target} friends before trading. This takes ${friendshipDays} days of daily interactions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Building',
          onPress: () => {
            Alert.alert('Friendship Building', `Started building friendship! Come back in ${friendshipDays} days.`);
          },
        },
      ]
    );
  };

  const markTradeCompleted = () => {
    Alert.alert(
      'Mark Trade Completed',
      'Have you successfully completed the trade in Pokémon GO?',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, Completed!',
          onPress: () => {
            Alert.alert('Trade Completed!', 'Thank you for using LobbyGO!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: TradeMessage }) => {
    const isMe = item.sender_id === 'me';
    
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.senderName}>{item.sender_name}</Text>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trade with {tradeData.other_trainer.name}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Trade Summary */}
          <View style={styles.tradeSummary}>
            <Text style={styles.summaryTitle}>Trade Summary</Text>
            <View style={styles.tradeExchange}>
              <View style={styles.exchangeSection}>
                <Text style={styles.exchangeLabel}>You Give:</Text>
                <Text style={styles.exchangeValue}>{tradeData.my_offer.join(', ')}</Text>
              </View>
              <Text style={styles.exchangeArrow}>⇄</Text>
              <View style={styles.exchangeSection}>
                <Text style={styles.exchangeLabel}>You Get:</Text>
                <Text style={styles.exchangeValue}>{tradeData.their_offer.join(', ')}</Text>
              </View>
            </View>
          </View>

          {/* Friend Codes */}
          <View style={styles.friendCodesSection}>
            <Text style={styles.sectionTitle}>Trainer Friend Codes</Text>
            <View style={styles.friendCodeCard}>
              <Text style={styles.friendCodeLabel}>Your Friend Code:</Text>
              <Text style={styles.friendCodeValue}>{tradeData.my_trainer.friend_code}</Text>
            </View>
            <View style={styles.friendCodeCard}>
              <Text style={styles.friendCodeLabel}>{tradeData.other_trainer.name}'s Friend Code:</Text>
              <Text style={styles.friendCodeValue}>{tradeData.other_trainer.friend_code}</Text>
            </View>
          </View>

          {/* Coordination Tools */}
          <View style={styles.coordinationSection}>
            <Text style={styles.sectionTitle}>Coordination</Text>
            
            {/* Coordinates */}
            <View style={styles.coordRow}>
              <TextInput
                style={styles.coordInput}
                value={coordinates}
                onChangeText={setCoordinates}
                placeholder="Enter coordinates (lat, lng)"
                placeholderTextColor={COLORS.TEXT_LIGHT}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendCoordinates}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>

            {/* Time Suggestion */}
            <View style={styles.coordRow}>
              <TextInput
                style={styles.coordInput}
                value={suggestedTime}
                onChangeText={setSuggestedTime}
                placeholder="Suggest meeting time"
                placeholderTextColor={COLORS.TEXT_LIGHT}
              />
              <TouchableOpacity style={styles.sendButton} onPress={suggestTime}>
                <Text style={styles.sendButtonText}>Suggest</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Friendship Building */}
          {tradeData.friendship_target !== 'None' && (
            <View style={styles.friendshipSection}>
              <Text style={styles.sectionTitle}>Friendship Requirement</Text>
              <Text style={styles.friendshipText}>
                This trade requires {tradeData.friendship_target} friendship level ({friendshipDays} days)
              </Text>
              <TouchableOpacity style={styles.friendshipButton} onPress={buildFriendship}>
                <Text style={styles.friendshipButtonText}>Build Friendship to {tradeData.friendship_target}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Messages */}
          <View style={styles.messagesSection}>
            <Text style={styles.sectionTitle}>Chat</Text>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.TEXT_LIGHT}
            multiline
          />
          <TouchableOpacity style={styles.sendMessageButton} onPress={sendMessage}>
            <Text style={styles.sendMessageButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Trade Completed Button */}
        <View style={styles.completedSection}>
          <TouchableOpacity style={styles.completedButton} onPress={markTradeCompleted}>
            <Text style={styles.completedButtonText}>✓ Mark Trade Completed</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_LIGHT,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tradeSummary: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  tradeExchange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeSection: {
    flex: 1,
  },
  exchangeLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  exchangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  exchangeArrow: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    marginHorizontal: 16,
  },
  friendCodesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  friendCodeCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  friendCodeLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  friendCodeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  coordinationSection: {
    marginBottom: 16,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordInput: {
    flex: 1,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  friendshipSection: {
    backgroundColor: COLORS.WARNING,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  friendshipText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  friendshipButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  friendshipButtonText: {
    color: COLORS.WARNING,
    fontSize: 14,
    fontWeight: '600',
  },
  messagesSection: {
    marginBottom: 16,
  },
  messagesList: {
    maxHeight: 300,
  },
  messageContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.PRIMARY,
    maxWidth: '80%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: COLORS.TEXT_PRIMARY,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.TEXT_LIGHT,
    marginTop: 4,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.TEXT_LIGHT,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.TEXT_LIGHT,
    maxHeight: 100,
    marginRight: 8,
  },
  sendMessageButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendMessageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  completedButton: {
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TradeChatScreen;
