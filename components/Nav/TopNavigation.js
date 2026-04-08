import Constants from 'expo-constants';
import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import SearchModal from './Search/SearchModal';
import CartButton from './Search/CartButton';

// Get the URLs from environment variables
const LOGO_URL = Constants.expoConfig.extra?.LOGO_URL || "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png";
const PRODUCTS_API = Constants.expoConfig.extra.PRODUCTS_API;

const TopNavigation = ({ onCategoryPress, onCartPress }) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const navigation = useNavigation();
    const { getCartItemsCount, wishlistItems, isInWishlist } = useCart(); // Add isInWishlist

    // Get wishlist count
    const wishlistCount = useMemo(() => {
        return wishlistItems ? wishlistItems.length : 0;
    }, [wishlistItems]);

    // Fetch products from AWS
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${PRODUCTS_API}?nocache=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Transform the data to match the expected format
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.products && Array.isArray(data.products)) {
                setProducts(data.products);
            } else if (typeof data === 'object') {
                // If it's a single object, convert to array
                setProducts([data]);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            Alert.alert('Error', 'Failed to load products. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Memoized filtered products for better performance
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                (String(product.benefits || '').toLowerCase()).includes(query) ||
                (product.description?.toLowerCase() || '').includes(query) ||
                (product.quantity?.toLowerCase() || '').includes(query);

            // If a category is selected (other than 'All'), filter by category too
            if (activeCategory !== 'All') {
                return matchesSearch && product.category === activeCategory;
            }
            return matchesSearch;
        });
    }, [searchQuery, activeCategory, products]);

    const handleRetry = () => {
        fetchProducts();
    };

    // Loading component
    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#000" />
            <Text style={styles.loadingText}>Loading products...</Text>
        </View>
    );

    // Error component
    const renderError = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load products</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Bar with Logo and Icons */}
            <View style={styles.topBar}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: LOGO_URL }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Action Icons */}
                <View style={styles.iconsContainer}>
                    {/* Wishlist Icon with Badge */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Wishlist')}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={wishlistCount > 0 ? "heart" : "heart-outline"}
                                size={24}
                                color={wishlistCount > 0 ? "#EF4444" : "#666"}
                            />
                            {wishlistCount > 0 && (
                                <View style={styles.wishlistBadge}>
                                    <Text style={styles.wishlistBadgeText}>
                                        {wishlistCount > 99 ? '99+' : wishlistCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Cart Icon with Badge */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onCartPress}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="bag-handle-outline" size={26} color="#333" />
                            {getCartItemsCount() > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {getCartItemsCount() > 99 ? '99+' : getCartItemsCount()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={[
                styles.searchContainer,
                isSearchFocused && styles.searchContainerFocused
            ]}>
                <Ionicons
                    name="search"
                    size={20}
                    color={isSearchFocused ? "#007AFF" : "#999"}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => {
                        setIsSearchFocused(true);
                        setSearchVisible(true);
                    }}
                    onBlur={() => setIsSearchFocused(false)}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Loading or Error State */}
            {loading && renderLoading()}
            {error && renderError()}

            {/* Search Modal */}
            <SearchModal
                visible={searchVisible}
                onClose={() => setSearchVisible(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                filteredProducts={filteredProducts}
                onCategoryPress={onCategoryPress}
                loading={loading}
                error={error}
                onRetry={handleRetry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3eeea',
        paddingTop: Constants.statusBarHeight + 10,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    wishlistBadge: {
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
    wishlistBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    logoContainer: {
        flex: 1,
    },

    logo: {
        width: 90,
        height: 40,
    },

    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    iconButton: {
        padding: 4,
    },

    cartIconContainer: {
        position: 'relative',
    },

    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },

    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f7',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    searchContainerFocused: {
        backgroundColor: '#fff',
        borderColor: '#007AFF',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        padding: 0,
    },

    clearButton: {
        padding: 4,
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
    },

    loadingText: {
        fontSize: 14,
        color: '#666',
    },

    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 12,
    },

    errorText: {
        fontSize: 14,
        color: '#FF3B30',
    },

    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },

    retryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default TopNavigation;