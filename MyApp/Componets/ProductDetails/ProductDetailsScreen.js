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

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  // show 6 similar products
  const similarProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 6);

  const renderSimilarProduct = ({ item }) => (
     <View style={styles.cardContainer}>
               <TouchableOpacity
                 style={styles.productCard}
                 onPress={() =>
                   navigation.navigate("ProductDetails", { product: item })
                 }
               >
                 {/* Image Container - Covering half the card */}
                 <View style={styles.imageContainer}>
                   <Image source={item.image} style={styles.productImage} />
                 </View>
   
                 {/* Content Container */}
                 <View style={styles.contentContainer}>
                   {/* Name and Wishlist Row */}
                   <View style={styles.nameRow}>
                     <Text style={styles.productName} numberOfLines={2}>
                       {item.name}
                     </Text>
                     <TouchableOpacity style={styles.wishlistIcon}>
                       <Ionicons name="heart-outline" size={18} color="#666" />
                     </TouchableOpacity>
                   </View>
   
                   {/* Price Container */}
                   <View style={styles.priceContainer}>
                     <View style={styles.priceContent}>
                       {/* Price Badge */}
                       <View style={styles.priceBadge}>
                         <Text style={styles.discountedPrice}>
                           ₹{item.sale_price}
                         </Text>
                         <Text style={styles.originalPrice}>
                           ₹{item.regular_price}
                         </Text>
                       </View>
   
                       {/* Save amount with animation */}
                       <TouchableOpacity
                         style={styles.saveBadge}
                         activeOpacity={0.8}
                       >
                         <Text style={styles.offerText}>Save ₹{item.save}</Text>
                       </TouchableOpacity>
                     </View>
                   </View>
   
                   {/* Add to cart button with icon */}
                   <TouchableOpacity style={styles.addButton}>
                     <Ionicons name="cart" size={16} color="#fff" />
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
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Product Image */}
            <Image source={product.image} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>

            <View style={styles.priceContainer}>
              <View style={styles.priceContent1}>
                {/* Price Badge */}
                <View style={styles.priceBadge}>
                     <Text style={styles.originalPrice}>
                   MRP₹{product.regular_price}
                  </Text>
                  <Text style={styles.discountedPrice}>₹{product.sale_price}</Text>
               
                </View>

                {/* Save amount with animation */}
                <TouchableOpacity style={styles.saveBadge} activeOpacity={0.8}>
                  <Text style={styles.offerText}>Save ₹{product.save}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.sectionTitle}>
              Quantity: {product.quantity}
            </Text>
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

            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
              Similar Products
            </Text>
          </View>
        }
      />

      {/* 🧷 Fixed bottom buttons */}
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
  header: { padding: 0, paddingBottom: 0 },
  image: { width: 220, height: 220, borderRadius: 20, alignSelf: "center" },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
  },
  priceWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#888",
    marginRight: 10,
  },
  discountedPrice: { color: "#007AFF", fontWeight: "bold", fontSize: 18 },
  saveBadge: {
    alignSelf: "center",
    backgroundColor: "#E6F8E0",
    padding: 4,
    borderRadius: 5,
    marginTop: 4,
  },
  saveText: { color: "green", fontWeight: "600" },
  
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 8,
    color: "#333",
  },
  description: { color: "#555", fontSize: 14, lineHeight: 20, marginTop: 5 },
  category: { color: "#666", marginTop: 6 },
  flatListContent: { padding: 10, paddingBottom: 100 },

  cardContainer: {
    flex: 1,
    padding: 6,
    maxWidth: "50%",
  },

  cardContainer: {
    flex: 1,
    padding: 6,
    maxWidth: "50%",
  },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    paddingBottom: 10,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    height: 280,
  },

  imageContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    resizeMode: "cover",
  },

  contentContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
    padding: 6,
    backgroundColor: "#f3eeee",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    width: "100%",
  },

  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },

  wishlistIcon: {
    padding: 4,
  },

  // Styles
  priceContainer: {
    marginBottom: 8,
  },

  priceContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  priceContent1: {
    flexDirection: "row",
    alignItems: "center",
    gap:20,
    width: "100%",
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },

  originalPrice: {
    fontSize: 12,
    color: "#6c757d",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },

  discountedPrice: {
    fontSize: 16,
    color: "#2b2d42",
    fontWeight: "bold",
  },

  saveBadge: {
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },

  offerText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  addButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,

    borderRadius: 20,
    width: "100%",
    gap: 6,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  bottomText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  addbottomText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
