// components/CartButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartButton = ({ onPress, itemCount }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cartButton}>
            <View style={styles.cartIconContainer}>
                <Ionicons name="cart-outline" size={24} color="#000" />
                {itemCount > 0 && (
                    <View style={[
                        styles.cartBadge,
                        itemCount > 99 && styles.cartBadgeLarge
                    ]}>
                        <Text style={styles.cartBadgeText}>
                            {itemCount > 99 ? '99+' : itemCount}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cartButton: {
        padding: 8,
        borderRadius: 8,
    },
    cartIconContainer: {
        position: 'relative',
        padding: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d0c9c4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cartBadgeLarge: {
        minWidth: 24,
        height: 20,
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        includeFontPadding: false,
    },
});

export default CartButton;