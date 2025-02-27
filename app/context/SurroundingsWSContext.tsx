import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";
import { useUser } from "../context/UserContext";
import { useAppState } from "../context/AppStateContext";
import { useAppMessage } from "../context/AppMessageContext";
import { useActiveSearch } from "./ActiveSearchContext";

interface SurroundingsWSContextType {
  sendMessage: (message: any) => void;
  lastMessage: any; // You can specify a more strict type if you know the structure
  lastLocationName: any;
}

const SurroundingsWSContext = createContext<
  SurroundingsWSContextType | undefined
>(undefined);

export const SurroundingsWSProvider: React.FC = ({ children }) => {
  const TOKEN_KEY = "accessToken";
  const socketRef = useRef<WebSocket | null>(null);
  const { user, reInitialize, isAuthenticated, isInitializing } = useUser();
  const { appStateVisible } = useAppState();
  const [token, setToken] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { handleLocationUpdateWSIsOpen, handleLocationUpdateWSIsClosed } = useActiveSearch();
  const { showAppMessage } = useAppMessage();

  const appState = useRef(AppState.currentState);
  const [appVisible, setAppVisible] = useState(appState.current);

   // 1 second to start, has exponential backoff capped at 
   // 60 seconds in timeout in attemptReconnect function
  const [reconnectionDelay, setReconnectionDelay] = useState(10000);
 
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [lastLocationName, setLastLocationName] = useState<any>(null);
  const [lastNotification, setLastNotification] = useState<any>(null);
 
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
 
  const fetchToken = async () => {
    setToken(null);
    console.log("fetchToken in socket context triggered!");
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
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Closing existing Location Update WebSocket connection");
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  // Manual WebSocket connection function
  const connectWebSocket = async (token?: string, noTokenPassed: boolean = false) => {
 
    // If no token is passed, attempt to fetch it from SecureStore

    let confirmedToken;

    if (!isAuthenticated || isInitializing || (!token && !noTokenPassed) ) {
      return;
    }

    if (!token && noTokenPassed) {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!storedToken) {
          console.log(
            `[${new Date().toISOString()}] No token available in SecureStore.`
          );
          return;
        } 
        confirmedToken = storedToken;
      } catch (error) {
        console.error("Failed to retrieve token from SecureStore:", error);
        return;
      }
    } else {
      confirmedToken = token;
    }

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${confirmedToken}`;
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket is already open, skipping connection.");
        return;
      } else if (socketRef.current.readyState === WebSocket.CLOSING) {
        console.log("WebSocket is closing, closing existing WebSocket connection before reopening.");
        socketRef.current.close();
      } else if (socketRef.current.readyState === WebSocket.CLOSED) {
        console.log("WebSocket is already closed, attempting to reconnect."); 
      }
    }
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Location Update WebSocket connection opened");
      handleLocationUpdateWSIsOpen(true);

      showAppMessage(true, null, "Websocket connected!");

      setIsReconnecting(false);
      setReconnectionDelay(3000); // Reset delay to 10 seconds
    };

    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      console.log("Received update from socket in WS context:", update);
      // Update state so that consumers can receive the update.
      // setLastMessage(update);

      if (update.message) {
        setLastMessage(update.message); // Update the message state
      }

      if (update.notification) {
        setLastNotification(update.notification); // Update the message state
      }


      if (update.name) {
        setLastLocationName(update.name); // Update the name state
      }
    };

    socket.onerror = (event: Event) => {
      console.log("WebSocket error:", event);
      showAppMessage(true, null, "Websocket error on trying to connect."); 
    };

    socket.onclose = (event) => {
      handleLocationUpdateWSIsClosed();
      logWebSocketClosure(event);
      const tokenLastTen = confirmedToken ? confirmedToken.slice(-10) : null;
      showAppMessage(
        true,
        null,
        `WebSocket closed, ${isAuthenticated} ${tokenLastTen}: ${
          event.reason || "No reason provided."
        }`
      );

      switch (event.code) {
        case 1000:
          console.log("WebSocket closed manually by the client.");
          break;
        case 1006:
          console.error(
            `Abnormal WebSocket closure ${isAuthenticated} ${tokenLastTen} (possibly lost connection).`
          );
          attemptReconnect();
          break;
        case 4001:
          console.error(
            "Server closed connection due to authentication issues."
          );
          // reInitialize();
          break;
        case 4403:
          console.error("Forbidden: Authentication token expired or invalid.");
          break;
        default:
          console.warn(
            `WebSocket closed with code ${event.code}. Attempting reconnection...`
          );
          attemptReconnect();
          break;
      }
    };

    // Utility function for logging
    const logWebSocketClosure = (event) => {
      console.log(
        `WebSocket closed [Code: ${event.code}, Reason: ${
          event.reason || "No reason"
        }]`
      );
      if (event.wasClean) {
        console.log("WebSocket closed cleanly by the server.");
      }
    };
  };
 
  const attemptReconnect = () => {
    if (!isReconnecting && isAuthenticated && !isInitializing) {
      console.log("Attempting to reconnect triggered");

      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.log("Attempting to reconnect: socket is not already open");
        setIsReconnecting(true);

        setTimeout(() => {
          if (
            isAuthenticated &&
            (!socketRef.current ||
              socketRef.current.readyState !== WebSocket.OPEN)
          ) {
            console.log("Reconnecting to WebSocket...");
            setReconnectAttempt((prev) => prev + 1);
            setReconnectionDelay((prev) => Math.min(prev * 2, 60000));
            connectWebSocket(undefined, true);
          } else {
            console.log("WebSocket is already open, skipping reconnection.");
          }
        }, reconnectionDelay);
      } else {
        console.log("WebSocket is already open, skipping reconnection.");
      }
    }
  };
 
  useEffect(() => {
    if (
      isAuthenticated &&
      !isInitializing 
      // &&
      // (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
    ) {
      fetchToken();
    } else {
      setToken(null);  //triggers useEffect to connect socket 
      console.log("token set to null");
      setLastMessage(null);
      setLastNotification(null);
      setLastLocationName(null);
    }
  }, [isAuthenticated, isInitializing]);

  useEffect(() => {
    if (appStateVisible !== "active") {
      console.log("App is in the background, triggering close socket...");
      closeSocket();
    }
  }, [appStateVisible]);

  useEffect(() => {
    if (token && isAuthenticated && !isInitializing) {
      console.log("WEBSOCKET CONTEXT: token use effect triggered", token);
      
      if (
        !socketRef.current || 
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.log("Connecting to WebSocket triggered by token in dependency...");
        connectWebSocket(token);
      } else {
        console.log("WebSocket is already open, skipping reconnection.");
      }
    }
  
    // Cleanup WebSocket when token is null or component unmounts
    return () => {
      closeSocket();
    };
  }, [token, isAuthenticated, isInitializing]); 
  

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  return (
    <SurroundingsWSContext.Provider
      value={{ sendMessage, lastMessage, lastNotification, lastLocationName }}
    >
      {children}
    </SurroundingsWSContext.Provider>
  );
};

export const useSurroundingsWS = () => {
  const context = useContext(SurroundingsWSContext);
  if (context === undefined) {
    throw new Error(
      "useSurroundingsWS must be used within a SurroundingsWSProvider"
    );
  }
  return context;
};
