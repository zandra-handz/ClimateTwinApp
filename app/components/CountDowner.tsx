import { View, TextInput, AppState } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import { useAppState } from "../context/AppStateContext";
import Animated, { useSharedValue, useAnimatedProps } from "react-native-reanimated";

const CountDowner = () => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { currentSurroundings } = useSurroundings();
  const { appStateVisible } = useAppState();
  
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const timeSharedValue = useSharedValue(0);
  const intervalRef = useRef(null); // Store interval reference

  const animatedTime = useAnimatedProps(() => {
    const time = Math.max(0, timeSharedValue.value); // Ensure it never goes negative
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedTime = `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return { text: formattedTime, defaultValue: formattedTime };
  });

  // Function to calculate time remaining (in seconds) until last_accessed + 1 hour
  const getTimeDifferenceInSeconds = (lastAccessed) => {
    const currentTime = new Date();
    const lastAccessedTime = new Date(lastAccessed);
    lastAccessedTime.setHours(lastAccessedTime.getHours() + 1);
    return Math.floor((lastAccessedTime - currentTime) / 1000);
  };

  // Function to reset countdown
  const resetCountdown = () => {
    if (currentSurroundings && !currentSurroundings.expired) {
      const timeDifference = getTimeDifferenceInSeconds(currentSurroundings.last_accessed);
      timeSharedValue.value = timeDifference > 0 ? timeDifference : 0;
    }
  };

  // Effect to restart countdown when appState changes or surroundings update
  useEffect(() => {
    resetCountdown();
  }, [currentSurroundings, appStateVisible]);

  // Start and manage countdown interval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      if (timeSharedValue.value > 0) {
        timeSharedValue.value -= 1;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [timeSharedValue]);

  return (
    <View style={[appContainerStyles.countDownerContainer, themeStyles.darkerBackground]}>
      <AnimatedTextInput
        style={[appFontStyles.countDownText, themeStyles.primaryText]}
        animatedProps={animatedTime}
        editable={false}
        defaultValue={"00:00"}
      />
    </View>
  );
};

export default CountDowner;
