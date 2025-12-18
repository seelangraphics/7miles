// components/MarqueeBannerLightweight.js
import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MarqueeBannerLightweight = () => {
    const scrollViewRef = useRef(null);
    const items = [
        {
            text: "Natural Ingredients",
            icon: "leaf-outline",
            color: "#4CAF50"
        },
        {
            text: "Eco-Friendly",
            icon: "earth-outline",
            color: "#2196F3"
        },
        {
            text: "Affordable for All",
            icon: "cash-outline",
            color: "#FF9800"
        },
        {
            text: "Premium Quality",
            icon: "diamond-outline",
            color: "#9C27B0"
        }
    ];

    // Duplicate items for seamless scroll
    const allItems = [...items, ...items, ...items];

    useEffect(() => {
        let scrollX = 0;
        const scrollSpeed = 0.5; // Adjust speed here
        
        const animate = () => {
            if (scrollViewRef.current) {
                scrollX += scrollSpeed;
                // Reset when scrolled through one set of items
                if (scrollX >= 400) { // Adjust based on content width
                    scrollX = 0;
                }
                scrollViewRef.current.scrollTo({ x: scrollX, animated: false });
            }
            requestAnimationFrame(animate);
        };
        
        const animationId = requestAnimationFrame(animate);
        
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <View style={stylesLight.container}>
            <View style={stylesLight.overlayLeft} />
            
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                style={stylesLight.scrollView}
                contentContainerStyle={stylesLight.contentContainer}
            >
                {allItems.map((item, index) => (
                    <View key={index} style={stylesLight.item}>
                        <Ionicons name={item.icon} size={16} color={item.color} />
                        <Text style={stylesLight.text}>{item.text}</Text>
                        {index < allItems.length - 1 && (
                            <View style={stylesLight.separator} />
                        )}
                    </View>
                ))}
            </ScrollView>
            
            <View style={stylesLight.overlayRight} />
        </View>
    );
};

const stylesLight = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: '#f3eeea',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 6,
    },
    separator: {
        width: 1,
        height: 16,
        backgroundColor: '#ddd',
        marginLeft: 20,
    },
    overlayLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 20,
        backgroundColor: '#f3eeea',
        zIndex: 1,
    },
    overlayRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 20,
        backgroundColor: '#f3eeea',
        zIndex: 1,
    },
});

export default MarqueeBannerLightweight;