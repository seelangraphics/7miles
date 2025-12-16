// components/CategoryFilter.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilterContainer}
            contentContainerStyle={styles.categoryFilterContent}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.categoryChip,
                        activeCategory === category && styles.activeCategoryChip
                    ]}
                    onPress={() => onSelectCategory(category)}
                >
                    <Text style={[
                        styles.categoryChipText,
                        activeCategory === category && styles.activeCategoryChipText
                    ]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    categoryFilterContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        backgroundColor: '#fff',
    },
    categoryFilterContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCategoryChip: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeCategoryChipText: {
        color: '#fff',
    },
});

export default CategoryFilter;