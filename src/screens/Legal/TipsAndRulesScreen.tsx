import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';

const TipsAndRulesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tips & Rules</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Your guide to getting the most out of LobbyGO</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Getting Started</Text>
          
          <Text style={styles.tipTitle}>Setting Up Your Profile</Text>
          <Text style={styles.tipDescription}>
            Complete your trainer profile with accurate information. Your trainer name should match your Pokémon GO account, and your friend code should be current. This builds trust with other trainers and ensures smooth coordination.
          </Text>
          
          <Text style={styles.tipTitle}>Choosing Your Team</Text>
          <Text style={styles.tipDescription}>
            Select your correct team (Mystic, Valor, or Instinct). This is permanent after creation and helps other trainers identify you during raids and trades.
          </Text>
          
          <Text style={styles.tipTitle}>Browse Without Account</Text>
          <Text style={styles.tipDescription}>
            You can explore LobbyGO without signing in! Browse raids and trades to get familiar with the app. You'll need to sign in only when you want to join raids, create trades, or participate in activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Raid Coordination Tips</Text>
          
          <Text style={styles.tipTitle}>Queue vs Live Raids</Text>
          <Text style={styles.tipDescription}>
            <Text style={styles.boldText}>Queue System:</Text> Join the queue for popular raid bosses. You'll be matched with other trainers when enough people are interested. No ETA provided - be patient!
          </Text>
          <Text style={styles.tipDescription}>
            <Text style={styles.boldText}>Live Raids:</Text> Join raids that are starting soon. Perfect for last-minute coordination or when you see an active raid nearby.
          </Text>
          
          <Text style={styles.tipTitle}>Hosting Raids</Text>
          <Text style={styles.tipDescription}>
            When hosting, be clear about your location and timing. Use the "Additional Trainers" field to indicate friends or family members who will join but aren't using the app. This helps others know the real party size.
          </Text>
          
          <Text style={styles.tipTitle}>Friend Code Gate</Text>
          <Text style={styles.tipDescription}>
            When joining a raid, you'll see the host's friend code. <Text style={styles.boldText}>You have 120 seconds</Text> to send a friend request in Pokémon GO and tap "Added Host" in LobbyGO. This ensures all participants are properly connected before the raid starts.
          </Text>
          
          <Text style={styles.tipTitle}>Party Etiquette</Text>
          <Text style={styles.tipDescription}>
            • Communicate clearly about your readiness status
            • Let the host know if you're running late
            • Be patient with new players learning the system
            • Use the chat to coordinate timing and strategy
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Trading Tips</Text>
          
          <Text style={styles.tipTitle}>Creating Good Trade Listings</Text>
          <Text style={styles.tipDescription}>
            Be specific in your offers and requests. Instead of "good Pokémon," list specific species, forms, or IV ranges. Mention if you're flexible on certain aspects of the trade.
          </Text>
          
          <Text style={styles.tipTitle}>Understanding Trade Costs</Text>
          <Text style={styles.tipDescription}>
            Remember that Pokémon GO trades cost stardust, and the amount depends on friendship level and whether you already have the Pokémon in your Pokédex. Plan accordingly and communicate these requirements in your listings.
          </Text>
          
          <Text style={styles.tipTitle}>Friendship Levels</Text>
          <Text style={styles.tipDescription}>
            • <Text style={styles.boldText}>Good Friend:</Text> 1 day - Reduces trade costs
            • <Text style={styles.boldText}>Great Friend:</Text> 7 days - Further cost reduction
            • <Text style={styles.boldText}>Ultra Friend:</Text> 30 days - Significant savings
            • <Text style={styles.boldText}>Best Friend:</Text> 90 days - Lowest costs
          </Text>
          
          <Text style={styles.tipTitle}>Can Fly Feature</Text>
          <Text style={styles.tipDescription}>
            The "Can Fly" option indicates trainers who can travel to your location (within Pokémon GO's trading distance of 100 meters). This is self-declared and refers to real-world travel capability, not any in-game cheating.
          </Text>
          
          <Text style={styles.tipTitle}>Safety for Trades</Text>
          <Text style={styles.tipDescription}>
            Always meet in public places for trades. Popular raid locations, parks, or shopping centers are ideal. Never share personal information beyond your trainer name and friend code.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Communication Best Practices</Text>
          
          <Text style={styles.tipTitle}>In-App Chat</Text>
          <Text style={styles.tipDescription}>
            Use party and trade chats for coordination. Keep conversations friendly and on-topic. Report any inappropriate behavior using the report function.
          </Text>
          
          <Text style={styles.tipTitle}>Response Times</Text>
          <Text style={styles.tipDescription}>
            Try to respond promptly to messages, especially for time-sensitive raids. If you need to leave a raid or cancel a trade, communicate this as soon as possible.
          </Text>
          
          <Text style={styles.tipTitle}>Language and Tone</Text>
          <Text style={styles.tipDescription}>
            Keep communication respectful and helpful. Remember that players come from diverse backgrounds and skill levels. Be patient with newcomers and offer guidance when appropriate.
          </Text>
        </View>

        <View style={styles.rulesSection}>
          <Text style={styles.rulesTitle}>📋 Community Rules</Text>
          
          <Text style={styles.ruleCategory}>Prohibited Behavior</Text>
          <Text style={styles.ruleItem}>• Harassment, bullying, or discriminatory language</Text>
          <Text style={styles.ruleItem}>• Sharing false trainer information or fake trade offers</Text>
          <Text style={styles.ruleItem}>• Spamming or excessive self-promotion</Text>
          <Text style={styles.ruleItem}>• Discussing or promoting cheating, spoofing, or ToS violations</Text>
          <Text style={styles.ruleItem}>• Sharing personal information (addresses, phone numbers, etc.)</Text>
          <Text style={styles.ruleItem}>• Using inappropriate usernames or profile content</Text>
          
          <Text style={styles.ruleCategory}>Account Requirements</Text>
          <Text style={styles.ruleItem}>• One account per person - no multiple accounts</Text>
          <Text style={styles.ruleItem}>• Accurate trainer information matching your Pokémon GO account</Text>
          <Text style={styles.ruleItem}>• Current and valid friend code</Text>
          <Text style={styles.ruleItem}>• Must be 13+ years old (parental permission required for minors)</Text>
          
          <Text style={styles.ruleCategory}>Trading Guidelines</Text>
          <Text style={styles.ruleItem}>• Honor your trade commitments and agreements</Text>
          <Text style={styles.ruleItem}>• Be honest about Pokémon IVs, levels, and movesets</Text>
          <Text style={styles.ruleItem}>• Communicate friendship level requirements clearly</Text>
          <Text style={styles.ruleItem}>• No real-money transactions - stardust trades only</Text>
          
          <Text style={styles.ruleCategory}>Raid Participation</Text>
          <Text style={styles.ruleItem}>• Show up to raids you've committed to joining</Text>
          <Text style={styles.ruleItem}>• Add hosts as friends promptly (within 120 seconds)</Text>
          <Text style={styles.ruleItem}>• Be ready to start when the group is assembled</Text>
          <Text style={styles.ruleItem}>• Communicate any delays or issues immediately</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Safety & Security</Text>
          
          <Text style={styles.tipTitle}>Personal Safety</Text>
          <Text style={styles.tipDescription}>
            Always prioritize your safety when meeting other trainers. Meet in well-lit public places, bring friends if possible, and trust your instincts. If something feels wrong, don't hesitate to leave.
          </Text>
          
          <Text style={styles.tipTitle}>Account Security</Text>
          <Text style={styles.tipDescription}>
            Never share your Pokémon GO login credentials with anyone. LobbyGO only needs your trainer information (name, friend code, etc.) - we never ask for your game password.
          </Text>
          
          <Text style={styles.tipTitle}>Privacy Protection</Text>
          <Text style={styles.tipDescription}>
            Only share your friend code through LobbyGO's secure system. Don't post friend codes in public chats or social media where they can be seen by anyone.
          </Text>
          
          <Text style={styles.tipTitle}>Reporting Issues</Text>
          <Text style={styles.tipDescription}>
            Report inappropriate behavior, technical issues, or safety concerns immediately. Use the in-app report feature or contact support@lobbygo.app for serious issues.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Troubleshooting</Text>
          
          <Text style={styles.tipTitle}>Can't Join Raids</Text>
          <Text style={styles.tipDescription}>
            Make sure you're signed in and your profile is complete. Check that the raid hasn't filled up or ended. If problems persist, try refreshing the app or restarting.
          </Text>
          
          <Text style={styles.tipTitle}>Friend Code Issues</Text>
          <Text style={styles.tipDescription}>
            Ensure your friend code is current and formatted correctly (XXXX XXXX XXXX). Update it in your profile if you've recently changed it in Pokémon GO.
          </Text>
          
          <Text style={styles.tipTitle}>Chat Not Working</Text>
          <Text style={styles.tipDescription}>
            Check your internet connection and try refreshing the chat. Messages may take a few seconds to appear during high usage periods.
          </Text>
          
          <Text style={styles.tipTitle}>App Performance</Text>
          <Text style={styles.tipDescription}>
            For best performance, keep the app updated and close other memory-intensive apps. Clear the app cache if you experience frequent crashes or slowdowns.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Pro Tips</Text>
          
          <Text style={styles.tipTitle}>Building Your Reputation</Text>
          <Text style={styles.tipDescription}>
            Be reliable, friendly, and helpful. Trainers will remember positive interactions and be more likely to invite you to future raids or accept your trade offers.
          </Text>
          
          <Text style={styles.tipTitle}>Efficient Trading</Text>
          <Text style={styles.tipDescription}>
            Plan multiple trades with the same trainer when possible to maximize friendship building and minimize travel. Consider trading lower-value Pokémon first to build friendship for expensive special trades.
          </Text>
          
          <Text style={styles.tipTitle}>Raid Strategy</Text>
          <Text style={styles.tipDescription}>
            Coordinate team selection and move sets in the party chat before starting. Agree on re-lobby strategies for difficult raids, and have backup plans for failed attempts.
          </Text>
          
          <Text style={styles.tipTitle}>Community Building</Text>
          <Text style={styles.tipDescription}>
            Welcome new trainers, share local knowledge about good raid spots, and help others learn the game mechanics. A strong community benefits everyone!
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Need More Help?</Text>
          <Text style={styles.footerText}>
            Check out our other resources or contact support if you have questions not covered here.
          </Text>
          <Text style={styles.contactText}>Support: support@lobbygo.app</Text>
          <Text style={styles.contactText}>Community Discord: discord.gg/lobbygo</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EC',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2B6BED',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1220',
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6BED',
    marginTop: 12,
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
    color: '#0B1220',
  },
  rulesSection: {
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 28,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 16,
  },
  ruleCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 12,
    marginBottom: 8,
  },
  ruleItem: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  footer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1220',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#2B6BED',
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TipsAndRulesScreen;
