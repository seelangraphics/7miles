import React, { useState } from "react";
import { View, ScrollView, StatusBar, StyleSheet } from "react-native";
import TopNavigation from "../Nav/TopNavigation";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
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

const HomeScreen = ({ navigation }) => {

  const { getCartItemsCount } = useCart();

  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // → UI Logic
  const openSearch = () => setShowSearch(true);
  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };
  const handleSearch = (text) => setSearchQuery(text);

  // → Bottom navigation action
  const handleTabPress = (tab) => {
    if (tab === "categories") {
      navigation.navigate("Categories");
    } else if (tab === "cart") {
      navigation.navigate("Cart");
    } else if (tab === "myorders") {
      navigation.navigate("MyOrders");
    } else if (tab === "help") {
      navigation.navigate("Help");
    } else if (tab === "account") {
      navigation.navigate("Account");
    } else {
      setActiveTab(tab);
    }
  };

  // → Render Home content only when home active
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
      <ScrollView style={styles.content}>
        <PromoBanner />
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

      {/* top header only on home */}
      {!showSearch && (
        <TopNavigation
          onSearchPress={openSearch}
          onCategoryPress={() => navigation.navigate("Categories")}
          onCartPress={() => navigation.navigate("Cart")}
          cartItemsCount={getCartItemsCount()}
        />
      )}

      {/* page content */}
      <View style={styles.mainContent}>{renderHomeContent()}</View>

      {/* bottom nav */}
     
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
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