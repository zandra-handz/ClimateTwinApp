import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import ArrowPixellySvg from '../../assets/svgs/arrow-pixelly.svg';

const WindSquare = ({ windSpeed, windDirection, windFriends, specialHarmony, size=100, opacity=1, color="white"}) => {
 
  let correctedWindDirection = (windDirection + 180 - 90) % 360;
 
  if (correctedWindDirection < 0) {
    correctedWindDirection += 360;
  }

  return (
    <View style={styles.container}> 
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