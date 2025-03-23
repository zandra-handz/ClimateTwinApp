import React, { useEffect, useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import { useActiveSearch } from "../../context/ActiveSearchContext"; 
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
import { useAppMessage } from "../../context/AppMessageContext";
import { useNearbyLocations } from "../../context/NearbyLocationsContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";

const WebSocketCurrentLocation: React.FC = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const [update, setUpdate] = useState<string>(' ');
  const { searchIsActive, setSearchIsActive, locationUpdateWSIsOpen, closeSearchExternally, refreshSurroundingsManually, gettingExploreLocations, foundExploreLocations } = useActiveSearch();
  const { showAppMessage} = useAppMessage();
  const { triggerRefetch } = useNearbyLocations(); 
  const { locationId } = useSurroundings();
  
  const { sendMessage, lastMessage, lastLocationName, lastLocationId } = useSurroundingsWS();
 

   
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage === 'User has returned home.') {
        if (searchIsActive) {
          closeSearchExternally();
        }
        setUpdate("You are home");
        if (locationId) { //if user did just return home from a location versus if app was just opened
        refreshSurroundingsManually();
      }
         
        showAppMessage(true, null, 'You have returned home');
      }
 
 
    }
  }, [lastMessage]);


 


  // useEffect(() => {
  //   if (lastNotification) { 
  //      console.log(`Last notification: ${lastNotification}`);
  //   }
  // }, [lastNotification]);
  
  useEffect(() => {
    console.log('last location name: ', lastLocationName);
    if (!lastLocationName) {
      setUpdate("You are home"); // If no location name, reset the state
    } else if (lastLocationName === null) {
      setUpdate("You are home");  
    } else if (lastLocationName === `You are searching`) {
      setSearchIsActive(true); 
      setUpdate(`You are searching`);
    } else if (lastLocationName !== update) { 
  
        setUpdate(lastLocationName);  
    
    }
 
  }, [lastLocationName]);

  return (
    // <>
    // {user?.authenticated && (
      
    <View style={appContainerStyles.defaultElementRow}>
      {update && locationUpdateWSIsOpen && !searchIsActive && (
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
