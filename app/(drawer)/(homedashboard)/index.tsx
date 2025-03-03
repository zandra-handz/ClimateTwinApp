import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useActiveSearch } from "../../context/ActiveSearchContext"; 
import GoButton from "@/app/components/GoButton"; 
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
 

const index = () => {
  useGeolocationWatcher();
  const { homeLocation } = useHomeLocation(); 
  const { themeStyles, appContainerStyles } = useGlobalStyles();  
  const { searchIsActive } = useActiveSearch(); 

 


  return (
    <> 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 90 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {!searchIsActive && (
            
        <GoButton address={homeLocation?.address || "Manchester, NH"} />
        
      )} 
              {searchIsActive && (
              <View
                style={[
                  appContainerStyles.defaultScreenElementContainer,
                  {
                    borderColor: themeStyles.primaryText.color,
                    height: 300,
                    marginVertical: "1%",
                  },
                ]}
              >
                <WebSocketSearchingLocations
                  reconnectOnUserButtonPress={searchIsActive}
                />
              </View>
            )}
        </View>
      </View>
    </>
  );
};

export default index;
