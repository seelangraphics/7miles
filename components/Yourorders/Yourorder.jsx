import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { getDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/Firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const [useremail, setuserEmail] = useState('');
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'milesusers', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.name || '');
        setuserEmail(userData.email || '');
        
        const orders = userData.orders || [];
        
        // Sort by date (newest first)
        const sortedOrders = [...orders].sort((a, b) => {
          const dateA = a.createdAt?.toDate 
            ? a.createdAt.toDate().getTime() 
            : new Date(a.timestamp || 0).getTime();
          const dateB = b.createdAt?.toDate 
            ? b.createdAt.toDate().getTime() 
            : new Date(b.timestamp || 0).getTime();
          return dateB - dateA;
        });
        
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  };

  const MAIL_ENDPOINT =
    "https://xmyml3xjs0.execute-api.ap-south-1.amazonaws.com/send-email";

  const sendOrderCancelEmail = async (order) => {
    try {
      const payload = {
        storeType: "7miles",
        to: useremail,
        username: username,
        subject: `Order Cancelled #${order.orderId}`,
        message: `
          <div style="font-family:Arial;">
            <h2>Your order has been cancelled</h2>
            <p>Hello ${username},</p>
            <p>We wanted to let you know that your order <strong>#${order.orderId}</strong> has been cancelled as per your request.</p>
            <p>If the payment was already made, refund will be processed within 3–5 working days.</p>
            <br />
            <p>Thanks for shopping with 7miles.</p>
            <p>Team 7miles</p>
          </div>
        `,
        orderid: order.orderId,
      };

      await axios.post(MAIL_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });

      return true;

    } catch (err) {
      console.log("Cancel email error →", err.response?.data || err.message);
      return false;
    }
  };

  const deleteOrderFromFirestore = async (orderId) => {
    const user = auth.currentUser;

    if(!user) return;

    const ref = doc(db, "milesusers", user.uid);

    await updateDoc(ref, {
      orders: orders.filter(o => o.orderId !== orderId)
    });

    // refresh UI
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  };

  const handleCancelOrder = (order) => {
    Alert.alert(
      "Cancel Order",
      `Are you sure you want to cancel order #${order.orderId}? This action cannot be undone.`,
      [
        { text: "Keep Order", style: "cancel" },

        {
          text: "Cancel Order",
          style: "destructive",
          onPress: async () => {

            try {

              const response = await sendOrderCancelEmail(order);

              if(!response){
                console.log("Email failed → not deleting order");
                return;
              }

              await deleteOrderFromFirestore(order.orderId);

              Alert.alert(
                "Order Cancelled!",
                `Order #${order.orderId} has been successfully cancelled.`
              );

            } catch (error) {
              console.log("Cancel failed", error);
            }
          },
        },
      ]
    );
  };

  // Render Product Item
  const renderProductItem = (item, index) => {
    const productName = item.name || 'Unnamed Product';
    const quantity = item.quantity || 1;
    const price = item.price || 0;
    const total = price * quantity;

    return (
      <View key={index} style={styles.productItem}>
        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          <View style={styles.productMeta}>
            <Text style={styles.productQuantity}>
              Qty: {quantity}
            </Text>
            <Text style={styles.productPrice}>
              ₹{price.toLocaleString('en-IN')} 
            </Text>
          </View>
        </View>

        {/* Product Total */}
        <View style={styles.productTotal}>
          <Text style={styles.productTotalText}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
    );
  };

  // Render Order Item
  const renderOrderItem = ({ item: order }) => {
    const canCancel = order.status !== 'cancelled' && order.status !== 'delivered';
    const statusConfig = {
      pending: { color: '#FFFFFF', label: '', icon: '' },
      processing: { color: '#e7272b', label: 'Processing', icon: 'package-variant' },
      delivered: { color: '#10B981', label: 'Delivered', icon: 'check-circle' },
      cancelled: { color: '#DC2626', label: 'Cancelled', icon: 'close-circle' },
      shipped: { color: '#3B82F6', label: 'Shipped', icon: 'truck' },
    };
    
    const status = order.status?.toLowerCase() || 'pending';
    const config = statusConfig[status] || statusConfig.pending;

    return (
      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            {/* <Icon name="package-variant-closed" size={20} color="#e7272b" /> */}
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{order.orderId || 'N/A'}</Text>
              <Text style={styles.orderDate}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
            <Icon name={config.icon} size={12} color={config.color} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Ordered Items</Text>
          
          {order.items && order.items.length > 0 ? (
            <View style={styles.productsList}>
              {order.items.map((item, index) => renderProductItem(item, index))}
            </View>
          ) : (
            <View style={styles.noProducts}>
              <Icon name="package-variant-remove" size={24} color="#9CA3AF" />
              <Text style={styles.noProductsText}>No products in this order</Text>
            </View>
          )}
        </View>

        {/* Order Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Order Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(order.priceDetails?.total || order.totalAmount || 0)}
            </Text>
          </View>

          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(order)}
            >
              <Icon name="close-circle-outline" size={16} color="#DC2626" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render Header


  // Loading State
  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#e7272b" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </View>
    );
  }

  // Empty State
  if (orders.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.emptyScrollContainer}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <Icon name="package-variant" size={80} color="#E5E7EB" />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>
              You haven't placed any orders. Start shopping to see them here!
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate("Categories")}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => `${item.orderId || 'order'}_${index}`}
        // ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#e7272b']}
            tintColor="#e7272b"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loaderCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    maxWidth: '80%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  orderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
  },
  orderDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  productsList: {
    gap: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 4,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 18,
  },
  productMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  productQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  productPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
  productTotal: {
    marginLeft: 8,
  },
  productTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  noProducts: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  noProductsText: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  orderFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 8,
  },
  footerSpace: {
    height: 20,
  },
  emptyScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  shopButton: {
    backgroundColor: '#e7272b',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
