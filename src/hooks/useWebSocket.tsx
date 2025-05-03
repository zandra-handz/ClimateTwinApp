import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useSharedValue } from "react-native-reanimated";
import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import * as SecureStore from "expo-secure-store";

const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const TOKEN_KEY = "accessToken";
  const { isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { lastState } = useSurroundingsWS();
  const [token, setToken] = useState<string | null>(null);
  const [triggerReconnectAfterFetch, setTriggerReconnectAfterFetch] =
    useState(false);

  // Create shared values within the hook
  const latitude = useSharedValue(0);
  const longitude = useSharedValue(0);
  const prevLatitude = useSharedValue(0);
  const prevLongitude = useSharedValue(0);
  const prevPrevLatitude = useSharedValue(0);
  const prevPrevLongitude = useSharedValue(0);
  const temperatureSharedValue = useSharedValue("");
  const countrySharedValue = useSharedValue("");
  const temperatureDifference = useSharedValue("");

  useFocusEffect(
    useCallback(() => {
      console.log("Location Searcher socket is focused");
      if (isAuthenticated && !settingsAreLoading && (lastState === 'searching for twin')) {
        fetchToken();
        setTriggerReconnectAfterFetch(true);
      }

      return () => {
        console.log("Screen location socket is unfocused");
        setTriggerReconnectAfterFetch(false);
      };
    }, [lastState])
  );

  const fetchToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      // console.log("fetching user token in location searcher socket", storedToken);

      setToken(storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    if (socketRef && socketRef.current) {
      console.log(
        "Searcher WebSocket already initialized, skipping new connection."
      );
      return;
    }
    // Create WebSocket connection
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/?user_token=${token}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(
        "WebSocket connection opened!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1"
      );
    };

    socket.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);

        // Update the shared values (no re-renders)
        prevPrevLatitude.value = prevLatitude.value;
        prevPrevLongitude.value = prevLongitude.value;

        prevLatitude.value = latitude.value;
        prevLongitude.value = longitude.value;

        temperatureSharedValue.value = update.temperature || 1;
        // console.log(temperatureSharedValue.value);
        countrySharedValue.value = update.country_name || "";
        temperatureDifference.value = update.temp_difference || "";

        latitude.value = update.latitude || 0;
        longitude.value = update.longitude || 0;
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
      }
    };
  }, [token]);

  return {
    sendMessage: (message: any) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(message));
      }
    },
    // Exposing shared values for use in other components
    sharedValues: {
      latitude,
      longitude,
      prevLatitude,
      prevLongitude,
      prevPrevLatitude,
      prevPrevLongitude,
      temperatureSharedValue,
      countrySharedValue,
      temperatureDifference,
    },
  };
};

export default useWebSocket;
