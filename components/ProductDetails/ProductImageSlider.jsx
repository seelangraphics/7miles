import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProductImageSlider = ({ images, dotColor = "#000" }) => {
  const flatListRef = useRef(null);
  const modalListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // AUTO SLIDE
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      const next =
        currentIndex === images.length - 1 ? 0 : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });

      setCurrentIndex(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  if (!images || images.length === 0) {
    return (
     <View style={styles.imageContainer}>
    <Image
      source={{ uri: product.image }}
      style={styles.image}
    />
  </View>
    );
  }

  return (
    <>
      {/* NORMAL SLIDER */}
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setCurrentIndex(index);
                setShowModal(true);
              }}
              style={styles.imageContainer}
            >
              <Image source={item} style={styles.image} />
            </TouchableOpacity>
          )}
        />

        {/* DOTS */}
        {images.length > 1 && (
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot, 
                  i === currentIndex && [styles.activeDot, { backgroundColor: dotColor }]
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* 🔥 POPUP MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          {/* CLOSE */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {/* BIG IMAGE SLIDER */}
          <FlatList
            ref={modalListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentIndex}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.modalImageContainer}>
                <Image source={item} style={styles.modalImage} />
              </View>
            )}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>
      </Modal>
    </>
  );
};



export default ProductImageSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    width: width,
    backgroundColor: "#f7f7f7",
  },
  
  imageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width,
    height: 260, // You can adjust this height as needed
    resizeMode: "cover", // Changed from "contain" to "cover"
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 16,
    backgroundColor: "#000",
  },

  /* MODAL */
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },

  modalImageContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },

  modalImage: {
    width: width,
    height: height * 0.75,
    resizeMode: "contain",
  },

  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
});