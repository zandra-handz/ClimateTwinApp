import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useActiveSearch } from "../../context/ActiveSearchContext";
import PortalBanner from "@/app/components/PortalBanner";
 
import HomeSurroundingsView from "@/app/components/HomeSurroundingsComponents/HomeSurroundingsView";
 
import { useSurroundings } from "../../context/CurrentSurroundingsContext";

const home = () => {
  useGeolocationWatcher();
  const { homeLocation } = useHomeLocation(); 
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const { homeSurroundings } = useSurroundings();
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
        {/* <PortalBanner address={homeLocation?.address || "Manchester, NH"} />
          */}
          {homeSurroundings && !searchIsActive && (
            <HomeSurroundingsView /> 
          )} 
        </View>
      </View>
    </>
  );
};

export default home;
