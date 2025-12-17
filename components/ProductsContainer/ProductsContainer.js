// components/ProductsContainer.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { filterProducts } from '../Utils/productFilters';
import ProductList from './ProductList';
import ProductGrid from './ProductGrid';

const ProductsContainer = ({ products }) => {
    const [activeTab, setActiveTab] = useState('bestSellers');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const tabs = [
        { id: 'bestSellers', label: 'Best Sellers' },
        { id: 'new', label: 'New' },
        { id: 'trending', label: 'Trending' }
    ];

    const getFilteredProducts = () => {
        switch (activeTab) {
            case 'bestSellers':
                return filterProducts.getBestSellers(products);
            case 'trending':
                return filterProducts.getTrending(products);
            case 'new':
                return filterProducts.getNewProducts(products);
            default:
                return filterProducts.getBestSellers(products);
        }
    };

    const filteredProducts = getFilteredProducts();

    // Render header component
    const renderHeader = () => (
        <View>
            {/* View Mode Toggle */}
            <View style={styles.viewModeContainer}>
                <TouchableOpacity
                    style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode]}
                    onPress={() => setViewMode('grid')}
                >
                    <Text style={[styles.viewModeText, viewMode === 'grid' && styles.activeViewModeText]}>
                        Grid
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
                    onPress={() => setViewMode('list')}
                >
                    <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>
                        List
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Category Tabs - Using horizontal FlatList instead of ScrollView */}
            <FlatList
                horizontal
                data={tabs}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === item.id && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(item.id)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === item.id && styles.activeTabText
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Products Count */}
            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {filteredProducts.length} products found
                </Text>
            </View>
        </View>
    );

    // Render products based on view mode
    const renderProducts = () => {
        if (viewMode === 'grid') {
            return <ProductGrid products={filteredProducts} />;
        } else {
            return <ProductList products={filteredProducts} />;
        }
    };

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderProducts()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    viewModeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    viewModeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginLeft: 10,
        backgroundColor: '#f0f0f0',
    },
    activeViewMode: {
        backgroundColor: 'black',
    },
    viewModeText: {
        fontSize: 14,
        color: '#666',
    },
    activeViewModeText: {
        color: '#fff',
    },
    tabContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
    },
    activeTab: {
        backgroundColor: 'black',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
    },
    countContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    countText: {
        fontSize: 14,
        color: '#666',
    },
});

export default ProductsContainer;