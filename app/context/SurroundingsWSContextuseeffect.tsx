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
  const { tokenVersion, reInitialize, user, onSignOut } = useUser();
  const { appStateVisible } = useAppState();
  const [token, setToken] = useState<string | null>(null); 
  const [isReconnecting, setIsReconnecting] = useState(false);

// Time delay for reconnection attempts (e.g., 10 seconds, 20 seconds, etc.)
const [reconnectionDelay, setReconnectionDelay] = useState(10000); // Start with 10 seconds

  
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
      console.log("Closing existing Location Update WebSocket connection");
      socketRef.current.close();
      socketRef.current = null;
    }
  };

 // Establish (or re-establish) the WebSocket connection.
useEffect(() => {
  if (!token) {
    console.log(`[${new Date().toISOString()}] No token available for WebSocket`);
    console.log(`[${new Date().toISOString()}] Authenticated user:`, user.authenticated);

    return;
  }
  console.log(`[${new Date().toISOString()}] Authenticated user:`, user.authenticated);

  // Check if the WebSocket is already open before attempting to create a new one
  if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    console.log("WebSocket is already open. No need to reconnect.");
  } else {
    // If no socket exists or it's not open, create a new WebSocket connection.
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${token}`;
    console.log("Connecting to WebSocket:", socketUrl);

    // Close the existing socket if it's not in an open state
    if (socketRef.current) {
      console.log("Closing existing Location Update WebSocket connection.");
      socketRef.current.close();
    }

    // Now create a new socket connection
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Location Update WebSocket connection opened");

      // Reset reconnection attempt state on successful connection
      // setIsReconnecting(false);
      // setReconnectionDelay(10000); // Reset delay to 10 seconds
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
    
      reInitialize();
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed", event.code, event.reason);

      if (event.wasClean) {
        console.log("WebSocket closed cleanly by the server.");
      } else {
        console.warn("WebSocket closed unexpectedly (possibly a server issue).");
      }

      if (event.code === 1006) {
        console.error("Abnormal WebSocket closure (possibly lost connection).");
      } else if (event.code === 4001) {
        console.error("Server closed connection due to authentication issues.");
      } else if (event.code === 4403) {
        console.error("Forbidden: Authentication token expired or invalid.");
      }

      // Prevent reconnection if one is already in progress
      // if (!isReconnecting && appStateVisible === "active") {
      //   console.log("Attempting to reconnect...");

      //   setIsReconnecting(true);

      //   // Use a timeout with increasing delay
      //   setTimeout(() => {
      //     console.log("Reconnecting to WebSocket...");
      //     setReconnectAttempt((prev) => prev + 1); // Increment reconnect attempt
      //     setReconnectionDelay((prev) => Math.min(prev * 2, 60000)); // Exponential backoff, max delay is 1 minute
      //   }, reconnectionDelay);
      // }
    };
  } 
  return () => {
    closeSocket();
  };
}, [token, reconnectAttempt]);


  // Fetch the token when the provider mounts or when the user changes.
  useEffect(() => {
    if (user && user.authenticated) {
      
    fetchToken();
    
    }
  }, [user, tokenVersion]);

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
