import React, { useCallback, useEffect, useRef, useState } from "react"; 
import { useFocusEffect } from "expo-router";
import { useUser } from "../context/UserContext";
import * as SecureStore from 'expo-secure-store';
import { useAppMessage } from '../context/AppMessageContext';
import { useActiveSearch } from "../context/ActiveSearchContext";

interface SurroundingsWebSocketProps { 
  reconnectSocket: boolean;
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useSurroundingsWebSocket = ({ 
  //token,
  reconnectSocket, //appstate
 reconnectOnUserButtonPress,
  onMessage,
  onError,
  onClose,
}: SurroundingsWebSocketProps) => {

 

  const TOKEN_KEY = 'accessToken';

  const socketRef = useRef<WebSocket | null>(null);
   const { showAppMessage } = useAppMessage();
const {manualSurroundingsRefresh,  resetRefreshSurroundingsManually  } = useActiveSearch();

  const { user } = useUser();
   const [token, setToken] = useState<string | null>(null);
  //  const [triggerReconnectAfterFetch, setTriggerReconnectAfterFetch] = useState(false);


     useFocusEffect(
       useCallback(() => {
         console.log("useFocusEffect in useSurroundingWebsockets focused");
         if (user && user.authenticated) { //if app is in foreground, might be an unnecessary check but I'm not sure
          
         setToken(null);
         fetchToken();
        //  setTriggerReconnectAfterFetch(true);
         
        }
   
         return () => {
           console.log("useFocusEffect in useSurroundingWebsockets unfocused");
          
          // socketRef.current = null;
          
           setToken(null);
          //  setTriggerReconnectAfterFetch(false);
         };
       }, [])
     );


     const fetchToken = async () => {
      //console.log('fetching user token in current location socket');
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log(storedToken);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };


     useEffect(() => {

      if (manualSurroundingsRefresh) {
        
      console.log('REFRESHING MANUALLY');
      // if (!user || !user?.authenticated) {
      //   return
      // } 

      if (socketRef && socketRef.current) {
        socketRef.current.close();
      }

      setToken(null);
       
         fetchToken();
         resetRefreshSurroundingsManually();
        //  setTriggerReconnectAfterFetch(false);
        //  setTriggerReconnectAfterFetch(true);
        
      }

     }, [manualSurroundingsRefresh]);
   


 
  

  useEffect(() => {
    console.log('use effect for socket!');

    if (!token) {
      console.log('no token in socket!');
     // showAppMessage(true, null, 'no token when surroundings websocket use effect triggered');
    return
    }; 

    //if (!triggerReconnectAfterFetch) return;

    if (socketRef && socketRef.current) {
      console.log("Current location WebSocket already initialized, skipping new connection.");
       return;
     }


  
 
     
     console.log(`token in surroundings web socket: ${token}`);

     
    //const socketUrl = `wss://climatetwin-lzyyd.ondigitalocean.app/ws/climate-twin/current/?user_token=${token}`;
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${token}`;

    console.log("WebSocket connection URL:", socketUrl); // Log the WebSocket URL and token

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;
 
    socket.onopen = () => {
      console.log("Surroundings websocket connection opened");
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
      console.log("Surroundings websocket connection closed");
      socketRef.current = null; 
      if (onClose) {
        onClose();
      }
    };
      

    // Cleanup when component unmounts
    return () => {
      if (socketRef.current) {
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
        console.log("Sending message to WebSocket:", message); 
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open");
      }
    },
  };
};



export default useSurroundingsWebSocket;
