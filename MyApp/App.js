// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// ✅ Your existing components
import TopNavigation from './Componets/Nav/TopNavigation';
import SearchBar from './Componets/Nav/SearchBar';
import BottomNavigation from './Componets/BottomNavigation/BottomNavigation';
import CategoriesScreen from './Componets/Categories/CategoriesScreen';
import PromoBanner from './Componets/PromoBanner/PromoBanner';
import ProductDetailsScreen from './Componets/ProductDetails/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

/* ---------------------------------------------
   ✅ Reusable TopBar for Product / Category Pages
--------------------------------------------- */
const TopBar = ({ title, onSearchPress, onCartPress, onWishlistPress }) => (
  <View style={styles.topBar}>
    <Text style={styles.title}>{title}</Text>

    <View style={styles.iconContainer}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
        <Ionicons name="search-outline" size={22} color="#000" />
      </TouchableOpacity>

      {/* Wishlist Icon */}
      <TouchableOpacity onPress={onWishlistPress} style={styles.iconButton}>
        <Ionicons name="heart-outline" size={22} color="#000" />
      </TouchableOpacity>

      {/* Cart Icon */}
      <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
        <Ionicons name="cart-outline" size={22} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

/* ---------------------------------------------
   ✅ Main App Component
--------------------------------------------- */
export default function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleSearchPress = () => setShowSearch(true);
  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery('');
  };
  const handleSearch = (text) => setSearchQuery(text);

  const onWishlistPress = () => console.log('❤️ Wishlist Pressed');
  const onCartPress = () => console.log('🛒 Cart Pressed');

  /* ---------------------------------------------
     🏠 Home Screen — TopNavigation + Cart Icon
  --------------------------------------------- */
  const HomeScreen = ({ navigation }) => {
    const handleTabPress = (tab) => {
      if (tab === 'categories') {
        navigation.navigate('Categories');
      } else {
        setActiveTab(tab);
      }
    };

    // Content Rendering Logic
    const renderContent = () => {
      if (showSearch) {
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Search Results for: {searchQuery}</Text>
          </View>
        );
      }

      switch (activeTab) {
        case 'home':
          return (
            <ScrollView style={styles.content}>
            <PromoBanner/>
          
            </ScrollView>
          );
        case 'myorders':
          return (
            <View style={styles.content}>
              <Text style={styles.contentText}>My Orders Screen</Text>
            </View>
          );
        case 'help':
          return (
            <View style={styles.content}>
              <Text style={styles.contentText}>Help Screen</Text>
            </View>
          );
        case 'account':
          return (
            <View style={styles.content}>
              <Text style={styles.contentText}>Account Screen</Text>
            </View>
          );
        case 'cart':
          return (
            <View style={styles.content}>
              <Text style={styles.contentText}>Cart Screen</Text>
            </View>
          );
        default:
          return (
            <ScrollView style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Welcome to 7 Miles</Text>
              </View>
            </ScrollView>
          );
      }
    };

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* ✅ Home TopNavigation (Logo + Cart) */}
        {!showSearch ? (
          <TopNavigation
            onSearchPress={handleSearchPress}
            onCategoryPress={() => navigation.navigate('Categories')}
            onCartPress={() => setActiveTab('cart')}
          />
        ) : (
          <SearchBar
            onSearch={handleSearch}
            onClose={handleSearchClose}
            placeholder="Search products..."
          />
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>{renderContent()}</View>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  };
/* ---------------------------------------------
   🛍️ Categories Screen — Uses TopBar
--------------------------------------------- */
const CategoriesScreenWithTopBar = ({ navigation }) => (
  <View style={styles.container}>
    <TopBar
      title="Categories"
      onSearchPress={() => console.log("🔍 Search in Categories")}
      onCartPress={onCartPress}
      onWishlistPress={onWishlistPress}
    />
    {/* pass navigation down */}
    <CategoriesScreen navigation={navigation} />
  </View>
);

/* ---------------------------------------------
   📦 Product Details Screen — Uses TopBar
--------------------------------------------- */
const ProductDetailsScreenWithTopBar = ({ navigation, route }) => (
  <View style={styles.container}>
    <TopBar
      title="Product Details"
      onSearchPress={() => console.log("🔍 Search in Product Details")}
      onCartPress={onCartPress}
      onWishlistPress={onWishlistPress}
    />
    <ProductDetailsScreen navigation={navigation} route={route} />
  </View>
);

/* ---------------------------------------------
   🌐 Navigation Container
--------------------------------------------- */
return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreenWithTopBar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreenWithTopBar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
}

/* ---------------------------------------------
   🎨 Styles
--------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // ✅ Common TopBar (for category/product screens)
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#d0c9c4", // ✅ Updated background color
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 18,
  },

  mainContent: { flex: 1 },
  content: { flex: 1, padding: 16 },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  section: { marginBottom: 24, alignItems: "center" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
});
