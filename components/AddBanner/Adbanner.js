import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Adbanner = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const handleShopNow = () => {
    Alert.alert('Shop Now', 'Redirecting to Rose Gulkand...');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Section */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/b.mp4" }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
          isMuted
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={styles.videoOverlay}
        />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Naturally Sweet.</Text>
          <Text style={styles.subTitle}>Traditionally Healing.</Text>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          At 7miles, we bring you nature's finest treasures.
        </Text>

        {/* Product Description */}
        <View style={styles.productCard}>
          <Ionicons name="flower" size={24} color="red" />
          <View style={styles.productTextContainer}>
            <Text style={styles.productTitle}>7miles Rose Gulkand</Text>
            <Text style={styles.productDescription}>
              Savor the rich taste and aroma of 7miles Rose Gulkand. Made without any artificial preservatives, it's perfect for daily wellness.
            </Text>
          </View>
        </View>

        {/* Shop Now Button */}
        <TouchableOpacity
          style={styles.shopButton}
          onPress={handleShopNow}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['black', 'black']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Shop Now</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Brand Tagline */}
        <Text style={styles.brandTagline}>Pure • Natural • Ayurvedic</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  videoContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A202C',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'red',
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 24,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  productTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
  shopButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandTagline: {
    textAlign: 'center',
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default Adbanner;