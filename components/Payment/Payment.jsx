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
import axios from "axios";

import RazorpayCheckout from "react-native-razorpay";
import { Dimensions } from "react-native";
import LottieView from "lottie-react-native";
const MAIL_ENDPOINT =
  "https://xmyml3xjs0.execute-api.ap-south-1.amazonaws.com/send-email";

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems = [], getCartTotal, clearCart } = useCart();
  console.log("cart-items",cartItems)

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { address, totalAmount,shippingaddress } = route.params || {};


 const shippingCharge =shippingaddress;
  const finalTotal = totalAmount;

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

  const RAZORPAY_API_KEY =
    "https://xmyml3xjs0.execute-api.ap-south-1.amazonaws.com/order";
  const PAYMENT_API_KEY = "FqAw8dS1a7N46d8TBM9e8xEynHiGpAw6tH42GSNf";

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "milesusers", auth.currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, []);






useEffect(() => {
  if (orderPlaced) {
    const timer = setTimeout(() => {
      navigation.navigate("OrderSuccess", { order: orderDetails });
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [orderPlaced]);













  // Payment Methods Data
  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      icon: "card-outline",
      description: "Pay with UPI, Cards, Net Banking",
      color: "#F00A0A",
      isActive: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "cash-outline",
      description: "Pay when you receive your order",
      color: "#F00A0A",
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

    try {
      const userRef = doc(db, "milesusers", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return null;

      const userData = userSnap.data();

      const orderId = generateOrderId();

      const orderData = {
        orderId,
        userEmail: userData.email,
        userName: userData.name,

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.sale_price,
          quantity: item.cartQty,
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
        },

        priceDetails: {
          subtotal: getCartTotal(),
          shipping: shippingCharge,
          total: finalTotal,
        },

        status:
          paymentMethod === "cod"
            ? "confirmed"
            : paymentStatus === "success"
            ? "confirmed"
            : "pending",

        createdAt: new Date().toISOString(),
      };

      const currentOrders = userData.orders || [];

      await updateDoc(userRef, {
        orders: [...currentOrders, orderData],
      });

      return orderData;
    } catch (error) {
      console.log("Error saving order:", error);
      return null;
    }
  };

  const sendOrderPlacedEmail = async (order) => {
    try {
      const payload = {
        storeType: "7miles",
        to: order.userEmail,
        username: order.userName,
        subject: `Order Placed Successfully #${order.orderId}`,

        message: `
        <div style="font-family:Arial;">
          <h2>Your order is confirmed!</h2>
          <p>Hello ${order.userName},</p>
          <p>Thanks for shopping with <strong>7miles</strong>.</p>

          <p>Your order <strong>#${
            order.orderId
          }</strong> has been successfully placed.</p>

          <p><strong>Payment Method:</strong> ${order.payment.method.toUpperCase()}</p>
          <p><strong>Total:</strong> ₹${order.priceDetails.total}</p>
          
          <br/>
          <p>Team 7miles</p>
        </div>
      `,

        orderid: order.orderId,
      };

      console.log("Payload", JSON.stringify(payload, null, 2));
      await axios.post(MAIL_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Order placed email sent!");
      return true;
    } catch (e) {
      console.log("Email error → ", e);
      return false;
    }
  };

  const paymenthandler = async () => {
    try {
      setIsLoading(true);

      const orderbody = {
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };
      console.log("rder", orderbody);

      const headers = {
        "Content-Type": "application/json",
        "x-api-key": PAYMENT_API_KEY,
      };

      const response = await axios.post(RAZORPAY_API_KEY, orderbody, {
        headers,
      });

      if (!response.data?.id) {
        throw new Error("Order ID missing in response");
      }

      return response.data.id;
    } catch (error) {
      console.error("Payment API error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {



  if (!cartItems || cartItems.length === 0) {
    Toast.show({
      type: "error",
      text1: "Cart is empty!",
      text2: "Add items to cart before placing order.",
    });
    return;
  }


    try {
      setIsLoading(true);

      // Step 1: Generate backend razorpay order first
      const razorpayOrderId = await paymenthandler();
      console.log("razorepay", razorpayOrderId);
      if (!razorpayOrderId) throw new Error("Order creation failed");

      // Step 2: Open Razorpay checkout
      const options = {
        description: "7Miles Order Payment",
        currency: "INR",
        key: "rzp_live_b0fy47YNnCNRK8",
        name: "7Miles",
        orderId: razorpayOrderId,
        amount: Math.round(finalTotal * 100),
        prefill: {
          email: userData?.email || "",
          contact: userData?.phone || "",
          name: userData?.name || "",
        },

        theme: { color: "#007AFF" },
      };

      console.log("options", options);

      const paymentData = await RazorpayCheckout.open(options);
      console.log("[5] Payment response:", paymentData);

      if (!paymentData.razorpay_payment_id) {
        throw new Error("Payment verification failed");
      }
      // Step 3: Check success
      if (!paymentData.razorpay_payment_id) {
        return;
      }

      console.log("Payment Success ✔️");

      // Step 4: Save order to Firestore
      const orderData = await saveOrderToFirebase("razorpay", "success");

      if (!orderData) throw new Error("Order save failed");

      // Step 5: Trigger email
      await sendOrderPlacedEmail(orderData);
setOrderDetails(orderData);
    
      Toast.show({
        type: "success",
        text1: "Payment Successful",
      });

    
    navigation.navigate("OrderProcessingScreen", { order: orderData });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleCashOnDelivery = async () => {
  if (!cartItems || cartItems.length === 0) {
    Toast.show({
      type: "error",
      text1: "Cart is empty!",
      text2: "Add items to cart before placing order.",
    });
    return;
  }

  setIsLoading(true);

  try {
    const orderData = await saveOrderToFirebase("cod", "pending");

    if (!orderData) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Could not save order. Try again.",
      });

      setIsLoading(false);
      return;
    }
    await sendOrderPlacedEmail(orderData);
    setOrderDetails(orderData);

    Toast.show({
      type: "success",
      text1: "Order Placed!",
      text2: "Your order has been confirmed.",
    });

    navigation.navigate("OrderProcessingScreen", { order: orderData });
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

const handleProductPress = (item) => {
    // Prepare product object with all required fields
    const productDetails = {
      id: item.id || item.name,
      name: item.name,
      image: item.image,
      quantity:item.quantity,
      sale_price: item.sale_price,
      regular_price: item.regular_price || item.sale_price,
      category: item.category || "Hair Care",
      brand: item.brand || item.Brand || "Unknown Brand",
       benefits: item.benefits || item.Benefits || "Unknown Brand",
      description: item.detailed_description || "No description available",
      hair_type: item.hair_type || item.hairType || "",
      save: item.save || Math.round(((item.regular_price || item.sale_price) - item.sale_price) || 0)
    };
    
    navigation.navigate("ProductDetails", { product: productDetails });
};





  if (orderPlaced && orderDetails) {
    return (
      <View style={styles.successContainer}>
     <View style={styles.backgroundCircles}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('../animationjson/Success.json')}
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          />
          
          {/* Glow effect around the tick */}
          <View style={styles.glowEffect} />
        </View>

        {/* Success Title */}
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        
        <Text style={styles.successSubtitle}>Thank you for your order</Text>
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
              <Text style={styles.editText}>More Items</Text>
            </TouchableOpacity> */}
          </View>

          {cartItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <TouchableOpacity     onPress={() => handleProductPress(item)}>
<Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.itemImage}
              />
              </TouchableOpacity>
              
              <View style={styles.itemDetails} >
                <TouchableOpacity   onPress={() => handleProductPress(item)}>
                       <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                </TouchableOpacity>
           
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.sale_price}</Text>
            </View>
          ))}

          <Text style={styles.priceDetailsHeading}>Price Details</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₹{getCartTotal().toFixed(2)}
            </Text>
          </View>
          {/* <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.shippingValue}>₹{shippingCharge}</Text>
          </View> */}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>
        </View>

        {address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>
                  {address.firstName} {address.lastName}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("delivery")}
                >
                  <Text style={styles.changeAddressText}>Change</Text>
                </TouchableOpacity> */}
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
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
            <Text style={styles.totalLabelBottom}>Total Payable</Text>
          <Text style={styles.totalAmount}>₹{finalTotal}</Text>
        
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
              {/* <Ionicons name="lock-closed" size={15} color="#fff" /> */}
            </>
          )}
        </TouchableOpacity>
      </View>
      {/* Bottom Action Bar */}
    </Animated.View>
  );
};

export default Payment;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f4",
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#ff4757",
    opacity: 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15, // Header font size
    fontWeight: "800",
    color: "#222",
    letterSpacing: -0.2,
  },
  headerRight: {
    width: 36,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 140,
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#ff4757",
  },
  sectionTitle: {
    fontSize: 15, // Header font size
    fontWeight: "800",
    color: "#222",
    letterSpacing: -0.2,
    marginBottom:5,
  },
  editText: {
    fontSize: 13.5, // Normal font size
    color: "#ff4757",
    fontWeight: "700",
    backgroundColor: "#fff1f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffcccb",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f6f4",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f8f6f4",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13.5, // Normal font size
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
    lineHeight: 18,
  },
  itemCategory: {
    fontSize: 11.5,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 6,
    fontWeight: "500",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#ff4757",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 13.5, // Normal font size
    fontWeight: "700",
    color: "#ff4757",
  },
  divider: {
    height: 2,
    backgroundColor: "#ff4757",
    marginVertical: 16,
    borderRadius: 1,
    opacity: 0.3,
  },
  priceDetailsHeading: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#222",
    marginTop: 15,
    textAlign: "center",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginVertical: 2,
  },

  summaryLabel: {
    fontSize: 13.5,
    color: "#555",
    fontWeight: "500",
  },

  summaryValue: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#555",
  },

  shippingValue: {
    fontSize: 13.5,
    fontWeight: "600",
  },

  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 15, // Header font size
    fontWeight: "800",
    color: "#222",
    letterSpacing: 0.3,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#ff4757",
    letterSpacing: 0.5,
  },

  addressCard: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressName: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#222",
    letterSpacing: -0.1,
  },
  changeAddressText: {
    fontSize: 13.5, // Normal font size
    color: "#ff4757",
    fontWeight: "700",
    backgroundColor: "#fff1f0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  addressPhone: {
    fontSize: 13.5, // Normal font size
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 13.5, // Normal font size
    color: "#555",
    lineHeight: 18,
    marginBottom: 2,
  },
  addressLocation: {
    fontSize: 13.5, // Normal font size
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  methodCardSelected: {
    borderColor: "#ff4757",
    backgroundColor: "#fff9f9",
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
  },
  methodIconContainerSelected: {
    borderColor: "#ff4757",
    backgroundColor: "#fff9f9",
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12.5,
    color: "#666",
    lineHeight: 16,
  },
  methodRight: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  soonText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
    backgroundColor: "#999",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f0fff7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  securityIcon: {
    backgroundColor: "#10b981",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  securityText: {
    fontSize: 13, // Normal font size
    color: "#065f46",
    marginLeft: 12,
    fontWeight: "600",
    flex: 1,
  },
  termsSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  termsTitle: {
    fontSize: 15, // Header font size
    fontWeight: "800",
    color: "#222",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  termsText: {
    fontSize: 13, // Normal font size
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  highlightText: {
    color: "#ff4757",
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3eeea", // changed background
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
    height: 100,
  },

  bottomLeft: {
    alignItems: "flex-start",
    bottom: 20,
  },

  totalAmount: {
    fontSize: 15, // unified font size
    fontWeight: "800",
    color: "#111",
    letterSpacing: 0.5,
  },

  totalLabelBottom: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
    marginTop: 4,
  },

  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    bottom: 20,
    elevation: 3,
  
  },

  payButtonDisabled: {
    backgroundColor: "#aaa",
    shadowColor: "#aaa",
  },

  payButtonText: {
    color: "#fff",
    fontSize: 15, // unified font size
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase", // unique design touch
  },
});
