import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native"; 
import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";
import { useAppMessage } from "../context/AppMessageContext";
import { useActiveSearch } from "../context/ActiveSearchContext";

interface SurroundingsWebSocketProps {  
  onMessage: (update: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

const useSurroundingsWebSocket = ({ 
  onMessage,
  onError,
  onClose,
}: SurroundingsWebSocketProps) => {
  const TOKEN_KEY = "accessToken";
  const socketRef = useRef<WebSocket | null>(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const { showAppMessage } = useAppMessage();
  const { manualSurroundingsRefresh, resetRefreshSurroundingsManually } = useActiveSearch();
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState changed to:", appState.current);
      }
    });

    return () => subscription.remove();
  }, []);

  const fetchToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Fetched token:", storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log("Sending keep-alive ping");
        socketRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  
    return () => clearInterval(interval);
  }, []);

  // Reconnect WebSocket when app comes to foreground
  useEffect(() => {
    if (appStateVisible) {
      console.log("App came to foreground - refreshing WebSocket");
      closeSocket();
      setToken(null);
      fetchToken();
    }
  }, [appStateVisible]);
 

  // Manual refresh handling
  useEffect(() => {
    if (manualSurroundingsRefresh) {
      console.log("Manual refresh triggered");
      closeSocket();
      setToken(null);
      fetchToken();
      resetRefreshSurroundingsManually();
    }
  }, [manualSurroundingsRefresh]);

  // Initialize WebSocket
  useEffect(() => {
    if (!token) {
      console.log("No token available for WebSocket");
      return;
    }

    if (socketRef.current) {
      console.log("WebSocket already initialized, skipping new connection.");
      return;
    }

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${token}`;
    console.log("Connecting to WebSocket:", socketUrl);

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      onMessage(update);
    };

    socket.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
      if (onError) onError(event);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socketRef.current = null;
      if (onClose) onClose();
    };

    return () => {
      closeSocket();
    };
  }, [token]);

  const closeSocket = () => {
    if (socketRef.current) {
      console.log("Closing existing WebSocket connection");
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  return {
    sendMessage: (message: any) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log("Sending message:", message);
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open");
      }
    },
  };
};

export default useSurroundingsWebSocket;
