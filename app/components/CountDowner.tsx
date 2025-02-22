import { View, Text, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import { AppState } from "react-native";
import { useAppState } from "../context/AppStateContext";

import Animated, {
  useSharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

const CountDowner = () => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { currentSurroundings } = useSurroundings();
  const [startingTime, setStartingTime] = useState(0);
    const { appStateVisible } = useAppState();
  

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  // Shared value for the countdown
  const timeSharedValue = useSharedValue(0);

  const animatedTime = useAnimatedProps(() => {
    const time = timeSharedValue.value;
    // Convert time to hr:min:sec format
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    // Format the time
    const formattedTime = `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    return {
      text: formattedTime,
      defaultValue: formattedTime,
    };
  });

  // Function to calculate the time difference in seconds between current time and a future time
  function getTimeDifferenceInSeconds(lastAccessed) {
    const currentTime = new Date();
    const lastAccessedTime = new Date(lastAccessed);
    // Add 1 hour to lastAccessedTime
    lastAccessedTime.setHours(lastAccessedTime.getHours() + 1);

    // Time difference between current time and the future time (last_accessed + 1 hour)
    const timeDifferenceInSeconds = Math.floor((lastAccessedTime - currentTime) / 1000);
    return timeDifferenceInSeconds;
  }

  // Start countdown when the surroundings are available
  useEffect(() => {
    if (currentSurroundings && currentSurroundings.expired !== true) {
      const timeDifference = getTimeDifferenceInSeconds(currentSurroundings.last_accessed);
      setStartingTime(timeDifference);
      timeSharedValue.value = timeDifference;
    }
  }, [currentSurroundings, appStateVisible]);

  // Start the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeSharedValue.value > 0) {
        timeSharedValue.value -= 1; // Decrease the time every second
      } else {
        clearInterval(interval); // Stop the countdown once it reaches zero
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timeSharedValue]);

  return (
    <View
      style={[
        appContainerStyles.countDownerContainer,
        themeStyles.darkerBackground,
      ]}
    >
      <AnimatedTextInput
        style={[appFontStyles.countDownText, themeStyles.primaryText]}
        animatedProps={animatedTime}
        editable={false}
        defaultValue={`${startingTime} seconds`}
      />
    </View>
  );
};

export default CountDowner;
