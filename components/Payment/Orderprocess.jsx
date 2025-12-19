import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";
import { useCart } from "../context/CartContext";

const { width, height } = Dimensions.get("window");

export default function OrderProcessingScreen({ route, navigation }) {
  const { order } = route.params;
  const { cartItems = [], getCartTotal, clearCart } = useCart();
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Background circle animation
    Animated.timing(circleScale, {
      toValue: 1,
      duration: 1500,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();

    // Main content fade in with scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 800,
        delay: 300,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation after tick finishes (~2s)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    // Navigate after 5 seconds total (3 seconds after text appears)
 const timer = setTimeout(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {

      clearCart(); // ✅ Clear items from cart here

      navigation.replace("OrderSuccess", { order });

    });

  }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.pageWrapper}>
      {/* Animated Background Circles */}
      <Animated.View
        style={[styles.backgroundCircles, { opacity: circleScale }]}
      >
        <Animated.View
          style={[
            styles.circle1,
            {
              transform: [
                {
                  scale: circleScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle2,
            {
              transform: [
                {
                  scale: circleScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circle3,
            {
              transform: [
                {
                  scale: circleScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>

      {/* Center Content */}
      <Animated.View
        style={[
          styles.centerBlock,
          {
            opacity: fadeAnim,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        {/* Lottie Animation Container */}
        <View style={styles.iconWrapper}>
          <LottieView
            source={require("../animationjson/Success.json")}
            autoPlay
            loop={false}
            style={styles.icon}
            speed={0.8} // Slightly slower for better visibility
          />

          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: circleScale,
                transform: [
                  {
                    scale: circleScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: slideUpAnim }, { scale: textScale }],
            },
          ]}
        >
          <Text style={styles.title}>Order Confirmed!</Text>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Thank you for your order</Text>

         
        </Animated.View>

      
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: "#087c59ff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backgroundCircles: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 71, 87, 0.1)",
    top: -80,
    left: -50,
  },
  circle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(0, 166, 80, 0.1)",
    bottom: 40,
    right: -40,
  },
  circle3: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    bottom: "40%",
    left: "65%",
  },
  centerBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40, // Pull content up slightly
  },
  iconWrapper: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Reduced spacing
    position: "relative",
  },
  icon: {
    width: 250,
    height: 250,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: -1,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 5, // Very close to the tick
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#f0f0f0",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  orderIdPreview: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  orderIdLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  orderIdValue: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 1,
  },
  progressContainer: {
    marginTop: 30,
    alignItems: "center",
    width: "80%",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  redirectText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
});
