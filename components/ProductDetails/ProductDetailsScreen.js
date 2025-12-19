import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { GoldenDrop } from "./GoldenDrop";
import ProductFeatures from "./Features";
import ProductImageSlider from "./ProductImageSlider";
import { useCart } from "../context/CartContext";

// Get the API URL from environment variables
const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const { addToCart, updateQuantity, getItemQuantity, isInCart, cartItems } =
    useCart();

  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = {
    primary: "black",
    secondary: "#10B981",
    accent: "#F59E0B",
    dark: "#1F2937",
    light: "#6B7280",
    border: "#E5E7EB",
    background: "#F9FAFB",
    white: "#FFFFFF",
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(PRODUCTS_API);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      let productsArray = data;
      if (
        !Array.isArray(data) &&
        data.products &&
        Array.isArray(data.products)
      ) {
        productsArray = data.products;
      }

      // Ensure each product has proper image format
      const formattedProducts = productsArray.map((item) => ({
        ...item,
        // Ensure image is properly formatted for Image component
        image:
          typeof item.image === "string" ? { uri: item.image } : item.image,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  const isItemInCart = isInCart(product.name);

  const showQuantityControls = isItemInCart || hasAddedToCart;


  useEffect(() => {
    if (isItemInCart) {
      const cartQuantity = getItemQuantity(product.name);
      setQuantity(cartQuantity);
      setHasAddedToCart(true);
    }
  }, [isItemInCart, product.name, getItemQuantity]);

  
  const handleQuantityChange = (change) => {
    const newQty = Math.max(1, quantity + change);
    setQuantity(newQty);

    if (showQuantityControls) {
      updateQuantity(product.name, newQty);
    }
  };

  const handleAddToCart = () => {
    if (showQuantityControls) {

      return;
    }


    addToCart({ ...product, cartQty: quantity });
    setHasAddedToCart(true); 
  };


  const handleBuyNow = () => {
    // Add product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigation.navigate("Cart");
  };

  const sliderImages = [
    typeof product.image === "string" ? { uri: product.image } : product.image,
    ...(product.sub_images || []).map((img) =>
      typeof img === "string" ? { uri: img } : img
    ),
  ].filter(Boolean);

  const similarProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 6);

  // Calculate discount for similar products
  const calculateDiscount = (regularPrice, salePrice) => {
    if (!regularPrice || regularPrice === 0) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  const renderSimilarProduct = ({ item, index }) => {
    const cartItemQuantity = getItemQuantity(item.name);
    const isInCartItem = isInCart(item.name);
    const discount = calculateDiscount(item.regular_price, item.sale_price);
    const colors = [
      "#f3eeea",
      "#f3eeea",
      "#f3eeea",
      "#f3eeea",
      "#f3eeea",
      "#f3eeea",
    ];
    const bgColor = colors[index % colors.length];

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.productCard, { backgroundColor: bgColor }]}
          onPress={() => navigation.push("ProductDetails", { product: item })}
          activeOpacity={0.9}
        >
          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}

          {/* Wishlist Icon */}
          <TouchableOpacity style={styles.wishlistBtn}>
            <Ionicons name="heart-outline" size={16} color="#666" />
          </TouchableOpacity>

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.category} numberOfLines={1}>
              {item.category}
            </Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.salePrice}>₹{item.sale_price}</Text>
              <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
            </View>

            {/* Add to Cart / Quantity Controls */}
            {isInCartItem ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(item.name, cartItemQuantity - 1)
                  }
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{cartItemQuantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    updateQuantity(item.name, cartItemQuantity + 1)
                  }
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addToCart(item)}
                activeOpacity={0.8}
              >
                <Ionicons name="cart" size={14} color="#fff" />
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRetry = () => {
    fetchProducts();
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Failed to load products</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={similarProducts}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        numColumns={2}
        renderItem={renderSimilarProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <ProductImageSlider
              images={sliderImages}
              dotColor={COLORS.primary}
            />

            <View style={styles.detailsContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.name}>{product.name}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
              </View>

              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.discountedPrice}>
                    ₹{product.sale_price}
                  </Text>
                  <Text style={styles.originalPrice}>
                    ₹{product.regular_price}
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>
                      Save ₹
                      {product.save ||
                        product.regular_price - product.sale_price}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaInfo}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="cube-outline"
                      size={16}
                      color={COLORS.light}
                    />
                    <Text style={styles.metaText}>
                      Quantity: {product.quantity}
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="pricetag-outline"
                      size={16}
                      color={COLORS.light}
                    />
                    <Text style={styles.metaText}>
                      Category: {product.category}
                    </Text>
                  </View>
                </View>

          
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <View style={styles.descriptionBox}>
                  <Text style={styles.description}>
                    {product.detailed_description ||
                      product.description ||
                      "No description available."}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Benefits</Text>
                <View style={styles.benefitsContainer}>
                  {(Array.isArray(product.benefits)
                    ? product.benefits
                    : []
                  ).map((item, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.secondary}
                      />
                      <Text style={styles.benefitText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <ProductFeatures />
              </View>

              <View style={styles.section}>
                <GoldenDrop />
              </View>

              <View style={styles.similarHeader}>
                <Text style={styles.sectionTitle}>Similar Products</Text>
                {similarProducts.length > 0 && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Categories")}
                  >
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingMoreText}>
                Loading similar products...
              </Text>
            </View>
          ) : (
            <View style={styles.noSimilarProducts}>
              <Ionicons name="cube-outline" size={40} color="#ccc" />
              <Text style={styles.noSimilarText}>
                No similar products found
              </Text>
            </View>
          )
        }
      />
      <View style={styles.bottomBar}>
        {/* Left Section: Add to Cart OR Quantity Controls */}
        <View style={styles.leftSection}>
          {showQuantityControls ? (
            // Quantity Controls (after clicking Add to Cart)
            <View style={styles.quantitySelector}>
      
              <View style={styles.mainQuantityControls}>
                <TouchableOpacity
                  style={styles.mainQtyBtn}
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Text style={styles.mainQtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.mainQuantity}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.mainQtyBtn}
                  onPress={() => handleQuantityChange(1)}
                >
                  <Text style={styles.mainQtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Add to Cart Button (initial state)
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={20} color="#FF4757" />
              <Text style={styles.cartText}>ADD TO CART</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Section: Always Buy Now */}
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={handleBuyNow}
          activeOpacity={0.9}
        >
          <Ionicons name="flash" size={20} color="#fff" />
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
    backgroundColor: "#FFFFFF",
  },

  // List Content
  listContent: {
    paddingBottom: 100,
  },

  // Details Container
  detailsContainer: {
    padding: 20,
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
    lineHeight: 28,
  },
  categoryTag: {
    alignSelf: "flex-start",
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
    flexWrap: "wrap",
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
    fontWeight: "600",
  },

  // Meta Info
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
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

  // Quantity Selector for Main Product
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  mainQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mainQtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  mainQtyBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  mainQuantity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
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
    flexDirection: "row",
    alignItems: "flex-start",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    padding: 8,
  },
  productCard: {
    width: "100%",
    minHeight: 300,
    borderRadius: 16,
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: "hidden",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 2,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  wishlistBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },
  imageContainer: {
    width: "100%",
    height: 160,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    padding: 12,
    paddingTop: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  category: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    height: 36,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 6,
  },
  regularPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 20,
    textAlign: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    gap: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  // Container for left section (Add to Cart OR Quantity controls)
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  // Add to Cart button
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF4757",
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF4757",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  // Quantity controls (replaces Add to Cart button)
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4CAF50",
    marginRight: 8,
  },
  mainQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    padding: 2,
  },
  mainQtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  mainQtyBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mainQuantity: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
  // Buy Now button (always on right)
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4757",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 12,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buyText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  noSimilarProducts: {
    padding: 40,
    alignItems: "center",
  },
  noSimilarText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});
