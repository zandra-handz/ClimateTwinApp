import { View, TextInput, AppState } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import { useAppMessage } from "../context/AppMessageContext"; 
import Animated, { useSharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import useDateTimeFunctions from '../hooks/useDateTimeFunctions';
import { useAppState } from "../context/AppStateContext";
import { useActiveSearch } from "../context/ActiveSearchContext"; 

const CountDowner = () => {
  const { sendMessage, lastMessage, lastLocationName } = useSurroundingsWS();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { currentSurroundings } = useSurroundings(); 
  const { showAppMessage} = useAppMessage();
  const { getTimeDifferenceInSeconds } = useDateTimeFunctions();
  const { appStateVisible } = useAppState();
  const { searchIsActive } = useActiveSearch(); 

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const timeSharedValue = useSharedValue(0);
  const intervalRef = useRef(null); 

  const animatedTime = useAnimatedProps(() => {
    const time = Math.max(0, timeSharedValue.value); 
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedTime = `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return { text: formattedTime, defaultValue: formattedTime };
  });


  useEffect(() => {
    console.log('countdowner rerendered');

  }, []);

  // Manual countdown reset
  const clearCountdown = () => {
    // Clear the interval if it is running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Reset interval ref
    }

    // Reset timeSharedValue and UI display
    timeSharedValue.value = 0;
    showAppMessage(true, null, "Countdown cleared");
    console.log("Countdown manually cleared");
  };

  useEffect(() => {  
    if (currentSurroundings?.id) { 
      console.log('resetting countdown');
    //  clearCountdown();
      resetCountdown();
    }
  }, [currentSurroundings]);  

  const resetCountdown = () => { 
    if (currentSurroundings && currentSurroundings.id && !currentSurroundings.expired) {
     // clearCountdown();
      const timeDifference = getTimeDifferenceInSeconds(currentSurroundings.last_accessed);
      timeSharedValue.value = timeDifference > 0 ? timeDifference : 0;
      // showAppMessage(true, null, `${currentSurroundings.last_accessed} ${timeDifference} ${timeSharedValue.value}`);
      // console.log(`${currentSurroundings.last_accessed} ${timeDifference} ${timeSharedValue.value}`);
    }
  };

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
    <> 
      <View style={[appContainerStyles.countDownerContainer, themeStyles.primaryBackground]}>
        {/* {!searchIsActive && ( */}
          <AnimatedTextInput
            style={[appFontStyles.countDownText, themeStyles.primaryText]}
            animatedProps={animatedTime}
            editable={false}
            defaultValue={"    "}
          /> 
        {/* // )} */}
      </View> 
    </>
  );
};

export default CountDowner;
