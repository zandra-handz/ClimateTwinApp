import React, { useCallback, useEffect, useState, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { View, StyleSheet, TextInput } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { useAppMessage } from "../context/AppMessageContext";
import { useAppState } from "../context/AppStateContext";  
import { useActiveSearch } from "../context/ActiveSearchContext";

import WorldMapSvg from "../assets/svgs/worldmap.svg";

import Dot from "../animations/Dot";

import * as SecureStore from "expo-secure-store";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedDot = Animated.createAnimatedComponent(Dot);

interface WebSocketProps {
  onMessage: (update: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

const useWebSocket = ({ 
  reconnectOnUserButtonPress,
  latitude,
  longitude,
  prevLatitude,
  prevLongitude,
  prevPrevLatitude,
  prevPrevLongitude,
  temperatureSharedValue,
  countrySharedValue,
  temperatureDifference,
  onMessage,
  onError,
  onClose,
}: WebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { showAppMessage } = useAppMessage();
  const { appStateVisible } = useAppState(); 
  const { foundExploreLocations } = useActiveSearch();

  const TOKEN_KEY = "accessToken";

  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [triggerReconnectAfterFetch, setTriggerReconnectAfterFetch] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log("Location Searcher socket is focused");
      if (appStateVisible && user && user.authenticated) {
        //if app is in foreground, might be an unnecessary check but I'm not sure

        fetchToken();
        setTriggerReconnectAfterFetch(true);
      }

      return () => {
        console.log("Screen location socket is unfocused");
        setTriggerReconnectAfterFetch(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!reconnectOnUserButtonPress || !user || !user?.authenticated) {
      return;
    }
    fetchToken();
    setTriggerReconnectAfterFetch(false);
    setTriggerReconnectAfterFetch(true);
  }, [reconnectOnUserButtonPress]);

  const fetchToken = async () => {
    console.log("fetching user token in location searcher socket");
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log(storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    if (!triggerReconnectAfterFetch) return;

    if (socketRef && socketRef.current) {
      console.log(
        "Searcher WebSocket already initialized, skipping new connection."
      );
      return;
    }

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/?user_token=${token}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Location search WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
     

        if (update && update.message && update.message === "Explore locations are ready!") {
          console.log('APP GOT EXPLORE LOCATIONS READY MESSAGE!');
          foundExploreLocations();
        }
        prevPrevLatitude.value = prevLatitude.value;
        prevPrevLongitude.value = prevLongitude.value;

        prevLatitude.value = latitude.value;
        prevLongitude.value = longitude.value;
        // console.log('WebSocket message received:', update); // Log the raw WebSocket message
        temperatureSharedValue.value = update.temperature || "";
        countrySharedValue.value = update.country_name || "";
        temperatureDifference.value = update.temp_difference || "";

        // prevCoords.value = {
        //   latitude: coords.value.latitude,
        //   longitude: coords.value.longitude
        // };
        latitude.value = update.latitude || 0;
        longitude.value = update.longitude || 0;
        // coords.value = {
        //   latitude: update.latitude || 0,
        //   longitude: update.longitude || 0
        // };
        // console.log(temperatureSharedValue);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      if (onError) onError(event);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socketRef.current = null;
      if (onClose) onClose();
    };

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
      }
    };
  }, [token, triggerReconnectAfterFetch]);

  return {
    sendMessage: (message: any) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(message));
      }
    },
  };
};

const WebSocketSearchingLocations: React.FC<{ 
  reconnectOnUserButtonPress: boolean;
}> = ({ reconnectOnUserButtonPress }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { user, reinitialize } = useUser();
  const { searchIsActive } = useActiveSearch();

  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  // // Using SharedValues for temperature and countryName
  // const temperatureValue = useSharedValue<string | null>(null);
  // const countryNameValue = useSharedValue<string | null>(null);

  const temperatureSharedValue = useSharedValue("");
  const countrySharedValue = useSharedValue("");
  const temperatureDifference = useSharedValue("");
  const coords = useSharedValue({ latitude: 0, longitude: 0 });

  const latitude = useSharedValue(0);
  const longitude = useSharedValue(0);

  const prevLatitude = useSharedValue(0);
  const prevLongitude = useSharedValue(0);

  const prevPrevLatitude = useSharedValue(0);
  const prevPrevLongitude = useSharedValue(0);

  const prevCoords = useSharedValue({ latitude: 0, longitude: 0 });

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setMapDimensions({ width, height });
  };

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

  const animatedCountry = useAnimatedProps(() => {
    return {
      text: `${countrySharedValue.value}`,
      defaultValue: `${countrySharedValue.value}`,
    };
  });

  // const animatedCoords = useAnimatedProps(() => ({
  //   latitude: latitude.value, // Directly using the shared value
  //   longitude: longitude.value
  // }));

  const animatedStyle = useAnimatedStyle(() => {
    // prevLatitude.value = latitude.value;
    // prevLongitude.value = longitude.value;
    // Normalize coordinates based on the mapContainer's dimensions
    const normalizedLeft =
      (longitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop = (90 - latitude.value) * (mapDimensions.height / 180); // Invert the vertical axis

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 1,
      backgroundColor: themeStyles.primaryText.color, // Use the color cycle here
      width: 6, // Size of the dot
      height: 6, // Size of the dot
      borderRadius: 3, // To make it round
      fadeOutDuration: 100,
    };
  });

  const animatedStylePrev = useAnimatedStyle(() => {
    // Normalize coordinates based on the mapContainer's dimensions
    const normalizedLeft =
      (prevLongitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop =
      (90 - prevLatitude.value) * (mapDimensions.height / 180); // Invert the vertical axis

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 0.6,
      backgroundColor: themeStyles.primaryText.color, // Use the color cycle here
      width: 6, // Size of the dot
      height: 6, // Size of the dot
      borderRadius: 3, // To make it round
      fadeOutDuration: 200,
    };
  });

  const animatedStylePrevPrev = useAnimatedStyle(() => {
    // Normalize coordinates based on the mapContainer's dimensions
    const normalizedLeft =
      (prevPrevLongitude.value + 180) * (mapDimensions.width / 360);
    const normalizedTop =
      (90 - prevPrevLatitude.value) * (mapDimensions.height / 180); // Invert the vertical axis

    return {
      position: "absolute",
      left: normalizedLeft,
      top: normalizedTop,
      zIndex: 2000,
      opacity: 0.3,
      backgroundColor: themeStyles.primaryText.color, // Use the color cycle here
      width: 4, // Size of the dot
      height: 4, // Size of the dot
      borderRadius: 3, // To make it round
      fadeOutDuration: 200,
    };
  });

  const animatedTemp = useAnimatedProps(() => {
    const difference =
      temperatureDifference.value !== null &&
      !isNaN(Number(temperatureDifference.value))
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
      text: `${temperatureSharedValue.value}°`,
      defaultValue: `${temperatureSharedValue.value}°`,
      color: color,
    };
  });

  // WebSocket hook
  useWebSocket({ 
    reconnectOnUserButtonPress,
    latitude,
    longitude,
    prevLatitude,
    prevLongitude,
    prevPrevLatitude,
    prevPrevLongitude,
    temperatureSharedValue,
    countrySharedValue,
    temperatureDifference,
    onMessage: (newUpdate) => {
      // console.log("Received update:", newUpdate);
    },
    onError: (error) => {
      console.error("Location Searcher WebSocket encountered an error:", error);
    },
    onClose: () => {
      console.log("Location Searcher WebSocket connection closed");
    },
  });

  return (
    <>
    {searchIsActive && (
    <View style={{ flexDirection: "column" }}>
      
      <View
        style={[appContainerStyles.mapContainer, { overflow: "hidden" }]}
        onLayout={handleLayout}
      >
        {/* {isValidCoords && (
          <AnimatedDot
          animatedProps={animatedDotProps} // Pass animatedProps here
          color="blue"                    // Customize the color
          size={20}                       // Customize the size
        />
        )} */}

        {/* <AnimatedDot style={animatedStyle} animatedProps={animatedCoords} /> */}

        <WorldMapSvg width={"100%"} color={"blue"} />
        {/* Only show the Dot if the map has dimensions */}
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
            <View
              style={[
                themeStyles.primaryBackground,
                {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: themeStyles.primaryText.color,
                  width: 52,
                  height: 52,
                  borderRadius: 52 / 2,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <AnimatedTextInput
                style={[styles.tempText, themeStyles.primaryText]}
                animatedProps={animatedTemp}
                editable={false}
                defaultValue={""}
              />
            </View>

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
