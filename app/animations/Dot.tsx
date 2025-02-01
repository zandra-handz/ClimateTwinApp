import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';

class Dot extends React.Component {
  render() {
    // const { color, size, style } = this.props;
    return (
      <View
        style={[
          {
            width: this.props.size, // Use the size prop
            height: this.props.size, // Use the size prop
            borderRadius: this.props.size / 2, // Use the size prop
            backgroundColor: this.props.color, // Use the color prop
          },
          this.props.style, // Apply the animated style (positioning)
        ]}
      >    
      </View>
    );
  }
}

export default Dot;