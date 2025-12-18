import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // 2 columns with padding

const ProductGrid = ({ products, limit = 0, title = "Products", showViewAll = false }) => {
    const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
    const navigation = useNavigation();
    const [wishlist, setWishlist] = useState({});

    const displayProducts = limit > 0 ? products.slice(0, limit) : products;

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleQuantityChange = (product, change) => {
        const current = getItemQuantity(product.name);
        const newQty = current + change;

        if (newQty <= 0) {
            removeFromCart(product.name);
        } else {
            updateQuantity(product.name, newQty);
        }
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
    };

    const renderProductItem = ({ item, index }) => {
        const quantity = getItemQuantity(item.name);
        const isWishlisted = wishlist[item.id || item.name];
        const discount = Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100);

        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
                activeOpacity={0.9}
            >
                {/* Discount Badge */}
                {discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>Save ₹{item.save}.00</Text>
                    </View>
                )}

                {/* Wishlist Icon */}
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={() => toggleWishlist(item.id || item.name)}
                >
                    <Ionicons
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={16}
                        color={isWishlisted ? "#EF4444" : "#666"}
                    />
                </TouchableOpacity>

                {/* Product Image - FULL WIDTH */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.category} numberOfLines={1}>
                        {item.category || 'Category'}
                    </Text>

                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.salePrice}>₹{item.sale_price}</Text>
                        <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
                    </View>

                    {/* Cart Actions */}
                    {quantity > 0 ? (
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => handleQuantityChange(item, -1)}
                            >
                                <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => handleQuantityChange(item, 1)}
                            >
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => handleAddToCart(item)}
                        >
                            <Ionicons name="cart" size={14} color="#fff" />
                            <Text style={styles.addBtnText}>Add to Cart</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {title && (
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {showViewAll && (
                        <TouchableOpacity style={styles.viewAllBtn}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <Ionicons name="arrow-forward" size={14} color="#8B5CF6" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <FlatList
                data={displayProducts}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
                numColumns={2}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B5CF6',
        marginRight: 4,
    },
    scrollContent: {
        paddingBottom: 8,
    },
    productCard: {
        width: CARD_WIDTH,
        margin: 6,
        borderRadius: 16,
        backgroundColor: '#f3eeea',
        position: 'relative',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        zIndex: 2,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        padding: 4,
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH * 0.75, // 4:3 aspect ratio
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        padding: 12,
        paddingTop: 8,
    },
    category: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    productName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
        height: 36,
        lineHeight: 18,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    salePrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 6,
    },
    regularPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    quantity: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        minWidth: 20,
        textAlign: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 20,
        paddingVertical: 10,
        gap: 6,
    },
    addBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});

export default ProductGrid;