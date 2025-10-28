import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';

// Import your images (make sure paths are correct)
const img1 = require("../../assets/skin/s3.webp");
const img2 = require("../../assets/Wellnes/w3.webp");
const img3 = require("../../assets/body/b3.webp");

const { width } = Dimensions.get('window');

const SevenMile = () => {
    // Enhanced JSON data structure with images
    const appData = {
        header: {
            title: "STYLISH + NATURAL + AFFORDABLE",
            subtitle: "Nature Meets Style – Discover 7Miles",
            description: "From skincare to self-care, discover handcrafted goodness with a stylish twist – only at 7Miles."
        },
        categories: [
            {
                name: "EDIBLE FOODS",
                count: "10 items",
                image: img1,
                color: '#ffffff',
                textColor: '#000000'
            },
            {
                name: "OIL",
                count: "8 items",
                image: img2,
                color: '#ffffff',
                textColor: '#000000'
            },
            {
                name: "POWDER",
                count: "10 items",
                image: img3,
                color: '#ffffff',
                textColor: '#000000'
            }
        ]
    };

    const handleCategoryPress = (categoryName) => {
        console.log(`Category pressed: ${categoryName}`);
        // Add navigation logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* Header Section - New Layout */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTop}>
                        <Text style={styles.logoText}>7Miles</Text>
                        <View style={styles.headerBadge}>
                            <Text style={styles.badgeText}>Premium</Text>
                        </View>
                    </View>

                    <View style={styles.headerContent}>
                        <Text style={styles.mainTitle}>{appData.header.title}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.subtitle}>{appData.header.subtitle}</Text>
                        <Text style={styles.description}>{appData.header.description}</Text>
                    </View>
                </View>

                {/* Categories Section - Grid Layout */}
                <View style={styles.categoriesSection}>


                    <View style={styles.categoriesGrid}>
                        {appData.categories.map((category, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.categoryCard}
                                onPress={() => handleCategoryPress(category.name)}
                                activeOpacity={0.8}
                            >
                                <View style={[
                                    styles.categoryIcon,
                                    { backgroundColor: category.color }
                                ]}>
                                    <Image
                                        source={category.image}
                                        style={styles.categoryImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>
                                        {category.name}
                                    </Text>
                                    <Text style={styles.categoryCount}>{category.count}</Text>
                                </View>
                                <View style={styles.shopNowContainer}>
                                    <Text style={styles.shopNowText}>→</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>



                {/* Bottom Spacing */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 25,
        backgroundColor: '#f8f8f8',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000000',
        letterSpacing: 1.5,
    },
    headerBadge: {
        backgroundColor: '#000000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ffffff',
    },
    headerContent: {
        alignItems: 'flex-start',
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 15,
        letterSpacing: 1,
        lineHeight: 22,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 10,
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 18,
    },
    divider: {
        height: 2,
        width: 40,
        backgroundColor: '#000000',
        marginBottom: 15,
    },
    categoriesSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000000',
        marginBottom: 20,
        textAlign: 'left',
    },
    categoriesGrid: {
        gap: 12,
    },
    categoryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eeeeee',
    },
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 15,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '500',
    },
    shopNowContainer: {
        width: 30,
        height: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopNowText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    featuredBanner: {
        backgroundColor: '#000000',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 25,
        borderRadius: 16,
    },
    featuredContent: {
        alignItems: 'flex-start',
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 8,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
        lineHeight: 18,
    },
    featuredButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    featuredButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    bottomSpacer: {
        height: 40,
    },
});

export default SevenMile;