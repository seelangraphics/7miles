import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { products } from "../data/7mils_Products";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  // show only first 6 similar products
  const similarProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 6);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Details */}
        <Image source={product.image} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceWrapper}>
            <Text style={styles.originalPrice}>
              MRP ₹{product.regular_price}
            </Text>
            <Text style={styles.discountedPrice}>₹{product.sale_price}</Text>
          </View>
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>
              Save ₹{product.regular_price - product.sale_price}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Quantity : {product.quantity}</Text>

        <Text style={styles.category}>Category: {product.category}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {product.description ||
            "This is a premium-quality product designed to give the best results."}
        </Text>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <Text style={styles.description}>
          {product.benefits ||
            "Helps in maintaining healthy skin and nourishes your body naturally."}
        </Text>
        <Text style={styles.sectionTitle}>Benefits</Text>
        <Text style={styles.description}>
          {product.benefits ||
            "Helps in maintaining healthy skin and nourishes your body naturally."}
        </Text>
        {/* Similar Products */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Similar Products
        </Text>

        <View style={styles.similarContainer}>
          {similarProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.similarCard}
              onPress={() =>
                navigation.push("ProductDetails", { product: item })
              }
            >
              <Image source={item.image} style={styles.similarImage} />
              <Text style={styles.similarName}>{item.name}</Text>
              <Text style={styles.similarPrice}>₹{item.sale_price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Space for bottom buttons so content doesn't get hidden */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={[styles.bottomButton, { backgroundColor: "#d0c9c4" }]}
        >
          <Text style={styles.addbottomText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomButton, { backgroundColor: "#020402f7" }]}
        >
          <Text style={styles.bottomText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { 
    padding: 20, 
    paddingTop: 20,
    paddingBottom: 80, 
  },
  backIcon: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 5,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 4,
    borderColor: "#e3f2fd",
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
  saveBadge: {
    backgroundColor: "rgba(21, 6, 2, 0.27)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  saveText: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 15,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 20,
    textAlign: "justify",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  qtyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  quantityValue: { fontSize: 16, fontWeight: "600", marginHorizontal: 12 },
  category: { fontSize: 16, color: "#555", marginTop: 10, fontWeight: "700" },
  similarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  similarCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  similarImage: { width: "100%", height: 100, borderRadius: 8 },
  similarName: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },
  similarPrice: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 20,
  },

  // 🔽 Fixed Bottom Buttons - Always visible
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fffefcff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  bottomText: {
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  addbottomText: {
    color: "#080505ff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});