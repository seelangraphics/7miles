import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    Image,
    
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const CheckoutScreen = ({ navigation }) => {
    // Use the correct structure from your CartContext
    const { 
        cartItems, // This should be cartItems if that's what your context exports
        getCartTotal, 
        clearCart 
    } = useCart();
    
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePlaceOrder = () => {
        // Basic validation
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (selectedPayment === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
            Alert.alert('Error', 'Please fill in card details');
            return;
        }

        // Simulate order processing
        setOrderSuccess(true);
        setTimeout(() => {
            clearCart();
            navigation.navigate('OrderSuccess', { orderId: `ORD${Date.now()}` });
        }, 2000);
    };

    const shippingCharge = 40;
    const tax = getCartTotal() * 0.18; // 18% GST
    const finalTotal = getCartTotal() + shippingCharge + tax;

    if (orderSuccess) {
        return (
            <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                <Text style={styles.successText}>Redirecting to order details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {/* Use cartItems instead of cart.items */}
                    {cartItems && cartItems.map((item, index) => (
                        <View key={index} style={styles.cartItem}>
                            <Image source={item.image} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemCategory}>{item.category}</Text>
                                <Text style={styles.itemPrice}>₹{item.sale_price} x {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemTotal}>₹{(item.sale_price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Delivery Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Information</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChangeText={(text) => handleInputChange('fullName', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange('phone', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Delivery Address *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter complete delivery address"
                            multiline
                            numberOfLines={3}
                            value={formData.address}
                            onChangeText={(text) => handleInputChange('address', text)}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>City *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                value={formData.city}
                                onChangeText={(text) => handleInputChange('city', text)}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Pincode *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Pincode"
                                keyboardType="number-pad"
                                value={formData.pincode}
                                onChangeText={(text) => handleInputChange('pincode', text)}
                            />
                        </View>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    
                    <TouchableOpacity 
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'card' && styles.paymentOptionSelected
                        ]}
                        onPress={() => setSelectedPayment('card')}
                    >
                        <Ionicons 
                            name={selectedPayment === 'card' ? "radio-button-on" : "radio-button-off"} 
                            size={24} 
                            color={selectedPayment === 'card' ? "#007AFF" : "#666"} 
                        />
                        <Text style={styles.paymentText}>Credit/Debit Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'upi' && styles.paymentOptionSelected
                        ]}
                        onPress={() => setSelectedPayment('upi')}
                    >
                        <Ionicons 
                            name={selectedPayment === 'upi' ? "radio-button-on" : "radio-button-off"} 
                            size={24} 
                            color={selectedPayment === 'upi' ? "#007AFF" : "#666"} 
                        />
                        <Text style={styles.paymentText}>UPI Payment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'cod' && styles.paymentOptionSelected
                        ]}
                        onPress={() => setSelectedPayment('cod')}
                    >
                        <Ionicons 
                            name={selectedPayment === 'cod' ? "radio-button-on" : "radio-button-off"} 
                            size={24} 
                            color={selectedPayment === 'cod' ? "#007AFF" : "#666"} 
                        />
                        <Text style={styles.paymentText}>Cash on Delivery</Text>
                    </TouchableOpacity>

                    {/* Card Details */}
                    {selectedPayment === 'card' && (
                        <View style={styles.cardDetails}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Card Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1234 5678 9012 3456"
                                    keyboardType="number-pad"
                                    value={formData.cardNumber}
                                    onChangeText={(text) => handleInputChange('cardNumber', text)}
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.label}>Expiry Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChangeText={(text) => handleInputChange('expiryDate', text)}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>CVV</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        value={formData.cvv}
                                        onChangeText={(text) => handleInputChange('cvv', text)}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details</Text>
                    
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>₹{getCartTotal().toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Shipping Charge</Text>
                        <Text style={styles.priceValue}>₹{shippingCharge.toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Tax (18% GST)</Text>
                        <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
                    </View>
                    
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Security Info */}
                <View style={styles.securitySection}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                    <Text style={styles.securityText}>
                        Your payment information is secure and encrypted
                    </Text>
                </View>
            </ScrollView>

            {/* Checkout Footer */}
            <View style={styles.footer}>
                <View style={styles.footerPrice}>
                    <Text style={styles.footerTotal}>₹{finalTotal.toFixed(2)}</Text>
                    <Text style={styles.footerText}>Total Amount</Text>
                </View>
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <Text style={styles.placeOrderText}>PLACE ORDER</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
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
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 50,
            paddingBottom: 15,
            paddingHorizontal: 20,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
        },
        backButton: {
            padding: 5,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#000',
        },
        placeholder: {
            width: 24,
        },
        scrollView: {
            flex: 1,
            padding: 20,
        },
        section: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#000',
            marginBottom: 16,
        },
        cartItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
        },
        itemImage: {
            width: 50,
            height: 50,
            borderRadius: 8,
            marginRight: 12,
        },
        itemDetails: {
            flex: 1,
        },
        itemName: {
            fontSize: 14,
            fontWeight: '600',
            color: '#000',
            marginBottom: 2,
        },
        itemCategory: {
            fontSize: 12,
            color: '#666',
            marginBottom: 4,
        },
        itemPrice: {
            fontSize: 12,
            color: '#888',
        },
        itemTotal: {
            fontSize: 14,
            fontWeight: '700',
            color: '#000',
        },
        inputGroup: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
            marginBottom: 6,
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#fafafa',
        },
        textArea: {
            height: 80,
            textAlignVertical: 'top',
        },
        row: {
            flexDirection: 'row',
        },
        paymentOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 8,
            marginBottom: 8,
        },
        paymentOptionSelected: {
            borderColor: '#007AFF',
            backgroundColor: '#f0f8ff',
        },
        paymentText: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 12,
            color: '#333',
        },
        cardDetails: {
            marginTop: 12,
            padding: 12,
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
        },
        priceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 6,
        },
        priceLabel: {
            fontSize: 14,
            color: '#666',
        },
        priceValue: {
            fontSize: 14,
            fontWeight: '500',
            color: '#333',
        },
        totalRow: {
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            marginTop: 8,
            paddingTop: 12,
        },
        totalLabel: {
            fontSize: 16,
            fontWeight: '700',
            color: '#000',
        },
        totalValue: {
            fontSize: 18,
            fontWeight: '700',
            color: '#000',
        },
        securitySection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: '#f0f8f0',
            borderRadius: 8,
            marginBottom: 20,
        },
        securityText: {
            fontSize: 14,
            color: '#4CAF50',
            marginLeft: 8,
            fontWeight: '500',
        },
        footer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
        },
        footerPrice: {
            alignItems: 'flex-start',
        },
        footerTotal: {
            fontSize: 20,
            fontWeight: '700',
            color: '#000',
        },
        footerText: {
            fontSize: 12,
            color: '#666',
        },
        placeOrderButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#000',
            paddingHorizontal: 24,
            paddingVertical: 15,
            borderRadius: 12,
            flex: 0.7,
            justifyContent: 'center',
        },
        placeOrderText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            marginRight: 8,
        },
        successContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
        },
        successTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#000',
            marginTop: 20,
            marginBottom: 10,
        },
        successText: {
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
        },
    });

    export default CheckoutScreen;