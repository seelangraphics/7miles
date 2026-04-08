import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    StyleSheet,
    FlatList,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from '../context/CartContext';

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const Powder = () => {
    const [products, setProducts] = useState([]);
    const [addedItems, setAddedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigation = useNavigation();
    const { addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart(); // Added wishlist functions

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${PRODUCTS_API}?nocache=${Date.now()}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const powderProducts = products.filter(product => product.powder === "yes");

    const handleAddToCart = (product, e) => {
        if (e) e.stopPropagation();
        setAddedItems(prev => ({ ...prev, [product.name]: true }));
        setQuantities(prev => ({ ...prev, [product.name]: 1 }));
        addToCart(product);
    };

    const handleQuantityChange = (product, change, e) => {
        if (e) e.stopPropagation();
        const currentQty = quantities[product.name] || 0;
        const newQty = Math.max(0, currentQty + change);
        
        setQuantities(prev => ({ ...prev, [product.name]: newQty }));
        updateQuantity(product.name, newQty);
        
        if (newQty === 0) {
            setAddedItems(prev => ({ ...prev, [product.name]: false }));
        }
    };

    const handleWishlistToggle = (product, e) => {
        if (e) e.stopPropagation();
        toggleWishlist(product);
    };

    if (powderProducts.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>Powder Products</Text>
                            <Text style={styles.subtitle}>Finely ground quality powders</Text>
                        </View>
                    </View>
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No powder products available</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const renderProductCard = ({ item: product, index }) => (
        <ProductCard 
            product={product}
            index={index}
            quantity={quantities[product.name] || 0}
            isAdded={addedItems[product.name]}
            isWishlisted={isInWishlist(product.name)}
            onAdd={(e) => handleAddToCart(product, e)}
            onQuantityChange={(change, e) => handleQuantityChange(product, change, e)}
            onWishlistToggle={(e) => handleWishlistToggle(product, e)}
            onPress={() => navigation.navigate("ProductDetails", { product })}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Powder Products</Text>
                        <Text style={styles.subtitle}>Finely ground quality powders</Text>
                    </View>
                </View>

                {/* Products Grid */}
                <FlatList
                    data={powderProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item, index) => item.name + index}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={[
                        styles.gridContent,
                        { paddingBottom: 80 } // ADDED: Extra bottom padding
                    ]}
                    showsVerticalScrollIndicator={true}
                    style={styles.listContainer}
                />
            </View>
        </SafeAreaView>
    );
};

const ProductCard = ({ 
    product, 
    index, 
    quantity, 
    isAdded, 
    isWishlisted,
    onAdd, 
    onQuantityChange, 
    onWishlistToggle,
    onPress 
}) => {
    const colors = ['#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea', '#f3eeea'];
    const bgColor = colors[index % colors.length];

    return (
        <TouchableOpacity 
            style={[styles.productCard, { backgroundColor: bgColor }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Discount Badge */}
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>Save ₹{product.save}.00</Text>
            </View>

            {/* Wishlist Icon */}
            <TouchableOpacity 
                style={styles.wishlistBtn}
                onPress={(e) => onWishlistToggle(e)}
            >
                <Ionicons 
                    name={isWishlisted ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isWishlisted ? "#EF4444" : "#666"}
                />
            </TouchableOpacity>

            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image 
                    source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
                <Text style={styles.category} numberOfLines={1}>{product.category}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.salePrice}>₹{product.sale_price}</Text>
                    <Text style={styles.regularPrice}>₹{product.regular_price}</Text>
                </View>

                {/* Add to Cart / Quantity Controls */}
                {isAdded ? (
                    <View style={styles.quantityControls}>
                        <TouchableOpacity 
                            style={styles.qtyBtn}
                            onPress={(e) => onQuantityChange(-1, e)}
                        >
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity 
                            style={styles.qtyBtn}
                            onPress={(e) => onQuantityChange(1, e)}
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.addBtn}
                        onPress={(e) => onAdd(e)}
                    >
                        <Ionicons name="cart" size={14} color="#fff" />
                        <Text style={styles.addBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        marginRight: 12,
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
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    listContainer: {
        flex: 1,
    },
    gridContent: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    productCard: {
        width: CARD_WIDTH,
        borderRadius: 16,
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
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default Powder;