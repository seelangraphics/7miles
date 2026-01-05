import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const ProductList = ({ products, limit = 0, title = "Products", showViewAll = false }) => {
    const {
        addToCart,
        getItemQuantity,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist
    } = useCart();
    const navigation = useNavigation();

    const displayProducts = limit > 0 ? products.slice(0, limit) : products;

    const handleAddToCart = (product, e) => {
        if (e) e.stopPropagation();
        addToCart(product);
    };

    const handleQuantityChange = (product, change, e) => {
        if (e) e.stopPropagation();
        const current = getItemQuantity(product.name);
        const newQty = current + change;

        if (newQty <= 0) {
            removeFromCart(product.name);
        } else {
            updateQuantity(product.name, newQty);
        }
    };

    const handleWishlistToggle = (product, e) => {
        if (e) e.stopPropagation();
        toggleWishlist(product);
    };

    const renderProductItem = ({ item, index }) => {
        const quantity = getItemQuantity(item.name);
        const isWishlisted = isInWishlist(item.name);
        const discount = Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100);

        // Use a consistent background color
        const colors = ['#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea'];
        const bgColor = colors[index % colors.length];

        return (
            <TouchableOpacity
                style={[styles.productCard, { backgroundColor: bgColor }]}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
                activeOpacity={0.9}
            >
                {/* Discount Badge */}
                {discount > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>Save ₹{item.save || discount}.00</Text>
                    </View>
                )}

                {/* Wishlist Icon */}
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={(e) => handleWishlistToggle(item, e)}
                >
                    <Ionicons
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={16}
                        color={isWishlisted ? "#EF4444" : "#666"}
                    />
                </TouchableOpacity>

                {/* Product Image - Left Side */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Product Info - Right Side */}
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
                                onPress={(e) => handleQuantityChange(item, -1, e)}
                            >
                                <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={(e) => handleQuantityChange(item, 1, e)}
                            >
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={(e) => handleAddToCart(item, e)}
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
                keyExtractor={(item, index) => `${item.name}-${index}`}
                contentContainerStyle={styles.listContent}
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
    listContent: {
        paddingBottom: 8,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#f3eeea',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
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
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
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
        lineHeight: 18,
        flex: 1,
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
        width: '100%',
        maxWidth: 140,
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
        width: '100%',
        maxWidth: 140,
    },
    addBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});

export default ProductList;