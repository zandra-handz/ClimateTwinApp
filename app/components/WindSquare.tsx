import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WindStreamSvg from '../assets/svgs/wind-stream.svg';

const WindSquare = ({ windSpeed, windDirection, windFriends, specialHarmony }) => {
  // Calculate the corrected wind direction (subtract 45 degrees)
  let correctedWindDirection = (windDirection - 90) % 360; // Subtract 45 degrees from wind direction
  
  // Ensure the angle is always positive (0-360 degrees)
  if (correctedWindDirection < 0) {
    correctedWindDirection += 360;
  }
  return (
    <View style={styles.container}>
      {/* <Text>WindSquare</Text>
      <Text>Wind Speed: {windSpeed} km/h</Text>
      <Text>Wind Direction: {windDirection}°</Text> */}
      
      {/* Windstream SVG with rotation based on the wind direction */}
      <View style={[styles.svgContainer, { transform: [{ rotate: `${correctedWindDirection - 90}deg` }] }]}>
        <WindStreamSvg width={100} height={100} color={'white'} />
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
