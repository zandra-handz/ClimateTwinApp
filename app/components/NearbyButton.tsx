import React from 'react';
import { Feather } from "@expo/vector-icons";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import Animated, { Easing, useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const NearbyButton = ({ props }) => {
  const { themeStyles, appFontStyles } = useGlobalStyles();
  const { searchIsActive, exploreLocationsAreReady } = useActiveSearch();

  // Create a shared value to control the rotation
  const rotation = useSharedValue(0);

  // If exploreLocationsAreReady is false, start spinning the icon
  React.useEffect(() => {
    if (!exploreLocationsAreReady) {
      // Repeated spinning animation with ease-in-out timing
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }), // Rotate 360 degrees in 2 seconds
        -1, // Repeat indefinitely
        0 // Reset after completing each cycle
      );
    } else {
      rotation.value = 0; // Reset rotation when ready
    }
  }, [exploreLocationsAreReady]);

  // Create an animated style to apply the rotation transformation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }], // Apply rotation
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Feather
        name="compass"
        size={appFontStyles.exploreTabBarIcon.width}
        color={themeStyles.exploreTabBarText.color}
        {...props}
      />
    </Animated.View>
  );
};

export default NearbyButton;
