import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native'
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'

const Help = () => {
  // Contact functions
  const callSupport = () => {
    Linking.openURL('tel:+911234567890')
  }

  const whatsappChat = () => {
    Linking.openURL('https://wa.me/911234567890')
  }

  const emailSupport = () => {
    Linking.openURL('mailto:7milesnkl@gmail.com')
  }

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>Get assistance anytime</Text>
      </View> */}

      {/* Contact Options */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        {/* Call Us */}
        <TouchableOpacity style={styles.contactCard} onPress={callSupport}>
          <View style={[styles.iconContainer, styles.redIconBg]}>
            <MaterialIcons name="phone" size={22} color="#d32f2f" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSubtitle}>+91 123 456 7890</Text>
            <Text style={styles.contactDescription}>Direct phone support</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#d32f2f" />
        </TouchableOpacity>

        {/* WhatsApp Chat */}
        <TouchableOpacity style={styles.contactCard} onPress={whatsappChat}>
          <View style={[styles.iconContainer, styles.redIconBg]}>
            <FontAwesome5 name="whatsapp" size={20} color="#d32f2f" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>WhatsApp Chat</Text>
            <Text style={styles.contactSubtitle}>Instant messaging</Text>
            <Text style={styles.contactDescription}>Quick response</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#d32f2f" />
        </TouchableOpacity>

        {/* Email Support */}
        <TouchableOpacity style={styles.contactCard} onPress={emailSupport}>
          <View style={[styles.iconContainer, styles.redIconBg]}>
            <MaterialIcons name="email" size={20} color="#d32f2f" />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSubtitle}>7milesnkl@gmail.com</Text>
            <Text style={styles.contactDescription}>Detailed assistance</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <Ionicons name="location" size={20} color="#d32f2f" />
          <Text style={styles.addressTitle}>Our Location</Text>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.addressIconContainer}>
            <MaterialIcons name="business" size={18} color="#d32f2f" />
          </View>
          <Text style={styles.addressText}>
            585/27, A2A-3rd Floor,{"\n"}
            Pathi Nagar,{"\n"}
            Salem Road,{"\n"}
            Namakkal,{"\n"}
            Tamilnadu - 637001
          </Text>
          
          <View style={styles.mapButton}>
            <TouchableOpacity 
              style={styles.mapButtonTouchable}
              onPress={() => Linking.openURL('https://maps.google.com/?q=Namakkal,Tamilnadu')}
            >
              <MaterialIcons name="map" size={16} color="#fff" />
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

     

   

      <View style={styles.footer}>
        <MaterialIcons name="favorite" size={16} color="#d32f2f" />
        <Text style={styles.footerText}>We're here to help you!</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '',
  },
  header: {
    backgroundColor: '#d32f2f',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffeaea',
    fontWeight: '500',
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000',
    // marginLeft: 8,
    textAlign: "center",
    marginTop: 10,
    marginBottom:10,
  },
  contactCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  redIconBg: {
    backgroundColor: '#ffeaea',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '600',
    marginBottom: 1,
  },
  contactDescription: {
    fontSize: 11,
    color: '#666',
  },
  addressSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addressIconContainer: {
    backgroundColor: '#ffeaea',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000',
    marginBottom: 16,
  },
  mapButton: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  mapButtonTouchable: {
    backgroundColor: '#000000FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  hoursSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoursCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  hourIcon: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
  },
  time: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  helpSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  helpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  helpItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginLeft: 6,
  },
})

export default Help