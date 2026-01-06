import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicy = ({ navigation }) => {
  const openEmail = () => {
    Linking.openURL('mailto:7milesnkl@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.contentText}>
            At 7Miles, we hold ourselves to the highest standards for secure transactions and the privacy of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our website and services.
          </Text>
          <Text style={styles.contentText}>
            Note: Our Privacy Policy is subject to change without notice. We encourage you to review this page periodically to stay informed about any updates.
          </Text>
          <Text style={styles.contentText}>
            By using our website, you agree to the terms of this Privacy Policy. If you do not agree, please refrain from accessing our site or providing any personal information.
          </Text>
        </View>

        {/* 1. Commitment to Your Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Commitment to Your Privacy</Text>
          <Text style={styles.contentText}>
            7Miles is committed to protecting and respecting your privacy. This policy describes the personal data we collect, how it is used, and the rights you have regarding your information. We also explain the steps we take to secure your data.
          </Text>
        </View>

        {/* 2. Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.contentText}>
            We only collect information necessary to deliver seamless service and improve your experience. This includes:
          </Text>
          <Text style={styles.listItem}>• Name, email address, phone number</Text>
          <Text style={styles.listItem}>• Shipping and billing addresses</Text>
          <Text style={styles.listItem}>• Date of birth (if applicable)</Text>
          <Text style={styles.listItem}>• Browser type, IP address, and device information</Text>
          <Text style={styles.listItem}>• Order history and preferences</Text>
          <Text style={styles.listItem}>• Any other information you provide via forms, feedback, or communication</Text>
        </View>

        {/* 3. Use of Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Use of Your Information</Text>
          <Text style={styles.contentText}>
            The data we collect helps us to:
          </Text>
          <Text style={styles.listItem}>• Process orders and deliver products</Text>
          <Text style={styles.listItem}>• Improve our website and services</Text>
          <Text style={styles.listItem}>• Provide customer support</Text>
          <Text style={styles.listItem}>• Send relevant offers, product updates, and newsletters (with your consent)</Text>
          <Text style={styles.listItem}>• Prevent fraud and ensure secure transactions</Text>
          <Text style={styles.listItem}>• Understand user behavior and preferences</Text>
          <Text style={styles.contentText}>
            We do not sell or share your personal data with third parties for their marketing purposes without your explicit consent.
          </Text>
        </View>

        {/* 4. Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Payment Information</Text>
          <Text style={styles.contentText}>
            7Miles does not store your credit/debit card or bank details. All payment transactions are processed securely through certified third-party payment gateways that comply with data protection regulations.
          </Text>
        </View>

        {/* 5. Cookies and Web Technologies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Cookies and Web Technologies</Text>
          <Text style={styles.contentText}>
            We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.
          </Text>
          <Text style={styles.contentText}>
            Rejecting cookies may limit the functionality of certain parts of our website.
          </Text>
        </View>

        {/* 6. Email, SMS & Marketing Communication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Email, SMS & Marketing Communication</Text>
          <Text style={styles.contentText}>
            With your permission, we may send:
          </Text>
          <Text style={styles.listItem}>• Newsletters and promotional offers</Text>
          <Text style={styles.listItem}>• Product announcements and updates</Text>
          <Text style={styles.listItem}>• Order and delivery notifications</Text>
          <Text style={styles.contentText}>
            You can opt out at any time by clicking the "unsubscribe" link in our emails or replying "STOP" to SMS communications.
          </Text>
        </View>

        {/* 7. Account Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Account Security</Text>
          <Text style={styles.contentText}>
            Your 7Miles account is protected by a password that you set. We urge you to keep this password confidential and change it periodically.
          </Text>
          <Text style={styles.contentText}>
            If you suspect unauthorized access, please contact us immediately.
          </Text>
        </View>

        {/* 8. Information Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Information Sharing</Text>
          <Text style={styles.contentText}>
            We may share information with trusted partners (e.g., logistics providers, customer service platforms, analytics tools) only to fulfill the purpose for which it was collected. All such partners are bound by strict confidentiality agreements.
          </Text>
          <Text style={styles.contentText}>
            We may also disclose information when required by law, to protect our rights, or in the event of a business transfer or acquisition.
          </Text>
        </View>

        {/* 9. External Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. External Links</Text>
          <Text style={styles.contentText}>
            Our site may contain links to third-party websites. We are not responsible for the privacy policies or practices of such external sites. We encourage you to read their policies before providing any information.
          </Text>
        </View>

        {/* 10. Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
          <Text style={styles.contentText}>
            Our website is not directed to individuals under the age of 13. We do not knowingly collect or solicit data from children. If we discover we have received such information, we will delete it promptly.
          </Text>
        </View>

        {/* 11. Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Data Retention</Text>
          <Text style={styles.contentText}>
            We retain your information only for as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law.
          </Text>
        </View>

        {/* 12. Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Your Rights</Text>
          <Text style={styles.contentText}>
            You have the right to:
          </Text>
          <Text style={styles.listItem}>• Access, correct, or delete your personal data</Text>
          <Text style={styles.listItem}>• Withdraw consent for marketing communications</Text>
          <Text style={styles.listItem}>• Object to data processing under legitimate interests</Text>
          <Text style={styles.listItem}>• Lodge a complaint with a data protection authority</Text>
          <Text style={styles.contentText}>
            To exercise any of these rights, please contact us at:
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailText}>7milesnkl@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default PrivacyPolicy;