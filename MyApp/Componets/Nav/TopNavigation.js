// components/TopNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TopNavigation = ({
    onSearchPress,
    onCategoryPress,
    onCartPress
}) => {
    const mainCategories = ['All', 'Hair Care', 'Skin Care', 'Body Care', 'Wellness & Edibles'];

    return (
        <View style={styles.container}>
            {/* Logo and Cart Row */}
            <View style={styles.topRow}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Cart Icon */}
                <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
                    <Ionicons name="cart-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
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
                        onPress={() => onCategoryPress?.(category, 'main')}
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
        marginLeft: -20 // Added left margin as requested
    },
    logo: {
        width: 120,
        height: 40,
    },
    cartButton: {
        padding: 4,
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