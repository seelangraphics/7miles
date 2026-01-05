// screens/WishlistScreen.js
import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const CARD_WIDTH = 160;

const WishlistScreen = () => {
    const navigation = useNavigation();
    const {
        wishlistItems,
        toggleWishlist,
        addToCart,
        updateQuantity,
        cartItems,
        isInCart,
        getItemQuantity
    } = useCart();

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleQuantityChange = (product, change, e) => {
        e.stopPropagation();
        const currentQty = getItemQuantity(product.name);
        const newQty = Math.max(0, currentQty + change);

        if (newQty === 0) {
            updateQuantity(product.name, 0);
        } else if (currentQty === 0) {
            addToCart(product);
        } else {
            updateQuantity(product.name, newQty);
        }
    };

    const renderProductCard = ({ item, index }) => {
        const colors = ['#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea'];
        const bgColor = colors[index % colors.length];
        const isItemInCart = isInCart(item.name);
        const cartQuantity = getItemQuantity(item.name);

        return (
            <TouchableOpacity
                style={[styles.productCard, { backgroundColor: bgColor }]}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
                activeOpacity={0.9}
            >
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>Save ₹{item.save}.00</Text>
                </View>

                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                    }}
                >
                    <Ionicons name="heart" size={16} color="#EF4444" />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image
                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.category} numberOfLines={1}>
                        {item.category}
                    </Text>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.salePrice}>₹{item.sale_price}</Text>
                        <Text style={styles.regularPrice}>₹{item.regular_price}</Text>
                    </View>

                    {isItemInCart ? (
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={(e) => handleQuantityChange(item, -1, e)}
                            >
                                <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{cartQuantity}</Text>
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

    if (wishlistItems.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color="#E5E7EB" />
                    <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
                    <Text style={styles.emptyText}>
                        Add items you love to your wishlist
                    </Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.shopButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <View style={styles.header}>


                </View>

                <View style={styles.wishlistInfo}>
                    <View style={styles.wishlistHeader}>
                        <View>
                            <Text style={styles.wishlistCount}>
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                            </Text>
                            <Text style={styles.wishlistSubtitle}>
                                Items you've saved for later
                            </Text>
                        </View>

                    </View>
                </View>

                <FlatList
                    data={wishlistItems}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}

                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    cartButton: {
        position: 'relative',
        padding: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    wishlistInfo: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    wishlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wishlistCount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    wishlistSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    moveAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    moveAllText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    wishlistNote: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        fontStyle: 'italic',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 32,
    },
    productCard: {
        width: CARD_WIDTH,
        borderRadius: 16,
        marginBottom: 16,
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
        width: CARD_WIDTH,
        height: CARD_WIDTH * 0.75,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default WishlistScreen;