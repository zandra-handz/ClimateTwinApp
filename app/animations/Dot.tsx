import React from 'react';
import { View } from 'react-native';
import Animated, { Easing, withTiming } from 'react-native-reanimated';

class Dot extends React.Component {
  render() {
    const { size, color, opacity, fadeOutDuration } = this.props;

    // If fadeOutDuration is provided, animate the opacity to 0
    const animatedOpacity = fadeOutDuration
      ? withTiming(0, { duration: fadeOutDuration, easing: Easing.linear })
      : opacity; // Default opacity if no fade-out duration is given

    return (
      <Animated.View
        style={[
          {
            width: size, // Use the size prop
            height: size, // Use the size prop
            opacity: animatedOpacity, // Animated opacity
            borderRadius: size / 2, // Use the size prop
            backgroundColor: color, // Use the color prop
          },
          this.props.style, // Apply any other passed styles
        ]}
      />
    );
  }
}

export default Dot;
