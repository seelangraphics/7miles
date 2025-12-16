import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { products } from "../data/7mils_Products";
import { GoldenDrop } from "./GoldenDrop";
import ProductFeatures from "./Features";
import ProductImageSlider from "./ProductImageSlider";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  // Color Palette (enhanced for better visual hierarchy)
  const COLORS = {
    primary: "black",     // Professional blue for CTAs
    secondary: "#10B981",   // Green for savings/success
    accent: "#F59E0B",      // Amber for highlights
    dark: "#1F2937",        // Charcoal for main text
    light: "#6B7280",       // Gray for secondary text
    border: "#E5E7EB",      // Light borders
    background: "#F9FAFB",  // Light background
    white: "#FFFFFF",
  };

  // Combine main image + sub images
  const sliderImages = [
    product.image,
    ...(product.sub_images || []),
  ];

  const similarProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 6);

  const renderSimilarProduct = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.push("ProductDetails", { product: item })
        }
        activeOpacity={0.9}
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.productImage} />
        </View>

        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>₹{item.sale_price}</Text>
            <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
          </View>

          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <Ionicons name="cart" size={14} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={similarProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderSimilarProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* IMAGE SLIDER */}
            <ProductImageSlider
              images={sliderImages}
              dotColor={COLORS.primary}
            />

            {/* PRODUCT DETAILS */}
            <View style={styles.detailsContainer}>
              {/* Product Title & Category */}
              <View style={styles.titleSection}>
                <Text style={styles.name}>{product.name}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
              </View>

              {/* Price Section with Better Visual Hierarchy */}
              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>₹{product.sale_price}</Text>
                  <Text style={styles.originalPrice}>₹{product.regular_price}</Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>
                      Save ₹{product.save}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaInfo}>
                  <View style={styles.metaItem}>
                    <Ionicons name="cube-outline" size={16} color={COLORS.light} />
                    <Text style={styles.metaText}>Quantity: {product.quantity}</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Ionicons name="pricetag-outline" size={16} color={COLORS.light} />
                    <Text style={styles.metaText}>Category: {product.category}</Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.description}>
                    {product.detailed_description}
                  </Text>
                </View>
              </View>

              {/* Benefits */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Benefits</Text>
                <View style={styles.benefitsContainer}>
                  {product.benefits.map((item, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.secondary} />
                      <Text style={styles.benefitText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Features */}
              <View style={styles.section}>
                <ProductFeatures />
              </View>

              {/* Golden Drop */}
              <View style={styles.section}>
                <GoldenDrop />
              </View>

              {/* Similar Products Header */}
              <View style={styles.similarHeader}>
                <Text style={styles.sectionTitle}>Similar Products</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />

      {/* ENHANCED BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.cartBtn]}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomButton, styles.buyBtn]}
          activeOpacity={0.9}
        >
          <Ionicons name="flash" size={20} color={COLORS.white} />
          <Text style={styles.buyText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  // List Content
  listContent: {
    paddingBottom: 100
  },

  // Details Container
  detailsContainer: {
    padding: 20
  },

  // Title Section
  titleSection: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 28
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: "black",
    fontSize: 12,
    fontWeight: "600",
  },

  // Price Section
  priceSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#6B7280",
    fontSize: 16,
  },
  discountedPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },
  saveBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600"
  },

  // Meta Info
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 14,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },

  // Description
  descriptionBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
  },
  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },

  // Benefits
  benefitsContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  // Similar Products Header
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },

  // Similar Products Cards
  cardContainer: {
    flex: 1,
    padding: 8
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  salePrice: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1F2937"
  },
  regularPrice: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
    fontSize: 13,
  },
  addButton: {
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  bottomButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    bottom: 30,
  },
  cartBtn: {
    backgroundColor: "#EFF6FF",
    marginRight: 12,
  },
  buyBtn: {
    backgroundColor: "black",
  },
  cartText: {
    fontWeight: "700",
    fontSize: 15,
    color: "black"
  },
  buyText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15
  },
});