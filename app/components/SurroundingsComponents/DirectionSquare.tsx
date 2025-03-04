import React from 'react';
import { View, StyleSheet } from 'react-native'; 
import ArrowPixellySvg from '../../assets/svgs/arrow-pixelly.svg';

const DirectionSquare = ({ locationDirection, size=100, opacity=1, color="white"}) => {
 
  let correctedDirection = (locationDirection - 90) % 360;
 
  if (correctedDirection < 0) {
    correctedDirection += 360;
  }

  return (
    <View style={styles.container}> 
      <View style={[styles.svgContainer, { transform: [{ rotate: `${correctedDirection}deg` }] }]}>
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

export default DirectionSquare;