import React from 'react';
import { View } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import Animated, { 
  Easing, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  useAnimatedStyle 
} from 'react-native-reanimated';

const NearbyButton = ({ color }) => {
  const { themeStyles, appFontStyles } = useGlobalStyles();
  const { searchIsActive, exploreLocationsAreReady } = useActiveSearch();

  // Create shared values for rotation and scale
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const positionShift = useSharedValue(0);

  React.useEffect(() => {
    if (!exploreLocationsAreReady) {
      // Start spinning and enlarging
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }), // Smooth rotation
        -1, // Infinite loop
        false // No reset after loop
      );

      scale.value = withTiming(3, { duration: 500, easing: Easing.inOut(Easing.ease) }); // Scale up
      positionShift.value = withTiming(-35, { duration: 500, easing: Easing.inOut(Easing.ease) }); // Move up
    } else {
      // Reset rotation and shrink back to normal size
      rotation.value = 0;
      scale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }); // Scale down
      positionShift.value = withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) }); // Reset position
    }
  }, [exploreLocationsAreReady]);

  // Create animated styles for rotation and scale
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` }, // Apply rotation
        { scale: scale.value }, // Apply scaling
      ],
    };
  });

  // Create animated styles for positioning the container
  const containerStyle = useAnimatedStyle(() => {
    return {
      marginTop: positionShift.value, // Move the container up
    };
  });

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={animatedStyle}>
        <Feather
          name="compass"
          size={appFontStyles.exploreTabBarIcon.width}
          color={color}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default NearbyButton;
