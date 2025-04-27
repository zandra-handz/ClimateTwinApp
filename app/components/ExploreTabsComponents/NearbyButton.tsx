import React, { useEffect } from 'react'; // useEffect usage valid ?
import { Feather } from "@expo/vector-icons";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";  
import Animated, { 
  Easing, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  useAnimatedStyle 
} from 'react-native-reanimated';

const NearbyButton = ({ color, lastState }) => { 
  const { appFontStyles } = useGlobalStyles();  
 
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const positionShift = useSharedValue(0);

  const runAnimationBasedOnState = () => {
    if (lastState === 'searching for ruins') {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
      scale.value = withTiming(3, { duration: 500, easing: Easing.inOut(Easing.ease) });
      positionShift.value = withTiming(-35, { duration: 500, easing: Easing.inOut(Easing.ease) });
    } else {
      rotation.value = 0;
      scale.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) });
      positionShift.value = withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) });
    }
  };

  useEffect(() => {
    runAnimationBasedOnState();
  }, [lastState]);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` }, // Apply rotation
        { scale: scale.value }, // Apply scaling
      ],
    };
  });
 
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
