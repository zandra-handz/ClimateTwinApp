import { View, TextInput, AppState } from "react-native";
import React, { useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
import { useAppMessage } from "../../context/AppMessageContext";
import Animated, { useSharedValue, useAnimatedProps } from "react-native-reanimated";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";

const CountDowner = () => {
  const { lastLocationAccessTime, lastLocationId } = useSurroundingsWS();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { getTimeDifferenceInSeconds } = useDateTimeFunctions();

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const timeSharedValue = useSharedValue(0);
  const intervalRef = useRef(null);
  const isResetting = useRef(false);

  const animatedTime = useAnimatedProps(() => {
    const time = Math.max(0, timeSharedValue.value);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { text: `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}` };
  });

  // Function to reset countdown if not already resetting
  const resetCountdown = useCallback(() => {
    if (!isResetting.current && lastLocationAccessTime) {
      isResetting.current = true;
      console.log("Resetting countdown");
      const timeDifference = getTimeDifferenceInSeconds(lastLocationAccessTime);
      timeSharedValue.value = timeDifference > 0 ? timeDifference : 0;

      setTimeout(() => {
        isResetting.current = false;
      }, 1000); // Allow 1s buffer before allowing another reset
    }
  }, [lastLocationAccessTime, timeSharedValue]);

  // Reset countdown when lastLocationAccessTime changes
  useEffect(() => {
    resetCountdown();
  }, [lastLocationAccessTime, lastLocationId, resetCountdown]);

  // Reset countdown when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      resetCountdown();
    }, [resetCountdown])
  );

  // Reset countdown when app comes back into the foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        resetCountdown();
      }
    };

    const appStateListener = AppState.addEventListener("change", handleAppStateChange);
    
    return () => appStateListener.remove();
  }, [resetCountdown]);

  // Countdown interval logic
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (timeSharedValue.value > 0) {
        timeSharedValue.value -= 1;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeSharedValue]);

  return (
    <View style={[appContainerStyles.countDownerContainer, themeStyles.primaryBackground]}>
      {lastLocationAccessTime !== null && (
        <AnimatedTextInput
          style={[appFontStyles.countDownText, themeStyles.primaryText]}
          animatedProps={animatedTime}
          editable={false}
          defaultValue={"    "}
        />
      )}
    </View>
  );
};

export default CountDowner;
