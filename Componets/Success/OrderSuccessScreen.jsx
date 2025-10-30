import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderSuccessScreen = ({ navigation, route }) => {
    const { orderId } = route.params || { orderId: `ORD${Date.now()}` };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Success Icon */}
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
                </View>

                {/* Success Message */}
                <Text style={styles.successTitle}>Order Confirmed!</Text>
                <Text style={styles.successSubtitle}>
                    Thank you for your purchase
                </Text>

                {/* Order Details */}
                <View style={styles.orderCard}>
                    <Text style={styles.orderId}>Order ID: {orderId}</Text>
                    <Text style={styles.orderText}>
                        Your order has been successfully placed and is being processed.
                    </Text>
                    
                    <View style={styles.deliveryInfo}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.deliveryText}>
                            Expected delivery: 2-3 business days
                        </Text>
                    </View>
                </View>

                {/* Next Steps */}
                <View style={styles.stepsCard}>
                    <Text style={styles.stepsTitle}>What's Next?</Text>
                    
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <Text style={styles.stepText}>
                            You'll receive order confirmation via email
                        </Text>
                    </View>
                    
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <Text style={styles.stepText}>
                            We'll notify you when your order ships
                        </Text>
                    </View>
                    
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <Text style={styles.stepText}>
                            Track your order in real-time
                        </Text>
                    </View>
                </View>

                {/* Support Info */}
                <View style={styles.supportCard}>
                    <Ionicons name="headset-outline" size={24} color="#007AFF" />
                    <Text style={styles.supportTitle}>Need Help?</Text>
                    <Text style={styles.supportText}>
                        Contact our customer support for any questions about your order
                    </Text>
                    <Text style={styles.supportContact}>support@7miles.com • +91 9876543210</Text>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => navigation.navigate('MyOrders')}
                >
                    <Text style={styles.primaryButtonText}>View My Orders</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 60,
    },
    successIcon: {
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    orderText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    stepsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stepsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    supportCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginTop: 12,
        marginBottom: 8,
    },
    supportText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 8,
    },
    supportContact: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#000',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#000',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OrderSuccessScreen;