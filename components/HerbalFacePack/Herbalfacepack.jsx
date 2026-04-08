import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from "../context/CartContext";

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const CARD_WIDTH = 160;

const Herbalfacepack = () => {
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const { addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${PRODUCTS_API}?nocache=${Date.now()}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("API Error:", err);
      }
    };
    fetchProducts();
  }, []);

  /** ✅ SAFE FILTER - Fix the condition */
  const herbalProducts = products
    .filter((p) => {
      // Handle undefined/null case
      if (!p || !p.Herbalfacepack) return false;
      
      // Convert to string and check for "yes" (case-insensitive)
      const herbalValue = String(p.Herbalfacepack).trim().toLowerCase();
      return herbalValue === "yes";
    })
    .slice(0, 6);

  // Debug: Check what we're filtering
  console.log("Total products:", products.length);
  console.log("Herbal products found:", herbalProducts.length);
  console.log("Herbal products:", herbalProducts);

  if (herbalProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No herbal face packs available</Text>
      </View>
    );
  }

  const handleAdd = (product) => {
    setAddedItems((p) => ({ ...p, [product.name]: true }));
    setQuantities((q) => ({ ...q, [product.name]: 1 }));
    addToCart(product);
  };

  const changeQty = (product, value) => {
    const qty = Math.max(0, (quantities[product.name] || 0) + value);
    setQuantities((q) => ({ ...q, [product.name]: qty }));
    updateQuantity(product.name, qty);
    if (qty === 0) setAddedItems((p) => ({ ...p, [product.name]: false }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Herbal Face Packs</Text>
          <Text style={styles.subtitle}>Natural & Chemical-free</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() =>
            navigation.navigate("Products", {
              title: "Herbal Face Packs",
              products: herbalProducts,
            })
          }
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {herbalProducts.map((item) => (
          <View key={item.id} style={styles.productCard}>
            {/* Discount Badge */}
            {item.save && item.save > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>Save ₹{item.save}</Text>
              </View>
            )}

            {/* Wishlist Button */}
            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={() => toggleWishlist(item)}
            >
              <Ionicons
                name={isInWishlist(item.name) ? "heart" : "heart-outline"}
                size={18}
                color="#e11d48"
              />
            </TouchableOpacity>

            {/* Product Image - FIXED: Handle both require and uri */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", { product: item })
              }
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={
                    typeof item.image === 'string' 
                      ? { uri: item.image }
                      : item.image?.uri 
                        ? { uri: item.image.uri }
                        : item.image 
                  }
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>

            {/* Product Info */}
            <View style={styles.productInfo}>
              {/* Category */}
              {item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}

              {/* Product Name */}
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.salePrice}>₹{item.sale_price}</Text>
                {item.regular_price > item.sale_price && (
                  <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
                )}
              </View>

              {/* Quantity/Add Button */}
              <View style={styles.quantitySection}>
                {addedItems[item.name] ? (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => changeQty(item, -1)}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>
                      {quantities[item.name] || 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => changeQty(item, 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAdd(item)}
                  >
                    <Ionicons name="cart-outline" size={14} color="#fff" />
                    <Text style={styles.addBtnText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
    marginRight: 4,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingRight: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginRight: 14,
    backgroundColor: '#fff',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#F9FAFB',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
    paddingTop: 8,
  },
  category: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    height: 36,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 6,
  },
  regularPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  quantitySection: {
    minHeight: 36,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 20,
    textAlign: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 20,
    paddingVertical: 10,
    gap: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Herbalfacepack;