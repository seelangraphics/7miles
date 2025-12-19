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
      
      // Show success message
      Alert.alert(
        "Bundle Added to Cart! 🎉",
        `Added ${bundleProducts.length} products and saved ₹${calculateBundleSavings.toFixed(2)}`,
        [{ text: "Continue Shopping" }, { text: "View Cart" }]
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
        <ActivityIndicator size="large" color="#0000ff" />
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
        {/* Banner Section - Like in reference image */}
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
            {bundleProducts.map((product) => (
              <View key={product.id || product._id} style={styles.productCard}>
                {/* Product Image - Handle different image structures */}
                <Image 
                  source={{ uri: product.image?.uri || product.image || product.thumbnail }} 
                  style={styles.productImage}
                 
                />
                
                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name || product.title}
                  </Text>
                  
                  {product.cartqty && (
                    <Text style={styles.productQuantity}>
                      {product.cartqty}
                    </Text>
                  )}
                  
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
                        ₹{parseFloat(product.regular_price || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Total Savings and Add Button */}
        <View style={styles.footerSection}>
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsLabel}>Total Savings</Text>
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
    backgroundColor: '#F8F8F8',
    padding: 16,
    marginVertical: 16,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  bannerSection: {
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 12,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    color: '#888888',
    fontWeight: '500',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  regularPrice: {
    fontSize: 13,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
 footerSection: {
  paddingVertical: 16,
  paddingHorizontal: 18,
  backgroundColor: '#F8F8F8',
  flexDirection: 'row',
  alignItems: 'center',
},

  savingsContainer: {
    flex: 1,
  },
 savingsLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
},

savingsValue: {
  fontSize: 24,   // ⬅ reduced from 32 (main issue)
  fontWeight: '800',
},

  savingsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
 
 addButton: {
  backgroundColor: '#000',
  borderRadius: 40,
  paddingHorizontal: 20,
  paddingVertical: 12,
  minWidth: 120,
},

addButtonText: {
  fontSize: 14,
  fontWeight: '700',
  color:'white'
},

  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
 
  buttonIcon: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 18,
  },
});

export default BundleComponent;