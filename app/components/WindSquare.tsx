import React from 'react';
import { View, StyleSheet } from 'react-native';
import WindStreamSvg from '../assets/svgs/wind-stream.svg';
import ArrowPixellySvg from '../assets/svgs/arrow-pixelly.svg';

const WindSquare = ({ windSpeed, windDirection, windFriends, specialHarmony, size=100, opacity=1, color="white"}) => {
  // Calculate the corrected wind direction (subtract 90 degrees)
  let correctedWindDirection = (windDirection - 90) % 360;
  
  // Ensure the angle is always positive (0-360 degrees)
  if (correctedWindDirection < 0) {
    correctedWindDirection += 360;
  }

  return (
    <View style={styles.container}>
      {/* Windstream SVG with rotation based on the wind direction */}
      <View style={[styles.svgContainer, { transform: [{ rotate: `${correctedWindDirection}deg` }] }]}>
        <ArrowPixellySvg width={size} height={size} color={color} style={{opacity: opacity}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WindSquare;