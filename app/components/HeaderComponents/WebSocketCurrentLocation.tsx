import React, { useEffect,  useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import { useActiveSearch } from "../../context/ActiveSearchContext"; 
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
 
 
const WebSocketCurrentLocation: React.FC = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const [update, setUpdate] = useState<string>(' ');
  const { isSearchingForTwin, locationUpdateWSIsOpen } = useActiveSearch();
  
  
  const { lastLocationName } = useSurroundingsWS();
 

     
  
  useEffect(() => {
    console.log('last location name: ', lastLocationName);
    if (!lastLocationName) {
      setUpdate("You are home"); // If no location name, reset the state
    } else if (lastLocationName === null) {
      setUpdate("You are home");  
    } else if (lastLocationName === `You are searching`) {
      // setisSearchingForTwin(true); 
      setUpdate(`You are searching`);
    } else if (lastLocationName !== update) { 
      // triggerSurroundingsRefetch();
      
  
        setUpdate(lastLocationName);  
    
    }
 
  }, [lastLocationName]);

  return (
    // <>
    // {user?.authenticated && (
      
    <View style={appContainerStyles.defaultElementRow}>
      {update && locationUpdateWSIsOpen && !isSearchingForTwin && (
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
