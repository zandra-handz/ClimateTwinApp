import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import useSurroundingsWebSocket from '../hooks/useSurroundingsWebSocket';
 
 

const WebSocketCurrentLocation: React.FC<{ userToken: string, reconnectSocket: boolean }> = ({
  userToken, reconnectSocket
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null); // State to store the current update

  // WebSocket hook
  const { sendMessage } = useSurroundingsWebSocket({
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
