// components/SearchBar.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({
    onSearch,
    onClose,
    placeholder = "Search products..."
}) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        onSearch && onSearch(searchText);
    };

    const handleClose = () => {
        setSearchText('');
        onClose && onClose();
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    autoFocus={true}
                    returnKeyType="search"
                    placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 8,
        marginRight: 8,
    },
    closeButton: {
        marginLeft: 8,
    },
    closeText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SearchBar;