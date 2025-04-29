import React from "react";
import { View, TextInput } from "react-native"; 
import { useGlobalStyles } from "../../src/context/GlobalStylesContext"; 
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import useWebSocket from "@/src/hooks/useWebSocket";

const Temperatures = () => {
  const { themeStyles } = useGlobalStyles();
  const { lastState } = useSurroundingsWS(); 

  Animated.addWhitelistedNativeProps({ text: true });
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const { sharedValues } = useWebSocket();  

  const { 
    temperatureSharedValue, 
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


  const derivedTemp = useDerivedValue(() => {
    return temperatureSharedValue.value;
  });
  
  const animatedTemp = useAnimatedProps(() => {
    const temp = derivedTemp.value;
  
    const difference = !isNaN(Number(temperatureDifference.value))
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
      text: `${temp}°`,
      defaultValue: `${temp}°`,
      color: color,
      transform: [
        { scale: scale.value },
      ],
    };
  }); 

  React.useEffect(() => {
    if ((lastState !== 'exploring') && (lastState === 'searching for twin')) { 
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),  
        -1,  
        false 
      );

      scale.value = withTiming(2, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); 
      positionShift.value = withTiming(-130, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); 
    } else { 
      rotation.value = 0;
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });  
      positionShift.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }); 
    }
  }, [lastState]);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // { rotate: `${rotation.value}deg` }, // Apply rotation
        { scale: scale.value }, // Apply scaling
      ],
    };
  });
 

  return ( 
      <Animated.View style={animatedStyle}>
        {(lastState === 'searching for twin') && (
          <View
            style={[
              { 
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
      </Animated.View> 
  );
};

export default Temperatures;
