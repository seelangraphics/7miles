// components/HeroSection.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const HeroSection = () => {
    return (
        <View style={styles.container}>
            {/* Timeline Container */}
            <View style={styles.timelineContainer}>
                {/* Ancient Section */}
                <View style={styles.timelineItem}>
                    <View style={[styles.circle, styles.ancientCircle]}>
                        <Image
                            source={{ uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/Herosection/SS2.avif" }}
                            style={styles.circleImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.ancientText}>Ancient Ayurveda</Text>
                        <Text style={styles.naturalText}>(Natural)</Text>
                    </View>
                </View>

                {/* Connecting Line */}
                {/* <View style={styles.connectorLine}>
                    <Text style={styles.meetsText}>Meets</Text>
                </View> */}

                {/* Modern Section */}
                <View style={styles.timelineItem}>
                    <View style={[styles.circle, styles.modernCircle]}>
                        <Image
                            source={{ uri: "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/Herosection/SS4.avif" }}
                            style={styles.circleImage}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.modernText}>Modern Self-Care</Text>
                        <Text style={styles.youText}>(100% You)</Text>
                    </View>
                </View>
            </View>

            {/* Center Floating Image */}
            {/* <View style={styles.centerFloating}>
                <Image
                    source={require('../../assets/Herosection/ss3.avif')}
                    style={styles.centerImage}
                    resizeMode="cover"
                />
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f4e9',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    timelineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    timelineItem: {
        alignItems: 'center',
        flex: 1,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        marginBottom: 15,
    },
    ancientCircle: {
        borderColor: '#2d5016',
        backgroundColor: '#e8f5e8',
    },
    modernCircle: {
        borderColor: '#1a365d',
        backgroundColor: '#e3f2fd',
    },
    circleImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    textContent: {
        alignItems: 'center',
    },
    connectorLine: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: [{ translateX: -30 }, { translateY: -10 }],
        backgroundColor: '#f8f4e9',
        paddingHorizontal: 10,
        zIndex: 5,
    },
    centerFloating: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 10,
    },
    centerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#d4b896',
    },
    ancientText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d5016',
        textAlign: 'center',
    },
    naturalText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#5a7d3c',
        textAlign: 'center',
        marginTop: 2,
    },
    modernText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a365d',
        textAlign: 'center',
    },
    youText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#4a5568',
        textAlign: 'center',
        marginTop: 2,
    },
    meetsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8b7355',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default HeroSection;