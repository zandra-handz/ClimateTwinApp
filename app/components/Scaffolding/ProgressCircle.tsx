import { View, Text } from "react-native";
import React from "react";
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
  const { lastSearchProgress } = useSurroundingsWS();
  const { themeStyles, constantColorsStyles } = useGlobalStyles();

  const progressPercentage = useSharedValue(0);
  const radius = (Math.min(width, height) / 2); // Adjust based on strokeWidth
  const circumference = 2 * Math.PI * radius;
 
 
  useDerivedValue(() => {
    if (lastSearchProgress) {
      const progressValue = Math.ceil(parseInt(lastSearchProgress, 10));


      if (!isNaN(progressValue)) { 
        progressPercentage.value = withSpring(progressValue, {
          damping: 10, // bounce intensity
          stiffness: 100, // speed
        });
      } else {
        console.log("Progress value is not a valid number");
      }
    } else {
      // Reset progress to 0 if the message doesn't start with "Progress: "
      progressPercentage.value = 0;
    }
  }, [lastSearchProgress]);


  // Reset
  // useDerivedValue(() => {
  //   if (!lastLocationId) { 
  //     progressPercentage.value = 0;
  //   }
  // }, [lastLocationId]);


  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progressPercentage.value / 100) * circumference,
  }));

  return (
    <View style={[  { justifyContent: 'center', alignItems: 'center' }]}>
          <Svg height={height} width={width}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="5"
          fill="none"
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={'teal'} 
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
        />
      </Svg> 
    </View>
  );
};

export default ProgressCircle;