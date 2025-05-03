import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
// import { useGeolocationWatcher } from "../../../src/hooks/useCurrentLocationWatcher";  
import HomeSurroundingsView from "@/app/components/HomeSurroundingsComponents/HomeSurroundingsView";
  
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";

import { useActiveSearch } from "@/src/context/ActiveSearchContext";

const home = () => {
 // useGeolocationWatcher(); 
  const { themeStyles, appContainerStyles } = useGlobalStyles();  
  const { lastState } = useSurroundingsWS();
  const { remainingGoes, handleGoHome } = useActiveSearch();

 


  return (
    <> 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
 
          { (lastState !== 'searching for twin') && ( // removed check for homeSurroundings
            <HomeSurroundingsView remainingGoes={remainingGoes} onPress={handleGoHome}/> 
          )} 
        </View>
      </View>
    </>
  );
};

export default home;
