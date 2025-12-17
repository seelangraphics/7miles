import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderSuccessScreen = ({ navigation, route }) => {
  const { order } = route.params || {};
  const orderId = order?.orderId || `ORD${Date.now()}`;

  const handleShareInvoice = async () => {
    try {
      const invoiceText = `Order Invoice - 7Miles\n\nOrder ID: ${orderId}\nDate: ${new Date().toLocaleDateString()}\nTotal: ₹${
        order?.priceDetails?.total?.toFixed(2) || "0.00"
      }\nStatus: ${
        order?.status || "Confirmed"
      }\n\nThank you for shopping with 7Miles!`;

      await Share.share({
        message: invoiceText,
        title: "Order Invoice",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share invoice");
    }
  };

  const handleViewInvoice = () => {
    navigation.navigate("Invoice", { order });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your order has been successfully placed
          </Text>
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Order Date</Text>
            <Text style={styles.summaryValue}>
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>
              {order?.payment?.method === "cod"
                ? "Cash on Delivery"
                : "Razorpay"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {order?.status === "confirmed" ? "Confirmed" : "Pending"}
              </Text>
            </View>
          </View>

          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{order?.priceDetails?.total?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color="#4F46E5" />
            <Text style={styles.cardTitle}>Delivery Information</Text>
          </View>

          <Text style={styles.deliveryText}>
            Estimated delivery: 3-5 business days
          </Text>
          <Text style={styles.noteText}>
            You'll receive tracking details via SMS & email
          </Text>
        </View>

        {/* What's Next Steps */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What's Next?</Text>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Order confirmation sent to your email
            </Text>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Your order will be processed and shipped
            </Text>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Track your order in real-time</Text>
          </View>
        </View>

        {/* Invoice Actions */}
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <Ionicons name="receipt-outline" size={24} color="#4F46E5" />
            <Text style={styles.invoiceTitle}>Order Invoice</Text>
          </View>

          <Text style={styles.invoiceText}>
            Download or share your order invoice
          </Text>

          <View style={styles.invoiceButtons}>
            <TouchableOpacity
              style={[styles.invoiceBtn, styles.viewInvoiceBtn]}
              onPress={handleViewInvoice}
            >
              <Ionicons name="eye-outline" size={16} color="#4F46E5" />
              <Text style={styles.viewInvoiceText}>View Invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.invoiceBtn, styles.shareInvoiceBtn]}
              onPress={handleShareInvoice}
            >
              <Ionicons name="share-outline" size={16} color="#fff" />
              <Text style={styles.shareInvoiceText}>Share Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Ionicons name="headset-outline" size={24} color="#4F46E5" />
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Our customer support team is here to help you
          </Text>
          <Text style={styles.supportContact}>support@7miles.com</Text>
          <Text style={styles.supportContact}>+91 98765 43210</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.continueBtn]}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, styles.ordersBtn]}
          onPress={() => navigation.navigate("MyOrders")}
        >
          <Ionicons name="list-outline" size={18} color="#4F46E5" />
          <Text style={styles.ordersBtnText}>View My Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  orderId: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  totalItem: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#6B7280",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  invoiceCard: {
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  invoiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
  },
  invoiceText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  invoiceButtons: {
    flexDirection: "row",
    gap: 12,
  },
  invoiceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  viewInvoiceBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  shareInvoiceBtn: {
    backgroundColor: "#4F46E5",
  },
  viewInvoiceText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
  shareInvoiceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  supportSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  supportContact: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  continueBtn: {
    backgroundColor: "#4F46E5",
  },
  ordersBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  ordersBtnText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default OrderSuccessScreen;
