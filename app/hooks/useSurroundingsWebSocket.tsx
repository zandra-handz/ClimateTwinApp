import React, { useCallback, useEffect, useRef, useState } from "react";

import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";
import { useAppMessage } from "../context/AppMessageContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useAppState } from "../context/AppStateContext"; 


import { websocketToken } from '../apicalls';

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
  const { appStateVisible } = useAppState();

  const { showAppMessage } = useAppMessage();
  const { manualSurroundingsRefresh, resetRefreshSurroundingsManually } = useActiveSearch();
  const { user, reInitialize, tokenVersion } = useUser(); //reInitialize will trigger new tokenVersion if needs to be refreshed
  const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     console.log("AppState changed:", nextAppState);
  //     console.log("Previous AppState:", appState.current);
  
  //     if (appState.current.match(/inactive|background/) && nextAppState === "active") {
  //       appState.current = nextAppState;
  //       setAppStateVisible(appState.current);
  //       console.log("Updated appStateVisible to:", appState.current);
  //     }
  //   });
  
  //   return () => subscription.remove();
  // }, []);
  
  

  const fetchToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Fetched token:", storedToken);
      //this shouldn't trgger a rerender if token is the same
      //if want to force a rerender every time, use setToken((prev) => storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };


  const fetchTokenForceRerender = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Fetched token:", storedToken); 
      // can only use closeSocket before setToken if forcing rerender every time
      // otherwise it may close the socket but the token amy be the same and not trigger it to reopen
      //closeSocket();
      setToken((prev) => storedToken);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
    }
  };


  useEffect(() => {
    if (user) {
      console.log('fetch token in location update websocket triggered by user');
      fetchToken();
    }
  }, [user]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (socketRef.current?.readyState === WebSocket.OPEN) {
  //       console.log("Sending keep-alive ping");
  //       socketRef.current.send(JSON.stringify({ type: "ping" }));
  //     }
  //   }, 30000);
  
  //   return () => clearInterval(interval);
  // }, []);

  // Reconnect WebSocket when app comes to foreground
  useEffect(() => {
    if (appStateVisible === "active") {
      console.log("App came to foreground - refreshing WebSocket");
      checkFor401HTTP(); //this will call getCurrentUser and trigger the 401 refresh if needed
      // closeSocket();
      // setToken(null);
      // fetchTokenForceRerender(); //doesn't seem to force if token is same hence setting token to null for now
   
    }
  }, [appStateVisible]);



  useEffect(() => {
    if (tokenVersion) {
      closeSocket(); 
      fetchToken();

    }

  }, [tokenVersion]);


  

  const checkFor401HTTP = async () => {
    console.log('TESTING REINITIALIZE');
    await reInitialize();

  };
 

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
      console.log("Location Update WebSocket connection opened");
    };

    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      onMessage(update);
    };

    
    socket.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
      //might cause infinite loop if keeps erroring !!!
      //fetchTokenForceRerender();
      checkFor401HTTP();
      if (onError) onError(event);
    };

    socket.onclose = () => {
      console.log("Location update WebSocket connection closed");
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
