import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from "../../assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png";

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const logoFadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Reset values
    scaleValue.setValue(0);
    rotateValue.setValue(0);
    fadeValue.setValue(0);
    bounceValue.setValue(0);
    logoFadeValue.setValue(0);

    // Parallel animations
    Animated.parallel([
      // Scale animation with bounce effect
      Animated.sequence([
        Animated.spring(scaleValue, {
          toValue: 1.2,
          friction: 1,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        })
      ]),
      
      // Rotate animation
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      
      // Fade in text
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      
      // Bounce animation for additional elements
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),

      // Logo fade in animation
      Animated.timing(logoFadeValue, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Wait for 1 second then complete
      setTimeout(() => {
        onAnimationComplete();
      }, 1000);
    });
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg']
  });

  const bounceInterpolate = bounceValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0]
  });

  const textScale = bounceValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1]
  });

  const logoScale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  return (
    <View style={styles.container}>
      {/* Background with gradient effect */}
      <View style={styles.background} />
      
      {/* Main logo container */}
      <View style={styles.logoContainer}>
        {/* Outer circle */}
        <Animated.View 
          style={[
            styles.outerCircle,
            {
              transform: [
                { scale: scaleValue },
                { rotate: rotateInterpolate }
              ]
            }
          ]}
        />
        
        {/* Middle circle */}
        <Animated.View 
          style={[
            styles.middleCircle,
            {
              transform: [
                { scale: scaleValue },
                { rotate: rotateInterpolate }
              ]
            }
          ]}
        />
        
        {/* Logo container */}
        <Animated.View
          style={[
            styles.logoImageContainer,
            {
              transform: [
                { scale: logoScale },
              ],
              opacity: logoFadeValue
            }
          ]}
        >
          <Image 
            source={logo} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

      
      </View>

      {/* App name with animation */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeValue,
            transform: [
              { translateY: bounceInterpolate },
              { scale: textScale }
            ]
          }
        ]}
      >
        <Text style={styles.appName}>7 Miles</Text>
        <Text style={styles.tagline}>Pure Nature, Pure You</Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeValue,
          }
        ]}
      >
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [
                    {
                      scale: bounceValue.interpolate({
                        inputRange: [0, 0.2 + index * 0.2, 0.6 + index * 0.2, 1],
                        outputRange: [1, 1.5, 1, 1]
                      })
                    }
                  ],
                  opacity: bounceValue.interpolate({
                    inputRange: [0, 0.2 + index * 0.2, 1],
                    outputRange: [0.3, 1, 0.3]
                  })
                }
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8f8f8',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(208, 201, 196, 0.2)',
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(208, 201, 196, 0.4)',
  },
  middleCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(208, 201, 196, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(208, 201, 196, 0.5)',
  },
  logoImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  decorativeIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#8B4513', // Brown color to match natural theme
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B4513', // Brown color to match theme
    marginHorizontal: 4,
  },
});

export default SplashScreen;