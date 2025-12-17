import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export const GoldenDrop = () => {
  const videoRef = useRef(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Video Section - Fixed Height */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={require('../../assets/PD-video.mp4')}
            shouldPlay={true}
            isLooping={true}
            resizeMode={ResizeMode.COVER}
            useNativeControls={false}
            isMuted={true}
            
          />
        </View>
        
        {/* Content Section - Below Video */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>Golden Goodness in Every Drop</Text>
          <Text style={styles.description}>
            Taste the richness of pure, natural honey straight from the hive. 
            Sweet, healthy, and packed with nature's nutrients for your everyday wellness.
          </Text>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => console.log('Shop Now pressed')}
          >
            <Text style={styles.buttonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoContainer: {
    width: '100%',
    height: isSmallScreen ? height * 0.45 : height * 0.5,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#FFFDF5',
    alignItems: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 26 : 30,
    fontWeight: '800',
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 34 : 40,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#654321',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 24 : 28,
    marginBottom: 35,
    paddingHorizontal: 10,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default GoldenDrop;