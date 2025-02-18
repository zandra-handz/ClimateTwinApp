import React, { useEffect, useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext"; 
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useFocusEffect } from "expo-router";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { useAppMessage } from "../context/AppMessageContext";
import { useNearbyLocations } from "../context/NearbyLocationsContext";

const WebSocketCurrentLocation: React.FC = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
 
  const [update, setUpdate] = useState<string | null>(null);
  const { closeSearchExternally, refreshSurroundingsManually, gettingExploreLocations, foundExploreLocations } = useActiveSearch();
  const { showAppMessage} = useAppMessage();
  const { triggerRefetch } = useNearbyLocations();
  
  const { sendMessage, lastMessage, lastLocationName } = useSurroundingsWS();
  // const lastMessage = 'hi';
  // const lastLocationName = 'hi';

   
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage === 'Searching for ruins!') {
        closeSearchExternally(); 
        gettingExploreLocations();
        showAppMessage(true, null, 'Searching for ruins!');
      } else if (lastMessage === 'No ruins found') {
        showAppMessage(true, null, 'No ruins found nearby');
      } else if (lastMessage === 'Search complete!') {
        foundExploreLocations();
        triggerRefetch();
        showAppMessage(true, null, 'Search complete!');
      } else if (lastMessage === '') {
        foundExploreLocations();
      }
    }
  }, [lastMessage]);
  
  useEffect(() => {
    console.log('last location name: ', lastLocationName);
    if (!lastLocationName) {
      setUpdate("");
    } else if (lastLocationName && lastLocationName === "null") {
      setUpdate("You are home");
    } else if (lastLocationName && lastLocationName !== update) {
      refreshSurroundingsManually();
      console.log('setting last location name');
      setUpdate(lastLocationName); // Only update if the name has changed
    }
  }, [lastLocationName]);

  return (
    // <>
    // {user?.authenticated && (
      
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

    
// )}
    
//     </>
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
