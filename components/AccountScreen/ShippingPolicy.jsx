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

const ShippingPolicy = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Shipping Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Processing Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Processing Time (Within India)</Text>
          <Text style={styles.contentText}>
            Great style deserves great care. Here's how we roll:
          </Text>
          <Text style={styles.listItem}>• Prepaid Orders: We pack and dispatch your vibe within 2 business days!</Text>
          <Text style={styles.listItem}>• Cash on Delivery (COD) Orders: We double-check everything for you. So, give us 3 business days.</Text>
        </View>

        {/* Delivery Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Timeline</Text>
          <Text style={styles.listItem}>• Metro Cities: Your fashion fix arrives in 3–7 business days.</Text>
          <Text style={styles.listItem}>• Remote Areas & Villages: A little detour, but totally worth the wait — 10–12 business days.</Text>
        </View>

        {/* International Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>International Shipping</Text>
          <Text style={styles.contentText}>
            Fashion knows no borders.
          </Text>
          <Text style={styles.listItem}>• Processing Time: Just 3 business days, because we're fast like that.</Text>
          <Text style={styles.listItem}>• Delivery Time: Expect your parcel in 10–15 business days across continents.</Text>
          <Text style={styles.contentText}>
            Note: Customs duties and taxes vary by country and are the buyer's responsibility.
          </Text>
        </View>

        {/* Delivery Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Hours</Text>
          <Text style={styles.listItem}>• Monday to Saturday: 10:00 a.m. – 6:00 p.m.</Text>
          <Text style={styles.contentText}>
            (Sundays and public holidays are our self-care days too!)
          </Text>
          <Text style={styles.contentText}>
            Signature Required: Please ensure someone trustworthy (you, a friend, or neighbor) is available to receive your fashion treasure.
          </Text>
        </View>

        {/* Shipping Charges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Charges</Text>
          <Text style={styles.subtitle}>For Indian Orders:</Text>
          <Text style={styles.subtitle}>Prepaid Orders:</Text>
          <Text style={styles.listItem}>• Orders below ₹500: ₹45</Text>
          <Text style={styles.listItem}>• ₹501 to ₹998: ₹60</Text>
          <Text style={styles.listItem}>• Above ₹998: FREE!</Text>
          
          <Text style={styles.subtitle}>COD Orders:</Text>
          <Text style={styles.listItem}>• Below ₹10,000: ₹89</Text>
          <Text style={styles.listItem}>• ₹10,000 & above: COD not available</Text>
          
          <Text style={styles.subtitle}>For International Orders:</Text>
          <Text style={styles.contentText}>
            Shipping fees vary by country. We'll show you the exact amount at checkout. Additional customs duties may apply based on local regulations.
          </Text>
        </View>

        {/* Refund Policy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refund Policy</Text>
          <Text style={styles.contentText}>
            We want you to love every purchase. But if something's not right:
          </Text>
        </View>

        {/* Used Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Used Products</Text>
          <Text style={styles.contentText}>
            We do not accept returns on opened or used products.
          </Text>
        </View>

        {/* Damaged on Arrival */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Damaged on Arrival?</Text>
          <Text style={styles.contentText}>
            We've got your back! If your product arrives damaged (leaks, cracks, etc.), notify us within 24 hours of delivery — with a video of the unboxing.
          </Text>
          <Text style={styles.contentText}>
            Email: 7milesnkl@gmail.com
          </Text>
          <Text style={styles.contentText}>
            Once verified by our team, we'll either replace it or offer a full refund.
          </Text>
        </View>

        {/* Return Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Return Process</Text>
          <Text style={styles.listItem}>• Returns are accepted only for damaged goods reported within 24 hours.</Text>
          <Text style={styles.listItem}>• We do not accept returns for damage caused after delivery or due to mishandling.</Text>
          <Text style={styles.listItem}>• Refunds are processed within 7 business days to your original payment method.</Text>
        </View>

        {/* Order Cancellations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Cancellations</Text>
          <Text style={styles.subtitle}>Changed your mind?</Text>
          <Text style={styles.listItem}>• Cancel within 2 hours of placing a prepaid order for a full refund.</Text>
          <Text style={styles.listItem}>• After 2 hours, 30% cancellation fee applies to prepaid orders.</Text>
          <Text style={styles.listItem}>• Orders cannot be canceled once shipped.</Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still need help?</Text>
          <Text style={styles.contentText}>
            We're just an email away!
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailText}>Contact us: 7milesnkl@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Closing */}
        <View style={styles.section}>
          <Text style={styles.contentText}>
            Thanks for choosing 7Miles — where fashion, fun, and fast delivery meet.
          </Text>
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
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
    marginTop: 8,
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

export default ShippingPolicy;