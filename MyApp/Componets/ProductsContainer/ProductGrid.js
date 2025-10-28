// components/ProductGrid.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductGrid = ({ products }) => {
    const handleAddToCart = (product) => {
        console.log('Added to cart:', product.name);
        // Add your cart logic here
        // You can use context, redux, or state management
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.salePrice}>₹{item.sale_price}</Text>
                    <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
                </View>
                <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>Save ₹{item.save}</Text>
                </View>
                <View style={styles.badgeContainer}>
                    {item.bestSeller === 'yes' && (
                        <Text style={[styles.badge, styles.bestSellerBadge]}>Best Seller</Text>
                    )}
                    {item.Trending === 'yes' && (
                        <Text style={[styles.badge, styles.trendingBadge]}>Trending</Text>
                    )}
                    {item.Newproducts === 'yes' && (
                        <Text style={[styles.badge, styles.newBadge]}>New</Text>
                    )}
                    {item.powder === 'yes' && (
                        <Text style={[styles.badge, styles.powderBadge]}>Powder</Text>
                    )}
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => handleAddToCart(item)}
                >
                    <View style={styles.cartButtonContent}>
                        <Ionicons
                            name="cart-outline"
                            size={16}
                            color="#fff"
                        />
                        <Text style={styles.cartButtonText}>Add</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    productCard: {
        flex: 1,
        margin: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
        height: 32,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    salePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 5,
    },
    regularPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    saveBadge: {
        backgroundColor: '#28a745',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    saveText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    badge: {
        fontSize: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 4,
        marginBottom: 2,
        overflow: 'hidden',
    },
    bestSellerBadge: {
        backgroundColor: '#ffc107',
        color: '#000',
    },
    trendingBadge: {
        backgroundColor: '#dc3545',
        color: '#fff',
    },
    newBadge: {
        backgroundColor: '#17a2b8',
        color: '#fff',
    },
    powderBadge: {
        backgroundColor: '#6f42c1',
        color: '#fff',
    },
    cartButton: {
        backgroundColor: 'black',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginTop: 'auto',
    },
    cartButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6, // Add spacing between icon and text
    },
});

export default ProductGrid;