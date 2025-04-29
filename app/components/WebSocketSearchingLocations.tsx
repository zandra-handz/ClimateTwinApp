import React, { useState } from "react";

import { View, StyleSheet, TextInput } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
} from "react-native-reanimated";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
 
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import ProgressCircle from "./Scaffolding/ProgressCircle";
import WorldMapSvg from "../assets/svgs/worldmap.svg";

import useWebSocket from "../../src/hooks/useWebSocket";

import Dot from "../animations/Dot";
 

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface WebSocketProps {
  onMessage: (update: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

const WebSocketSearchingLocations: React.FC<{
  reconnectOnUserButtonPress: boolean;
}> = ({ reconnectOnUserButtonPress }) => {
  const { themeStyles, constantColorsStyles, appContainerStyles } =
    useGlobalStyles(); 

  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const { lastState } = useSurroundingsWS();
  const { sharedValues } = useWebSocket(); // Getting shared values from the hook

  const {
    latitude,
    longitude,
    prevLatitude,
    prevLongitude,
    prevPrevLatitude,
    prevPrevLongitude,
    temperatureSharedValue,
    countrySharedValue,
    temperatureDifference,
  } = sharedValues;
  const prevCoords = useSharedValue({ latitude: 0, longitude: 0 });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };
 

  const animatedCountry = useAnimatedProps(() => {
    return {
      text: `${countrySharedValue.value}`,
      defaultValue: `${countrySharedValue.value}`,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const normalizedLeft =
      (longitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop = (90 - latitude.value) * (mapDimensions.height / 180);

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 1,
      backgroundColor: themeStyles.primaryText.color,
      width: 6,
      height: 6,
      borderRadius: 3,
      fadeOutDuration: 100,
    };
  });

  const animatedStylePrev = useAnimatedStyle(() => {
    const normalizedLeft =
      (prevLongitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop =
      (90 - prevLatitude.value) * (mapDimensions.height / 180);

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 0.6,
      backgroundColor: themeStyles.primaryText.color,
      width: 6,
      height: 6,
      borderRadius: 3,
      fadeOutDuration: 200,
    };
  });

  const animatedStylePrevPrev = useAnimatedStyle(() => {
    const normalizedLeft =
      (prevPrevLongitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop =
      (90 - prevPrevLatitude.value) * (mapDimensions.height / 180);

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 0.3,
      backgroundColor: themeStyles.primaryText.color,
      width: 4,
      height: 4,
      borderRadius: 3,
      fadeOutDuration: 200,
    };
  });

  return (
    <>
      {(lastState === 'searching for twin') && (
        <>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
            }}
          >
            <ProgressCircle height={"300"} width={"300"} />
          </View>
          <View style={{ flexDirection: "column" }}>
            <View
              style={[appContainerStyles.mapContainer, { overflow: "hidden" }]}
              onLayout={handleLayout}
            >
              <WorldMapSvg
                width={"100%"}
                color={constantColorsStyles.v1LogoColor.backgroundColor}
              />
              {mapDimensions.width > 0 &&
                mapDimensions.height > 0 &&
                latitude !== undefined &&
                longitude !== undefined && (
                  <>
                    <AnimatedDot style={animatedStyle} />

                    <AnimatedDot style={animatedStylePrev} />

                    <AnimatedDot style={animatedStylePrevPrev} />
                  </>
                )}
            </View>
            <View style={appContainerStyles.defaultElementRow}>
              <View style={styles.updatesContainer}>
                <View style={styles.infoContainer}>
                  <AnimatedTextInput
                    style={[styles.updateText, themeStyles.primaryText]}
                    animatedProps={animatedCountry}
                    editable={false}
                    defaultValue={""}
                  />
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  updatesContainer: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: "column",
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  updateText: {
    fontSize: 20,
  },
  tempText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  coordsText: {
    fontSize: 16,
  },
});

export default WebSocketSearchingLocations;
