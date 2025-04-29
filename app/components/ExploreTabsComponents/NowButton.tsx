import React, { useEffect } from "react"; // useEffect usage valid ?
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import useWebSocket from "@/src/hooks/useWebSocket";


const NowButton = ({ color, lastState }) => {
  const { appFontStyles } = useGlobalStyles();

  Animated.addWhitelistedNativeProps({ text: true });

  const { sharedValues } = useWebSocket();

  const {} = sharedValues;

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const positionShift = useSharedValue(0);

  const handleAnimation = () => {
    if (lastState === "searching for twin") {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );

      scale.value = withTiming(3, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });

      positionShift.value = withTiming(-130, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      rotation.value = 0;
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
      positionShift.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    }
  };

  useEffect(() => {
    handleAnimation();
  }, [lastState]);

  // Create animated styles for rotation and scale
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // { rotate: `${rotation.value}deg` }, // Apply rotation
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
    <Animated.View
      style={[
        containerStyle,
        { justifyContent: "center", alignContent: "center" },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <MaterialIcons
            name="my-location"
            size={appFontStyles.exploreTabBarIcon.width + 4}
            color={color}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default NowButton;
