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
  Image,
} from 'react-native';
import {  getDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/Firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { doc, updateDoc } from "firebase/firestore";

export default function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const [useremail, setuserEmail] = useState('');

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
  "https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/send-email";




const sendOrderCancelEmail = async (order) => {
  try {
    const payload = {
      storeType: "tinykarts",
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
    console.log("❌ Cancel email error →", err.response?.data || err.message);
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


  // Render Product Item with Image
  const renderProductItem = (item, index) => {
    const productImage = item.image || item.imageUrl || item.thumbnail;
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
          <Text style={styles.productQuantity}>
            Qty: {quantity}
          </Text>
          <Text style={styles.productPrice}>
            ₹{price.toLocaleString('en-IN')} each
          </Text>
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
      pending: { color: '#F59E0B', label: 'Pending', icon: 'clock-outline' },
      processing: { color: '#3B82F6', label: 'Processing', icon: 'package-variant' },
      delivered: { color: '#10B981', label: 'Delivered', icon: 'check-circle' },
      cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'close-circle' },
    };
    
    const status = order.status?.toLowerCase() || 'pending';
    const config = statusConfig[status] || statusConfig.pending;

    return (
      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Icon name="package-variant-closed" size={20} color="#3B82F6" />
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{order.orderId || 'N/A'}</Text>
              <Text style={styles.orderDate}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
          </View>
          
         
        </View>

        {/* Product Details */}
        <View style={styles.productsSection}>
          
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
              {formatCurrency(order.total)}
            </Text>
          </View>

          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(order)}
            >
              <Icon name="close-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render Header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>
          {username ? `Welcome back, ${username}` : 'Track your orders'}
        </Text>
      </View>
      
    
    </View>
  );

  // Loading State
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  // Empty State
  if (orders.length === 0 && !loading) {
    return (
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
          onPress={() => console.log('Navigate to shop')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => `${item.orderId || 'order'}_${index}`}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfo: {
    marginLeft: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  productsList: {
    gap: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
  productTotal: {
    marginLeft: 12,
  },
  productTotalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
    fontSize: 14,
    color: '#9CA3AF',
  },
  orderFooter: {
    paddingTop: 20,
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
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});




// await saveOrderToFirebase("razorpay", "success");
// await sendOrderPlacedEmail(orderData);
