import { View, TextInput, AppState } from "react-native";
import React, { useEffect, useRef, useCallback } from "react"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext"; 
import Animated, { useSharedValue, useAnimatedProps } from "react-native-reanimated";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";

const CountDowner = () => {
  const { lastLocationAccessTime, lastLocationId, alwaysReRender } = useSurroundingsWS();
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
  // const resetCountdown = useCallback(() => {
  //   if (!isResetting.current && lastLocationAccessTime) {
  //     isResetting.current = true;
  //     console.log("Resetting countdown");
  //     const timeDifference = getTimeDifferenceInSeconds(lastLocationAccessTime);
  //     timeSharedValue.value = timeDifference > 0 ? timeDifference : 0;

  //     setTimeout(() => {
  //       isResetting.current = false;
  //     }, 1000); // Allow 1s buffer before allowing another reset
  //   }
  // }, [lastLocationAccessTime, timeSharedValue]);

  const resetCountdown = () => {
    // console.log('reset countdown triggered!');
    if (!isResetting.current && lastLocationAccessTime) {
      isResetting.current = true;
      // console.log("Resetting countdown");
      const timeDifference = getTimeDifferenceInSeconds(lastLocationAccessTime);
      timeSharedValue.value = timeDifference > 0 ? timeDifference : 0;

      setTimeout(() => {
        isResetting.current = false;
      }, 2000); // Allow 1s buffer before allowing another reset
    }
  };

  // Reset countdown when lastLocationAccessTime changes
  useEffect(() => {
   // console.log('use effect triggering resetCountdown triggered by alwaysReRender');
    resetCountdown();
  }, [alwaysReRender]);
 
  // useFocusEffect(
  //   useCallback(() => {
  //     resetCountdown();
  //   }, [resetCountdown])
  // );

  // Reset countdown when app comes back into the foreground
  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === "active") {
  //       resetCountdown();
  //     }
  //   };

  //   const appStateListener = AppState.addEventListener("change", handleAppStateChange);
    
  //   return () => appStateListener.remove();
  // }, [resetCountdown]);

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
  }, [timeSharedValue, alwaysReRender]);

  return (
    <View style={[appContainerStyles.countDownerContainer, themeStyles.primaryBackground]}>
      
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
