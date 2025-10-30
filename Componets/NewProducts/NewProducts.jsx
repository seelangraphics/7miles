import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

import { products } from '../data/7mils_Products';
import { useCart } from '../context/CartContext';

const NewProducts = () => {
    const [addedItems, setAddedItems] = useState({});
    const [quantities, setQuantities] = useState({});
    const navigation = useNavigation();
    const { addToCart, updateQuantity } = useCart();

    const newProducts = products.filter(product => product.Newproducts === "yes");

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

    const calculateDiscount = (regular, sale) => {
        return Math.round(((regular - sale) / regular) * 100);
    };

    const ProductCard = ({ product, index }) => {
        const isEven = index % 2 === 0;
        const quantity = quantities[product.name] || 0;
        const isAdded = addedItems[product.name];

        return (
            <TouchableOpacity 
                style={[
                    styles.productCard,
                    { backgroundColor: isEven ? '#f3eeea' : '#f3eeea' }
                ]}
                onPress={() => navigation.navigate("ProductDetails", { product: product })}
            >
                {/* Product Image - Fixed Height */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={product.image}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    
                    {/* Discount Badge */}
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {calculateDiscount(product.regular_price, product.sale_price)}% OFF
                        </Text>
                    </View>
                </View>

                {/* Product Info - Fixed Height Container */}
                <View style={styles.productInfo}>
                    {/* Product Name with Fixed Height */}
                    <View style={styles.productNameContainer}>
                        <Text style={[
                            styles.productName,
                            { color: isEven ? '#000' : '#000' }
                        ]} numberOfLines={2}>
                            {product.name}
                        </Text>
                    </View>
                    
                    <Text style={[
                        styles.productCategory,
                        { color: isEven ? '#000' : '#666' }
                    ]}>
                        {product.category}
                    </Text>

                    {/* Price Section */}
                    <View style={styles.priceContainer}>
                        <Text style={[
                            styles.salePrice,
                            { color: isEven ? '#000' : '#000' }
                        ]}>
                            ₹{product.sale_price}
                        </Text>
                        <Text style={[
                            styles.regularPrice,
                            { color: isEven ? '#000' : '#999' }
                        ]}>
                            ₹{product.regular_price}
                        </Text>
                    </View>

                    {/* Quantity Controls or Add Button */}
                    {isAdded ? (
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity 
                                style={[
                                    styles.quantityButton,
                                    { backgroundColor: isEven ? '#000' : '#ddd' }
                                ]}
                                onPress={() => handleQuantityChange(product, -1)}
                            >
                                <Text style={[
                                    styles.quantityText,
                                    { color: isEven ? '#fff' : '#000' }
                                ]}>
                                    -
                                </Text>
                            </TouchableOpacity>
                            
                            <Text style={[
                                styles.quantity,
                                { color: isEven ? '#000' : '#000' }
                            ]}>
                                {quantity}
                            </Text>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.quantityButton,
                                    { backgroundColor: isEven ? '#333' : '#ddd' }
                                ]}
                                onPress={() => handleQuantityChange(product, 1)}
                            >
                                <Text style={[
                                    styles.quantityText,
                                    { color: isEven ? '#fff' : '#000' }
                                ]}>
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={[
                                styles.addToCartButton,
                                { 
                                    backgroundColor: isEven ? '#000' : '#000',
                                    borderWidth: isEven ? 0 : 2,
                                    borderColor: '#000'
                                }
                            ]}
                            onPress={() => handleAddToCart(product)}
                        >
                            <Ionicons 
                                name="cart-outline" 
                                size={16} 
                                color={isEven ? '#fff' : '#fff'} 
                            />
                            <Text style={[
                                styles.addToCartText,
                                { color: isEven ? '#fff' : '#fff' }
                            ]}>
                                ADD
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (newProducts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No new products available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>New Arrivals</Text>
                <Text style={styles.subtitle}>Fresh products just for you</Text>
            </View>

            {/* Products Grid - 2 per row */}
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsGrid}
            >
                <View style={styles.productsRow}>
                    {newProducts.map((product, index) => (
                        <View key={product.name + index} style={styles.productWrapper}>
                            <ProductCard product={product} index={index} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 12,
    },
    header: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    productsGrid: {
        paddingBottom: 20,
    },
    productsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productWrapper: {
        width: '48%',
        marginBottom: 16,
    },
    productCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        height: 320,
    },
    imageContainer: {
        position: 'relative',
        height: 160,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#48bb78',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    discountText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
    },
    productInfo: {
        padding: 14,
        height: 140,
        justifyContent: 'space-between',
    },
    productNameContainer: {
        height: 40,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
        letterSpacing: -0.2,
        flexWrap: 'wrap',
    },
    productCategory: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: '600',
        marginTop: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
        marginTop: 4,
    },
    salePrice: {
        fontSize: 18,
        fontWeight: '800',
        marginRight: 6,
    },
    regularPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        marginTop: 4,
    },
    addToCartText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginTop: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '700',
    },
    quantity: {
        fontSize: 16,
        fontWeight: '700',
        minWidth: 30,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default NewProducts;