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
const CARD_WIDTH = 160; // Fixed card width
const CARD_HEIGHT = 300; // Adjust height as needed

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [addedItems, setAddedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigation = useNavigation();
    const { addToCart, updateQuantity } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(PRODUCTS_API);
                const data = await response.json();
                console.log('Data',JSON.stringify(data,null,2))
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const newProducts = products.filter(product => product.Newproducts === "yes").slice(0, 6); // Limit to 6

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

    if (newProducts.length === 0) {
        return null; // Don't show if no new products
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>New Arrivals</Text>
                    <Text style={styles.subtitle}>Freshly added to our collection</Text>
                </View>
                
            </View>

            {/* Products Horizontal Scroll */}
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {newProducts.map((product, index) => (
                    <ProductCard 
                        key={product.name + index}
                        product={product}
                        index={index}
                        quantity={quantities[product.name] || 0}
                        isAdded={addedItems[product.name]}
                        onAdd={() => handleAddToCart(product)}
                        onQuantityChange={(change) => handleQuantityChange(product, change)}
                        onPress={() => navigation.navigate("ProductDetails", { product })}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const ProductCard = ({ product, index, quantity, isAdded, onAdd, onQuantityChange, onPress }) => {
    const discount = Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
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
            <TouchableOpacity style={styles.wishlistBtn}>
                <Ionicons name="heart-outline" size={16} color="#666" />
            </TouchableOpacity>

            {/* Product Image - Now FULL WIDTH */}
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

            
                {isAdded ? (
                    <View style={styles.quantityControls}>
                        <TouchableOpacity 
                            style={styles.qtyBtn}
                            onPress={() => onQuantityChange(-1)}
                        >
                            <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <TouchableOpacity 
                            style={styles.qtyBtn}
                            onPress={() => onQuantityChange(1)}
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.addBtn}
                        onPress={onAdd}
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
        // REMOVED padding from here - images will be full width
        position: 'relative',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        overflow: 'hidden', // Important for full width images
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
        width: CARD_WIDTH, // Full width
        height: CARD_WIDTH * 0.75, // 4:3 aspect ratio
        // REMOVED margins that were creating padding
    },
    productImage: {
        width: '100%', // Full width
        height: '100%', // Full height
        // REMOVED borderRadius that was creating padding effect
    },
    productInfo: {
        padding: 12, // Add padding only to the info section, not the image
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

export default NewProducts;