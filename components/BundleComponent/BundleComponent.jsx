import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;

const BundleComponent = () => {
  const [bundleProducts, setBundleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigation = useNavigation();

  // Fetch products from AWS API
  useEffect(() => {
    const fetchBundleProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRODUCTS_API);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allProducts = await response.json();
        
        // Filter products that have Bundle_save:"Yes"
        const bundleItems = allProducts.filter(product => 
          product.Bundle_save === "Yes" || product.Bundle_save === true
        );
        
        setBundleProducts(bundleItems);
      } catch (err) {
        console.error('Error fetching bundle products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (PRODUCTS_API) {
      fetchBundleProducts();
    }
  }, []);

  // Calculate total savings for bundle products
  const calculateBundleSavings = useMemo(() => {
    return bundleProducts.reduce((total, product) => {
      const regular = parseFloat(product.regular_price) || 0;
      const sale = parseFloat(product.sale_price) || 0;
      return total + (regular - sale);
    }, 0);
  }, [bundleProducts]);

  // Navigation function for product details
  const handleProductPress = (item) => {
    // Prepare product object with all required fields
    const productDetails = {
      id: item.id || item.name,
      name: item.name || item.title,
      image: item.image?.uri || item.image || item.thumbnail,
      sale_price: item.sale_price,
      regular_price: item.regular_price || item.sale_price,
      quantity:item.quantity,
      category: item.category || item.Category || "Hair Care",
      brand: item.brand || item.Brand || "Unknown Brand",
      benefits: item.benefits || item.Benefits || "",
      description: item.detailed_description,
      hair_type: item.hair_type || item.hairType || "",
      save: item.save || Math.round(((item.regular_price || item.sale_price) - item.sale_price) || 0),
      // Include original data for backward compatibility
      ...item
    };
    
    navigation.navigate("ProductDetails", { product: productDetails });
  };

  const handleAddBundle = () => {
    if (isAdding || bundleProducts.length === 0) return;
    
    setIsAdding(true);
    
    try {
      // Create a unique bundle ID
      const bundleId = `bundle_${Date.now()}`;
      
      // Add each bundle product to cart individually
      bundleProducts.forEach(product => {
        const cartProduct = {
          ...product,
          cartqty: 1,
          isFromBundle: true,
          bundleId: bundleId,
          timestamp: Date.now(),
          bundleDiscount: (parseFloat(product.regular_price) - parseFloat(product.sale_price))
        };
        addToCart(cartProduct);
      });
      
      // Show success message with options
      Alert.alert(
        "Bundle Added to Cart! 🎉",
        `Added ${bundleProducts.length} products and saved ₹${calculateBundleSavings.toFixed(2)}`,
        [
          { text: "Continue Shopping", style: "cancel" },
          { 
            text: "View Cart", 
            onPress: () => navigation.navigate('Cart')
          }
        ]
      );
      
    } catch (error) {
      console.error('Error adding bundle:', error);
      Alert.alert("Error", "Failed to add bundle to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading bundle offers...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load bundle offers</Text>
        <Text style={styles.errorSubText}>{error}</Text>
      </View>
    );
  }

  // If no bundle products, don't show the component
  if (bundleProducts.length === 0) {
    return null;
  }

  // Banner image path - adjust as needed
  const bannerImage = require('../../assets/BundleComponent/15.webp');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bundle & Save</Text>
        <Text style={styles.subtitle}>Build Your Own Basket</Text>
      </View>

      {/* Main Card */}
      <View style={styles.mainCard}>
        {/* Banner Section */}
        <View style={styles.bannerSection}>
          <Image 
            source={bannerImage} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Products Section - Horizontal Scroll */}
        <View style={styles.productsSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {bundleProducts.map((product, index) => (
              <TouchableOpacity 
                key={product.id || product._id || product.name || index} 
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.7}
              >
                {/* Product Image */}
                <Image 
                  source={{ 
                    uri: product.image?.uri || 
                         product.image || 
                         product.thumbnail || 
                         product.image_url 
                  }} 
                  style={styles.productImage}
                />
                
                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name || product.title || "Product Name"}
                  </Text>
                  
                  {/* Bundle Badge */}
                  <View style={styles.bundleIndicator}>
                    <Text style={styles.bundleIndicatorText}>Bundle Item</Text>
                  </View>
                  
                  {/* Price Section */}
                  <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Sale:</Text>
                      <Text style={styles.salePrice}>
                        ₹{parseFloat(product.sale_price || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Regular:</Text>
                      <Text style={styles.regularPrice}>
                        ₹{parseFloat(product.regular_price || product.sale_price || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Savings */}
                  {product.regular_price && product.sale_price && (
                    <View style={styles.savingsRow}>
                      <Text style={styles.savingsText}>
                        Save ₹{(parseFloat(product.regular_price) - parseFloat(product.sale_price)).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Total Savings and Add Button */}
        <View style={styles.footerSection}>
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsLabel}>Total Bundle Savings</Text>
            <View style={styles.savingsAmount}>
              <Text style={styles.saveText}>SAVE</Text>
              <Text style={styles.savingsValue}>₹{calculateBundleSavings.toFixed(2)}</Text>
            </View>
          </View>
          
          {/* Add Bundle Button */}
          <TouchableOpacity 
            style={[styles.addButton, isAdding && styles.disabledButton]}
            onPress={handleAddBundle}
            disabled={isAdding}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.addButtonText}>
                {isAdding ? 'Adding...' : 'Add All'}
              </Text>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>+</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  bannerSection: {
    height: 160,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  productsContainer: {
    paddingRight: 16,
  },
  productCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginBottom: 10,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
    height: 32,
  },
  bundleIndicator: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  bundleIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 0.2,
  },
  priceSection: {
    width: '100%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },
  salePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  regularPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  savingsRow: {
    marginTop: 6,
    width: '100%',
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footerSection: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  savingsContainer: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  savingsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    letterSpacing: 0.3,
  },
  savingsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  buttonIcon: {
    backgroundColor: '#FFFFFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  buttonIconText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 16,
  },
});

export default BundleComponent;