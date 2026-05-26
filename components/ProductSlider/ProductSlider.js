import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const PRODUCTS_IMAGE_API = Constants.expoConfig.extra?.PRODUCTS_IMAGE_API;

const CARD_WIDTH = width - 40;
const CARD_HEIGHT = width > 768 ? 480 : 430;
const AUTOPLAY_DELAY = 4200;

export const products = [
    {
        title: 'Rose Gulkand',
        tagline: 'Cooling Wellness',
        description:
            'Made with sun-soaked Damask roses and natural sweeteners for a soothing, digestive-friendly daily ritual.',
        image: {
            remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}glow/Rose_Gulkand.webp` } : null,
        },
        eyebrow: 'Best Seller',

    },
    {
        title: 'Herbal Face Packs',
        tagline: 'Glow the Natural Way',
        description:
            'Pure herbal powders that cleanse, calm, and brighten your skin without harsh chemicals or heavy fillers.',
        image: {
            remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}glow/Herbal_face.webp` } : null,
        },
        eyebrow: 'Skin Ritual',

    },
    {
        title: 'Charcoal Soap',
        tagline: 'Deep Detox Care',
        description:
            'A refreshing cleanse that lifts away dirt, oil, and buildup while leaving skin smooth and reset.',
        image: {
            remote: PRODUCTS_IMAGE_API ? { uri: `${PRODUCTS_IMAGE_API}glow/Charcoal.webp` } : null,
        },
        eyebrow: 'Fresh Pick',

    },
];

const ProductSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [failedImages, setFailedImages] = useState({});
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const autoPlayRef = useRef(null);
    const currentIndexRef = useRef(0);

    const stopAutoplay = useCallback(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    }, []);

    const scrollToIndex = useCallback((index) => {
        flatListRef.current?.scrollToOffset({
            offset: index * width,
            animated: true,
        });
    }, []);

    const startAutoplay = useCallback(() => {
        stopAutoplay();
        autoPlayRef.current = setInterval(() => {
            const nextIndex = (currentIndexRef.current + 1) % products.length;
            scrollToIndex(nextIndex);
        }, AUTOPLAY_DELAY);
    }, [scrollToIndex, stopAutoplay]);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [startAutoplay, stopAutoplay]);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = useCallback((event) => {
        const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
    }, []);

    const handleManualScroll = useCallback(
        (index) => {
            currentIndexRef.current = index;
            setCurrentIndex(index);
            scrollToIndex(index);
            startAutoplay();
        },
        [scrollToIndex, startAutoplay]
    );

    const renderItem = useCallback(
        ({ item, index }) => (
            (() => {
                const imageSource = failedImages[item.title] ? null : item.image.remote;

                return (
                    <View style={styles.slide}>
                        <View style={styles.cardShell}>
                            {imageSource ? (
                                <Image
                                    source={imageSource}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                    onError={() =>
                                        setFailedImages((prev) => ({ ...prev, [item.title]: true }))
                                    }
                                />
                            ) : (
                                <View style={styles.productImage} />
                            )}

                            <LinearGradient
                                colors={['rgba(10,10,10,0.04)', 'rgba(10,10,10,0.14)', 'rgba(26,18,14,0.54)']}
                                style={styles.imageShade}
                            />

                            {/* <LinearGradient colors={item.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.accentGlow} /> */}

                            <View style={styles.topMetaRow}>
                                <View style={styles.eyebrowPill}>
                                    <Text style={styles.eyebrowText}>{item.eyebrow}</Text>
                                </View>
                                <View style={styles.slideBadge}>
                                    <Text style={styles.slideBadgeText}>0{index + 1}</Text>
                                </View>
                            </View>

                            <View style={styles.contentContainer}>
                                <Text style={styles.tagline}>{item.tagline}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                                <View style={styles.accentLine} />
                                <Text style={styles.description}>{item.description}</Text>

                            </View>
                        </View>
                    </View>
                );
            })()
        ),
        [failedImages]
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#050505', '#111111', '#000000']} style={styles.backgroundWash} />

            <View style={styles.header}>
                <Text style={styles.sectionKicker}>Glow Edit</Text>
                <Text style={styles.headerTitle}>Glow Naturally with 7Miles</Text>

                <Text style={styles.headerSubtitle}>
                    Premium Natural Products
                </Text>
            </View>

            <View style={styles.sliderContainer}>
                <FlatList
                    ref={flatListRef}
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.title}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScrollBeginDrag={stopAutoplay}
                    onScrollEndDrag={startAutoplay}
                    onScroll={onScroll}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="center"
                />

                <View style={styles.bottomBar}>
                    <View style={styles.pagination}>
                        {products.map((_, index) => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [10, 28, 10],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.35, 1, 0.35],
                                extrapolate: 'clamp',
                            });

                            return (
                                <TouchableOpacity
                                    key={products[index].title}
                                    activeOpacity={0.8}
                                    onPress={() => handleManualScroll(index)}
                                >
                                    <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {String(currentIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
                        </Text>
                    </View> */}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 24,
        paddingBottom: 28,
        position: 'relative',
    },
    backgroundWash: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 18,
    },
    sectionKicker: {
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#D4A017',
        fontWeight: '800',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: width > 768 ? 34 : 28,
        lineHeight: width > 768 ? 40 : 34,
        color: '#FFFFFF',
        fontWeight: '800',
        marginBottom: 8,
        maxWidth: 560,
    },
    headerSubtitle: {
        fontSize: 15,
        lineHeight: 23,
        color: 'rgba(255,255,255,0.72)',
        maxWidth: 640,
    },
    sliderContainer: {
        position: 'relative',
    },
    slide: {
        width,
        alignItems: 'center',
    },
    cardShell: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#101010',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.28,
        shadowRadius: 22,
        elevation: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imageShade: {
        ...StyleSheet.absoluteFillObject,
    },

    topMetaRow: {
        position: 'absolute',
        top: 18,
        left: 18,
        right: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eyebrowPill: {
        backgroundColor: 'rgba(0,0,0,0.72)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
    },
    eyebrowText: {
        fontSize: 11,
        color: '#FFD34D',
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    slideBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(26,18,14,0.75)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideBadgeText: {
        color: '#FFF8F0',
        fontWeight: '800',
        fontSize: 13,
    },
    contentContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 22,
        paddingTop: 34,
        paddingBottom: 18,
        backgroundColor: 'rgba(0,0,0,0.52)',
    },
    tagline: {
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#FFD34D',
        fontWeight: '800',
        marginBottom: 8,
    },
    title: {
        fontSize: width > 768 ? 34 : 28,
        lineHeight: width > 768 ? 38 : 32,
        color: '#FFF9F1',
        fontWeight: '800',
        marginBottom: 10,
        maxWidth: '90%',
    },
    accentLine: {
        width: 62,
        height: 4,
        borderRadius: 999,
        backgroundColor: '#FFD34D',
        marginBottom: 14,
    },
    description: {
        fontSize: 14,
        lineHeight: 21,
        color: 'rgba(255,249,241,0.9)',
        marginBottom: 10,
        maxWidth: '88%',
    },
    footerHint: {
        color: 'rgba(255,255,255,0.68)',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomBar: {
        marginTop: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        height: 10,
        borderRadius: 999,
        backgroundColor: '#FFD34D',
        marginRight: 8,
    },
    counterContainer: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    counterText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 1,
    },
});

export default ProductSlider;
