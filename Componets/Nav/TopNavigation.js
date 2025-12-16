// components/TopNavigation.js
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import { products } from '../data/7mils_Products';
import SearchModal from './Search/SearchModal';
import CartButton from './Search/CartButton';

const TopNavigation = ({ onCategoryPress, onCartPress }) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const navigation = useNavigation();
    const { getCartItemsCount } = useCart();

    const mainCategories = ['All', 'Hair Care', 'Skin Care', 'Body Care', 'Wellness & Edibles'];

    // Memoized filtered products for better performance
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                (product.benefits?.toLowerCase() || '').includes(query) ||
                (product.description?.toLowerCase() || '').includes(query) ||
                (product.quantity?.toLowerCase() || '').includes(query);

            // If a category is selected (other than 'All'), filter by category too
            if (activeCategory !== 'All') {
                return matchesSearch && product.category === activeCategory;
            }

            return matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const handleSearchPress = () => {
        setSearchVisible(true);
    };

    const handleCategorySelect = (category) => {
        setActiveCategory(category);
        onCategoryPress?.(category, 'main');
    };

    return (
        <View style={styles.container}>
            {/* Logo and Cart Row */}
            <View style={styles.topRow}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png" }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <CartButton
                    onPress={onCartPress}
                    itemCount={getCartItemsCount()}
                />
            </View>

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
                <Ionicons name="search" size={18} color="#666" />
                <Text style={styles.searchPlaceholder}>Search "Powder"</Text>
            </TouchableOpacity>

            {/* Main Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mainCategoriesContainer}
            >
                {mainCategories.map((category, index) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.mainCategory,
                            index === 0 && styles.activeMainCategory
                        ]}
                        onPress={() => handleCategorySelect(category)}
                    >
                        <Text style={[
                            styles.mainCategoryText,
                            index === 0 && styles.activeMainCategoryText
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
                categories={mainCategories}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d0c9c4',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 40,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    logoContainer: {
        flex: 1,
        marginLeft: -20
    },
    logo: {
        width: 120,
        height: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchPlaceholder: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    mainCategoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    mainCategory: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginRight: 12,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
    },
    activeMainCategory: {
        backgroundColor: '#000000FF',
    },
    mainCategoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeMainCategoryText: {
        color: '#fff',
    },
});

export default TopNavigation;