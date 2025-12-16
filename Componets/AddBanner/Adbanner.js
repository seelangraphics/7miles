import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Adbanner = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const handleShopNow = () => {
    Alert.alert('Shop Now', 'Redirecting to Face Powder collection...');
    // Add navigation logic here
  };

  return (
    <View style={styles.bannerContainer}>
      {/* Video Background */}
      <Video
        ref={videoRef}
        source={{ uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/b.mp4" }}

        style={styles.videoBackground}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />

      {/* Dark Overlay */}
      <View style={styles.darkOverlay} />

      {/* Gradient Overlay for better text readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Content Container */}
      <View style={styles.contentContainer}>


        {/* Main Heading */}
        <Text style={styles.mainHeading}>
          Glow Naturally with{'\n'}
          <Text style={styles.highlightText}>7Miles Facepack</Text>
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Pure, chemical-free facepack powders made to{'\n'}
          pamper every skin type with natural ingredients
        </Text>



        {/* Shop Now Button */}
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={handleShopNow}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA000']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="cart" size={20} color="#000" />
            <Text style={styles.shopNowText}>Shop Face Powders</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="leaf" size={12} color="#FFD700" />
            </View>
            <Text style={styles.featureText}>Natural Ingredients</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={12} color="#FFD700" />
            </View>
            <Text style={styles.featureText}>Premium Quality</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="cash" size={12} color="#FFD700" />
            </View>
            <Text style={styles.featureText}>Affordable</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="earth" size={12} color="#FFD700" />
            </View>
            <Text style={styles.featureText}>Eco-Friendly</Text>
          </View>
        </View>

        {/* Bottom Offer Text */}
        <View style={styles.offerContainer}>
          <Text style={styles.offerText}>
            🎁 Free Shipping on orders above ₹499
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: width - 32,
    height: 420,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    marginBottom: 20,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    letterSpacing: 1,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  highlightText: {
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
  },
  description: {
    fontSize: 16,
    color: '#E8F5E8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  shopNowButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  shopNowText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
    flex: 1,
  },
  offerContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
  },
  offerText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Adbanner;