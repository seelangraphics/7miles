// components/SearchResultItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchResultItem = ({ item, onPress }) => {
    const discountPercentage = Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100);

    return (
        <TouchableOpacity
            style={styles.searchResultItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image 
                source={{ uri: item.image }} 
                style={styles.resultImage} 
                resizeMode="cover"
            />
            <View style={styles.resultInfo}>
                <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.resultMeta}>
                    <Text style={styles.resultCategory}>{item.category}</Text>
                    <Text style={styles.resultQuantity}>• {item.quantity}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.resultPrice}>₹{item.sale_price}</Text>
                    <Text style={styles.originalPrice}>₹{item.regular_price}</Text>
                    {discountPercentage > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                {discountPercentage}%
                            </Text>
                        </View>
                    )}
                </View>
                {item.benefits && (
                    <Text style={styles.resultBenefits} numberOfLines={1}>
                        {Array.isArray(item.benefits) ? item.benefits[0] : item.benefits}
                    </Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    resultImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    resultInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    resultName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        lineHeight: 20,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    resultCategory: {
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    resultQuantity: {
        fontSize: 12,
        color: '#999',
        marginLeft: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    resultPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 13,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    discountBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '700',
    },
    resultBenefits: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        lineHeight: 16,
    },
});

export default SearchResultItem;