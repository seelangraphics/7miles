import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

// Simple Marquee Component (top placement)
const TopMarquee = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(width);
      Animated.timing(translateX, {
        toValue: -600,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => finished && animate());
    };
    animate();
  }, []);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={[styles.marqueeContent, { transform: [{ translateX }] }]}>
        <Text style={styles.marqueeText}>★ Premium Quality</Text>
        <Text style={styles.marqueeText}>★ Eco-Friendly</Text>
        <Text style={styles.marqueeText}>★ Affordable for All</Text>
        <Text style={styles.marqueeText}>★ Natural Ingredients</Text>
      </Animated.View>
    </View>
  );
};

const Facepack = ({ navigation }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback gradient background
  const fallbackGradient = ['#FFF9F0', '#FEF7E6'];
  

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Image Container */}
      <View style={styles.backgroundContainer}>
        {!imageError ? (
          <ImageBackground
            source={require('../../assets/Facepack.webp')}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          >
            <View style={styles.imageOverlay} />
          </ImageBackground>
        ) : (
          <View style={[styles.fallbackBackground, { 
            backgroundColor: fallbackGradient[0] 
          }]} />
        )}
      </View>
      
      {/* Main Content Overlay */}
      <View style={styles.contentContainer}>
        <Content navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const Content = () => {
    const categories = [
      { 
        id: 'skin', 
        name: 'Skin Care', 
        key: 'Skin Care',
        color: '#d2c1e2',
      },
    ];
      const navigation = useNavigation();
  return (
    <>
      {/* Marquee at top - subtle but visible */}
      <TopMarquee />
      
      {/* Main Content with proper spacing */}
      <View style={styles.contentWrapper}>
        
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.brandName}>7Miles</Text>
          <View style={styles.taglineContainer}>
            <View style={styles.line} />
            <Text style={styles.tagline}>Facepack Powders</Text>
            <View style={styles.line} />
          </View>
        </View>

        {/* Hero Section with better font handling */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLine1}>Glow Naturally</Text>
          <Text style={styles.heroLine2}>with 7Miles</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.subtitle}>
            Pure, chemical-free facepack powders{'\n'}
            crafted for every skin type
          </Text>
          
          {/* Product Image Section - Better placement */}
          <View style={styles.productImageContainer}>
            <View style={styles.imageFrame}>
              <Image
                source={require('../../assets/Facepack.webp')}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.ctaButton} 
              activeOpacity={0.9}
              onPress={() => navigation?.navigate?.('Categories', { selectedCategory: category.key })}
            >
              <Text style={styles.ctaText}>Explore Collection</Text>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.shippingNote}>Free shipping • Orders above ₹499</Text>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 249, 240, 0.85)',
  },
  fallbackBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  marqueeContainer: {
    height: 32,
    backgroundColor: 'rgba(90, 57, 33, 0.9)',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  marqueeContent: {
    flexDirection: "row",
  },
  marqueeText: {
    color: '#FEF7E6',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: 1,
    marginHorizontal: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: width > 768 ? 60 : 24,
    paddingTop: height * 0.12, // Adjusted for better spacing
    paddingBottom: height * 0.08,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  brandName: {
    fontSize: width > 768 ? 52 : 42,
    fontWeight: '800',
    fontFamily: 'System',
    color: '#5A3921',
    letterSpacing: 2,
    textTransform: 'uppercase',
    includeFontPadding: false,
    lineHeight: width > 768 ? 56 : 46,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  line: {
    width: 20,
    height: 1,
    backgroundColor: '#E8B896',
  },
  tagline: {
    fontSize: width > 768 ? 16 : 14,
    color: '#7D5C3E',
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: 2,
    marginHorizontal: 12,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  heroLine1: {
    fontSize: width > 768 ? 56 : 44,
    fontWeight: '300',
    fontFamily: 'System',
    color: '#5A3921',
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: width > 768 ? 60 : 48,
  },
  heroLine2: {
    fontSize: width > 768 ? 56 : 44,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#5A3921',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: -4, // Adjust line spacing
    includeFontPadding: false,
    lineHeight: width > 768 ? 60 : 48,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#E8B896',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: width > 768 ? 20 : 17,
    color: '#7D5C3E',
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: width > 768 ? 28 : 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  productImageContainer: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  imageFrame: {
    width: width * 0.7,
    height: height * 0.25,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 150, 0.3)',
    shadowColor: '#5A3921',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A3921',
    paddingVertical: width > 768 ? 18 : 16,
    paddingHorizontal: width > 768 ? 40 : 32,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: {
    color: '#FFF9F0',
    fontSize: width > 768 ? 18 : 16,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: 1,
    includeFontPadding: false,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrow: {
    color: '#5A3921',
    fontSize: 16,
    fontWeight: 'bold',
    includeFontPadding: false,
  },
  shippingNote: {
    marginTop: 16,
    fontSize: 13,
    color: '#7D5C3E',
    opacity: 0.8,
    letterSpacing: 0.5,
    fontFamily: 'System',
    includeFontPadding: false,
  },
});

export default Facepack;