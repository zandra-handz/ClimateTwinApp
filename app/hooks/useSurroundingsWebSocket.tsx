import React, { useCallback, useEffect, useRef, useState } from "react"; 
import { useFocusEffect } from "expo-router";
import { useUser } from "../context/UserContext";
import * as SecureStore from 'expo-secure-store';
import { useAppMessage } from '../context/AppMessageContext';

interface SurroundingsWebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useSurroundingsWebSocket = ({ 
  reconnectSocket, //appstate
  reconnectOnUserButtonPress,
  onMessage,
  onError,
  onClose,
}: SurroundingsWebSocketProps) => {

  const TOKEN_KEY = 'accessToken';

  const socketRef = useRef<WebSocket | null>(null);
   const { showAppMessage } = useAppMessage();


  const { user } = useUser();
   const [token, setToken] = useState<string | null>(null);
   const [triggerReconnectAfterFetch, setTriggerReconnectAfterFetch] = useState(false);


     useFocusEffect(
       useCallback(() => {
         console.log("Current location socket is focused");
        //  if (reconnectSocket && user && user.authenticated) { //if app is in foreground, might be an unnecessary check but I'm not sure
          
         fetchToken();
         setTriggerReconnectAfterFetch(true);
         
        // }
   
         return () => {
           console.log("Screen location socket is unfocused");
           setTriggerReconnectAfterFetch(false);
         };
       }, [])
     );

     useEffect(() => {
      if (!reconnectOnUserButtonPress || !user || !user?.authenticated) {
        return
      } 
         fetchToken();
         setTriggerReconnectAfterFetch(false);
         setTriggerReconnectAfterFetch(true);

     }, [reconnectOnUserButtonPress]);
   

     const fetchToken = async () => {
      console.log("Fetching user token in current location socket");
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log("Fetched token:", storedToken);
    
        if (storedToken) {
          setToken(storedToken);
          initiateWebSocketConnection(storedToken); // Trigger WebSocket connection here
        }
      } catch (error) {
        console.error("Failed to retrieve token:", error);
      }
    };
    
    const initiateWebSocketConnection = (userToken: string) => {
      console.log("use effect for socket!");
    
      if (!userToken) {
        console.log("No token in socket!");
        showAppMessage(
          true,
          null,
          "No token when surroundings WebSocket use effect triggered"
        );
        return;
      }
    
      if (!triggerReconnectAfterFetch) return;
    
      if (socketRef && socketRef.current) {
        console.log(
          "Current location WebSocket already initialized, skipping new connection."
        );
        return;
      }
    
      console.log(`Token in surroundings WebSocket: ${userToken}`);
    
      const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${userToken}`;
      console.log("WebSocket connection URL:", socketUrl);
    
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
    
        if ("message" in event) {
          errorMessage = (event as any).message;
        } else if ("error" in event) {
          errorMessage = (event as any).error;
        } else if ("reason" in event) {
          errorMessage = (event as any).reason;
        } else {
          errorMessage = JSON.stringify(event);
        }
    
        if (onError) {
          onError(event);
        }
      };
    
      socket.onclose = () => {
        console.log("WebSocket connection closed");
        socketRef.current = null;
      };
    };
    
    // Remove token dependency in useEffect
    useEffect(() => {
      if (triggerReconnectAfterFetch) {
        fetchToken();
      }
    }, [triggerReconnectAfterFetch]);
    

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



export default useSurroundingsWebSocket;
