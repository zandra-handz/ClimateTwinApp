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
         if (reconnectSocket && user && user.authenticated) { //if app is in foreground, might be an unnecessary check but I'm not sure
          
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
        return
      } 
         fetchToken();
         setTriggerReconnectAfterFetch(false);
         setTriggerReconnectAfterFetch(true);

     }, [reconnectOnUserButtonPress]);
   

    const fetchToken = async () => {
      console.log('fetching user tokem in current location socket');
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log(storedToken);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };


    // useEffect(() => { 
    //   fetchToken();
    // }, []);


    // useEffect(() => {
    //   if (user && user.authenticated) {
        
    //   const fetchToken = async () => {
    //     try {
    //       const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    //       setToken(storedToken);
    //       //console.log(storedToken);
    //     } catch (error) {
    //       console.error('Failed to retrieve token:', error);
    //     }
    //   };

  
    //   fetchToken();
    // }
    // }, [user]);

  

  useEffect(() => {
    console.log('use effect for socket!');

    if (!token) {
      console.log('no token in socket!');
      showAppMessage(true, null, 'no token when surroundings websocket use effect triggered');
    return
    }; 

    if (!triggerReconnectAfterFetch) return;

    if (socketRef && socketRef.current) {
      console.log("Current location WebSocket already initialized, skipping new connection.");
       return;
     }


  
 
     
     console.log(`token in surroundings web socket: ${token}`);

     
    //const socketUrl = `wss://climatetwin-lzyyd.ondigitalocean.app/ws/climate-twin/current/?user_token=${userToken}`;
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${token}`;

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
      } else if ('error' in event) {
          errorMessage = (event as any).error; 
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
      socketRef.current = null; 
      // if (onClose) {
      //   onClose();
      // }
    };
      

    // Cleanup when component unmounts
    return () => {
      if (socketRef.current) {
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
        console.log("Sending message to WebSocket:", message); 
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open");
      }
    },
  };
};



export default useSurroundingsWebSocket;
