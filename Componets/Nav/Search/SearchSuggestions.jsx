// components/SearchSuggestions.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SearchSuggestions = ({ onSearchTermSelect, onCategorySelect, categories }) => {
    const popularSearches = ['Shampoo', 'Oil', 'Powder', 'Soap', 'Facewash', 'Honey', 'Cream', 'Gel'];
    
    const categoryIcons = {
        'Hair Care': 'cut-outline',
        'Skin Care': 'body-outline',
        'Body Care': 'water-outline',
        'Wellness & Edibles': 'nutrition-outline'
    };

    return (
        <View style={styles.searchSuggestions}>
            <Ionicons name="search-outline" size={80} color="#f0f0f0" />
            <Text style={styles.suggestionsTitle}>What are you looking for?</Text>
            
            <View style={styles.quickSearches}>
                <Text style={styles.quickSearchesTitle}>Popular Searches</Text>
                <View style={styles.quickSearchChips}>
                    {popularSearches.map((term) => (
                        <TouchableOpacity
                            key={term}
                            style={styles.quickSearchChip}
                            onPress={() => onSearchTermSelect(term)}
                        >
                            <Ionicons name="search-outline" size={14} color="#666" />
                            <Text style={styles.quickSearchText}>{term}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.categoriesSection}>
                <Text style={styles.categoriesTitle}>Browse Categories</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={styles.categoryCard}
                            onPress={() => onCategorySelect(category)}
                        >
                            <View style={styles.categoryIcon}>
                                <Ionicons 
                                    name={categoryIcons[category] || 'cube-outline'} 
                                    size={24} 
                                    color="#666" 
                                />
                            </View>
                            <Text style={styles.categoryCardText} numberOfLines={2}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchSuggestions: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    suggestionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    quickSearches: {
        width: '100%',
        marginBottom: 30,
    },
    quickSearchesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    quickSearchChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    quickSearchChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    quickSearchText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    categoriesSection: {
        width: '100%',
    },
    categoriesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    categoryCard: {
        width: (width - 52) / 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    categoryCardText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default SearchSuggestions;