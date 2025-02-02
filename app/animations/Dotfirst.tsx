import React from 'react';
import { View } from 'react-native';

class Dot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trail: [], // Store previous positions
      currentCoords: {latitude: this.props.style.left,
        longitude: this.props.style.right}
    };
  }

  componentDidUpdate(prevProps) {
    console.log('Previous Coords:', prevProps.style);  // Log previous style
    console.log('Current Coords:', this.props.style);  // Log the incoming style
  
    if (
      prevProps.style.left !== this.props.style.left ||
      prevProps.style.right !== this.props.style.right
    ) {
      console.log('Updating trail with new coordinates');
      // Add previous position to trail
      this.setState((prevState) => ({
        trail: [
          ...prevState.trail,
          { 
            latitude: prevState.currentCoords.latitude, 
            longitude: prevState.currentCoords.longitude, 
            key: Math.random() 
          },
        ],
        currentCoords: {
          latitude: this.props.style.left,  // Update current position
          longitude: this.props.style.right,
        },
      }));
    } else {
      console.log('No change in coordinates');
    }
  }

  render() {
    return (
      <>
        {/* Render trail dots */}
        {this.state.trail.map(({ latitude, longitude, key }) => (
          <View
            key={key}
            style={[
              {
                width: this.props.size * 0.6,
                height: this.props.size * 0.6,
                borderRadius: this.props.size / 2,
                backgroundColor: this.props.color,
                position: 'absolute',
                left: longitude,
                top: latitude,
                opacity: 0.4, // Faded effect
              },
            ]}
          />
        ))}
        {/* Render main dot */}
        <View
          style={[
            {
              width: this.props.size,
              height: this.props.size,
              borderRadius: this.props.size / 2,
              backgroundColor: this.props.color,
              position: 'absolute',
              left: this.props.style.left,
              top: this.props.style.right,
            },
            this.props.style,
          ]}
        />
      </>
    );
  }
}

export default Dot;
