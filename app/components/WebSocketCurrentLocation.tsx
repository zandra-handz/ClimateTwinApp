import React, { useEffect, useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { useMatchedLocation } from "../context/MatchedLocationContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useFocusEffect } from "expo-router";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { useAppMessage } from "../context/AppMessageContext";
import { useNearbyLocations } from "../context/NearbyLocationsContext";

const WebSocketCurrentLocation: React.FC = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { user } = useUser();
  const [update, setUpdate] = useState<string | null>(null);
  const { closeSearchExternally, gettingExploreLocations, foundExploreLocations } = useActiveSearch();
  const { showAppMessage} = useAppMessage();
  const { triggerRefetch } = useNearbyLocations();
  
  const { sendMessage, lastMessage } = useSurroundingsWS();

   
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.message === 'Searching for ruins!') {
        closeSearchExternally(); 
        gettingExploreLocations();
        showAppMessage(true, null, 'Searching for ruins!');
      } else if (lastMessage.message === 'No ruins found') {
        showAppMessage(true, null, 'No ruins found nearby');
      } else if (lastMessage.message === 'Search complete!') {
        foundExploreLocations();
        triggerRefetch();
        showAppMessage(true, null, 'Search complete!');
      } else if (lastMessage.message === '') {
        foundExploreLocations();
      }
    }
  }, [lastMessage]);
  
  useEffect(() => {
    console.log(lastMessage);
    // if (lastMessage?.name && lastMessage.name !== update) {
    //   setUpdate(lastMessage.name);
    //   closeSearchExternally();
    // } else 
    if (lastMessage?.name) {
      console.log('setting name');
      setUpdate(lastMessage.name); // This happens only if the name has changed
    }
  }, [lastMessage, update]);  

  return (
    <View style={appContainerStyles.defaultElementRow}>
      {update && (
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
