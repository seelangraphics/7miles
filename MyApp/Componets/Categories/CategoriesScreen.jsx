import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { products } from "../data/7mils_Products";

const CategoriesScreen = () => {
  const allProducts = products;
  const navigation = useNavigation();

  const categories = [...new Set(allProducts.map((item) => item.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

 
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
const [selectedSort, setSelectedSort] = useState("Best Selling");
const [selectedFilter, setSelectedFilter] = useState("");

  const categoryImages = {
    "Hair Care": require("../../assets/categories/haircare.png"),
    "Skin Care": require("../../assets/categories/skincare.png"),
    "Body Care": require("../../assets/categories/skincare.png"),
    "Wellness & Edibles": require("../../assets/categories/edible.png"),
  };

 
  const filteredProducts = allProducts.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterSortRow}>
        <TouchableOpacity
          style={styles.filterSortButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter-outline" size={18} color="#000" />
          <Text style={styles.filterSortText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterSortButton}
          onPress={() => setSortVisible(true)}
        >
          <Ionicons name="swap-vertical-outline" size={18} color="#000" />
          <Text style={styles.filterSortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === item && styles.activeTab,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Image
              source={categoryImages[item]}
              style={[
                styles.categoryImage,
                selectedCategory === item && styles.activeCategoryImage,
              ]}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      {/* 🛍 Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
              navigation.navigate("ProductDetails", { product: item })
            }
          >
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>₹{item.regular_price}</Text>
              <Text style={styles.discountedPrice}>₹{item.sale_price}</Text>
            </View>
            <Text style={styles.offerText}>Save ₹{item.save}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* 🔸 Filter Modal */}

      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.floatingCloseButton}
            onPress={() => setFilterVisible(false)}
          >
            <Text style={styles.floatingCloseIcon}>×</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by</Text>

            {["Hair Type", "Price Range", "Brand", "Discount"].map((option) => (
              <TouchableOpacity key={option} style={styles.modalOption}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setFilterVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={sortVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {/* Floating Close Icon Button */}
          <TouchableOpacity
            style={styles.floatingCloseButton}
            onPress={() => setSortVisible(false)}
          >
            <Text style={styles.floatingCloseIcon}>×</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>

            {[
              "Best Selling",
              "Featured",
              "Price (Low to High)",
              "Price (High to Low)",
              "Alphabetical (A-Z)",
              "Alphabetical (Z-A)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => setSelectedSort(option)}
              >
                <View style={styles.radioCircle}>
                  {selectedSort === option && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.floatingCloseButton}
            onPress={() => setFilterVisible(false)}
          >
            <Text style={styles.floatingCloseIcon}>×</Text>
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by</Text>

            {["Hair Type", "Price Range", "Brand", "Discount"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => setSelectedFilter(option)}
              >
                <View style={styles.radioCircle}>
                  {selectedFilter === option && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Filter & Sort Row
  filterSortRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  filterSortButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  filterSortText: { fontSize: 14, fontWeight: "500" },

  // Category Tabs
  categoryTab: {
    alignItems: "center",
    marginRight: 28,
    paddingBottom: 20,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#f2f2f2",
  },
  activeCategoryImage: { borderColor: "#007AFF" },
  categoryText: { fontSize: 14, marginTop: 6, color: "#555" },
  activeText: { color: "#007AFF", fontWeight: "bold" },

  // Product Cards
  productCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 10,
    margin: 8,
    marginTop: 30,
    alignItems: "center",
    elevation: 2,
  },
  productImage: { width: 100, height: 100, borderRadius: 10 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
    color: "#333",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discountedPrice: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
  offerText: { fontSize: 12, color: "green", marginTop: 3 },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 8,
  },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "bold" },

  // Modals
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  // Radio button styles
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 15,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },


  floatingCloseButton: {
    position: "absolute",
    top: 350,
    right: 170,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingCloseIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
