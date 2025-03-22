import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg"; // Importing necessary components from react-native-svg

import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle); // Create an animated Circle component
const AnimatedText = Animated.createAnimatedComponent(Text); // Create an animated Text component

const ProgressCircle = ({height = 52, width = 52}) => {
  const { lastMessage } = useSurroundingsWS();
  const { themeStyles, constantColorsStyles } = useGlobalStyles();

  const progressPercentage = useSharedValue(0);
  const radius = (Math.min(width, height) / 2) - 5; // Adjust based on strokeWidth
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    console.log('PROGRESS CIRCLE RERENDERED');
  }, []);

  // Use useDerivedValue to reactively update the progressPercentage
  useDerivedValue(() => {
    if (lastMessage && lastMessage.startsWith("Progress: ")) {
      const progressValue = Math.ceil(
        parseInt(lastMessage.slice("Progress: ".length), 10)
      );

      if (!isNaN(progressValue)) {
        //console.log(progressValue);
        
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

  // Animate the text displaying the percentage
  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(progressPercentage.value)}%`, // Round the value for display
    };
  });

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progressPercentage.value / 100) * circumference,
  }));

  return (
    <View style={[themeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Svg height={height} width={width}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="4"
          fill="none"
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={'teal'}
        //  stroke={constantColorsStyles.v1LogoColor.backgroundColor}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
        />
      </Svg>
      {/* Display the percentage text */}
      <AnimatedText
        style={[constantColorsStyles.text, { marginTop: 10 }]}
        animatedProps={animatedTextProps}
      />
    </View>
  );
};

export default ProgressCircle;