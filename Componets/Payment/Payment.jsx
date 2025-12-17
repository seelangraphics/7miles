import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";
import { auth, db } from "../Firebase/Firebase";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems = [], getCartTotal, clearCart } = useCart();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { address, totalAmount } = route.params || {};

  const shippingCharge = 40;
  const tax = getCartTotal() * 0.18;
  const finalTotal = totalAmount || getCartTotal() + shippingCharge + tax;

  useEffect(() => {
    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Payment Methods Data
  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      icon: "card-outline",
      description: "Pay with UPI, Cards, Net Banking",
      color: "#4F46E5",
      isActive: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "cash-outline",
      description: "Pay when you receive your order",
      color: "#10B981",
      isActive: true,
    },
  ];

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
  };

const saveOrderToFirebase = async (
  paymentMethod,
  paymentStatus = "pending"
) => {
  if (!auth.currentUser?.uid) return null;

  const orderId = generateOrderId();
  const orderData = {
    orderId,
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.sale_price,
      quantity: item.quantity,
      category: item.category,
    })),
    address: {
      name: `${address.firstName} ${address.lastName}`,
      phone: address.phone,
      address: address.addressLine1,
      address2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    },
    payment: {
      method: paymentMethod,
      status: paymentStatus,
      transactionId: paymentMethod === "razorpay" ? `TXN${Date.now()}` : null,
    },
    priceDetails: {
      subtotal: getCartTotal(),
      shipping: shippingCharge,
      tax: tax,
      total: finalTotal,
    },
    status:
      paymentMethod === "cod"
        ? "confirmed"
        : paymentStatus === "success"
        ? "confirmed"
        : "pending",
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days from now
  };

  try {
    const userRef = doc(db, "milesusers", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Create orders array if it doesn't exist
    const currentOrders = userData.orders || [];

    await updateDoc(userRef, {
      orders: [...currentOrders, orderData],
    });

    return orderData;
  } catch (error) {
    console.error("Error saving order:", error);
    Toast.show({
      type: "error",
      text1: "Failed to save order",
      text2: "Please try again",
    });
    return null;
  }
};

  const handleRazorpayPayment = async () => {
    setIsLoading(true);

    try {
      // Simulate Razorpay API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, integrate Razorpay SDK
      // const options = {
      //   description: 'Order Payment',
      //   currency: 'INR',
      //   amount: finalTotal * 100, // in paise
      //   name: 'Miles Store',
      //   order_id: 'order_123', // from your server
      //   prefill: {
      //     email: auth.currentUser?.email,
      //     contact: address?.phone,
      //     name: `${address?.firstName} ${address?.lastName}`
      //   },
      //   theme: {color: '#4F46E5'}
      // }

      // const data = await RazorpayCheckout.open(options);

      // For demo, simulate success
      const orderData = await saveOrderToFirebase("razorpay", "success");

      if (orderData) {
        setOrderDetails(orderData);
        setOrderPlaced(true);
        clearCart();

        Toast.show({
          type: "success",
          text1: "Payment Successful!",
          text2: "Your order has been placed successfully.",
        });

        // Navigate to order confirmation after delay
        setTimeout(() => {
          navigation.navigate("OrderConfirmation", { order: orderData });
        }, 2000);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Please try another payment method.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setIsLoading(true);

    try {
      const orderData = await saveOrderToFirebase("cod", "pending");

      if (orderData) {
        setOrderDetails(orderData);
        setOrderPlaced(true);
        clearCart();

        Toast.show({
          type: "success",
          text1: "Order Placed!",
          text2: "Your order has been confirmed.",
        });

        // Navigate to order confirmation after delay
        setTimeout(() => {
          navigation.navigate("OrderSuccess", { order: orderData });
        }, 2000);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      Toast.show({
        type: "info",
        text1: "Select Payment Method",
        text2: "Please choose a payment method to continue.",
      });
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Proceed with ${
        selectedMethod === "razorpay" ? "Razorpay Payment" : "Cash on Delivery"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            if (selectedMethod === "razorpay") {
              handleRazorpayPayment();
            } else {
              handleCashOnDelivery();
            }
          },
        },
      ]
    );
  };

  if (orderPlaced && orderDetails) {
    return (
      <View style={styles.successContainer}>
        <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successOrderId}>
            Order ID: {orderDetails.orderId}
          </Text>
          <Text style={styles.successText}>
            {selectedMethod === "cod"
              ? "Your order has been placed successfully. Pay when you receive your order."
              : "Payment successful! Your order has been placed."}
          </Text>
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={styles.loader}
          />
          <Text style={styles.redirectText}>
            Redirecting to order details...
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {cartItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemQuantity}>
                  Qty: {item.quantity} × ₹{item.sale_price}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ₹{(item.sale_price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₹{getCartTotal().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              ₹{shippingCharge.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (18%)</Text>
            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        {address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>
                  {address.firstName} {address.lastName}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Address")}
                >
                  <Text style={styles.changeAddressText}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.addressPhone}>{address.phone}</Text>
              <Text style={styles.addressText}>{address.addressLine1}</Text>
              {address.addressLine2 ? (
                <Text style={styles.addressText}>{address.addressLine2}</Text>
              ) : null}
              <Text style={styles.addressLocation}>
                {address.city}, {address.state} - {address.pincode}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
                !method.isActive && styles.methodCardDisabled,
              ]}
              onPress={() => method.isActive && setSelectedMethod(method.id)}
              disabled={!method.isActive}
            >
              <View style={styles.methodLeft}>
                <View
                  style={[
                    styles.methodIconContainer,
                    { backgroundColor: `${method.color}15` },
                  ]}
                >
                  <Ionicons name={method.icon} size={20} color={method.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>

              <View style={styles.methodRight}>
                {!method.isActive ? (
                  <Text style={styles.soonText}>Coming Soon</Text>
                ) : (
                  <View
                    style={[
                      styles.radioOuter,
                      selectedMethod === method.id && {
                        borderColor: method.color,
                      },
                    ]}
                  >
                    {selectedMethod === method.id && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: method.color },
                        ]}
                      />
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Payment Security Info */}
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.securityText}>
              Your payment is secure and encrypted
            </Text>
          </View>
        </View>

        {/* Terms & Conditions */}
     
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.totalAmount}>₹{finalTotal.toFixed(2)}</Text>
          <Text style={styles.totalLabelBottom}>Total Payable</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedMethod || isLoading) && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>
                {selectedMethod === "cod" ? "PLACE ORDER" : "PAY NOW"}
              </Text>
              <Ionicons name="lock-closed" size={14} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  headerRight: {
    width: 28,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  editText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 11,
    color: "#4F46E5",
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  changeAddressText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  addressPhone: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 16,
    marginBottom: 2,
  },
  addressLocation: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  methodCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#F5F3FF",
  },
  methodCardDisabled: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  methodRight: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  soonText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  securityText: {
    fontSize: 12,
    color: "#065F46",
    marginLeft: 8,
    fontWeight: "500",
  },
  termsSection: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 8,
    padding: 16,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  bottomLeft: {
    alignItems: "flex-start",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
  },
  totalLabelBottom: {
    fontSize: 12,
    color: "#6B7280",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowColor: "#9CA3AF",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 8,
  },
  successOrderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  loader: {
    marginVertical: 20,
  },
  redirectText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
});
