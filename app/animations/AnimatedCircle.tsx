import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);

const AnimatedCircle = ({
  height = 52,
  width = 52,
  color = "grey",
  strokeWidth = 3,
  duration = 800,
  segmentLengthRatio = 0.5,
}) => {
  const radius = (Math.min(width, height) - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const visibleLength = circumference * segmentLengthRatio;
  const gapLength = circumference - visibleLength;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={animatedStyle}>
        <Svg height={height} width={width}>
          {/* Background ring */}
          <Circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Rotating arc */}
          <AnimatedSvgCircle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${visibleLength}, ${gapLength}`}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default AnimatedCircle;
