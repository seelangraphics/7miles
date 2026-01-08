import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native'

const Help = () => {
  // Contact functions
  const callSupport = () => {
    Linking.openURL('tel:+9109677764778')
  }

  const whatsappChat = () => {
    Linking.openURL('https://wa.me/9190677764778')
  }

  const emailSupport = () => {
    Linking.openURL('mailto:7milesnkl@gmail.com')
  }
const openMap = () => {
  const url = 'https://maps.app.goo.gl/AaBc7He6Ev6YAe1aA'
  Linking.openURL(url).catch(err => {
    console.error('Error opening map:', err)
  })
}



  return (
    <ScrollView style={styles.container}>
      {/* Contact Options */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        
        {/* Call Us */}
        <TouchableOpacity style={styles.contactCard} onPress={callSupport}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactSubtitle}>+91 096777 64778</Text>
            <Text style={styles.contactDescription}>Direct phone support</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* WhatsApp Chat */}
        <TouchableOpacity style={styles.contactCard} onPress={whatsappChat}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>WhatsApp Chat</Text>
            <Text style={styles.contactSubtitle}>Instant messaging</Text>
            <Text style={styles.contactDescription}>Quick response</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Email Support */}
        <TouchableOpacity style={styles.contactCard} onPress={emailSupport}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSubtitle}>7milesnkl@gmail.com</Text>
            <Text style={styles.contactDescription}>Detailed assistance</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.addressSection}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>Our Location</Text>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.addressIconContainer}>
            <Text style={styles.buildingIcon}>🏢</Text>
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
  onPress={openMap}
>
  <Text style={styles.mapButtonText}>View on Map</Text>
</TouchableOpacity>

          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>We're here to help you!</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000',
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 12,
    color: '#666',
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  addressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addressHeader: {
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addressIconContainer: {
    backgroundColor: '#ffeaea',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffcccc',
    alignSelf: 'center',
  },
  buildingIcon: {
    fontSize: 20,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  mapButton: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  mapButtonTouchable: {
    backgroundColor: '#d32f2f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
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
  },
})

export default Help
