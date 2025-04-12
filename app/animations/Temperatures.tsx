import React from "react";
import { View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { useActiveSearch } from "../../src/context/ActiveSearchContext";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import useWebSocket from "@/app/hooks/useWebSocket";

const Temperatures = () => {
  const { themeStyles, appFontStyles } = useGlobalStyles();
  const { isExploring, isSearchingForTwin } = useActiveSearch();

  Animated.addWhitelistedNativeProps({ text: true });
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const { sharedValues } = useWebSocket(); // Getting shared values from the hook

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
  

  // const animatedTemp = useAnimatedProps(() => {
  //   const difference =
  //     // temperatureDifference.value !== null &&
  //     !isNaN(Number(temperatureDifference.value))
  //       ? Number(temperatureDifference.value)
  //       : null;

  //   let color = null;
  //   if (difference && difference < 2) {
  //     color = "red";
  //   } else if (difference && difference <= 30) {
  //     const colorIndex = Math.floor(((difference - 2) / 28) * 8);
  //     color = colorMap[colorIndex];
  //   } else {
  //     color = themeStyles.primaryText.color;
  //   }

  //   return {
  //     text: `${temperatureSharedValue.value}°`,
  //     defaultValue: `${temperatureSharedValue.value}°`,
  //     color: color,
  //     //fontSize: 2,
  //     transform: [
  //       { opacity: scale.value },
  //       // { rotate: `${rotation.value}deg` }, // Apply rotation
  //       { scale: scale.value }, 
  //     ],
  //   };
  // });

  React.useEffect(() => {
    if (!isExploring && isSearchingForTwin) { 
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
  }, [isExploring, isSearchingForTwin]);
 
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        // { rotate: `${rotation.value}deg` }, // Apply rotation
        { scale: scale.value }, // Apply scaling
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      marginTop: positionShift.value, // Move the container up
    };
  });

  return (
    // <Animated.View
    //   style={[
    //     containerStyle,
    //     { justifyContent: "center", alignContent: "center" },
    //   ]}
    // >
      <Animated.View style={animatedStyle}>
        {isSearchingForTwin && (
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
    // </Animated.View>
  );
};

export default Temperatures;
