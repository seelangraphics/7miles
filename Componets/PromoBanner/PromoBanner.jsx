// components/PromoBanner.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const PromoBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Using remote images from AWS S3
  const bannerImages = [
    { uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/bb1.jpg" },
    { uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/bb2.jpg" },
    { uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/bb1.jpg" },
    { uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/banners/bb2.jpg" },
  ];

  const bannerData = [
    {
      offer: "FLAT 300 OFF",
      code: "MYNTRA300",
      discount: "UNDER 2199",
    },
    {
      offer: "BUY 1 GET 1 FREE",
      code: "BOGO50",
      discount: "ON ALL ITEMS",
    },
    {
      offer: "50% OFF SALE",
      code: "HALFPRICE",
      discount: "LIMITED TIME",
    },
    {
      offer: "FREE SHIPPING",
      code: "FREESHIP",
      discount: "ABOVE 999",
    },
  ];

  // Auto-change banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const currentBanner = bannerData[currentImageIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#201F1FFF", "#3B3939FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        {/* Background Image */}
        <Image
          source={bannerImages[currentImageIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Overlay Content */}
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.offerText}>{currentBanner.offer}</Text>
              <Text style={styles.codeText}>{currentBanner.code}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.useCodeText}>USECODE:</Text>
              <Text style={styles.discountText}>{currentBanner.discount}</Text>
            </View>
          </View>
        </View>

        {/* Image Indicators */}
        <View style={styles.indicators}>
          {bannerImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentImageIndex(index)}
            >
              <View
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

// ... styles remain the same ...
const styles = StyleSheet.create({
  container: {
    width: width,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    marginTop: -10,
    marginRight: 50,
  },
  banner: {
    width: width,
    height: 200,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  offerText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  codeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    overflow: "hidden",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailsContainer: {
    alignItems: "flex-end",
  },
  useCodeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  discountText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  indicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
  },
});

export default PromoBanner;