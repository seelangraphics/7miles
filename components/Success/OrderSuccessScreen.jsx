import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderSuccessScreen = ({ navigation, route }) => {
  const { order } = route.params || {};
  const orderId = order?.orderId || `ORD${Date.now()}`;

// console.log('orders',order)


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ELEGANT HEADER SECTION */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBackground}>
            <View style={styles.headerDecoration}>
              <View style={styles.circleDecoration} />
              <View style={[styles.circleDecoration, styles.circle2]} />
            </View>

            <View style={styles.successHeader}>
              <View style={styles.successIconContainer}>
                <View style={styles.successIconBackground}>
                  <Ionicons name="checkmark" size={30} color="#fff" />
                </View>
              </View>

              <View style={styles.headerContent}>
                <Text style={styles.headerSubtitle}>
                  Order Placed Successfully
                </Text>
                <Text style={styles.headerMainTitle}>THANK YOU!</Text>
                <View style={styles.orderIdContainer}>
                  <Text style={styles.orderIdLabel}>Order ID:</Text>
                  <Text style={styles.orderIdValue}>#{orderId}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.orderConfirmationCard}>
            <View style={styles.confirmationRow}>
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              <Text style={styles.confirmationText}>
                Your order has been confirmed
              </Text>
            </View>
            <Text style={styles.orderNote}>
              Thank you for shopping with us. Your items will be shipped soon.
            </Text>
          </View>
        </View>

        {/* PRODUCT CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Items</Text>
            <Text style={styles.itemCount}>
              {order?.items?.length || 0} Items
            </Text>
          </View>

          {order?.items?.map((item, index) => (
            <View key={index} style={styles.productRow}>
              <Image source={{ uri: item.image }} style={styles.productImg} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
                <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}

          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={styles.addMoreBtn}
              onPress={() => navigation.navigate("Products")}
            >
              <Text style={styles.addMoreText}>Add More</Text>
            </TouchableOpacity>
            <Text style={styles.totalText}>
              Total: ₹{order?.priceDetails?.total}
            </Text>
          </View>
        </View>

        {/* DELIVERY ADDRESS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color="#e55946ff" />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>

          <View style={styles.addressCard}>
            <View style={styles.addressIcon}>
              <Ionicons name="home" size={20} color="#e54646ff" />
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>
                {order?.address?.name || "John Doe"}
              </Text>
              <Text style={styles.addressLine}>
                {order?.address?.house || "123 Main Street"}
              </Text>
              <Text style={styles.addressLine}>
                {order?.address?.street || "Downtown"}
              </Text>
              <Text style={styles.addressLine}>
                {order?.address?.city || "Mumbai"} -{" "}
                {order?.address?.pincode || "400001"}
              </Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call" size={14} color="#666" />
                <Text style={styles.addressPhone}>
                  {order?.address?.phone || "+91 9876543210"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* PAYMENT METHOD CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={18} color="#e54e46ff" />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentCard}>
            <View
              style={[
                styles.paymentIcon,
                {
                  backgroundColor:
                    order?.payment?.method === "cod" ? "#FEF3C7" : "#DBEAFE",
                },
              ]}
            >
              <Ionicons
                name={order?.payment?.method === "cod" ? "cash" : "card"}
                size={24}
                color={order?.payment?.method === "cod" ? "#D97706" : "#2563EB"}
              />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentMethod}>
                {order?.payment?.method === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </Text>
             
            </View>
          </View>
        </View>

        {/* PRICE DETAILS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt" size={18} color="#e54646ff" />
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>

          <View style={styles.priceDetails}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>
                ₹{order?.priceDetails?.subtotal || "0"}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping</Text>
              <Text style={styles.priceValue}>
                {order?.priceDetails?.shipping === 0
                  ? "Free"
                  : `₹${order?.priceDetails?.shipping || "0"}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.priceRow, styles.totalRow]}>
              <View>
                <Text style={styles.totalLabel}>Total Amount</Text>
    
              </View>
              <Text style={styles.totalAmount}>
                ₹{order?.priceDetails?.total || "0"}
              </Text>
            </View>
          </View>
        </View>

   
      </ScrollView>

      {/* ELEGANT FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Ionicons name="cart" size={20} color="#fff" style={styles.btnIcon} />
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 160,
  },

  // ELEGANT HEADER STYLES
  headerContainer: {
    marginBottom: 20,
  },
  headerBackground: {
    backgroundColor: "#d2c1e2",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  headerDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circleDecoration: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: 50,
    left: -50,
  },
  successHeader: {
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerContent: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  headerMainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 1,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderIdLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginRight: 6,
  },
  orderIdValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  orderConfirmationCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginLeft: 10,
  },
  orderNote: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // CARD STYLES
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginLeft: 10,
  },
  itemCount: {
    marginLeft: "auto",
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "600",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  productImg: {
    width: 65,
    height: 65,
    borderRadius: 12,
    marginRight: 16,
  },

  productInfo: {
    flex: 1,
    justifyContent: "flex-start",
  },

  productName: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },

  productPrice: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  productQuantity: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4F46E5",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  totalText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  addMoreBtn: {
    backgroundColor: "#1d1c23ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addMoreText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "700",
  },

  // ADDRESS CARD
  addressCard: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13.5,
    color: "#555",
    marginBottom: 2,
    lineHeight: 18,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  addressPhone: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
  },

  // PAYMENT CARD
  paymentCard: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  paymentStatus: {
    fontSize: 13,
    color: "#666",
  },

  // PRICE DETAILS
  priceDetails: {
    paddingHorizontal: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: "#111",
    fontWeight: "700",
  },
  taxNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4F46E5",
  },

  // TRACKING CARD
  trackingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  trackingContent: {
    flex: 1,
    marginLeft: 12,
  },
  trackingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  trackingDate: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "600",
  },
  trackButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // ELEGANT FOOTER
  footer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
  },
  continueBtn: {
    backgroundColor: "#1d1c23ff",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnIcon: {
    marginRight: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginHorizontal: 8,
  },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4F46E5",
  },
});

export default OrderSuccessScreen;
