import React, { useState } from "react";
import { 
  View, 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Image,
  Dimensions 
} from "react-native";
import TopNavigation from "../Nav/TopNavigation";
import SearchBar from "../Nav/SearchBar";
import PromoBanner from "../PromoBanner/PromoBanner";
import NewProducts from "../NewProducts/NewProducts";
import ProductsScreen from "../ProductsContainer/ProductsScreen";
import HeroSection from "../HeroSection/HeroSection";
import SevenMile from "../SevenMile/SevenMile";
import BundleComponent from "../BundleComponent/BundleComponent";
import Facepack from "../Facepack_powder/Facepack";
import ProductSlider from "../ProductSlider/ProductSlider";
import Routineproduct from "../Rotine-product/RotineProducts";
import Adbanner from "../AddBanner/Adbanner";
import FAQSection from "../Faq/Faq";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const { width } = Dimensions.get('window');
const PRODUCTS_IMAGE_API = Constants.expoConfig.extra?.PRODUCTS_IMAGE_API;
const homeCategoryImages = {
  hair: {
    remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_4.png` } : null,
  },
  skin: {
    remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_1.png` } : null,
  },
  body: {
    remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_2.png` } : null,
  },
  wellness: {
    remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}Home-catagories/C_3.png` } : null,
  },
};

// Simple & Creative Category Component
const CategoryQuickNav = ({ navigation }) => {
  const [failedImages, setFailedImages] = useState({});
  const categories = [
    { 
      id: 'hair', 
      name: 'Hair Care', 
      key: 'Hair Care',
      image: homeCategoryImages.hair,
      color: '#d2c1e2',
    },
    { 
      id: 'skin', 
      name: 'Skin Care', 
      key: 'Skin Care',
      image: homeCategoryImages.skin,
      color: '#d2c1e2',
    },
    { 
      id: 'body', 
      name: 'Body Care', 
      key: 'Body Care',
      image: homeCategoryImages.body,
      color: '#d2c1e2',
    },
    { 
      id: 'wellness', 
      name: 'Wellness', 
      key: 'Wellness & Edibles',
      image: homeCategoryImages.wellness,
      color: '#d2c1e2',
    },
  ];

  return (
    <View style={categoryNavStyles.container}>
      <View style={categoryNavStyles.header}>
        <View>
          <Text style={categoryNavStyles.title}>Browse Categories</Text>
          <Text style={categoryNavStyles.subtitle}>Find what you need</Text>
        </View>
        <TouchableOpacity 
          style={categoryNavStyles.viewAllBtn}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={categoryNavStyles.viewAllText}>All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={categoryNavStyles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={categoryNavStyles.card}
            onPress={() => navigation.navigate('Categories', { selectedCategory: category.key })}
            activeOpacity={0.7}
          >
            {/* Image with colored border */}
            <View style={[categoryNavStyles.imageWrapper, { borderColor: category.color + '30' }]}>
              {(() => {
                const imageSource = failedImages[category.id] ? null : category.image.remote;

                if (!imageSource) {
                  return null;
                }

                return (
              <Image
                source={imageSource}
                style={categoryNavStyles.image}
                resizeMode="cover"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [category.id]: true }))
                }
              />
                );
              })()}
              {/* Color accent corner */}
              <View style={[categoryNavStyles.colorAccent, { backgroundColor: category.color }]} />
            </View>
            
            <View style={categoryNavStyles.cardContent}>
              <Text style={categoryNavStyles.categoryName}>{category.name}</Text>
              <View style={categoryNavStyles.ctaRow}>
                <Text style={categoryNavStyles.ctaText}>Shop →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const categoryNavStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  viewAllBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 40) / 2,
    marginBottom: 16,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#F9FAFB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  colorAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    paddingHorizontal: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});

// Alternative even simpler design (choose one):
const SimpleCategoryNav = ({ navigation }) => {
  const [failedImages, setFailedImages] = useState({});
  const categories = [
    { id: 'hair', name: 'Hair', key: 'Hair Care', image: homeCategoryImages.hair },
    { id: 'skin', name: 'Skin', key: 'Skin Care', image: homeCategoryImages.skin },
    { id: 'body', name: 'Body', key: 'Body Care', image: homeCategoryImages.body },
    { id: 'wellness', name: 'Wellness', key: 'Wellness & Edibles', image: homeCategoryImages.wellness },
  ];

  return (
    <View style={simpleStyles.container}>
      <Text style={simpleStyles.title}>Categories</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={simpleStyles.scrollView}
        contentContainerStyle={simpleStyles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={simpleStyles.categoryCircle}
            onPress={() => navigation.navigate('Categories', { selectedCategory: category.key })}
            activeOpacity={0.8}
          >
            <View style={simpleStyles.imageCircle}>
              {(() => {
                const imageSource = failedImages[category.id] ? null : category.image.remote;

                if (!imageSource) {
                  return null;
                }

                return (
              <Image
                source={imageSource}
                style={simpleStyles.circleImage}
                resizeMode="cover"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [category.id]: true }))
                }
              />
                );
              })()}
            </View>
            <Text style={simpleStyles.categoryLabel}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const simpleStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryCircle: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  imageCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
});

const HomeScreen = ({ navigation }) => {
  const { getCartItemsCount } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSearch = () => setShowSearch(true);
  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };
  const handleSearch = (text) => setSearchQuery(text);

  const renderHomeContent = () => {
    if (showSearch) {
      return (
        <View style={styles.content}>
          <SearchBar
            onSearch={handleSearch}
            onClose={closeSearch}
            placeholder="Search products..."
          />
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PromoBanner />
        {/* Choose either CategoryQuickNav or SimpleCategoryNav below */}
        <CategoryQuickNav navigation={navigation} />
        {/* <SimpleCategoryNav navigation={navigation} /> */}
        <NewProducts />
        <ProductsScreen />
        <HeroSection />
        <SevenMile />
        <BundleComponent />
        <Facepack />
        <ProductSlider />
        <Routineproduct />
        <Adbanner />
        <FAQSection />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {!showSearch && (
        <TopNavigation
          onSearchPress={openSearch}
          onCategoryPress={() => navigation.navigate("Categories", { selectedCategory: "Hair Care" })}
          onCartPress={() => navigation.navigate("Cart")}
          cartItemsCount={getCartItemsCount()}
        />
      )}

      <View style={styles.mainContent}>{renderHomeContent()}</View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: { flex: 1 },
  content: { flex: 1 },
});
