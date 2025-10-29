import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
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
import NewProducts from './Componets/NewProducts/NewProducts';
import ProductsScreen from './Componets/ProductsContainer/ProductsScreen';
import HeroSection from './Componets/HeroSection/HeroSection';
import SevenMile from './Componets/SevenMile/SevenMile';
import ProductSlider from './Componets/ProductSlider/ProductSlider';
import Routineproduct from './Componets/Rotine-product/RotineProducts';
import Adbanner from './Componets/AddBanner/Adbanner';
import CartScreen from './Componets/CartScreen/CartScreen';

// ✅ Cart Context
import { CartProvider, useCart } from './Componets/context/CartContext';

const Stack = createNativeStackNavigator();

/* ---------------------------------------------
   ✅ Reusable TopBar for ALL Non-Home Pages
--------------------------------------------- */
const TopBar = ({ 
  title, 
  onBackPress, 
  onSearchPress, 
  onCartPress, 
  onWishlistPress, 
  cartItemsCount,
  showBackButton = true 
}) => (
  <View style={styles.topBar}>
    {/* Back Button */}
    <View style={styles.leftSection}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>

    <View style={styles.iconContainer}>
      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
        <Ionicons name="search-outline" size={22} color="#000" />
      </TouchableOpacity>

      {/* Wishlist Icon */}
      <TouchableOpacity onPress={onWishlistPress} style={styles.iconButton}>
        <Ionicons name="heart-outline" size={22} color="#000" />
      </TouchableOpacity>

      {/* Cart Icon with Badge */}
      <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
        <Ionicons name="cart-outline" size={22} color="#000" />
        {cartItemsCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

// ✅ Cart Screen Wrapper with TopBar
const CartScreenWithTopBar = ({ navigation }) => {
  const { getCartItemsCount } = useCart();

  return (
    <View style={styles.container}>
      <TopBar
        title="My Cart"
        onBackPress={() => navigation.navigate('Home')}
        onSearchPress={() => console.log("Search in Cart")}
        onCartPress={() => {}}
        onWishlistPress={() => console.log("Wishlist")}
        cartItemsCount={getCartItemsCount()}
      />
      <CartScreen navigation={navigation} />
    </View>
  );
};

// ✅ My Orders Screen
const MyOrdersScreen = ({ navigation }) => {
  const { getCartItemsCount } = useCart();

  return (
    <View style={styles.container}>
      <TopBar
        title="My Orders"
        onBackPress={() => navigation.navigate('Home')}
        onSearchPress={() => console.log("Search in Orders")}
        onCartPress={() => navigation.navigate('Cart')}
        onWishlistPress={() => console.log("Wishlist")}
        cartItemsCount={getCartItemsCount()}
      />
      <View style={styles.content}>
        <Text style={styles.contentText}>My Orders Screen</Text>
        {/* Add your orders content here */}
      </View>
    </View>
  );
};

// ✅ Help Screen
const HelpScreen = ({ navigation }) => {
  const { getCartItemsCount } = useCart();

  return (
    <View style={styles.container}>
      <TopBar
        title="Help & Support"
        onBackPress={() => navigation.navigate('Home')}
        onSearchPress={() => console.log("Search in Help")}
        onCartPress={() => navigation.navigate('Cart')}
        onWishlistPress={() => console.log("Wishlist")}
        cartItemsCount={getCartItemsCount()}
      />
      <View style={styles.content}>
        <Text style={styles.contentText}>Help Screen</Text>
        {/* Add your help content here */}
      </View>
    </View>
  );
};

// ✅ Account Screen
const AccountScreen = ({ navigation }) => {
  const { getCartItemsCount } = useCart();

  return (
    <View style={styles.container}>
      <TopBar
        title="My Account"
        onBackPress={() => navigation.navigate('Home')}
        onSearchPress={() => console.log("Search in Account")}
        onCartPress={() => navigation.navigate('Cart')}
        onWishlistPress={() => console.log("Wishlist")}
        cartItemsCount={getCartItemsCount()}
      />
      <View style={styles.content}>
        <Text style={styles.contentText}>Account Screen</Text>
        {/* Add your account content here */}
      </View>
    </View>
  );
};

/* ---------------------------------------------
   ✅ Main App Component - MOVE useCart INSIDE HomeScreen
--------------------------------------------- */
function AppContent() {
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // REMOVE useCart from here - move it inside HomeScreen

  // Handlers
  const handleSearchPress = () => setShowSearch(true);
  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery('');
  };
  const handleSearch = (text) => setSearchQuery(text);

  const onWishlistPress = () => console.log('❤️ Wishlist Pressed');

  /* ---------------------------------------------
     🏠 Home Screen — Only screen with TopNavigation
  --------------------------------------------- */
  const HomeScreen = ({ navigation }) => {
    // MOVE useCart INSIDE HomeScreen component
    const { getCartItemsCount } = useCart();

    const handleTabPress = (tab) => {
      if (tab === 'categories') {
        navigation.navigate('Categories');
      } else if (tab === 'cart') {
        navigation.navigate('Cart');
      } else if (tab === 'myorders') {
        navigation.navigate('MyOrders');
      } else if (tab === 'help') {
        navigation.navigate('Help');
      } else if (tab === 'account') {
        navigation.navigate('Account');
      } else {
        setActiveTab(tab);
      }
    };

    // Content Rendering Logic - ONLY for home tab content
    const renderHomeContent = () => {
      if (showSearch) {
        return (
          <View style={styles.content}>
            <Text style={styles.contentText}>Search Results for: {searchQuery}</Text>
          </View>
        );
      }

      return (
        <ScrollView style={styles.content}>
          <PromoBanner />
          <NewProducts />
          <ProductsScreen />
          <HeroSection />
          <SevenMile />
          <ProductSlider />
          <Routineproduct/>
          <Adbanner/>
        </ScrollView>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* ✅ ONLY on Home Screen: Show TopNavigation */}
        {!showSearch ? (
          <TopNavigation
            onSearchPress={handleSearchPress}
            onCategoryPress={() => navigation.navigate('Categories')}
            onCartPress={() => navigation.navigate('Cart')}
            cartItemsCount={getCartItemsCount()}
          />
        ) : (
          <SearchBar
            onSearch={handleSearch}
            onClose={handleSearchClose}
            placeholder="Search products..."
          />
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {renderHomeContent()}
        </View>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  };

  /* ---------------------------------------------
     🛍️ Categories Screen — Uses TopBar
  --------------------------------------------- */
  const CategoriesScreenWithTopBar = ({ navigation }) => {
    const { getCartItemsCount } = useCart();

    return (
      <View style={styles.container}>
        <TopBar
          title="Categories"
          onBackPress={() => navigation.navigate('Home')}
          onSearchPress={() => console.log("🔍 Search in Categories")}
          onCartPress={() => navigation.navigate('Cart')}
          onWishlistPress={onWishlistPress}
          cartItemsCount={getCartItemsCount()}
        />
        <CategoriesScreen navigation={navigation} />
      </View>
    );
  };

  /* ---------------------------------------------
     📦 Product Details Screen — Uses TopBar
  --------------------------------------------- */
  const ProductDetailsScreenWithTopBar = ({ navigation, route }) => {
    const { getCartItemsCount } = useCart();

    return (
      <View style={styles.container}>
        <TopBar
          title="Product Details"
          onBackPress={() => navigation.goBack()}
          onSearchPress={() => console.log("🔍 Search in Product Details")}
          onCartPress={() => navigation.navigate('Cart')}
          onWishlistPress={onWishlistPress}
          cartItemsCount={getCartItemsCount()}
        />
        <ProductDetailsScreen navigation={navigation} route={route} />
      </View>
    );
  };

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
        <Stack.Screen
          name="Cart"
          component={CartScreenWithTopBar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrders"
          component={MyOrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ---------------------------------------------
   ✅ Main Export with Cart Provider
--------------------------------------------- */
export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

/* ---------------------------------------------
   🎨 Updated Styles
--------------------------------------------- */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  // ✅ TopBar Styles (for all non-home pages)
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#d0c9c4",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
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
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  mainContent: { flex: 1 },
  content: { flex: 1 },
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