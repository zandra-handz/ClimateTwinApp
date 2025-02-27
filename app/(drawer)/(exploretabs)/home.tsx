import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
 
import { useActiveSearch } from "../../context/ActiveSearchContext";
 
import HomeSurroundingsView from "@/app/components/HomeSurroundingsView";
 
import { useSurroundings } from "../../context/CurrentSurroundingsContext";

const home = () => {
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
          {homeSurroundings && !searchIsActive && (
            <HomeSurroundingsView /> 
          )}
        </View>
      </View>
    </>
  );
};

export default home;
