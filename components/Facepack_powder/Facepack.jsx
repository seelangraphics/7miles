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
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import img from "../../assets/Facepack.gif"

const { width, height } = Dimensions.get('window');
const PRODUCTS_IMAGE_API = Constants.expoConfig.extra?.PRODUCTS_IMAGE_API;

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
  }, [translateX]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.View style={[styles.marqueeContent, { transform: [{ translateX }] }]}>
        <Text style={styles.marqueeText}>Premium Quality</Text>
        <Text style={styles.marqueeText}>Eco-Friendly</Text>
        <Text style={styles.marqueeText}>Affordable for All</Text>
        <Text style={styles.marqueeText}>Natural Ingredients</Text>
      </Animated.View>
    </View>
  );
};

const Facepack = () => {
  const [imageError, setImageError] = useState(false);
  const remoteFacepackImage = PRODUCTS_IMAGE_API
    ? { uri: `${PRODUCTS_IMAGE_API}Facepack.gif?v=2` }
    : null;
  const facepackImage = imageError || !remoteFacepackImage ? img : remoteFacepackImage;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContainer}>
        {facepackImage ? (
          <ImageBackground
            source={facepackImage}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          >
            <View style={styles.imageOverlay} />
          </ImageBackground>
        ) : (
          <View style={styles.fallbackBackground} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <Content facepackImage={facepackImage} onImageError={() => setImageError(true)} />
      </View>
    </SafeAreaView>
  );
};

const Content = ({ facepackImage, onImageError }) => {
  const navigation = useNavigation();

  return (
    <>
      <TopMarquee />

      <View style={styles.contentWrapper}>
        <View style={styles.logoSection}>
          <Text style={styles.brandName}>7Miles</Text>
          <View style={styles.taglineContainer}>
            <View style={styles.line} />
            <Text style={styles.tagline}>Facepack Powders</Text>
            <View style={styles.line} />
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroLine1}>Glow Naturally</Text>
          <Text style={styles.heroLine2}>with 7Miles</Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>
            Pure, chemical-free facepack powders{'\n'}
            crafted for every skin type
          </Text>

          <View style={styles.productShowcase}>
            <View style={styles.productImageContainer}>
              <View style={styles.imageFrame}>
                {facepackImage ? (
                  <Image
                    source={facepackImage}
                    style={styles.productImage}
                    resizeMode="contain"
                    onError={onImageError}
                  />
                ) : null}
              </View>
            </View>

            <View style={styles.ctaSection}>
              <TouchableOpacity
                style={styles.ctaButton}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('Categories', { selectedCategory: 'Skin Care' })
                }
              >
                <Text style={styles.ctaText}>Explore Collection</Text>
                <View style={styles.arrowCircle}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.shippingNote}>Free shipping • Orders above Rs499</Text>
            </View>
          </View>
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
    backgroundColor: 'rgba(255, 249, 240, 0.82)',
  },
  fallbackBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF9F0',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  marqueeContainer: {
    height: 32,
    backgroundColor: 'rgba(90, 57, 33, 0.92)',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  marqueeContent: {
    flexDirection: 'row',
  },
  marqueeText: {
    color: '#FEF7E6',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginHorizontal: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: width > 768 ? 60 : 24,
    paddingTop: height * 0.12,
    paddingBottom: height * 0.06,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  brandName: {
    fontSize: width > 768 ? 52 : 42,
    fontWeight: '800',
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
    color: '#5A3921',
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: width > 768 ? 60 : 48,
  },
  heroLine2: {
    fontSize: width > 768 ? 56 : 44,
    fontWeight: '700',
    color: '#5A3921',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: -4,
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
    lineHeight: width > 768 ? 28 : 24,
    textAlign: 'center',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  productShowcase: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  productImageContainer: {
    alignItems: 'center',
    width: '100%',
  },
  imageFrame: {
    width: '100%',
    maxWidth: width > 768 ? 360 : 290,
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(232, 184, 150, 0.3)',
    padding: width > 768 ? 20 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A3921',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  ctaSection: {
    alignItems: 'center',
    marginTop: -30,
    zIndex: 2,
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
    borderWidth: 4,
    borderColor: 'rgba(255, 249, 240, 0.95)',
  },
  ctaText: {
    color: '#FFF9F0',
    fontSize: width > 768 ? 18 : 16,
    fontWeight: '600',
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
    marginTop: 14,
    fontSize: 13,
    color: '#7D5C3E',
    opacity: 0.85,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});

export default Facepack;
