import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import { products } from "../data/7mils_Products";
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Routineproduct = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const flatListRefs = useRef({});
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndices = useRef({});

  // Cart context and navigation
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart, getCartItemsCount } = useCart();
  const navigation = useNavigation();

  // Filter products based on selected criteria
  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') {
      return products.filter(product => 
        product.Facepowder === "yes" || 
        product.nightroutine === "yes" || 
        product.hairpack === "yes"
      );
    }
    return products.filter(product => product[selectedFilter] === "yes");
  }, [selectedFilter]);

  // Get products for each category for horizontal sliders
  const categoryProducts = useMemo(() => ({
    Facepowder: products.filter(product => product.Facepowder === "yes"),
    nightroutine: products.filter(product => product.nightroutine === "yes"),
    hairpack: products.filter(product => product.hairpack === "yes"),
  }), []);

  // Auto-scroll for horizontal sliders - moves one product at a time
  useEffect(() => {
    const intervals = {};
    
    Object.keys(categoryProducts).forEach(category => {
      const categoryProductsList = categoryProducts[category];
      if (categoryProductsList.length > 1) {
        intervals[category] = setInterval(() => {
          if (flatListRefs.current[category]) {
            const currentIndex = currentIndices.current[category] || 0;
            const nextIndex = (currentIndex + 1) % categoryProductsList.length;
            
            flatListRefs.current[category].scrollToIndex({
              index: nextIndex,
              animated: true,
              viewPosition: 0.5
            });
            
            currentIndices.current[category] = nextIndex;
          }
        }, 3000); // Auto scroll every 3 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [categoryProducts]);

  // Enhanced Add to Cart function with cart context
  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert(
      'Success!',
      `${product.name} added to cart`,
      [
        { 
          text: 'Continue Shopping', 
          style: 'cancel' 
        },
        { 
          text: 'Go to Cart', 
          onPress: () => navigation.navigate('Cart') 
        }
      ]
    );
  };

  // Handle quantity increase
  const handleQuantityIncrease = (productName) => {
    const currentQuantity = getItemQuantity(productName);
    updateQuantity(productName, currentQuantity + 1);
  };

  // Handle quantity decrease
  const handleQuantityDecrease = (productName) => {
    const currentQuantity = getItemQuantity(productName);
    if (currentQuantity === 1) {
      removeFromCart(productName);
    } else {
      updateQuantity(productName, currentQuantity - 1);
    }
  };

  // Handle Buy Now
  const handleBuyNow = (product) => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  // Calculate discount percentage
  const getDiscountPercentage = (regular, sale) => {
    return Math.round(((regular - sale) / regular) * 100);
  };

  // Horizontal Product Card component with cart functionality
  const HorizontalProductCard = ({ item, category }) => {
    const quantity = getItemQuantity(item.name);
    const isInCart = quantity > 0;

    return (
      <View style={styles.horizontalCard}>
        <View style={styles.horizontalImageContainer}>
          <Image source={item.image} style={styles.horizontalProductImage} />
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {category === 'Facepowder' ? 'Face Powder' : 
               category === 'nightroutine' ? 'Night Routine' : 'Hair Pack'}
            </Text>
          </View>

          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {getDiscountPercentage(item.regular_price, item.sale_price)}% OFF
            </Text>
          </View>
        </View>

        <View style={styles.horizontalProductInfo}>
          <Text style={styles.horizontalProductName} numberOfLines={2}>
            {item.name}
          </Text>
          
          <Text style={styles.horizontalCategory}>{item.category}</Text>
          
          <View style={styles.horizontalPriceContainer}>
            <Text style={styles.horizontalSalePrice}>₹{item.sale_price}</Text>
            <Text style={styles.horizontalRegularPrice}>₹{item.regular_price}</Text>
          </View>

          {/* Additional Tags */}
          <View style={styles.horizontalTagsContainer}>
            {item.Newproducts === "yes" && (
              <Text style={styles.newTag}>NEW</Text>
            )}
            {item.bestSeller === "yes" && (
              <Text style={styles.bestSellerTag}>BEST SELLER</Text>
            )}
            {item.Trending === "yes" && (
              <Text style={styles.trendingTag}>TRENDING</Text>
            )}
          </View>

          {/* Cart Actions */}
          <View style={styles.actionButtons}>
            {isInCart ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityDecrease(item.name)}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantity}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityIncrease(item.name)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
            
            {/* Buy Now Button */}
            <TouchableOpacity 
              style={styles.buyNowButton}
              onPress={() => handleBuyNow(item)}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Cart Icon Component
  const CartIcon = () => (
    <TouchableOpacity 
      style={styles.cartIcon}
      onPress={() => navigation.navigate('Cart')}
    >
      <Text style={styles.cartIconText}>
        Cart ({getCartItemsCount()})
      </Text>
    </TouchableOpacity>
  );

  // Horizontal Slider Section
  const HorizontalSliderSection = ({ category }) => {
    const products = categoryProducts[category];
    const categoryTitle = category === 'Facepowder' ? 'Face Powder' : 
                         category === 'nightroutine' ? 'Night Routine' : 'Hair Pack';

    if (!products || products.length === 0) return null;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      if (viewableItems.length > 0) {
        currentIndices.current[category] = viewableItems[0].index;
      }
    }).current;

    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50
    }).current;

    return (
      <View style={styles.horizontalSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{categoryTitle} Products</Text>
          <Text style={styles.sectionSubtitle}>
            {products.length} products • Auto-scrolling
          </Text>
        </View>
        <Animated.FlatList
          ref={ref => flatListRefs.current[category] = ref}
          horizontal
          data={products}
          renderItem={({ item }) => <HorizontalProductCard item={item} category={category} />}
          keyExtractor={(item, index) => `horizontal-${category}-${item.name}-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={width * 0.7 + 16}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: width * 0.7 + 16,
            offset: (width * 0.7 + 16) * index,
            index,
          })}
        />
      </View>
    );
  };

  // Render horizontal sliders for all categories
  const renderHorizontalSliders = () => (
    <>
      <HorizontalSliderSection category="Facepowder" />
      <HorizontalSliderSection category="nightroutine" />
      <HorizontalSliderSection category="hairpack" />
    </>
  );

  // Main content based on selected filter
  const renderMainContent = () => {
    if (selectedFilter === 'all') {
      // When "all" is selected, only show horizontal sliders in a ScrollView
      return (
        <View style={styles.scrollContainer}>
          {renderHorizontalSliders()}
        </View>
      );
    } else {
      // For specific category filters, only show that category's horizontal slider
      return (
        <View style={styles.scrollContainer}>
          <HorizontalSliderSection category={selectedFilter} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>7Mils Products</Text>
            <Text style={styles.headerSubtitle}>
              Specialized Face Powder, Night Routine & Hair Pack Products
            </Text>
          </View>
          <CartIcon />
        </View>
      </View>

      {/* Main Content */}
      {renderMainContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.7,
  },
  cartIcon: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  cartIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Horizontal Slider Styles
  horizontalSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#000',
    opacity: 0.6,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  horizontalCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  horizontalImageContainer: {
    position: 'relative',
    padding: 16,
  },
  horizontalProductImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#f8f8f8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  horizontalProductInfo: {
    padding: 16,
    paddingTop: 0,
  },
  horizontalProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  horizontalCategory: {
    fontSize: 14,
    color: '#000',
    opacity: 0.6,
    marginBottom: 8,
  },
  horizontalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  horizontalSalePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  horizontalRegularPrice: {
    fontSize: 14,
    color: '#000',
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  horizontalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  newTag: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 4,
    marginBottom: 4,
  },
  bestSellerTag: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 4,
    marginBottom: 4,
  },
  trendingTag: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 4,
    marginBottom: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#f8f8f8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyNowButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buyNowText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 30,
    textAlign: 'center',
  },
});

export default Routineproduct;