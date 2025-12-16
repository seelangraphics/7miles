// components/BottomNavigation.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BottomNavigation = ({
    activeTab,
    onTabPress
}) => {
    const tabs = [
        {
            key: 'home',
            label: 'Home',
            icon: 'home-outline',
            activeIcon: 'home'
        },
        {
            key: 'categories',
            label: 'Categories',
            icon: 'grid-outline',
            activeIcon: 'grid'
        },
        {
            key: 'myorders',
            label: 'My Orders',
            icon: 'receipt-outline',
            activeIcon: 'receipt'
        },
        {
            key: 'help',
            label: 'Help',
            icon: 'help-circle-outline',
            activeIcon: 'help-circle'
        },
        {
            key: 'account',
            label: 'Account',
            icon: 'person-outline',
            activeIcon: 'person'
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.activeTab
                        ]}
                        onPress={() => onTabPress(tab.key)}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={activeTab === tab.key ? tab.activeIcon : tab.icon}
                                size={22}
                                color={activeTab === tab.key ? '#000000FF' : '#666'}
                            />
                        </View>
                        <Text
                            style={[
                                styles.tabLabel,
                                { color: activeTab === tab.key ? '#000000FF' : '#666' }
                            ]}
                            numberOfLines={1}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3eeea',
        borderTopWidth: 1,
        borderTopColor: '#d0c9c4',
        paddingBottom: 25, // Safe area for mobile buttons
    },
    navBar: {
        flexDirection: 'row',
        width: '100%',
        marginHorizontal: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 2,
        minHeight: 65,
    },
    activeTab: {
        // Optional: Add background for active tab if needed
        // backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    iconContainer: {
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: '90%',
    },
});

export default BottomNavigation;