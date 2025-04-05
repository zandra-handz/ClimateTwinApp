import React from "react";
import { View, TextInput } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useActiveSearch } from "../../context/ActiveSearchContext";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import useWebSocket from "@/app/hooks/useWebSocket";

const NowButton = ({ color }) => {
  const { themeStyles, appFontStyles } = useGlobalStyles();
  const { isExploring, isSearchingForTwin } = useActiveSearch();

  Animated.addWhitelistedNativeProps({ text: true });
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const { sharedValues } = useWebSocket(); // Getting shared values from the hook

  const {
    latitude,
    longitude,
    prevLatitude,
    prevLongitude,
    prevPrevLatitude,
    prevPrevLongitude,
    temperatureSharedValue,
    countrySharedValue,
    temperatureDifference,
  } = sharedValues;

  const colorMap = {
    0: "red",
    1: "darkorange",
    2: "darkorange",
    3: "darkorange",
    4: "orange",
    5: "orange",
    6: "orange",
    7: "gold",
    8: "yellow",
  };

  // Create shared values for rotation and scale
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const positionShift = useSharedValue(0);

  const animatedTemp = useAnimatedProps(() => {
    const difference =
      temperatureDifference.value !== null &&
      !isNaN(Number(temperatureDifference.value))
        ? Number(temperatureDifference.value)
        : null;

    let color = null;
    if (difference && difference < 2) {
      color = "red";
    } else if (difference && difference <= 30) {
      const colorIndex = Math.floor(((difference - 2) / 28) * 8);
      color = colorMap[colorIndex];
    } else {
      color = themeStyles.primaryText.color;
    }

    return {
      text: `${temperatureSharedValue.value}°`,
      defaultValue: `${temperatureSharedValue.value}°`,
      color: color,
      //fontSize: 2,
      transform: [
        { opacity: scale.value },
        // { rotate: `${rotation.value}deg` }, // Apply rotation
        { scale: scale.value }, // Apply scaling
      ],
    };
  });

  React.useEffect(() => {
    if (!isExploring && isSearchingForTwin) {
      //added both conditions in case app gets stuck
      // Start spinning and enlarging
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }), // Smooth rotation
        -1, // Infinite loop
        false // No reset after loop
      );

      scale.value = withTiming(3, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); // Scale up
      positionShift.value = withTiming(-130, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); // Move up
    } else {
      // Reset rotation and shrink back to normal size
      rotation.value = 0;
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); // Scale down
      positionShift.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); // Reset position
    }
  }, [isExploring, isSearchingForTwin]);

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
        {isSearchingForTwin && (
          <View
            style={[
              {
                // position: "absolute",

                width: "100%",
                height: "auto",
                zIndex: 100,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 10,
              },
            ]}
          >
            <AnimatedTextInput
              style={[themeStyles.primaryText]}
              animatedProps={animatedTemp}
              editable={false}
              defaultValue={""}
            />
          </View>
        )}
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
