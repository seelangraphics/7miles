import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, SafeAreaView } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Your actual product data
const product = {
  "id": 36,
  "name": "ROSE GULKAND",
  "ediblefoods": "yes",
  "sale_price": 120,
  "regular_price": 180,
  "save": 60,
  "category": "Wellness & Edibles",
  "image": "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/Wellnes/w2.webp",
  "sub_images": [
    "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/ProductDetails/Wellness/ROSE-GULKAND-01.webp",
    "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/ProductDetails/Wellness/ROSE-GULKAND-02.webp"
  ],
  "quantity": "250gm",
  "short_benefit": "Improves digestion and cools the body",
  "benefits": [
    "Natural Body Coolant – Helps reduce body heat and soothes acidity",
    "Aids Digestion – Improves gut health and relieves constipation",
    "Rich in Antioxidants – Detoxifies the body and boosts immunity",
    "Enhances Skin Glow – Purifies the blood, promoting clear and radiant skin",
    "Relieves Stress & Fatigue – Acts as a natural mood enhancer"
  ],
  "description": "Sweet rose preserve made from fresh petals.",
  "detailed_description": "Indulge in the rich, aromatic taste of Rose Gulkand, a traditional Ayurvedic blend made from fresh, handpicked rose petals and natural sweeteners. Known for its cooling properties, this delicious and nutritious preserve is perfect for overall health and wellness.",
  "free_from": [
    "Artificial colors",
    "Preservatives",
    "Chemicals"
  ],
  "usage_notes": [
    "Consume 1–2 tsp daily after meals or as desired.",
    "Store in a cool, dry place."
  ],
  "suitable_for": [
    "Digestive health",
    "Skin glow",
    "Stress relief"
  ]
};

const Adbanner = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const navigation = useNavigation();

  const handleProductPress = () => {
    // Prepare product object with all required fields
    const productDetails = {
      id: product.id.toString(),
      name: product.name,
      title: product.name,
      quantity: product.quantity,
      image: { uri: product.image },
      sale_price: product.sale_price,
      regular_price: product.regular_price,
      category: product.category,
      brand: "7miles",
      benefits: product.short_benefit,
      detailed_description: product.detailed_description,
      save: product.save,
      // Include all original data
      ...product,
      // Additional fields that might be expected
      thumbnail: product.image,
      hair_type: "N/A",
      hairType: "N/A",
      Brand: "7miles",
      Category: product.category,
      Benefits: product.short_benefit
    };

    if (navigation) {
      navigation.navigate("ProductDetails", { product: productDetails });
    } else {
      Alert.alert('Error', 'Navigation not available');
    }
  };

  // Calculate price display
  const priceDisplay = `₹${product.sale_price}`;
  const originalPriceDisplay = product.regular_price ? `₹${product.regular_price}` : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Section */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/banners/b.mp4" }}
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
          onPress={handleProductPress}
          style={styles.shopButton}
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
  productTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  /* Product Name */
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },

  /* Product Description */
  productDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 6,
  },

  /* Price Row */
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    flexWrap: "wrap",
  },

  /* Sale Price */
  salePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a8f3c", // green
    marginRight: 8,
  },

  /* Original Price */
  regularPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },

  /* Save Amount */
  saveText: {
    fontSize: 12,
    color: "#d32f2f",
    fontWeight: "600",
    backgroundColor: "#fdecea",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  /* Quantity */
  quantityText: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
    marginBottom: 6,
  },

  /* Benefits */
  benefitsText: {
    fontSize: 13,
    color: "#2e7d32",
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default Adbanner;