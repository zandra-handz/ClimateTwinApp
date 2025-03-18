import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const BackgroundFadeIn = ({ triggerFade }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity

  useEffect(() => {
    // Trigger fade effect when `triggerFade` changes
    Animated.timing(fadeAnim, {
      toValue: triggerFade ? 1 : 0, // Fade to 1 if triggered, else fade out to 0
      duration: 1000,                // Duration of the fade (1 second)
      useNativeDriver: false,        // Needed to animate backgroundColor
    }).start();
  }, [triggerFade]);

  return (
    <View style={{  flex: 1 }}>
      <Animated.View
        style={{
    ...StyleSheet.absoluteFillObject, // This ensures it fills the entire parent container
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    top: 0,
    bottom: 0, 
    width: '100%',
    right: 0,
    left: 0,
    
    zIndex: 0,
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#fff", "#ff6347"], // Color transition (white to tomato)
          }),
        }}
      />
    </View>
  );
};

export default BackgroundFadeIn;
