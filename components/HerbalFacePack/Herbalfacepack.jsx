import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    ScrollView, 
    StyleSheet,
    Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCart } from '../context/CartContext';

const PRODUCTS_API = Constants.expoConfig.extra?.PRODUCTS_API;
const CARD_WIDTH = 160;
const CARD_HEIGHT = 300;

const Herbalfacepack = () => {
    const [products, setProducts] = useState([]);
    const [addedItems, setAddedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigation = useNavigation();
    const { addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCTS_API);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Filter products with Herbalfacepack: "yes"
    const herbalProducts = products.filter(product => product.Herbalfacepack === "yes").slice(0, 6);

    const handleAddToCart = (product) => {
        setAddedItems(prev => ({ ...prev, [product.name]: true }));
        setQuantities(prev => ({ ...prev, [product.name]: 1 }));
        addToCart(product);
    };

    const handleQuantityChange = (product, change) => {
        const currentQty = quantities[product.name] || 0;
        const newQty = Math.max(0, currentQty + change);
        
        setQuantities(prev => ({ ...prev, [product.name]: newQty }));
        updateQuantity(product.name, newQty);
        
        if (newQty === 0) {
            setAddedItems(prev => ({ ...prev, [product.name]: false }));
        }
    };

    if (herbalProducts.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Herbal Face Packs</Text>
                    <Text style={styles.subtitle}>Natural ingredients for glowing skin</Text>
                </View>
                <TouchableOpacity 
                    style={styles.viewAllBtn}
                    onPress={() => navigation.navigate("Products", { 
                        category: "Herbal Face Packs",
                        products: herbalProducts 
                    })}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={14} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {herbalProducts.map((product, index) => (
                    <ProductCard 
                        key={product.id || product.name + index}
                        product={product}
                        index={index}
                        quantity={quantities[product.name] || 0}
                        isAdded={addedItems[product.name]}
                        isWishlisted={isInWishlist(product.name)}
                        onAdd={() => handleAddToCart(product)}
                        onWishlistToggle={() => toggleWishlist(product)}
                        onQuantityChange={(change) => handleQuantityChange(product, change)}
                        onPress={() => navigation.navigate("ProductDetails", { product })}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const ProductCard = ({ 
    product, 
    index, 
    quantity, 
    isAdded, 
    isWishlisted, 
    onAdd, 
    onWishlistToggle, 
    onQuantityChange, 
    onPress 
}) => {
    const colors = ['#f0f9ff', '#fef2f2', '#f0fdf4', '#fefce8', '#faf5ff', '#f0f9ff'];
    const bgColor = colors[index % colors.length];

    return (
        <TouchableOpacity 
            style={[styles.productCard, { backgroundColor: bgColor }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.discountBadge}>
                <Text style={styles.discountText}>Save ₹{product.save}.00</Text>
            </View>

            <TouchableOpacity 
                style={styles.wishlistBtn} 
                onPress={(e) => {
                    e.stopPropagation();
                    onWishlistToggle();
                }}
            >
                <Ionicons 
                    name={isWishlisted ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isWishlisted ? "#EF4444" : "#666"}
                />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image 
                    source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.category} numberOfLines={1}>
                    {product.category || 'Herbal Care'}
                </Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.salePrice}>₹{product.sale_price}</Text>
                    <Text style={styles.regularPrice}>₹{product.regular_price}</Text>
                </View>

                <View style={styles.quantitySection}>
                    {isAdded ? (
                        <View style={styles.quantityControls}>
                            <TouchableOpacity 
                                style={styles.qtyBtn}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onQuantityChange(-1);
                                }}
                            >
                                <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity 
                                style={styles.qtyBtn}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onQuantityChange(1);
                                }}
                            >
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={styles.addBtn}
                            onPress={(e) => {
                                e.stopPropagation();
                                onAdd();
                            }}
                        >
                            <Ionicons name="cart" size={14} color="#fff" />
                            <Text style={styles.addBtnText}>Add to Cart</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
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
    scrollContainer: {
        flexDirection: 'row',
    },
    scrollContent: {
        paddingRight: 16,
    },
    productCard: {
        width: CARD_WIDTH,
        borderRadius: 16,
        marginRight: 14,
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
        backgroundColor: '#10B981',
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
    quantitySection: {
        minHeight: 36,
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
        backgroundColor: '#059669',
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

export default Herbalfacepack;