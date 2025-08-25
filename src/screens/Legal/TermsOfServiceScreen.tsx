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

const TermsOfServiceScreen = () => {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ACCEPTANCE OF TERMS</Text>
          <Text style={styles.sectionText}>
            By downloading, installing, accessing, or using the LobbyGO mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. DESCRIPTION OF SERVICE</Text>
          <Text style={styles.sectionText}>
            LobbyGO is a third-party coordination platform that helps players organize and participate in Pokémon GO raid battles and facilitate Pokémon trading. The App provides tools for:
          </Text>
          <Text style={styles.bulletPoint}>• Finding and joining raid groups</Text>
          <Text style={styles.bulletPoint}>• Hosting raid battles</Text>
          <Text style={styles.bulletPoint}>• Creating and browsing trade listings</Text>
          <Text style={styles.bulletPoint}>• Communicating with other players</Text>
          <Text style={styles.bulletPoint}>• Managing friend codes and trainer information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. IMPORTANT DISCLAIMERS</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>NO AFFILIATION WITH NIANTIC OR POKÉMON:</Text> LobbyGO is an independent, third-party application. We are NOT affiliated with, endorsed by, sponsored by, or connected to:
          </Text>
          <Text style={styles.bulletPoint}>• Niantic, Inc.</Text>
          <Text style={styles.bulletPoint}>• The Pokémon Company</Text>
          <Text style={styles.bulletPoint}>• Nintendo Co., Ltd.</Text>
          <Text style={styles.bulletPoint}>• Game Freak Inc.</Text>
          <Text style={styles.bulletPoint}>• Creatures Inc.</Text>
          <Text style={styles.bulletPoint}>• Any related companies or entities</Text>
          
          <Text style={styles.sectionText}>
            Pokémon GO is a trademark of Niantic, Inc. All Pokémon names, characters, and related marks are trademarks of their respective owners. This App operates as a fan-made coordination tool and does not modify, hack, or interfere with Pokémon GO gameplay.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. USER ACCOUNTS AND ELIGIBILITY</Text>
          <Text style={styles.sectionText}>
            To use LobbyGO, you must:
          </Text>
          <Text style={styles.bulletPoint}>• Be at least 13 years old (or the minimum age in your jurisdiction)</Text>
          <Text style={styles.bulletPoint}>• Have a valid Pokémon GO trainer account</Text>
          <Text style={styles.bulletPoint}>• Provide accurate trainer information</Text>
          <Text style={styles.bulletPoint}>• Use only your own trainer credentials</Text>
          <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. PROHIBITED CONDUCT</Text>
          <Text style={styles.sectionText}>You agree NOT to:</Text>
          <Text style={styles.bulletPoint}>• Use the App for any illegal activities</Text>
          <Text style={styles.bulletPoint}>• Share multiple accounts or false trainer information</Text>
          <Text style={styles.bulletPoint}>• Engage in harassment, bullying, or abusive behavior</Text>
          <Text style={styles.bulletPoint}>• Spam, advertise, or promote external services</Text>
          <Text style={styles.bulletPoint}>• Attempt to circumvent any App limitations or security measures</Text>
          <Text style={styles.bulletPoint}>• Share inappropriate content or personal information of others</Text>
          <Text style={styles.bulletPoint}>• Use automated tools, bots, or scripts</Text>
          <Text style={styles.bulletPoint}>• Reverse engineer, modify, or create derivative works of the App</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. TRADING AND RAID COORDINATION</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Trading:</Text> LobbyGO facilitates communication between players for Pokémon trading but does not:
          </Text>
          <Text style={styles.bulletPoint}>• Guarantee any trades will be completed</Text>
          <Text style={styles.bulletPoint}>• Verify the accuracy of trade offers</Text>
          <Text style={styles.bulletPoint}>• Provide dispute resolution for failed trades</Text>
          <Text style={styles.bulletPoint}>• Handle any in-game transactions</Text>
          
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Raids:</Text> We provide coordination tools but cannot guarantee:
          </Text>
          <Text style={styles.bulletPoint}>• Raid availability or success</Text>
          <Text style={styles.bulletPoint}>• Player attendance or behavior</Text>
          <Text style={styles.bulletPoint}>• In-game rewards or outcomes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. PRIVACY AND DATA</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information. By using the App, you consent to our data practices as described in the Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. INTELLECTUAL PROPERTY</Text>
          <Text style={styles.sectionText}>
            The LobbyGO App, including its design, code, and original content, is owned by us and protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our App without written permission.
          </Text>
          <Text style={styles.sectionText}>
            All Pokémon-related names, images, and content remain the property of their respective owners and are used under fair use for coordination purposes only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. DISCLAIMERS AND LIMITATIONS</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</Text> We disclaim all warranties, express or implied, including but not limited to:
          </Text>
          <Text style={styles.bulletPoint}>• Merchantability and fitness for a particular purpose</Text>
          <Text style={styles.bulletPoint}>• Accuracy, reliability, or completeness of information</Text>
          <Text style={styles.bulletPoint}>• Uninterrupted or error-free operation</Text>
          <Text style={styles.bulletPoint}>• Security of data transmission</Text>
          
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>LIMITATION OF LIABILITY:</Text> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. ACCOUNT TERMINATION</Text>
          <Text style={styles.sectionText}>
            We may suspend or terminate your account at any time for:
          </Text>
          <Text style={styles.bulletPoint}>• Violation of these Terms</Text>
          <Text style={styles.bulletPoint}>• Fraudulent or illegal activity</Text>
          <Text style={styles.bulletPoint}>• Harassment of other users</Text>
          <Text style={styles.bulletPoint}>• Any other reason at our sole discretion</Text>
          
          <Text style={styles.sectionText}>
            You may delete your account at any time through the App settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. CHANGES TO TERMS</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these Terms at any time. We will notify users of material changes through the App or by email. Continued use of the App after changes constitutes acceptance of the new Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. GOVERNING LAW</Text>
          <Text style={styles.sectionText}>
            These Terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles. Any disputes arising from these Terms or the App shall be resolved through binding arbitration.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. CONTACT INFORMATION</Text>
          <Text style={styles.sectionText}>
            For questions about these Terms or the App, please contact us at:
          </Text>
          <Text style={styles.contactText}>Email: legal@lobbygo.app</Text>
          <Text style={styles.contactText}>Support: support@lobbygo.app</Text>
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
  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
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
  bottomSpacing: {
    height: 40,
  },
});

export default TermsOfServiceScreen;
