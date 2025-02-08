import React, { useEffect, useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { useMatchedLocation } from "../context/MatchedLocationContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useFocusEffect } from "expo-router";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";

const WebSocketCurrentLocation: React.FC = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null); // Local state to display the update
  const { activeSearch, closeSearchExternally } = useActiveSearch();
  const { matchedLocation } = useMatchedLocation();
  const [renderSocket, setRenderSocket] = useState(true);

  // Bring in the context values.
  const { sendMessage, lastMessage } = useSurroundingsWS();

  // Focus management
  useFocusEffect(
    useCallback(() => {
      console.log("location update socket is focused");
      if (user && user.authenticated) {
        setRenderSocket(true);
      }
      return () => {
        setRenderSocket(false);
        console.log("location update socket is unfocused");
      };
    }, [user])
  );

  // Listen for incoming messages from the context.
  useEffect(() => {
    if (lastMessage) {
      console.log("Received update from context:", lastMessage);
      // Assuming your incoming update has a 'name' property.
      if (lastMessage.name !== update) {
        setUpdate(lastMessage.name);
        closeSearchExternally();
      } else {
        setUpdate(lastMessage.name);
      }
    }
  }, [lastMessage, update, closeSearchExternally]);

  return (
    <View style={appContainerStyles.defaultElementRow}>
      {update && renderSocket && (
        <>
          <Text style={[appFontStyles.subHeaderMessageText, themeStyles.primaryText]}>
            {update !== "You are home" ? `you are in: ` : ``}
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
