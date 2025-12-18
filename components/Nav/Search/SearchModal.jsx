// components/SearchModal.js
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Dimensions,
    SafeAreaView,
    Keyboard,
    StatusBar,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SearchResultItem from './SearchResultItem';
import SearchSuggestions from './SearchSuggestions';
// import CategoryFilter from './CategoryFilter';

const { width } = Dimensions.get('window');

const SearchModal = ({
    visible,
    onClose,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredProducts,
    onCategoryPress,
    categories
}) => {
    const navigation = useNavigation();

    const clearSearch = () => {
        setSearchQuery('');
    };

    const dismissSearch = () => {
        Keyboard.dismiss();
        onClose();
        setSearchQuery('');
    };

    const handleProductSelect = (product) => {
        Keyboard.dismiss();
        onClose();
        setSearchQuery('');
        navigation.navigate('ProductDetails', { product });
    };

    const handleCategorySelect = (category) => {
        setActiveCategory(category);
    };

    const renderSearchResult = ({ item }) => (
        <SearchResultItem
            item={item}
            onPress={() => handleProductSelect(item)}
        />
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            statusBarTranslucent={true}
            onRequestClose={dismissSearch}
        >
            <SafeAreaView style={styles.modalSafeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                
                {/* Search Header */}
                <View style={styles.modalHeader}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products, categories, benefits..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="search"
                            onSubmitEditing={() => {
                                if (filteredProducts.length > 0) {
                                    handleProductSelect(filteredProducts[0]);
                                }
                            }}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={dismissSearch} style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>

                {/* Category Filter */}
                {/* <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={handleCategorySelect}
                /> */}

                {/* Search Results or Empty State */}
                {searchQuery.trim() ? (
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => `search-${item.id}`}
                        renderItem={renderSearchResult}
                        contentContainerStyle={styles.resultsContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyResults}>
                                <Ionicons name="search-outline" size={60} color="#e0e0e0" />
                                <Text style={styles.emptyResultsTitle}>No products found</Text>
                                <Text style={styles.emptyResultsText}>
                                    Try different keywords or check spelling
                                </Text>
                                <TouchableOpacity
                                    style={styles.clearFilterButton}
                                    onPress={clearSearch}
                                >
                                    <Text style={styles.clearFilterText}>Clear search</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                ) : (
                    <SearchSuggestions
                        onSearchTermSelect={setSearchQuery}
                        onCategorySelect={(category) => {
                            setSearchQuery('');
                            setActiveCategory(category);
                            dismissSearch();
                            onCategoryPress?.(category, 'main');
                        }}
                       
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalSafeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        padding: 0,
        includeFontPadding: false,
    },
    clearButton: {
        padding: 2,
        marginLeft: 8,
    },
    cancelButton: {
        padding: 5,
    },
    cancelText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    resultsContainer: {
        paddingBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginLeft: 98,
    },
    emptyResults: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyResultsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyResultsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    clearFilterButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    clearFilterText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
});

export default SearchModal;