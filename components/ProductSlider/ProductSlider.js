import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Product data
export const products = [
    {
        title: "Rose Gulkand",
        tagline: "Tasty and Natural",
        description: "Made with sun-soaked Damask roses and natural sweeteners, our Gulkand is your daily dose of calm digestion and cooling relief.",
        cta: "Shop Now",
        image: { uri: "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/glow/G1.webp" },
        screen: "WellnessProducts", // or whatever screen you want to navigate to
    },
    {
        title: "Herbal Face Packs",
        tagline: "Glow the Natural Way",
        description: "Pure, herbal face pack powders to nourish, cleanse, and enhance your skin—no chemicals, just results.",
        cta: "Shop Now",
        image: { uri: "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/glow/G2.webp" },
        screen: "herbalfacepack", // This will navigate to Herbalfacepack screen
    },
    {
        title: "Charcoal Soap",
        tagline: "Detox Deep",
        description: "Activated Charcoal Soap that gently removes dirt, oil, and toxins, leaving your skin fresh and rejuvenated.",
        cta: "Shop Now",
        image: { uri: "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/glow/G3.webp" },
        screen: "SkinProducts", // or whatever screen you want to navigate to
    },
];

const ProductSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const autoPlayRef = useRef(null);
    const navigation = useNavigation();

    // Auto slide functionality
    useEffect(() => {
        autoPlayRef.current = setInterval(() => {
            if (currentIndex < products.length - 1) {
                flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
            } else {
                flatListRef.current.scrollToIndex({ index: 0 });
            }
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(autoPlayRef.current);
    }, [currentIndex]);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = (event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;
        const pageNum = Math.floor(contentOffset.x / viewSize.width);
        setCurrentIndex(pageNum);
    };

    const handleManualScroll = (index) => {
        clearInterval(autoPlayRef.current);
        setCurrentIndex(index);
        flatListRef.current.scrollToIndex({ index });
        // Restart auto play after manual interaction
        setTimeout(() => {
            autoPlayRef.current = setInterval(() => {
                if (currentIndex < products.length - 1) {
                    flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
                } else {
                    flatListRef.current.scrollToIndex({ index: 0 });
                }
            }, 4000);
        }, 5000);
    };

    const handleShopNow = (screenName) => {
        if (screenName === 'herbalfacepack') {
            navigation.navigate('herbalfacepack');
        } else {
            // Handle other screens or navigate to a products list with filter
            navigation.navigate('Products', { category: screenName });
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                {/* Image Section - Now on top */}
                <View style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />
                </View>

                {/* Content Section - Overlay on image */}
                <View style={styles.contentContainer}>
                    <View style={styles.textContent}>
                        <Text style={styles.tagline}>{item.tagline}</Text>
                        <Text style={styles.title}>{item.title}</Text>

                        <View style={styles.divider} />

                        <Text style={styles.description}>{item.description}</Text>

                        {/* <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => handleShopNow(item.screen)}
                        >
                            <Text style={styles.ctaText}>{item.cta}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Glow Naturally with 7Miles</Text>
                <Text style={styles.headerSubtitle}>Premium Natural Products</Text>
            </View>

            {/* Slider */}
            <View style={styles.sliderContainer}>
                <FlatList
                    ref={flatListRef}
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="center"
                />

                {/* Slide Counter */}
                <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {products.length}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        fontWeight: '500',
    },
    sliderContainer: {
        flex: 1,
        position: 'relative',
    },
    slide: {
        width: width,
        height: height * 0.78,
        position: 'relative',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    textContent: {
        maxWidth: '90%',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 12,
        lineHeight: 36,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFD700',
        marginBottom: 8,
        fontStyle: 'italic',
        letterSpacing: 1,
    },
    divider: {
        height: 3,
        width: 60,
        backgroundColor: '#FFD700',
        marginBottom: 16,
        borderRadius: 2,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 22,
        marginBottom: 24,
        fontWeight: '400',
    },
    ctaButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        alignSelf: 'flex-start',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: 0.5,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 140,
        left: 0,
        right: 0,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFD700',
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    counterContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    counterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default ProductSlider;