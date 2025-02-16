import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { useAppState } from "../context/AppStateContext";
import { useAppMessage } from "../context/AppMessageContext";
 

interface SurroundingsWSContextType {
  sendMessage: (message: any) => void;
  lastMessage: any; // You can specify a more strict type if you know the structure
  lastLocationName: any;
}

const SurroundingsWSContext = createContext<SurroundingsWSContextType | undefined>(undefined);

export const SurroundingsWSProvider: React.FC = ({ children }) => {
  const TOKEN_KEY = "accessToken";
  const socketRef = useRef<WebSocket | null>(null);
  const { reInitialize, user } = useUser();
  const { appStateVisible } = useAppState();
  const [token, setToken] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { showAppMessage } = useAppMessage();

  // Time delay for reconnection attempts (e.g., 10 seconds, 20 seconds, etc.)
  const [reconnectionDelay, setReconnectionDelay] = useState(10000); // Start with 10 seconds

  // State variable to hold the last message received.
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [lastLocationName, setLastLocationName] = useState<any>(null);

  // State variable to trigger reconnection attempts.
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // Function to fetch the token.
  const fetchToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      //console.log("Fetched token:", storedToken);
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

  useEffect(() => {
    if (appStateVisible === 'active') {
      console.log('WS CONTEXT USE EFFECT: appStateVisible === active');
      
    }

  }, [appStateVisible]);

  // Manual WebSocket connection function
  const connectWebSocket = async (token?: string) => {
    // If no token is passed, attempt to fetch it from SecureStore

    let confirmedToken; 

    if (!user.authenticated) {
      return;
    }

    if (!token) {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!storedToken) {
          console.log(`[${new Date().toISOString()}] No token available in SecureStore.`);
          return;
        }
       // token = storedToken; // Use the token fetched from SecureStore
        confirmedToken = storedToken;
      } catch (error) {
        console.error("Failed to retrieve token from SecureStore:", error);
        return;
      }
    } else {
      confirmedToken = token;
    }
  
    // Proceed with WebSocket connection if a valid token is available
    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${confirmedToken}`;
    console.log("Connecting to Location Update WebSocket", confirmedToken); //, socketUrl);
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log("Closing existing open Location Update WebSocket connection.");
        
        socketRef.current.close();
      } else {
        console.log("Socket is not open, skipping close.");
      }
    } 
    //setIsReconnecting(true);
    // Create a new WebSocket connection
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;
  
    socket.onopen = () => {
      console.log("Location Update WebSocket connection opened");

      //Alert.alert("WEBSOCKET CONNECT", "Websocket connected!");
      showAppMessage(true, null, "Websocket connected!");
  
      // Reset reconnection attempt state on successful connection
      setIsReconnecting(false);
      setReconnectionDelay(10000); // Reset delay to 10 seconds
    };
  
    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      console.log("Received update from socket in WS context:", update);
      // Update state so that consumers can receive the update.
     // setLastMessage(update);

      if (update.message) {
        setLastMessage(update.message); // Update the message state
      }
    
      if (update.name) {
        setLastLocationName(update.name); // Update the name state
      }
    };
  
    socket.onerror = (event: Event) => {
      console.log("WebSocket error:", event);
      showAppMessage(true, null, "Websocket error on trying to connect.");
      //Alert.alert("WEBSOCKET CONNECT ERROR", "Websocket error on trying to connect.");
      reInitialize(); // This could reset the user state or handle certain errors
      //attemptReconnect(); // Trigger reconnection attempt
    };
  
    socket.onclose = (event) => {
      console.log("WebSocket closed", event.code, event.reason);
    
      if (event.wasClean) {
        console.log("WebSocket closed cleanly by the server.");
      } else {
        console.log("WebSocket closed unexpectedly (possibly a server issue).");
      }
    
      // Handle different closure codes if needed
      if (event.code === 1006) {
        console.error("Abnormal WebSocket closure (possibly lost connection).");
      } else if (event.code === 4001) {
        console.error("Server closed connection due to authentication issues.");
      } else if (event.code === 4403) {
        console.error("Forbidden: Authentication token expired or invalid.");
      }
    
      // Check if it was manually closed
      if (event.code === 1000) {
        console.log("WebSocket closed manually by the client.");
      } else {
        // Attempt to reconnect for unexpected closures
        attemptReconnect();
      }
    };
    
  };
 
  

  // Function to attempt reconnection with exponential backoff
  const attemptReconnect = () => {
    if (!isReconnecting && appStateVisible === "active" && user && user.authenticated && !user.loading) {
      console.log("Attempting to reconnect triggered");
  
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.log("Attempting to reconnect: socket is not already open");
        setIsReconnecting(true);
   
        setTimeout(() => { 
          if (appStateVisible === "active" && user && user.authenticated && !user.loading && (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)) {
            console.log("Reconnecting to WebSocket...");
            setReconnectAttempt((prev) => prev + 1);  
            setReconnectionDelay((prev) => Math.min(prev * 2, 60000));  
            connectWebSocket(); 
          } else {
            console.log("WebSocket is already open, skipping reconnection.");
           
          }
        }, reconnectionDelay);
      } else {
        console.log("WebSocket is already open, skipping reconnection.");
      }
    }
  };
  

  // Manually fetch the token and initialize the WebSocket connection when the provider mounts
  useEffect(() => {
    if (
      user && 
      user.authenticated && 
      !user.loading && 
      (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
    ) {
      console.log('WEBSOCKET CONTEXT: Fetching token from SecureStore because the user is authenticated and the WebSocket is not open.');
      console.log(`WebSocket state: ${socketRef.current ? socketRef.current.readyState : 'No socket'}`);
      

      fetchToken();
    } else {
      console.log('WEBSOCKET CONTEXT: Skipping token fetch because WebSocket is already open or user is not authenticated.');
      console.log(`WebSocket state: ${socketRef.current ? socketRef.current.readyState : 'No socket'}`);
      console.log(`User authenticated: ${user.authenticated}`);
      setToken(null); // Clear token when user logs out or is not authenticated
      console.log('token set to null');
      setLastMessage(null);
      setLastLocationName(null);
    }
  }, [user]);
  
 

    
useEffect(() => {   // Access appStateVisible from context

  if (appStateVisible !== 'active') {
    console.log('App is in the background, closing WebSocket...');
    closeSocket(); // Close WebSocket when app goes into background
  }
}, [appStateVisible]); 

 

  useEffect(() => {
    if (token) {
      console.log('WEBSOCKET CONTEXT: token use effect triggered', token);
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.log("Connecting to WebSocket triggered by token in dependency...");
        connectWebSocket(token);  // Call your WebSocket connection function
      } else {
        console.log("WebSocket is already open, skipping reconnection.");
      }
      
     // connectWebSocket(token); // Manually trigger WebSocket connection on token change
    } else {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      closeSocket();
    } 
  }

    // Cleanup the socket on unmount or when token changes
    return () => {
      
      closeSocket();
    };
  }, [token]); // Runs when `token` changes

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  return (
    <SurroundingsWSContext.Provider value={{ sendMessage, lastMessage, lastLocationName }}>
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
