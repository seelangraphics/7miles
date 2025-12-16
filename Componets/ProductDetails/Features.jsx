import React, { useRef, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Animated, FlatList } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = 80;
const SPACING = 20;
const CARD_WIDTH = CIRCLE_SIZE + SPACING * 2;

const features = [
  {
    id: 1,
    title: "Ayurvedic Essence",
    image: require("../../assets/ProductDetails/PD1.webp"),
    color: "#C06C84",
  },
  {
    id: 2,
    title: "Everyday Wellness",
    image: require("../../assets/ProductDetails/PD2.webp"),
    color: "#6C5B7B",
  },
  {
    id: 3,
    title: "Sustainable Care",
    image: require("../../assets/ProductDetails/PD3.webp"),
    color: "#355C7D",
  },
  {
    id: 4,
    title: "Pure Ingredients",
    image: require("../../assets/ProductDetails/PD4.webp"),
    color: "#F67280",
  },
];

const ProductFeatures = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);
  const timerRef = useRef(null);

  // Auto scroll animation
  useEffect(() => {
    const startAutoScroll = () => {
      timerRef.current = setInterval(() => {
        if (flatListRef.current) {
          currentIndex.current = (currentIndex.current + 1) % features.length;
          flatListRef.current.scrollToIndex({
            index: currentIndex.current,
            animated: true,
          });
        }
      }, 2000); // Change every 2 seconds
    };

    startAutoScroll();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.carouselItem}>
        <Animated.View
          style={[
            styles.circleContainer,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View style={[styles.outerRing, { borderColor: item.color }]} />
          <View style={[styles.innerGlow, { backgroundColor: `${item.color}20` }]} />
          <Image source={item.image} style={styles.circleImage} />
          <View style={[styles.pulseRing, { borderColor: item.color }]} />
        </Animated.View>
      </View>
    );
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    currentIndex.current = index;
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={features}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={styles.carouselContent}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
      />
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {features.map((_, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.4, 1],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: features[index].color,
                  transform: [{ scale: dotScale }],
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ProductFeatures;

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
  },
  carouselItem: {
    width: CARD_WIDTH,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: CIRCLE_SIZE + 16,
    height: CIRCLE_SIZE + 16,
    borderRadius: (CIRCLE_SIZE + 16) / 2,
    borderWidth: 2,
    opacity: 0.8,
  },
  innerGlow: {
    position: 'absolute',
    width: CIRCLE_SIZE - 4,
    height: CIRCLE_SIZE - 4,
    borderRadius: (CIRCLE_SIZE - 4) / 2,
    opacity: 0.6,
  },
  circleImage: {
    width: CIRCLE_SIZE - 8,
    height: CIRCLE_SIZE - 8,
    borderRadius: (CIRCLE_SIZE - 8) / 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pulseRing: {
    position: 'absolute',
    width: CIRCLE_SIZE + 24,
    height: CIRCLE_SIZE + 24,
    borderRadius: (CIRCLE_SIZE + 24) / 2,
    borderWidth: 1,
    opacity: 0.4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});