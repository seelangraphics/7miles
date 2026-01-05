import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export const GoldenDrop = () => {
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const [honeyProduct, setHoneyProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    findHoneyProduct();
  }, []);

  const findHoneyProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(PRODUCTS_API);
      const data = await response.json();
      
      const products = Array.isArray(data) ? data : (data.products || []);
      
      // Try to find honey products in this order:
      // 1. Products with 'honey' in name
      // 2. Products with 'honey' in category
      // 3. Products in 'Wellness & Edibles' category
      
      let honeyProduct = null;
      
      // Priority 1: Exact honey match in name
      honeyProduct = products.find(product => 
        product.name && product.name.toLowerCase().includes('honey')
      );
      
      // Priority 2: Products in 'Honey' category
      if (!honeyProduct) {
        honeyProduct = products.find(product => 
          product.category && product.category.toLowerCase().includes('honey')
        );
      }
      
      // Priority 3: Any product in 'Wellness & Edibles' category
      if (!honeyProduct) {
        honeyProduct = products.find(product => 
          product.category === 'Wellness & Edibles'
        );
      }
      
      // Priority 4: Any product with 'Wellness' in category
      if (!honeyProduct) {
        honeyProduct = products.find(product => 
          product.category && product.category.includes('Wellness')
        );
      }
      
      // Priority 5: First available product as fallback
      if (!honeyProduct && products.length > 0) {
        honeyProduct = products[0];
      }
      
      if (honeyProduct) {
        console.log('Found honey product:', honeyProduct.name);
        setHoneyProduct(honeyProduct);
      } else {
        setError('No honey products found');
      }
      
    } catch (error) {
      console.error('Error finding honey product:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    if (honeyProduct) {
      // Navigate directly to the product details page
      navigation.navigate('ProductDetails', { 
        product: honeyProduct,
        productId: honeyProduct.id || honeyProduct.name
      });
    } else {
      // Fallback - navigate to categories
      navigation.navigate('Categories', { 
        selectedCategory: 'Wellness & Edibles' 
      });
    }
  };

  // Show different button text based on what we found
  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (honeyProduct) {
      if (honeyProduct.name.toLowerCase().includes('honey')) {
        return 'Shop Now';
      } else {
        return 'View Product';
      }
    }
    return 'Shop Wellness';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Video Section - Fixed Height */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={require('../../assets/PD-video.mp4')}
            shouldPlay={true}
            isLooping={true}
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
            isMuted={true}
          />
        </View>
        
        {/* Content Section - Below Video */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Golden Goodness in Every Drop</Text>
          <Text style={styles.description}>
            Taste the richness of pure, natural honey straight from the hive. 
            Sweet, healthy, and packed with nature's nutrients for your everyday wellness.
          </Text>
          
          {loading ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : error ? (
            <TouchableOpacity 
              style={[styles.button, styles.errorButton]} 
              activeOpacity={0.8}
              onPress={findHoneyProduct}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              activeOpacity={0.8}
              onPress={handleShopNow}
            >
              <Text style={styles.buttonText}>{getButtonText()}</Text>
            </TouchableOpacity>
          )}
          
     
          
          {error && !loading && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoContainer: {
    width: '100%',
    height: isSmallScreen ? height * 0.45 : height * 0.5,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#FFFDF5',
    alignItems: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 26 : 30,
    fontWeight: '800',
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 34 : 40,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#654321',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 24 : 28,
    marginBottom: 35,
    paddingHorizontal: 10,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default GoldenDrop;