import React, { useState, useMemo, useEffect } from 'react';
import Constants from 'expo-constants';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchModal from '../Nav/Search/SearchModal';
import { useCart } from '../context/CartContext';
import { Navigation } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Get the URLs from environment variables
const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;

const TopBar = ({
  title,
  onBackPress,
  onSearchPress: externalOnSearchPress,
  onCartPress,
  onWishlistPress,
  cartItemsCount: propCartItemsCount,
  wishlistItemsCount: propWishlistItemsCount, // Add prop for wishlist count
  showBackButton = true,
  onCategoryPress,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation()
  
  // Use cart context inside the component
  const { getCartItemsCount, wishlistItems } = useCart(); // Get wishlistItems
  
  // Calculate cart items count - use prop if provided, otherwise use context
  const cartItemsCount = propCartItemsCount !== undefined 
    ? propCartItemsCount 
    : getCartItemsCount();
  
  // Calculate wishlist items count - use prop if provided, otherwise use context
  const wishlistItemsCount = propWishlistItemsCount !== undefined 
    ? propWishlistItemsCount 
    : (wishlistItems ? wishlistItems.length : 0);

  const mainCategories = ['All', 'Hair Care', 'Skin Care', 'Body Care', 'Wellness & Edibles'];

  // Fetch products from AWS
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
      
      // Transform the data to match the expected format
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (typeof data === 'object') {
        // If it's a single object, convert to array
        setProducts([data]);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      Alert.alert('Error', 'Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (String(product.benefits || '').toLowerCase()).includes(query) ||
        (product.description?.toLowerCase() || '').includes(query) ||
        (product.quantity?.toLowerCase() || '').includes(query);

      // If a category is selected (other than 'All'), filter by category too
      if (activeCategory !== 'All') {
        return matchesSearch && product.category === activeCategory;
      }

      return matchesSearch;
    });
  }, [searchQuery, activeCategory, products]);

  const handleSearchPress = () => {
    setSearchVisible(true);
    // Call external handler if provided
    if (externalOnSearchPress) {
      externalOnSearchPress();
    }
  };

  const handleWishlistPress = () => {
    navigation.navigate('Wishlist');
    // Call external handler if provided
    if (onWishlistPress) {
      onWishlistPress();
    }
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    onCategoryPress?.(category, 'main');
  };

  const handleRetry = () => {
    fetchProducts();
  };

  // Loading component
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#000" />
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  // Error component
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load products</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>

          {/* Back Button */}
          <View style={styles.leftBox}>
            {showBackButton && (
              <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={26} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          {/* Title */}
          <View style={styles.centerBox}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
          </View>

          {/* Right Icons */}
          <View style={styles.rightBox}>

            <TouchableOpacity onPress={handleSearchPress} style={styles.iconBox}>
              <Ionicons name="search-outline" size={22} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWishlistPress} style={styles.iconBox}>
              <View style={styles.iconWithBadge}>
                <Ionicons 
                  name={wishlistItemsCount > 0 ? "heart" : "heart-outline"} 
                  size={22} 
                  color={wishlistItemsCount > 0 ? "#EF4444" : "#000"}
                />
                {wishlistItemsCount > 0 && (
                  <View style={[styles.badge, styles.wishlistBadge]}>
                    <Text style={styles.badgeText}>
                      {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconBox}>
              <View style={styles.iconWithBadge}>
                <Ionicons name="cart-outline" size={22} color="#000" />
                {cartItemsCount > 0 && (
                  <View style={[styles.badge, styles.cartBadge]}>
                    <Text style={styles.badgeText}>
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

          </View>

        </View>
      </View>

      {/* Loading or Error State - only show when search is active */}
      {searchVisible && loading && renderLoading()}
      {searchVisible && error && renderError()}

      {/* Search Modal */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        filteredProducts={filteredProducts}
        onCategoryPress={handleCategorySelect}
        categories={mainCategories}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </View>
  );
};
export default TopBar;

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,

    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  leftBox: {
    width: 50,
    height: 42,
    justifyContent: "center",
  },

  backBtn: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#f4f5f7",
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 6,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.3,
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 38,
    height: 38,
    marginLeft: 14,
    borderRadius: 50,
    backgroundColor: "#f4f5f7",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#ff3c3c",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  // Loading and Error styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  errorText: {
    fontSize: 14,
    color: '#ff3c3c',
    marginRight: 10,
  },

  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#f4f5f7',
    borderRadius: 4,
  },

  retryText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  iconBox: {
    padding: 4,
    position: 'relative',
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartBadge: {
    minWidth: 18,
    height: 18,
  },
  wishlistBadge: {
    minWidth: 16,
    height: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },

});