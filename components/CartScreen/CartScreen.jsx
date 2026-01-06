import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { Dropdown } from "react-native-element-dropdown";



const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const cartTotal = getCartTotal();
  const FREE_SHIPPING_LIMIT = 200;
  const shippingCharge = cartTotal >= FREE_SHIPPING_LIMIT ? 0 : 40;
  const finalTotal = cartTotal + shippingCharge;

  const shippingProgress = Math.min(
    (cartTotal / FREE_SHIPPING_LIMIT) * 100,
    100
  );
  const amountNeeded = Math.max(FREE_SHIPPING_LIMIT - cartTotal, 0);

  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("");
  const [estimatedShipping, setEstimatedShipping] = useState(null);

  const states = [
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Kerala", value: "Kerala" },
    { label: "Karnataka", value: "Karnataka" },
  ];

  const calculateEstimatedShipping = () => {
    if (!pincode || pincode.length !== 6) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode");
      return;
    }

    if (cartTotal >= FREE_SHIPPING_LIMIT) {
      setEstimatedShipping({
        method: "Standard Shipping",
        price: 0,
        message: "🎉 Free Shipping Unlocked!",
        delivery: "3-5 business days",
      });
    } else {
      setEstimatedShipping({
        method: "Standard Shipping",
        price: 40,
        message: "Add ₹" + amountNeeded.toFixed(2) + " more for free shipping",
        delivery: "3-5 business days",
      });
    }
  };



const handleCheckout = () => {
  if (cartItems.length === 0) {
    Alert.alert("Cart Empty", "Please add items to cart before checkout");
    return;
  }

 
  const finalTotalWithTax = cartTotal + shippingCharge;


  const priceDetails = {
    subtotal: cartTotal.toFixed(2),
    shipping: shippingCharge.toFixed(2),
    finalTotal: finalTotalWithTax.toFixed(2),
    freeShippingLimit: FREE_SHIPPING_LIMIT,
    isFreeShipping: cartTotal >= FREE_SHIPPING_LIMIT,
    itemsCount: cartItems.length,
  };

  console.log("Passing price details to delivery:", priceDetails);
  navigation.navigate("delivery", { priceDetails });
};







  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#d6433c" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>
            Add some products to get started
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View style={styles.cartItem}>
            {/* Left Side Image */}
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={styles.cartItemImage}
            />

            {/* Right Side Details */}
            <View style={styles.cartItemDetails}>
              {/* Name */}
              <Text style={styles.cartItemName} numberOfLines={2}>
                {item.name}
              </Text>

              {/* Price */}
              <Text style={styles.cartItemPrice}>₹{item.sale_price}</Text>

              {/* Quantity Controls */}
              <View style={styles.quantitysection}>
                <Text style={styles.quantityLabel}>Qty: {item.quantity}</Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.name, item.cartQty - 1)}
                    disabled={item.cartQty <= 1}
                  >
                    <Text
                      style={[
                        styles.quantityText,
                        item.cartQty <= 1 && styles.disabledButton,
                      ]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{item.cartQty}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.name, item.cartQty + 1)}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Divider Line */}
              <View style={styles.divider} />

              {/* Wishlist + Remove Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.wishlistButton}>
                  <Ionicons name="heart-outline" size={18} color="#d6433c" />
                  <Text style={styles.actionText}>Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.name)}
                >
                  <Ionicons name="trash-outline" size={18} color="#d6433c" />
                  <Text style={styles.actionText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Free Shipping Progress */}
        <View style={styles.shippingProgressSection}>
          <View style={styles.progressHeader}>
            {/* <Ionicons name="rocket-outline" size={20} color="#d6433c" /> */}
            <Text style={styles.progressTitle}>Free Shipping Progress</Text>
            <Text style={styles.progressPercentage}>
              {shippingProgress.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[styles.progressFill, { width: `${shippingProgress}%` }]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressAmount}>₹{cartTotal.toFixed(2)}</Text>
              <Text style={styles.progressTarget}>₹{FREE_SHIPPING_LIMIT}</Text>
            </View>
          </View>

          {shippingProgress < 100 ? (
            <Text style={styles.progressMessage}>
              Add{" "}
              <Text style={styles.highlight}>₹{amountNeeded.toFixed(2)}</Text>{" "}
              more for free shipping
            </Text>
          ) : (
            <View style={styles.freeShippingAchieved}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.freeShippingText}>
                Free Shipping Unlocked!
              </Text>
            </View>
          )}
        </View>

        {/* Estimate Shipping */}
        <View style={styles.estimateSection}>
          <Text style={styles.sectionTitle}>Estimate Shipping</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>State</Text>
              <Dropdown
                data={states}
                labelField="label"
                valueField="value"
                value={state}
                style={styles.dropdown}
                placeholder="Select"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                onChange={(item) => setState(item.value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.pincodeInput}
                placeholder="Enter 6-digit"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.calcButton,
              pincode.length !== 6 && styles.calcButtonDisabled,
            ]}
            onPress={calculateEstimatedShipping}
            disabled={pincode.length !== 6}
          >
            {/* <Ionicons name="calculator-outline" size={16} color="#fff" /> */}
            <Text style={styles.calcButtonText}>Calculate Shipping</Text>
          </TouchableOpacity>

          {estimatedShipping && (
            <View style={styles.estimateResult}>
              <View style={styles.resultRow}>
                {/* <Text style={resultMethod}>{estimatedShipping.method}</Text> */}
                <Text
                  style={
                    estimatedShipping.price === 0
                      ? styles.freePrice
                      : styles.price
                  }
                >
                  {estimatedShipping.price === 0
                    ? "FREE"
                    : `₹${estimatedShipping.price}`}
                </Text>
              </View>
              <Text style={styles.resultMessage}>
                {estimatedShipping.message}
              </Text>
              <Text style={styles.resultDelivery}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />{" "}
                {estimatedShipping.delivery}
              </Text>
            </View>
          )}
        </View>

        {/* Price Details Section */}
        <View style={styles.priceDetailsSection}>
          <Text style={styles.sectionTitle}>Price Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Subtotal ({cartItems.length} items)
            </Text>
            <Text style={styles.detailValue}>₹{cartTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.shippingDetail}>
              <Text style={styles.detailLabel}>Shipping Charges</Text>
              {shippingCharge === 0 && (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>FREE</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.detailValue,
                shippingCharge === 0 && styles.freeText,
              ]}
            >
              {shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Order Total</Text>
            <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotal}>₹{finalTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>CONTINUE</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3eeea",
  },
  cartItems: {
    flex: 1,
    padding: 10,
    paddingBottom: 30,
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  cartItemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
  },

  cartItemDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "flex-start",
  },

  cartItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  cartItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d6433c",
    marginBottom: 8,
  },

  quantitysection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3eeea",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    color: "#9CA3AF",
  },

  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  quantity: {
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 12,
    color: "#333",
    minWidth: 24,
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    color: "#111827",
  },

  shippingProgressSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d6433c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  progressTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  progressPercentage: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#d6433c",
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f3eeea",
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#d6433c",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressAmount: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressTarget: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressMessage: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  highlight: {
    color: "#d6433c",
    fontWeight: "700",
  },
  freeShippingAchieved: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1FAE5",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    gap: 8,
  },
  freeShippingText: {
    fontSize: 13.5,
    color: "#065F46",
    fontWeight: "600",
  },
  estimateSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  dropdown: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d6433c",
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  placeholder: {
    fontSize: 13.5,
    color: "#9CA3AF",
  },
  selectedText: {
    fontSize: 13.5,
    color: "#333",
  },
  pincodeInput: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d6433c",
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: "#333",
    backgroundColor: "#F9FAFB",
  },
  calcButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  calcButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  calcButtonText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "600",
  },
  estimateResult: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  resultMethod: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#111827",
  },
  price: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#d6433c",
  },
  freePrice: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#10B981",
  },
  resultMessage: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  resultDelivery: {
    fontSize: 12,
    color: "#6B7280",
  },
  priceDetailsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13.5,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#111827",
  },
  shippingDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  freeBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeBadgeText: {
    fontSize: 11,
    color: "#065F46",
    fontWeight: "700",
  },
  freeText: {
    color: "#10B981",
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#d6433c",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    // paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0,  },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
    height: 100,
    
  },
  footerLeft: {
    flex: 1,
    bottom: 20
  },
  footerTotalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#d6433c",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
     bottom:20
  },
  checkoutText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 16,
    fontWeight: "700",
  },
  emptyCartSubtext: {
    fontSize: 13.5,
    color: "#9CA3AF",
    marginTop: 4,
  },
  continueShoppingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  
    
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "600",
  },
});
