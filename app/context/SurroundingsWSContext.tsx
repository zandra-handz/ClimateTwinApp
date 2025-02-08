import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { useAppState } from "../context/AppStateContext";

interface SurroundingsWSContextType {
  sendMessage: (message: any) => void;
  lastMessage: any; // You can specify a more strict type if you know the structure
}

const SurroundingsWSContext = createContext<SurroundingsWSContextType | undefined>(undefined);

export const SurroundingsWSProvider: React.FC = ({ children }) => {
  const TOKEN_KEY = "accessToken";
  const socketRef = useRef<WebSocket | null>(null);
  const { tokenVersion, reInitialize, user } = useUser();
  const { appStateVisible } = useAppState();
  const [token, setToken] = useState<string | null>(null);
  
  // State variable to hold the last message received.
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  // State variable to trigger reconnection attempts.
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // Function to fetch the token.
  const fetchToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Fetched token:", storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };

  // Function to close the socket.
  const closeSocket = () => {
    if (socketRef.current) {
      console.log("Closing existing WebSocket connection");
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  // Establish (or re-establish) the WebSocket connection.
  useEffect(() => {
    if (!token) {
      console.log("No token available for WebSocket");
      return;
    }

    // Always close any existing socket before reconnecting.
    closeSocket();

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${token}`;
    console.log("Connecting to WebSocket:", socketUrl);
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Location Update WebSocket connection opened");
    };

    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      console.log("Received update from socket in WS context:", update);
      // Update state so that consumers can receive the update.
      setLastMessage(update);
    };

    socket.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
      Alert.alert("WEBSOCKET CONNECT ERROR", "Websocket error on trying to connect.");
    };

    socket.onclose = () => {
      console.log("Location update WebSocket connection closed");
      socketRef.current = null;
      // If the app is active, attempt to reconnect after a delay.
      if (appStateVisible === "active") {
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          setReconnectAttempt((prev) => prev + 1);
        }, 3000); // Delay of 3 seconds before reconnection.
      }
    };

    // Cleanup: close the socket if any dependency changes.
    return () => {
      closeSocket();
    };
  }, [token, tokenVersion, appStateVisible, reconnectAttempt]);

  // Fetch the token when the provider mounts or when the user changes.
  useEffect(() => {
    fetchToken();
  }, [user]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  return (
    <SurroundingsWSContext.Provider value={{ sendMessage, lastMessage }}>
      {children}
    </SurroundingsWSContext.Provider>
  );
};

export const useSurroundingsWS = () => {
  const context = useContext(SurroundingsWSContext);
  if (context === undefined) {
    throw new Error("useSurroundingsWS must be used within a SurroundingsWSProvider");
  }
  return context;
};
