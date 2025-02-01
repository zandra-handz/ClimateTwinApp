import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface AnimatedDotProps {
  animatedProps: {
    latitude: string; // Passed as a string
    longitude: string; // Passed as a string
  };
  color?: string;
  size?: number;
}

const AnimatedDot: React.FC<AnimatedDotProps> = ({ animatedProps, color = 'red', size = 10 }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Convert latitude and longitude back to numbers
    const latitude = parseFloat(animatedProps.latitude);
    const longitude = parseFloat(animatedProps.longitude);

    return {
      position: 'absolute',
      left: longitude, // Use longitude for x-axis
      top: latitude,   // Use latitude for y-axis
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
  },
});

export default AnimatedDot;