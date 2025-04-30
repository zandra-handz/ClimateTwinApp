import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useRef,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useUser } from "./UserContext";
import { useAppMessage } from "./AppMessageContext";
interface SurroundingsWSContextType {
  sendMessage: (message: string) => void;
  handleRefreshDataFromSocket: () => void;
  locationUpdateWSIsOpen: boolean;
  lastMessage: string | null; // You can specify a more strict type if you know the structure
  lastLocationName: string | null;
  baseLocationId: string | null;
  lastNotification: string | null;
  lastInboxItemId: string | null;
  lastRequestId: string | null;
  lastRequestType: string | null;
  lastRequestItemId: string | null;
  lastLocationId: string | null;
  lastLocationAccessTime: string | null;
  lastLatAndLong: [string, string] | null;
  lastLocationIsSame: string | null;
  isLocationSocketOpen: boolean;
  locationSocketColor: string;
  lastSearchProgress: string | null;
  lastState: string | null;
  alwaysReRender: number;
}

interface SurroundingsWSProviderProps {
  children: ReactNode;
}

const SurroundingsWSContext = createContext<
  SurroundingsWSContextType | undefined
>(undefined);

export const SurroundingsWSProvider: React.FC<SurroundingsWSProviderProps> = ({
  children,
}) => {
  const TOKEN_KEY = "accessToken";
  const socketRef = useRef<WebSocket | null>(null);
  const { isAuthenticated, isInitializing } = useUser();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { showAppMessage } = useAppMessage();
  const [locationUpdateWSIsOpen, setlocationUpdateWSIsOpen] =
    useState<boolean>(false);

  // 1 second to start, has exponential backoff capped at
  // 60 seconds in timeout in attemptReconnect function
  const [reconnectionDelay, setReconnectionDelay] = useState(10000);

  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [baseLocationId, setBaseLocationId] = useState<string | null>(null);
  const [lastLocationName, setLastLocationName] = useState<string | null>(null);
  const [lastSearchProgress, setLastSearchProgress] = useState<string | null>(
    null
  ); // guessing it's a string too
  const [lastState, setLastState] = useState<string | null>(null); // same here
  const [lastLocationIsSame, setLastLocationIsSame] = useState<string | null>(null); // same here
  const [lastLocationId, setLastLocationId] = useState<string | null>(null);
  const [lastLocationAccessTime, setLastLocationAccessTime] = useState<
    string | null
  >(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [lastInboxItemId, setLastInboxItemId] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const [lastRequestType, setLastRequestType] = useState<string | null>(null);
  const [lastRequestItemId, setLastRequestItemId] = useState<string | null>(null);
  
  const [lastLatAndLong, setLastLatAndLong] = useState<[string, string] | null>(
    null
  );
  const [isLocationSocketOpen, setIsLocationSocketOpen] =
    useState<boolean>(false);
  const [locationSocketColor, setLocationSocketColor] = useState<string>(""); // fallback to empty string

  const [alwaysReRender, setAlwaysReRender] = useState<number>(1);

  const closeSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setLastMessage(null);
      setBaseLocationId(null);
      setLastNotification(null);
      setLastInboxItemId(null);
      setLastRequestId(null);
      setLastRequestType(null);
      setLastRequestItemId(null);
      setLastSearchProgress(null);
      setLastState(null);
      setLastLocationIsSame(null);
      setLastLocationName(null);
      setLastLocationAccessTime(null);
      setLastLocationId(null);
      setLastLatAndLong(null);
      setlocationUpdateWSIsOpen(false);
      socketRef.current.close();
      socketRef.current = null;
      //console.log('Location Socket closed');
    } else {
      console.log(
        "Location Socket closed already --> CloseSocket() will do nothing"
      );
    }
  };

  const connectWebSocket = async (
    token?: string,
    noTokenPassed: boolean = false
  ) => {
    let confirmedToken: string | null = null;

    // if (!isAuthenticated) {
    //   return;
    // }

    if (isInitializing) {
      return;
    }

    if (isAuthenticated) {
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
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        closeSocket();
        return;
      }
    }

    if (!confirmedToken) {
      console.error("Confirmed token is missing");
      return;
    }

    const socketUrl = `wss://climatetwin.com/ws/climate-twin/current/?user_token=${confirmedToken}`;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setlocationUpdateWSIsOpen(true);
      setIsLocationSocketOpen(true);

      setLocationSocketColor("limegreen");
      setIsReconnecting(false);
      setReconnectionDelay(3000);
      console.log("WebSocket is already open, sending request to refresh data");
      handleRefreshDataFromSocket();
      return;
    }

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Location Update WebSocket connection opened");
      setlocationUpdateWSIsOpen(true);
      setIsLocationSocketOpen(true);
      setLocationSocketColor("lightgreen");
      // using button color now
      // showAppMessage(true, null, "Websocket connected!");
      setIsReconnecting(false);
      setReconnectionDelay(3000); // Reset delay to 10 seconds
    };

    socket.onmessage = (event: WebSocketMessageEvent) => {
      const update = JSON.parse(event.data);
      console.log("Received update from socket in WS context:", update);
 
      // const {
      //   message,
      //   state,
      //   location_same_as_last_update,
      //   base_location,
      //   search_progress,
      //   notification,
      //   inbox_item_id,
      //   friend_request_id,
      //   friend_id,
      //   gift_request_id,
      //   gift_id,
      //   name,
      //   location_id,
      //   last_accessed,
      //   latitude,
      //   longitude
      // } = update;
      
      // if (message) setLastMessage(message);
      // if (state) setLastState(state);
      // if (location_same_as_last_update) setLastLocationIsSame(location_same_as_last_update);
      // if (base_location) setBaseLocationId(base_location);
      // if (search_progress) setLastSearchProgress(search_progress);
      // if (notification) setLastNotification(notification);
      // if (notification && inbox_item_id) setLastInboxItemId(inbox_item_id);

      // if (notification && friend_request_id) {
      //   setLastRequestId(friend_request_id);
      //   setLastRequestType('friend');
      //   setLastRequestItemId(friend_id);
      // }
      // if (notification && gift_request_id) {
      //   setLastRequestId(gift_request_id);
      //   setLastRequestType('gift');
      //   setLastRequestItemId(gift_id);
      // }
      // if (name) setLastLocationName(name);
      // if (location_id) setLastLocationId(location_id);
      // if (typeof last_accessed !== "undefined") {
      //   setTimeout(() => {
      //     setLastLocationAccessTime(last_accessed);
      //     setAlwaysReRender((prev) => prev + 1);
      //   }, 0);
      // }
      // if (typeof latitude === "number" && typeof longitude === "number") {
      //   setLastLatAndLong([latitude, longitude]);
      // }
      













      if ("message" in update) {
        setLastMessage(update.message);
        console.log("message from socket: ", update.message);
      }

      if ("state" in update) {
        setLastState(update.state);
      }

      if ("location_same_as_last_update" in update) { // either "yes" or None
        setLastLocationIsSame(update.location_same_as_last_update);
      }

      //added to backend specifically for reducing triggering nearby locations fetch
      if ("base_location" in update) {
        setBaseLocationId(update.base_location);
      }

      if ("search_progress" in update) {
        setLastSearchProgress(update.search_progress);
      }

      if ("notification" in update) {
        setLastNotification(update.notification);
      }

      if ("notification" in update && "inbox_item_id" in update) {
        setLastInboxItemId(update.inbox_item_id);
      }

      if ("notification" in update && "friend_request_id" in update) {
        setLastRequestId(update.friend_request_id);
        setLastRequestType('friend')
        setLastRequestItemId(update.friend_id)
      }  

      if ("notification" in update && "gift_request_id" in update) {
        setLastRequestId(update.gift_request_id);
        setLastRequestType('gift')
        setLastRequestItemId(update.gift_id)
      }  

      if ("name" in update) {
        setLastLocationName(update.name);
      }

      if ("location_id" in update) { 
        setLastLocationId(update.location_id);
      }

      if ("last_accessed" in update) {
        //  console.log('update last accessed!', update.last_accessed);
        //  console.log(`force rerender`, alwaysReRender);

        //WHY SET TIMEOUT?
        // 1. THIS ALLOWS THIS UPDATE TO OCCUR AFTER THE CURRENT EVENT LOOP
        //MANUAL OVERRIDE OF REACT'S OPTIMIZING BATCH UPDATE FEATURE
        //NEEDED TO RETRIGGER COUNTDOWN
        // 2. I AM A NOOB AND NOT SURE HOW ELSE TO FIX, THIS FEELS PRETTY BAD
        //
        setTimeout(() => {
          setLastLocationAccessTime(update.last_accessed); // this will trigger state update even if the value is the same
          setAlwaysReRender((prev) => prev + 1); // Update a dummy state to trigger a re-render
        }, 0);
      }

      if ("latitude" in update && "longitude" in update) {
        setLastLatAndLong([update.latitude, update.longitude]);
      }
    };

    socket.onerror = (event: Event) => {
      console.log("WebSocket error:", event);
      setLocationSocketColor("black");
      // showAppMessage(true, null, "Websocket error on trying to connect.");
    };

    socket.onclose = (event) => {
      // logWebSocketClosure(event);
      setIsLocationSocketOpen(false);
      setLocationSocketColor("red");

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
          setLocationSocketColor("yellow");
          console.log("WebSocket closed manually by the client.");
          break;
        case 1006:
          setLocationSocketColor("orange");
          console.error(
            `Abnormal WebSocket closure ${isAuthenticated} ${tokenLastTen} (possibly lost connection).`
          );
          attemptReconnect();
          break;
        case 4001:
          setLocationSocketColor("blue");
          console.error(
            "Server closed connection due to authentication issues."
          );
          // reInitialize();
          break;
        case 4403:
          setLocationSocketColor("blue");
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
            !isInitializing &&
            (!socketRef.current ||
              socketRef.current.readyState !== WebSocket.OPEN)
          ) {
            console.log("Reconnecting to WebSocket...");
            //setReconnectAttempt((prev) => prev + 1);
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

  useEffect(() => {
    //console.log('WS connection useEffect triggered');
    if (isAuthenticated && !isInitializing) {
      connectWebSocket(); // Check if connection/reconnection needed when authenticated & done initializing
    }

    return () => {
      if (!isAuthenticated) {
        //  console.log('isAuthenticated === false --> running CloseSocket()');
        closeSocket(); // Always close socket in cleanup
      }
      setReconnectionDelay(1000);
      setIsReconnecting(false);
    };
  }, [isInitializing]);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  const handleRefreshDataFromSocket = () => {
    console.log("sending refresh message to socket");
    // showAppMessage(true, null, 'Triggered resend from socket!')
    sendMessage({ action: "refresh" });
  };

  // backend for temporary reference (OUTDATED 4/5/2025):
  // def receive(self, text_data=None, bytes_data=None):
  // """
  // Keeps the connection alive and listens for incoming messages.
  // Can be expanded to handle specific commands from the client.
  // """
  // if text_data:
  //     logger.debug(f"Received WebSocket message: {text_data}")
  //     message = json.loads(text_data)

  //     # Handle incoming messages (optional, modify as needed)
  //     if message.get("action") == "refresh":

  //         self.send_message_from_cache()
  //         self.send_notif_from_cache()
  //         self.send_current_location_from_cache_or_endpoint()

  return (
    <SurroundingsWSContext.Provider
      value={{
        locationUpdateWSIsOpen,
        sendMessage,
        handleRefreshDataFromSocket,
        lastMessage,
        baseLocationId,
        lastNotification,
        lastInboxItemId,
        lastRequestId,
        lastRequestType,
        lastRequestItemId,
        lastSearchProgress,
        lastState,
        lastLocationIsSame,
        lastLocationName,
        lastLocationId,
        lastLocationAccessTime,
        lastLatAndLong,
        isLocationSocketOpen,
        locationSocketColor,
        alwaysReRender,
      }}
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
