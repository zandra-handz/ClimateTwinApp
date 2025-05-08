import React  from "react";
import { 
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import { useNearbyLocations } from "../../../src/context/NearbyLocationsContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
 import useInlineComputations from "@/src/hooks/useInlineComputations";
 
import NearbyView from "../../components/NearbyComponents/NearbyView";
 
import NothingHere from "@/app/components/Scaffolding/NothingHere";

const nearby = () => {
  const { themeStyles, appContainerStyles, appMiscStyles } = useGlobalStyles();
  const { lastLocationId } = useSurroundingsWS();
  const { nearbyLocations } = useNearbyLocations();
  const { getNearbyLocationsData } = useInlineComputations();
 const centeredNearbyLocations = getNearbyLocationsData(nearbyLocations, lastLocationId);
 
 
  // backend is so confused on this lol, you need to submit {'explore_location' : [location id]} if data.explore_type is discovery_location
  // else you need to submit {'twin_location' : [the same id]}
  // WHY DID PAST ME DO THIS
  // I believe it has to add more data to twin locations.
  // originally, twin location couldn't be an explore location (?)
  //this will move to the surroundings context so that i can control behaviors based on mutations
 

  

  return (  
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          appMiscStyles.exploreTabScreen, // ( = paddingTop: 50)
       
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        {centeredNearbyLocations.length > 0 && (
          
            <NearbyView centeredNearbyLocations={centeredNearbyLocations}  />
        )}

        {centeredNearbyLocations.length < 1 && (
          <NothingHere message={'No other locations'} subMessage={'Sorry!'} offsetStatusBarHeight={true} />
        )}
             
    
        </View>
      </View>  
  );
};

export default nearby;
