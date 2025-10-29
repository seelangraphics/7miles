// components/ProductList.js
import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Image, 
    TouchableOpacity,
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const ProductList = ({ products }) => {
    const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
    const navigation = useNavigation();

    const handleAddToCart = (product) => {
        addToCart(product);
        Alert.alert(
            'Success!',
            `${product.name} added to cart`,
            [
                { 
                    text: 'Continue Shopping', 
                    style: 'cancel' 
                },
                { 
                    text: 'Go to Cart', 
                    onPress: () => navigation.navigate('Cart') 
                }
            ]
        );
    };

    const handleQuantityIncrease = (product) => {
        const currentQuantity = getItemQuantity(product.name);
        updateQuantity(product.name, currentQuantity + 1);
    };

    const handleQuantityDecrease = (product) => {
        const currentQuantity = getItemQuantity(product.name);
        if (currentQuantity === 1) {
            removeFromCart(product.name);
        } else {
            updateQuantity(product.name, currentQuantity - 1);
        }
    };

    const handleBuyNow = (product) => {
        addToCart(product);
        navigation.navigate('Cart');
    };

    const renderProductItem = ({ item }) => {
        const quantity = getItemQuantity(item.name);
        const isInCart = quantity > 0;

        return (
            <TouchableOpacity style={styles.productCard}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
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

                    {/* Cart Actions */}
                    <View style={styles.actionButtons}>
                        {isInCart ? (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity 
                                    style={styles.quantityButton}
                                    onPress={() => handleQuantityDecrease(item)}
                                >
                                    <Text style={styles.quantityText}>-</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.quantity}>{quantity}</Text>
                                
                                <TouchableOpacity 
                                    style={styles.quantityButton}
                                    onPress={() => handleQuantityIncrease(item)}
                                >
                                    <Text style={styles.quantityText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
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
                                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        
                        {/* Buy Now Button */}
                        <TouchableOpacity
                            style={styles.buyNowButton}
                            onPress={() => handleBuyNow(item)}
                        >
                            <Text style={styles.buyNowText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    productCategory: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    salePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 8,
    },
    regularPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    saveBadge: {
        backgroundColor: '#28a745',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    saveText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    badge: {
        fontSize: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 6,
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    cartButton: {
        backgroundColor: 'black',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
        marginRight: 8,
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
        marginLeft: 6,
    },
    buyNowButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
    },
    buyNowText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flex: 1,
        marginRight: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        minWidth: 30,
        textAlign: 'center',
    },
});

export default ProductList;