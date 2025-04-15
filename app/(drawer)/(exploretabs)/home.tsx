import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher"; 
import { useActiveSearch } from "../../../src/context/ActiveSearchContext"; 
import HomeSurroundingsView from "@/app/components/HomeSurroundingsComponents/HomeSurroundingsView";
 
import { useSurroundings } from "../../../src/context/CurrentSurroundingsContext";

const home = () => {
  useGeolocationWatcher(); 
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const { homeSurroundings } = useSurroundings();
  const { isSearchingForTwin } = useActiveSearch(); 

 


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
 
          {homeSurroundings && !isSearchingForTwin && (
            <HomeSurroundingsView /> 
          )} 
        </View>
      </View>
    </>
  );
};

export default home;
