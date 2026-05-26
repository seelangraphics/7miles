import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from "../context/CartContext";
import TopBar from "../Topbar/Topbar";
import FilterModal from "./Filter";

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const PRODUCTS_IMAGE_API = Constants.expoConfig.extra?.PRODUCTS_IMAGE_API;
const CARD_WIDTH = 160;
const CARD_HEIGHT = 300;

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    addToCart, 
    updateQuantity, 
    getCartItemsCount,
    toggleWishlist,
    isInWishlist 
  } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Best Selling");
  const [activeFilters, setActiveFilters] = useState({});
  const [debugInfo, setDebugInfo] = useState("");
  const [failedCategoryImages, setFailedCategoryImages] = useState({});

  const initialCategory = route.params?.selectedCategory || "";
  
  // Get cart items count
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PRODUCTS_API}?nocache=${Date.now()}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // console.log("First product structure:", data[0]);
        setAllProducts(data);
        
        const allKeys = data.reduce((keys, product) => {
          Object.keys(product).forEach(key => {
            if (!keys.includes(key)) keys.push(key);
          });
          return keys;
        }, []);
        
        console.log("All available keys:", allKeys);
        setDebugInfo(`Available key: ${allKeys.join(", ")}`);
      } else if (data.products && Array.isArray(data.products)) {
        // console.log("First product structure:", data.products[0]);
        setAllProducts(data.products);
      } else {
        setAllProducts([]);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    setAddedItems((prev) => ({ ...prev, [product.name]: true }));
    setQuantities((prev) => ({ ...prev, [product.name]: 1 }));
    addToCart(product);
  };

  // Handle Quantity Change
  const handleQuantityChange = (product, change, e) => {
    if (e) e.stopPropagation();
    const currentQty = quantities[product.name] || 0;
    const newQty = Math.max(0, currentQty + change);

    setQuantities((prev) => ({ ...prev, [product.name]: newQty }));
    updateQuantity(product.name, newQty);

    if (newQty === 0) {
      setAddedItems((prev) => ({ ...prev, [product.name]: false }));
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = (product, e) => {
    if (e) e.stopPropagation();
    toggleWishlist(product);
  };

  // Categories
  const categories = [...new Set(allProducts.map((item) => item.category))];
  
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (allProducts.length > 0) {
      const categories = [...new Set(allProducts.map((item) => item.category))];
      
      let defaultCategory = "";
      
      if (initialCategory && categories.includes(initialCategory)) {
        defaultCategory = initialCategory;
      } else if (categories.includes("Hair Care")) {
        defaultCategory = "Hair Care";
      } else if (categories.length > 0) {
        defaultCategory = categories[0];
      }
      
      setSelectedCategory(defaultCategory);
    }
  }, [allProducts, initialCategory]);

  // Products in selected category
  const categoryProducts = useMemo(() => {
    return allProducts.filter(item => item.category === selectedCategory);
  }, [allProducts, selectedCategory]);

  
  const filteredProducts = useMemo(() => {
    console.log("Applying filters:", activeFilters);
    console.log("Total products in category:", categoryProducts.length);
    
    let result = [...categoryProducts];

    // Apply brand filter
    if (activeFilters.brand && activeFilters.brand.length > 0) {
      result = result.filter(product => {
        const brand = product.brand || product.Brand || product.product_brand;
        return brand && activeFilters.brand.includes(brand);
      });
      console.log("After brand filter:", result.length);
    }

    // Apply hair type filter
    if (activeFilters.hairType && activeFilters.hairType.length > 0) {
      result = result.filter(product => {
        const hairType = product.hair_type || product.hairType || product.hair;
        return hairType && activeFilters.hairType.includes(hairType);
      });
      console.log("After hair type filter:", result.length);
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      result = result.filter(product => {
        const price = product.sale_price || product.price || 0;
        return price >= min && price <= max;
      });
      console.log("After price filter:", result.length);
    }

    // Apply discount filter
    if (activeFilters.discount && activeFilters.discount.length > 0) {
      result = result.filter(product => {
        const regularPrice = product.regular_price || 0;
        const salePrice = product.sale_price || 0;
        if (regularPrice === 0) return false;
        
        const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
        return activeFilters.discount.some(d => d <= discount);
      });
      console.log("After discount filter:", result.length);
    }

    // Apply sorting
    switch (selectedSort) {
      case "Price (Low to High)":
        result.sort((a, b) => (a.sale_price || 0) - (b.sale_price || 0));
        break;
      case "Price (High to Low)":
        result.sort((a, b) => (b.sale_price || 0) - (a.sale_price || 0));
        break;
      case "A-Z":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "Z-A":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        // Keep original order
        break;
    }

    console.log("Final filtered products:", result.length);
    return result;
  }, [categoryProducts, activeFilters, selectedSort]);

  const categoryImages = {
    "Hair Care": {
      remote: PRODUCTS_IMAGE_API
        ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_4.png` }
        : null,
    },
    "Skin Care": {
      remote: PRODUCTS_IMAGE_API
        ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_1.png` }
        : null,
    },
    "Body Care": {
      remote: PRODUCTS_IMAGE_API
        ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_2.png` }
        : null,
    },
    "Wellness & Edibles": {
      remote: PRODUCTS_IMAGE_API
        ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_3.png` }
        : null,
    },
    default: {
      remote: PRODUCTS_IMAGE_API
        ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_4.png` }
        : null,
    },
  };

  const handleApplyFilters = (filters) => {
    console.log("Applying new filters:", filters);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const hasActiveFilters = Object.values(activeFilters).some(
    value => value && (Array.isArray(value) ? value.length > 0 : value !== null)
  );

  // Product Card Component
  const ProductCard = ({ product, index }) => {
    const discount = Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
    const colors = ['#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea'];
    const bgColor = colors[index % colors.length];
    const quantity = quantities[product.name] || 0;
    const isAdded = addedItems[product.name];
    const isWishlisted = isInWishlist(product.name);

    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: bgColor }]}
        onPress={() => navigation.navigate("ProductDetails", { product })}
        activeOpacity={0.9}
      >
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Save ₹{product.save}.00</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.wishlistBtn}
          onPress={(e) => handleWishlistToggle(product, e)}
        >
          <Ionicons 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={16} 
            color={isWishlisted ? "#EF4444" : "#666"}
          />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image 
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>₹{product.sale_price}</Text>
            <Text style={styles.regularPrice}>₹{product.regular_price}</Text>
          </View>

          {isAdded ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={(e) => handleQuantityChange(product, -1, e)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={(e) => handleQuantityChange(product, 1, e)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={(e) => handleAddToCart(product, e)}
            >
              <Ionicons name="cart" size={14} color="#fff" />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!selectedCategory || categories.length === 0) {
    return (
      <>
        <TopBar 
          title="Categories"
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('Cart')}
          onWishlistPress={() => navigation.navigate('Wishlist')}
          cartItemsCount={cartItemsCount}
          showBackButton={true}
        />
        <View style={styles.container}>
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>
              No categories available
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar 
        title="Categories"
        onBackPress={() => navigation.goBack()}
        onCartPress={() => navigation.navigate('Cart')}
        onWishlistPress={() => navigation.navigate('Wishlist')}
        cartItemsCount={cartItemsCount}
        showBackButton={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Categories</Text>
            <Text style={styles.subtitle}>Browse by your preferences</Text>
          </View>
        </View>

        {/* Categories Section - FIXED */}
        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.activeTab,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setActiveFilters({});
                }}
              >
                <View style={styles.categoryImageContainer}>
                  {(() => {
                    const categoryImageSet = categoryImages[category] || categoryImages.default;
                    const categoryImageSource =
                      failedCategoryImages[category] ? null : categoryImageSet.remote;

                    if (!categoryImageSource) {
                      return null;
                    }

                    return (
                  <Image
                    source={categoryImageSource}
                    style={[
                      styles.categoryImage,
                      selectedCategory === category && styles.activeCategoryImage,
                    ]}
                    onError={() =>
                      setFailedCategoryImages((prev) => ({ ...prev, [category]: true }))
                    }
                  />
                    );
                  })()}
                  {selectedCategory === category && (
                    <View style={styles.activeIndicator} />
                  )}
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeText,
                  ]}
                  numberOfLines={2}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeFilters.brand?.map(brand => (
                <View key={brand} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>Brand: {brand}</Text>
                  <TouchableOpacity onPress={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      brand: prev.brand.filter(b => b !== brand)
                    }));
                  }}>
                    <Ionicons name="close-circle" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
              {activeFilters.hairType?.map(type => (
                <View key={type} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>Type: {type}</Text>
                  <TouchableOpacity onPress={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      hairType: prev.hairType.filter(t => t !== type)
                    }));
                  }}>
                    <Ionicons name="close-circle" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
              {activeFilters.priceRange && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterText}>
                    Price: ₹{activeFilters.priceRange.min} - ₹{activeFilters.priceRange.max}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setActiveFilters(prev => ({ ...prev, priceRange: null }));
                  }}>
                    <Ionicons name="close-circle" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        <View style={styles.productsHeader}>
          <View style={styles.productsHeaderContent}>
            <Text style={styles.productsTitle}>{selectedCategory}</Text>
   
          </View>
          <View style={styles.filterSortRow}>
            <TouchableOpacity
              style={styles.filterSortButton}
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons name="filter-outline" size={18} color="#000" />
              <Text style={styles.filterSortText}>Filter</Text>
              {hasActiveFilters && <View style={styles.filterIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterSortButton}
              onPress={() => setSortVisible(true)}
            >
              <Ionicons name="swap-vertical-outline" size={18} color="#000" />
              <Text style={styles.filterSortText}>Sort</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredProducts.length > 0 ? (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsGrid}
          >
            <View style={styles.productsRow}>
              {filteredProducts.map((product, index) => (
                <View key={`${product.id || product.name}-${index}`} style={styles.productColumn}>
                  <ProductCard product={product} index={index} />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noProductsContainer}>
            <Ionicons name="cube-outline" size={60} color="#ccc" />
            <Text style={styles.noProductsText}>
              {hasActiveFilters ? "No products match your filters" : "No products found"}
            </Text>
            <Text style={styles.noProductsSubtext}>
              {hasActiveFilters ? "Try adjusting your filters" : "Check back soon"}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Filter Modal */}
        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={handleApplyFilters}
          products={categoryProducts}
          activeFilters={activeFilters}
        />

        {/* Sort Modal */}
        <Modal visible={sortVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalOverlayTouchable}
              onPress={() => setSortVisible(false)}
            />
            <View style={styles.sortModalContent}>
              <Text style={styles.modalTitle}>Sort by</Text>
              {[
                "Best Selling",
                "Featured",
                "Price (Low to High)",
                "Price (High to Low)",
                "A-Z",
                "Z-A",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => {
                    setSelectedSort(option);
                    setSortVisible(false);
                  }}
                >
                  <View style={styles.radioCircle}>
                    {selectedSort === option && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedSort === option && styles.optionTextSelected
                  ]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  debugContainer: {
    backgroundColor: '#ffeb3b',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 10,
    color: '#333',
  },
  
  // Header
  header: {
    paddingTop: -20,
    // paddingHorizontal: 16,
    // paddingBottom: 12,

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

  // Categories Section - FIXED
  categoriesSection: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoriesScroll: {
    height: 105, // Fixed height to ensure all content shows
        backgroundColor:"#f3eeea"
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryTab: {
    alignItems: 'center',
    marginRight: 22,
    width: 68,
    height: 85,
    justifyContent: 'space-between',
  },
  categoryImageContainer: {
    position: 'relative',
    marginBottom: 8,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  activeCategoryImage: {
    borderColor: '#000',
    borderWidth: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  categoryText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    height: 28,
    width: '100%',
  },
  activeText: {
    color: '#000',
    fontWeight: '700',
  },

  // Active Filters
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterText: {
    fontSize: 12,
    color: '#374151',
    marginRight: 6,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  // Products Header
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  productsHeaderContent: {
    flex: 1,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  productsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterSortRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterSortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    position: 'relative',
  },
  filterSortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  filterIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Products Grid
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -7,
  },
  productColumn: {
    width: '50%',
    paddingHorizontal: 7,
    marginBottom: 14,
  },

  // Product Card Styles
  productCard: {
    width: '100%',
    minHeight: CARD_HEIGHT,
    borderRadius: 16,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
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
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
    paddingTop: 8,
    flex: 1,
    justifyContent: 'space-between',
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

  // No Products
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noProductsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  noProductsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  clearFiltersButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Sort Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  sortModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#000',
  },
});

export default CategoriesScreen;
