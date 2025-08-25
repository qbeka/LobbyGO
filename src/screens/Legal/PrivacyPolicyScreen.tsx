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

const PrivacyPolicyScreen = () => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. INTRODUCTION</Text>
          <Text style={styles.sectionText}>
            LobbyGO ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>IMPORTANT:</Text> LobbyGO is an independent third-party application and is not affiliated with Niantic, Inc., The Pokémon Company, Nintendo, or any related entities. We only collect and process data necessary for app functionality.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. INFORMATION WE COLLECT</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Information You Provide Directly</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Trainer Information:</Text> Trainer name, friend code, team affiliation (Mystic/Valor/Instinct), and trainer level</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Data:</Text> Authentication credentials (via Apple/Google Sign-In)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Communication Data:</Text> Messages in party chats and trade conversations</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Trade Listings:</Text> Pokémon offered, Pokémon wanted, trading preferences, and notes</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Raid Preferences:</Text> Raid boss selections and party participation</Text>

          <Text style={styles.subsectionTitle}>2.2 Information Collected Automatically</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Usage Data:</Text> App features used, session duration, and interaction patterns</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Device Information:</Text> Device type, operating system, app version, and unique device identifiers</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Log Data:</Text> Error logs, crash reports, and performance metrics</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Analytics Data:</Text> Anonymous usage statistics for app improvement</Text>

          <Text style={styles.subsectionTitle}>2.3 Information We Do NOT Collect</Text>
          <Text style={styles.bulletPoint}>• Real-world location or GPS coordinates</Text>
          <Text style={styles.bulletPoint}>• Pokémon GO account credentials or passwords</Text>
          <Text style={styles.bulletPoint}>• In-game currency or item information</Text>
          <Text style={styles.bulletPoint}>• Personal identification documents</Text>
          <Text style={styles.bulletPoint}>• Financial or payment information</Text>
          <Text style={styles.bulletPoint}>• Contact lists or phonebook data</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. HOW WE USE YOUR INFORMATION</Text>
          <Text style={styles.sectionText}>We use collected information for:</Text>
          
          <Text style={styles.subsectionTitle}>3.1 Core App Functionality</Text>
          <Text style={styles.bulletPoint}>• Displaying your trainer profile to other users</Text>
          <Text style={styles.bulletPoint}>• Facilitating raid group formation and management</Text>
          <Text style={styles.bulletPoint}>• Enabling trade listing creation and browsing</Text>
          <Text style={styles.bulletPoint}>• Processing party chat and trade messages</Text>
          <Text style={styles.bulletPoint}>• Managing friend code exchanges</Text>

          <Text style={styles.subsectionTitle}>3.2 Service Improvement</Text>
          <Text style={styles.bulletPoint}>• Analyzing usage patterns to improve features</Text>
          <Text style={styles.bulletPoint}>• Identifying and fixing bugs or technical issues</Text>
          <Text style={styles.bulletPoint}>• Developing new features based on user needs</Text>
          <Text style={styles.bulletPoint}>• Optimizing app performance and reliability</Text>

          <Text style={styles.subsectionTitle}>3.3 Safety and Security</Text>
          <Text style={styles.bulletPoint}>• Preventing fraud, abuse, and spam</Text>
          <Text style={styles.bulletPoint}>• Enforcing our Terms of Service</Text>
          <Text style={styles.bulletPoint}>• Investigating reports of misconduct</Text>
          <Text style={styles.bulletPoint}>• Protecting user safety and app integrity</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. INFORMATION SHARING AND DISCLOSURE</Text>
          
          <Text style={styles.subsectionTitle}>4.1 With Other Users</Text>
          <Text style={styles.sectionText}>
            The following information is visible to other LobbyGO users:
          </Text>
          <Text style={styles.bulletPoint}>• Trainer name, level, and team affiliation</Text>
          <Text style={styles.bulletPoint}>• Friend code (when joining raids or trades)</Text>
          <Text style={styles.bulletPoint}>• Trade listings and preferences</Text>
          <Text style={styles.bulletPoint}>• Messages in party chats and trade conversations</Text>
          <Text style={styles.bulletPoint}>• Raid participation history</Text>

          <Text style={styles.subsectionTitle}>4.2 Third-Party Service Providers</Text>
          <Text style={styles.sectionText}>We may share data with:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Supabase:</Text> Database and authentication services</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>PostHog:</Text> Anonymous analytics and user behavior insights</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Sentry:</Text> Error monitoring and crash reporting</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Expo:</Text> Push notification delivery</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Apple/Google:</Text> Authentication services</Text>

          <Text style={styles.subsectionTitle}>4.3 Legal Requirements</Text>
          <Text style={styles.sectionText}>
            We may disclose information when required by law or to:
          </Text>
          <Text style={styles.bulletPoint}>• Comply with legal processes or court orders</Text>
          <Text style={styles.bulletPoint}>• Protect our rights, property, or safety</Text>
          <Text style={styles.bulletPoint}>• Investigate fraud or security issues</Text>
          <Text style={styles.bulletPoint}>• Enforce our Terms of Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. DATA STORAGE AND SECURITY</Text>
          
          <Text style={styles.subsectionTitle}>5.1 Data Storage</Text>
          <Text style={styles.bulletPoint}>• Data is stored securely using Supabase cloud infrastructure</Text>
          <Text style={styles.bulletPoint}>• Servers are located in secure, compliant data centers</Text>
          <Text style={styles.bulletPoint}>• Data is encrypted in transit and at rest</Text>
          <Text style={styles.bulletPoint}>• Regular backups ensure data availability</Text>

          <Text style={styles.subsectionTitle}>5.2 Security Measures</Text>
          <Text style={styles.bulletPoint}>• Industry-standard encryption protocols</Text>
          <Text style={styles.bulletPoint}>• Secure authentication via Apple/Google Sign-In</Text>
          <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
          <Text style={styles.bulletPoint}>• Access controls limiting data exposure</Text>
          <Text style={styles.bulletPoint}>• Automated monitoring for suspicious activity</Text>

          <Text style={styles.subsectionTitle}>5.3 Data Retention</Text>
          <Text style={styles.bulletPoint}>• Account data: Retained while your account is active</Text>
          <Text style={styles.bulletPoint}>• Messages: Retained for 30 days after party/trade completion</Text>
          <Text style={styles.bulletPoint}>• Analytics data: Anonymized and retained for 2 years</Text>
          <Text style={styles.bulletPoint}>• Deleted accounts: Data permanently removed within 30 days</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. YOUR PRIVACY RIGHTS</Text>
          
          <Text style={styles.subsectionTitle}>6.1 Access and Control</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>View Data:</Text> Access your profile information in app settings</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Update Data:</Text> Modify trainer information and preferences</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Export Data:</Text> Request a copy of your data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Delete Account:</Text> Permanently remove your account and data</Text>

          <Text style={styles.subsectionTitle}>6.2 Communication Preferences</Text>
          <Text style={styles.bulletPoint}>• Control push notification settings</Text>
          <Text style={styles.bulletPoint}>• Manage email communication preferences</Text>
          <Text style={styles.bulletPoint}>• Opt out of analytics data collection</Text>

          <Text style={styles.subsectionTitle}>6.3 Regional Rights (GDPR, CCPA, etc.)</Text>
          <Text style={styles.sectionText}>
            If you're located in the EU, California, or other regions with specific privacy laws, you may have additional rights including:
          </Text>
          <Text style={styles.bulletPoint}>• Right to know what data we collect and why</Text>
          <Text style={styles.bulletPoint}>• Right to access your personal data</Text>
          <Text style={styles.bulletPoint}>• Right to correct inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Right to delete your data</Text>
          <Text style={styles.bulletPoint}>• Right to data portability</Text>
          <Text style={styles.bulletPoint}>• Right to opt out of data sales (we don't sell data)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. CHILDREN'S PRIVACY</Text>
          <Text style={styles.sectionText}>
            LobbyGO is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to remove such information and terminate the account.
          </Text>
          <Text style={styles.sectionText}>
            Parents who believe their child has provided information to us should contact us immediately at privacy@lobbygo.app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. INTERNATIONAL DATA TRANSFERS</Text>
          <Text style={styles.sectionText}>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure adequate protection through:
          </Text>
          <Text style={styles.bulletPoint}>• Standard contractual clauses with service providers</Text>
          <Text style={styles.bulletPoint}>• Adequacy decisions from relevant authorities</Text>
          <Text style={styles.bulletPoint}>• Appropriate safeguards for data protection</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. THIRD-PARTY LINKS AND SERVICES</Text>
          <Text style={styles.sectionText}>
            LobbyGO may contain links to third-party websites or services. This Privacy Policy does not apply to those third parties. We encourage you to review the privacy policies of any third-party services you use.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. CHANGES TO THIS POLICY</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons. We will:
          </Text>
          <Text style={styles.bulletPoint}>• Notify users of material changes via app notification or email</Text>
          <Text style={styles.bulletPoint}>• Post the updated policy with a new "Last Updated" date</Text>
          <Text style={styles.bulletPoint}>• Provide a summary of key changes when applicable</Text>
          
          <Text style={styles.sectionText}>
            Continued use of the app after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. CONTACT US</Text>
          <Text style={styles.sectionText}>
            If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:
          </Text>
          <Text style={styles.contactText}>Email: privacy@lobbygo.app</Text>
          <Text style={styles.contactText}>Support: support@lobbygo.app</Text>
          <Text style={styles.contactText}>Data Protection Officer: dpo@lobbygo.app</Text>
          
          <Text style={styles.sectionText}>
            We will respond to privacy inquiries within 30 days (or as required by applicable law).
          </Text>
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
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
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

export default PrivacyPolicyScreen;
