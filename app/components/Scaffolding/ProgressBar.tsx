import { View, Text, TextInput } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";

import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

const ProgressBar = () => {
  const { lastMessage } = useSurroundingsWS();
  const { themeStyles, constantColorsStyles } = useGlobalStyles();

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const progressPercentage = useSharedValue(0);

  useEffect(() => {
console.log('PROGRESS BAR RERENDERED');
  }, []);

  // Use useDerivedValue to reactively update the progressPercentage
  useDerivedValue(() => {
    if (lastMessage && lastMessage.startsWith("Progress: ")) {
      const progressValue = Math.ceil(
        parseInt(lastMessage.slice("Progress: ".length), 10)
      );

      if (!isNaN(progressValue)) {
        console.log(progressValue);
        // Apply withSpring to smoothly transition the value with a bounce effect
        progressPercentage.value = withSpring(progressValue, {
          damping: 10, // Controls the bounce intensity
          stiffness: 100, // Controls the speed of the transition
        });
      } else {
        console.log("Progress value is not a valid number");
      }
    } else {
      // Reset progress to 0 if the message doesn't start with "Progress: "
      progressPercentage.value = 0;
    }
  }, [lastMessage]);

  const animatedPercentage = useAnimatedProps(() => {
    return {
      text: `${progressPercentage.value}%`,
      defaultValue: `${progressPercentage.value}%`,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressPercentage.value}%`, // Use the shared value to set width
    };
  });

  return (
    <View style={[themeStyles.container]}>
      <AnimatedTextInput
        style={constantColorsStyles.text}
        animatedProps={animatedPercentage}
        editable={false}
        defaultValue={""}
      />
      <Animated.View
        style={[{ height: 20, backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor}, animatedStyle]}
      />
    </View>
  );
};

export default ProgressBar;
