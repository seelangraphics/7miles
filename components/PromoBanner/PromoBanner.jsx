// components/PromoBanner.js
import React, { useState, useEffect } from "react";
import img1 from "../../assets/banners/bb1.webp"
import img2 from "../../assets/banners/bb2.webp"
import img3 from "../../assets/banners/bb3.webp"
import img4 from "../../assets/banners/bb4.webp"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");
const PRODUCTS_IMAGE_API = Constants.expoConfig.extra?.PRODUCTS_IMAGE_API;

const PromoBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  const localBannerImages = [img1, img2, img3,img4];
  const bannerImages = [
    `${PRODUCTS_IMAGE_API}banners/bb1.webp`,
    `${PRODUCTS_IMAGE_API}banners/bb2.webp`,
    `${PRODUCTS_IMAGE_API}banners/bb3.webp`,
    `${PRODUCTS_IMAGE_API}banners/bb4.webp`,
  ];
  const currentBannerImage = failedImages[currentImageIndex] || !PRODUCTS_IMAGE_API
    ? localBannerImages[currentImageIndex]
    : { uri: bannerImages[currentImageIndex] };


  const currentBannerSource = Image.resolveAssetSource(
    localBannerImages[currentImageIndex]
  );
  const bannerAspectRatio =
    currentBannerSource?.width && currentBannerSource?.height
      ? currentBannerSource.width / currentBannerSource.height
      : 16 / 9;


  // Auto-change banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

 

  return (
    <View style={styles.container}>
      <View style={styles.bannerShell}>
        <LinearGradient
          colors={["#F3E2CF", "#E7D0B7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.banner, { aspectRatio: bannerAspectRatio }]}
        >
        {/* Background Image */}
        <Image
          source={currentBannerImage}
          style={styles.backgroundImage}
          resizeMode="contain"
          onError={() =>
            setFailedImages((prev) => ({ ...prev, [currentImageIndex]: true }))
          }
        />

        <LinearGradient
          colors={["rgba(46, 28, 17, 0.06)", "rgba(46, 28, 17, 0.22)"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.imageTint}
        />

        {/* Image Indicators */}
        <View style={styles.indicators}>
          {bannerImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentImageIndex(index)}
              activeOpacity={0.8}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  bannerShell: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#50311E",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  banner: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6E8D8",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
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

  detailsContainer: {
    alignItems: "flex-end",
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
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  activeIndicator: {
    backgroundColor: "#FFFFFF",
    width: 28,
    height: 9,
  },
});

export default PromoBanner;
