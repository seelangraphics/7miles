import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from '../context/CartContext';

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const CARD_WIDTH = 160; // Fixed card width
const CARD_MARGIN = 14;
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN;

const Routineproduct = () => {
  const [products, setProducts] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigation = useNavigation();
  const { addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();

  // Refs for each horizontal scroll
  const facePowderRef = useRef(null);
  const nightRoutineRef = useRef(null);
  const hairPackRef = useRef(null);

  // Current indices for auto-scroll
  const currentIndices = useRef({
    facePowder: 0,
    nightRoutine: 0,
    hairPack: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${PRODUCTS_API}?nocache=${Date.now()}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category
  const facePowderProducts = products.filter(product => product.Facepowder === "yes").slice(0, 6);
  const nightRoutineProducts = products.filter(product => product.nightroutine === "yes").slice(0, 6);
  const hairPackProducts = products.filter(product => product.hairpack === "yes").slice(0, 6);

  // Auto-scroll effect
  useEffect(() => {
    const intervals = {};

    // Auto-scroll for Face Powder
    if (facePowderProducts.length > 1 && facePowderRef.current) {
      intervals.facePowder = setInterval(() => {
        const currentIndex = currentIndices.current.facePowder;
        const nextIndex = (currentIndex + 1) % facePowderProducts.length;

        facePowderRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0.5
        });

        currentIndices.current.facePowder = nextIndex;
      }, 3000); // 3 seconds
    }

    // Auto-scroll for Night Routine
    if (nightRoutineProducts.length > 1 && nightRoutineRef.current) {
      intervals.nightRoutine = setInterval(() => {
        const currentIndex = currentIndices.current.nightRoutine;
        const nextIndex = (currentIndex + 1) % nightRoutineProducts.length;

        nightRoutineRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0.5
        });

        currentIndices.current.nightRoutine = nextIndex;
      }, 3200); // 3.2 seconds (slightly offset)
    }

    // Auto-scroll for Hair Pack
    if (hairPackProducts.length > 1 && hairPackRef.current) {
      intervals.hairPack = setInterval(() => {
        const currentIndex = currentIndices.current.hairPack;
        const nextIndex = (currentIndex + 1) % hairPackProducts.length;

        hairPackRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0.5
        });

        currentIndices.current.hairPack = nextIndex;
      }, 3400); // 3.4 seconds (slightly offset)
    }

    // Cleanup intervals
    return () => {
      Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [facePowderProducts, nightRoutineProducts, hairPackProducts]);

  const handleAddToCart = (product) => {
    setAddedItems(prev => ({ ...prev, [product.name]: true }));
    setQuantities(prev => ({ ...prev, [product.name]: 1 }));
    addToCart(product);
  };

  const handleQuantityChange = (product, change) => {
    const currentQty = quantities[product.name] || 0;
    const newQty = Math.max(0, currentQty + change);

    setQuantities(prev => ({ ...prev, [product.name]: newQty }));
    updateQuantity(product.name, newQty);

    if (newQty === 0) {
      setAddedItems(prev => ({ ...prev, [product.name]: false }));
    }
  };

  const handleWishlistToggle = (product, e) => {
    if (e) e.stopPropagation();
    toggleWishlist(product);
  };

  // Don't show if no products in any category
  if (facePowderProducts.length === 0 && nightRoutineProducts.length === 0 && hairPackProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Routine Products</Text>
          <Text style={styles.mainSubtitle}>Specialized collections for your daily routine</Text>
        </View>
      </View>

      {/* Category Sections */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Face Powder Section */}
        {facePowderProducts.length > 0 && (
          <CategorySection
            title="Face Powder"
            subtitle="Specialized face care products"
            products={facePowderProducts}
            addedItems={addedItems}
            quantities={quantities}
            onAdd={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            onWishlistToggle={handleWishlistToggle}
            isInWishlist={isInWishlist}
            navigation={navigation}
            flatListRef={facePowderRef}
            currentIndices={currentIndices}
            categoryKey="facePowder"
          />
        )}

        {/* Night Routine Section */}
        {nightRoutineProducts.length > 0 && (
          <CategorySection
            title="Night Routine"
            subtitle="Products for your night care routine"
            products={nightRoutineProducts}
            addedItems={addedItems}
            quantities={quantities}
            onAdd={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            onWishlistToggle={handleWishlistToggle}
            isInWishlist={isInWishlist}
            navigation={navigation}
            flatListRef={nightRoutineRef}
            currentIndices={currentIndices}
            categoryKey="nightRoutine"
          />
        )}

        {/* Hair Pack Section */}
        {hairPackProducts.length > 0 && (
          <CategorySection
            title="Hair Pack"
            subtitle="Specialized hair care treatments"
            products={hairPackProducts}
            addedItems={addedItems}
            quantities={quantities}
            onAdd={handleAddToCart}
            onQuantityChange={handleQuantityChange}
            onWishlistToggle={handleWishlistToggle}
            isInWishlist={isInWishlist}
            navigation={navigation}
            flatListRef={hairPackRef}
            currentIndices={currentIndices}
            categoryKey="hairPack"
          />
        )}
      </ScrollView>
    </View>
  );
};

// Category Section Component with Animated FlatList
const CategorySection = ({
  title,
  subtitle,
  products,
  addedItems,
  quantities,
  onAdd,
  onQuantityChange,
  onWishlistToggle,
  isInWishlist,
  navigation,
  flatListRef,
  currentIndices,
  categoryKey
}) => {
  // Track viewable items for auto-scroll
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      currentIndices.current[categoryKey] = viewableItems[0].index;
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  return (
    <View style={styles.categorySection}>
      {/* Category Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

      </View>

      {/* Animated Horizontal Products List */}
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        data={products}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            quantity={quantities[item.name] || 0}
            isAdded={addedItems[item.name]}
            isWishlisted={isInWishlist(item.name)}
            onAdd={() => onAdd(item)}
            onQuantityChange={(change) => onQuantityChange(item, change)}
            onWishlistToggle={(e) => onWishlistToggle(item, e)}
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
            category={title}
          />
        )}
        keyExtractor={(item, index) => `${categoryKey}-${item.name}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={TOTAL_CARD_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: TOTAL_CARD_WIDTH,
          offset: TOTAL_CARD_WIDTH * index,
          index,
        })}
      />
    </View>
  );
};

// Product Card Component
const ProductCard = ({
  product,
  index,
  quantity,
  isAdded,
  isWishlisted,
  onAdd,
  onQuantityChange,
  onWishlistToggle,
  onPress,
  category
}) => {
  const discount = Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
  const colors = ['#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea'];
  const bgColor = colors[index % colors.length];

  return (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Discount Badge */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>Save ₹{product.save}.00</Text>
      </View>

      {/* Wishlist Icon */}
      <TouchableOpacity
        style={styles.wishlistBtn}
        onPress={(e) => {
          e.stopPropagation();
          onWishlistToggle(e);
        }}
      >
        <Ionicons
          name={isWishlisted ? "heart" : "heart-outline"}
          size={16}
          color={isWishlisted ? "#EF4444" : "#666"}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof product.image === 'string' ? { uri: product.image } : product.image}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.category} numberOfLines={1}>{category}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>₹{product.sale_price}</Text>
          <Text style={styles.regularPrice}>₹{product.regular_price}</Text>
        </View>

        {/* Cart Actions */}
        {isAdded ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={(e) => {
                e.stopPropagation();
                onQuantityChange(-1);
              }}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={(e) => {
                e.stopPropagation();
                onQuantityChange(1);
              }}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <Ionicons name="cart" size={14} color="#fff" />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  // Main Container
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 8,
  },

  // Main Header
  mainHeader: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Category Section
  categorySection: {
    marginBottom: 30,
  },

  // Header for each category
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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

  // Scroll Content
  scrollContent: {
    paddingRight: 16,
  },

  // Product Card
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginRight: CARD_MARGIN,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  // Discount Badge
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EF4444',
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

  // Wishlist Button
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },

  // Image Container
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.75,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },

  // Product Info
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

  // Quantity Controls
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

  // Add Button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
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

export default Routineproduct;