import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedProps } from 'react-native-reanimated';

// Translate latitude and longitude into screen coordinates
const translateCoordsToPosition = (latitude, longitude, mapWidth, mapHeight) => {
  const LAT_MIN = -90;
  const LAT_MAX = 90;
  const LONG_MIN = -180;
  const LONG_MAX = 180;

  // Calculate x (longitude) and y (latitude) position based on the map size
  const x = ((longitude - LONG_MIN) / (LONG_MAX - LONG_MIN)) * mapWidth;
  const y = ((LAT_MAX - latitude) / (LAT_MAX - LAT_MIN)) * mapHeight;

  return { x, y };
};

const MapDots = ({ animatedProps }) => {
  // Use animatedProps to receive latitude and longitude
  const { latitude, longitude } = animatedProps;

  // Window and map dimensions
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = windowWidth / 2; // Aspect ratio (you can adjust this)

  // Shared values for x and y position
  const dotX = useSharedValue(0);
  const dotY = useSharedValue(0);

  // Update x and y positions whenever latitude or longitude change
  React.useEffect(() => {
    const { x, y } = translateCoordsToPosition(latitude, longitude, windowWidth, windowHeight);
    dotX.value = x;  // Update x position
    dotY.value = y;  // Update y position
  }, [latitude, longitude]);  // This will trigger when either latitude or longitude changes

  // Animated style for the dot
  const dotStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: withSpring(dotX.value), // Smooth animation for x
      top: withSpring(dotY.value), // Smooth animation for y
    };
  });

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const styles = StyleSheet.create({
  dot: {
    width: 15,
    height: 15,
    backgroundColor: 'red', // Red dot
    borderRadius: 50, // Circle
    zIndex: 10000,
  },
});

export default MapDots;
