import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import * as SecureStore from 'expo-secure-store';

import { Alert } from 'react-native';

interface SearchWebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useSearchForLocationWebSocket = ({
  userToken,
  reconnectSocket,
  onMessage,
  onError,
  onClose,
}: SurroundingsWebSocketProps) => {

  const TOKEN_KEY = 'accessToken';

  const socketRef = useRef<WebSocket | null>(null);

  const { user, reInitialize } = useUser();
   const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to retrieve token:', error);
        }
      };
  
      fetchToken();
    }, []);


    useEffect(() => {
      if (user && user.authenticated) {
        
      const fetchToken = async () => {
        try {
          const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
          setToken(storedToken);
          //console.log(storedToken);
        } catch (error) {
          console.error('Failed to retrieve token:', error);
        }
      };

  
      fetchToken();
    }
    }, [user]);

  

  useEffect(() => {

    if (socketRef && socketRef.current) {
      // console.log("WebSocket already initialized, skipping new connection.");
       return;
     }
  
    if (token) {
     
 
    //const socketUrl = `wss://climatetwin-lzyyd.ondigitalocean.app/ws/climate-twin/current/?user_token=${userToken}`;
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${userToken}`;

    console.log("WebSocket connection URL:", socketUrl); // Log the WebSocket URL and token

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
    
      let errorMessage = "Unknown error occurred.";
      
      if ('message' in event) {
        errorMessage = (event as any).message; // TypeScript workaround if message exists
      } else if ('reason' in event) {
        errorMessage = (event as any).reason;
      } else {
        errorMessage = JSON.stringify(event); // Fallback: Convert entire event to string
      }
    
      // Alert.alert(
      //   'DEBUG MODE: Request Failed',
      //   `The request could not be sent. Please try again.\n\nError: ${errorMessage}`
      // );
    
      if (onError) {
        onError(event);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      if (onClose) {
        onClose();
      }
    };
     
  }

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token, reconnectSocket, onMessage, onError, onClose]);

  return {
    sendMessage: (message: any) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("Sending message to WebSocket:", message); 
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open");
      }
    },
  };
};



export default useSearchForLocationWebSocket;
