// screens/ProductsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductsContainer from './ProductsContainer';
import { products } from '../data/7mils_Products'; // Your products array

const ProductsScreen = () => {
    return (
        <View style={styles.container}>
            <ProductsContainer products={products} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default ProductsScreen;