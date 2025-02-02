import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";

interface WebSocketProps {
  userToken: string; // Token used for WebSocket authentication
  onMessage: (update: any) => void; // Callback for handling WebSocket messages
  onError?: (error: Event) => void; // Optional callback for WebSocket errors
  onClose?: () => void; // Optional callback when the WebSocket connection is closed
}

const useWebSocket = ({
  userToken,
  reconnectSocket,
  onMessage,
  onError,
  onClose,
}: WebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  

  useEffect(() => {

    if (socketRef.current) {
      // console.log("WebSocket already initialized, skipping new connection.");
       return;
     }
  
 
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

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [userToken, reconnectSocket, onMessage, onError, onClose]);

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

const WebSocketCurrentLocation: React.FC<{ userToken: string, reconnectSocket: boolean }> = ({
  userToken, reconnectSocket
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null); // State to store the current update

  // WebSocket hook
  const { sendMessage } = useWebSocket({
    userToken,
    reconnectSocket,
    onMessage: (newUpdate) => {
      console.log("Received update:", newUpdate);
      setUpdate(newUpdate.name); // Replace the previous update with the new one
    },
    onError: (error) => {
      console.error("Current Location WebSocket encountered an error:", error);
    },
    onClose: () => {
      console.log("Current Location WebSocket connection closed");
    },
  });

  return (
    <View style={appContainerStyles.defaultElementRow}>
      {update && (
        <>
          <Text
            style={[
              appFontStyles.subHeaderMessageText,
              themeStyles.primaryText,
            ]}
          >
            {update != "You are home" ? `you are in: ` : ``}
          </Text>
          <Text style={[appFontStyles.emphasizedText, themeStyles.primaryText]}>
            {update}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  updatesContainer: {
    flexGrow: 1,
  },
  updateCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default WebSocketCurrentLocation;
