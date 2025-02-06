import React, { useEffect, useRef, useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import useSurroundingsWebSocket from '../hooks/useSurroundingsWebSocket'; 
import { useMatchedLocation } from '../context/MatchedLocationContext';
import { useActiveSearch } from '../context/ActiveSearchContext';
 

const WebSocketCurrentLocation: React.FC<{ reconnectSocket: boolean }> = ({
    reconnectSocket
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null); // State to store the current update
  const { activeSearch, closeSearchExternally } = useActiveSearch();
  const { matchedLocation } = useMatchedLocation();

  // WebSocket hook
  const { sendMessage } = useSurroundingsWebSocket({
     
    
    reconnectSocket,
    onMessage: (newUpdate) => {
      console.log("Received update:", newUpdate);
    
      console.log(activeSearch);
      if ((newUpdate.name !== update)) { //} && activeSearch.timestamp) {
        setUpdate(newUpdate.name);  // Only update the state if the value has changed
        closeSearchExternally();
      } else {
        setUpdate(newUpdate.name);  
      } 
    },
    onError: (error) => {
      console.error("Received error:", error);
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
