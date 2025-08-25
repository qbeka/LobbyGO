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

const AboutScreen = () => {
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
        <Text style={styles.headerTitle}>About LobbyGO</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.appTitle}>LobbyGO</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Your Pokémon GO Raid & Trade Coordinator</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is LobbyGO?</Text>
          <Text style={styles.sectionText}>
            LobbyGO is a community-driven coordination platform designed to help Pokémon GO trainers connect, organize raid battles, and facilitate Pokémon trading. Our mission is to make it easier for trainers to find groups, coordinate activities, and build lasting friendships within the Pokémon GO community.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <Text style={styles.featureTitle}>🔥 Raid Coordination</Text>
          <Text style={styles.featureDescription}>
            Join existing raid groups or host your own. Our smart queue system matches you with other trainers looking for the same raid bosses, while live raids let you jump into action immediately.
          </Text>
          
          <Text style={styles.featureTitle}>🔄 Pokémon Trading</Text>
          <Text style={styles.featureDescription}>
            Create detailed trade listings specifying what you're offering and what you're looking for. Filter by friendship requirements, registration status, and find trainers who can "fly" to your location.
          </Text>
          
          <Text style={styles.featureTitle}>👥 Party Management</Text>
          <Text style={styles.featureDescription}>
            Real-time party coordination with built-in chat, member status tracking, and automatic friend code sharing to ensure smooth raid experiences.
          </Text>
          
          <Text style={styles.featureTitle}>📱 Modern Interface</Text>
          <Text style={styles.featureDescription}>
            Clean, intuitive design optimized for mobile use with fast navigation, smart filters, and seamless user experience across iOS and Android.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.stepTitle}>1. Create Your Profile</Text>
          <Text style={styles.stepDescription}>
            Sign in with Apple or Google and set up your trainer profile with your Pokémon GO trainer name, friend code, team, and level.
          </Text>
          
          <Text style={styles.stepTitle}>2. Find or Host Raids</Text>
          <Text style={styles.stepDescription}>
            Browse available raid bosses, join the queue for popular raids, or create your own party. Our system handles matching and coordination.
          </Text>
          
          <Text style={styles.stepTitle}>3. Trade Pokémon</Text>
          <Text style={styles.stepDescription}>
            Create trade listings or browse what others are offering. Use our advanced filters to find exactly what you need based on your preferences.
          </Text>
          
          <Text style={styles.stepTitle}>4. Connect & Coordinate</Text>
          <Text style={styles.stepDescription}>
            Use in-app chat to coordinate raid times, discuss trade details, and exchange friend codes safely within the platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Community</Text>
          <Text style={styles.sectionText}>
            LobbyGO prioritizes user safety and positive community experiences:
          </Text>
          <Text style={styles.bulletPoint}>• No location sharing - we don't track or share your GPS coordinates</Text>
          <Text style={styles.bulletPoint}>• Secure friend code exchange through verified profiles only</Text>
          <Text style={styles.bulletPoint}>• Community moderation to maintain respectful interactions</Text>
          <Text style={styles.bulletPoint}>• Report system for inappropriate behavior or content</Text>
          <Text style={styles.bulletPoint}>• Privacy-focused design with minimal data collection</Text>
        </View>

        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimers</Text>
          
          <Text style={styles.disclaimerSubtitle}>No Official Affiliation</Text>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>LobbyGO is completely independent and NOT affiliated with:</Text>
          </Text>
          <Text style={styles.bulletPoint}>• Niantic, Inc. (developers of Pokémon GO)</Text>
          <Text style={styles.bulletPoint}>• The Pokémon Company International</Text>
          <Text style={styles.bulletPoint}>• Nintendo Co., Ltd.</Text>
          <Text style={styles.bulletPoint}>• Game Freak Inc.</Text>
          <Text style={styles.bulletPoint}>• Creatures Inc.</Text>
          <Text style={styles.bulletPoint}>• Any other official Pokémon entities</Text>
          
          <Text style={styles.disclaimerSubtitle}>Trademark Information</Text>
          <Text style={styles.disclaimerText}>
            Pokémon GO is a trademark of Niantic, Inc. Pokémon and all related characters, names, marks, and logos are trademarks of The Pokémon Company, Nintendo, Game Freak, and Creatures Inc. All other trademarks are the property of their respective owners.
          </Text>
          
          <Text style={styles.disclaimerSubtitle}>Fair Use Statement</Text>
          <Text style={styles.disclaimerText}>
            LobbyGO uses Pokémon names, images, and related content under principles of fair use for the sole purpose of facilitating player coordination and community building. We do not claim ownership of any Pokémon-related intellectual property.
          </Text>
          
          <Text style={styles.disclaimerSubtitle}>Game Integrity</Text>
          <Text style={styles.disclaimerText}>
            LobbyGO does not modify, hack, interfere with, or violate Pokémon GO's Terms of Service. We are a coordination tool only and encourage all users to play Pokémon GO fairly and within Niantic's guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Source & Development</Text>
          <Text style={styles.sectionText}>
            LobbyGO is built with modern, open-source technologies:
          </Text>
          <Text style={styles.bulletPoint}>• React Native & Expo for cross-platform mobile development</Text>
          <Text style={styles.bulletPoint}>• Supabase for secure backend services and real-time features</Text>
          <Text style={styles.bulletPoint}>• TypeScript for reliable, type-safe code</Text>
          <Text style={styles.bulletPoint}>• Industry-standard security and privacy practices</Text>
          
          <Text style={styles.sectionText}>
            Our app is continuously updated to provide the best experience for the Pokémon GO community while maintaining the highest standards of security and privacy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Guidelines</Text>
          <Text style={styles.sectionText}>
            To maintain a positive environment for all trainers, we ask that you:
          </Text>
          <Text style={styles.bulletPoint}>• Be respectful and courteous to fellow trainers</Text>
          <Text style={styles.bulletPoint}>• Provide accurate trainer information and trade details</Text>
          <Text style={styles.bulletPoint}>• Honor your commitments to raids and trades</Text>
          <Text style={styles.bulletPoint}>• Report any inappropriate behavior or technical issues</Text>
          <Text style={styles.bulletPoint}>• Follow Pokémon GO's Terms of Service and community guidelines</Text>
          <Text style={styles.bulletPoint}>• Help newcomers learn and feel welcome in the community</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Future Development</Text>
          <Text style={styles.sectionText}>
            We're constantly working to improve LobbyGO based on community feedback. Planned features include:
          </Text>
          <Text style={styles.bulletPoint}>• Enhanced raid boss catalog with regular updates</Text>
          <Text style={styles.bulletPoint}>• Improved trading filters and search capabilities</Text>
          <Text style={styles.bulletPoint}>• Community events and special raid coordination</Text>
          <Text style={styles.bulletPoint}>• Additional language support for global trainers</Text>
          <Text style={styles.bulletPoint}>• Performance optimizations and new features</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Feedback</Text>
          <Text style={styles.sectionText}>
            We value your feedback and are here to help with any questions or issues:
          </Text>
          <Text style={styles.contactText}>General Support: support@lobbygo.app</Text>
          <Text style={styles.contactText}>Technical Issues: tech@lobbygo.app</Text>
          <Text style={styles.contactText}>Feature Requests: feedback@lobbygo.app</Text>
          <Text style={styles.contactText}>Legal Questions: legal@lobbygo.app</Text>
          
          <Text style={styles.sectionText}>
            Follow us for updates and community news:
          </Text>
          <Text style={styles.contactText}>Website: lobbygo.app</Text>
          <Text style={styles.contactText}>Community Discord: discord.gg/lobbygo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgments</Text>
          <Text style={styles.sectionText}>
            Special thanks to the Pokémon GO community for inspiration and feedback, and to all the trainers who help make raid coordination and trading a fun, social experience. LobbyGO exists to serve this amazing community of players around the world.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for the Pokémon GO Community</Text>
          <Text style={styles.footerText}>© 2024 LobbyGO - Independent Community Project</Text>
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
  section: {
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2B6BED',
    textAlign: 'center',
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1220',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1220',
    marginTop: 12,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 8,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B6BED',
    marginTop: 12,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 8,
  },
  disclaimerSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
  },
  disclaimerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
    color: '#0B1220',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#2B6BED',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E6E8EC',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AboutScreen;
