import React, {  useCallback, useEffect } from "react";
import { 
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import { useNearbyLocations } from "../../../src/context/NearbyLocationsContext";
 
import { useRouter } from "expo-router"; 
import { useFocusEffect } from "expo-router"; 
import { useSurroundings } from "@/src/context/CurrentSurroundingsContext";
import NearbyView from "../../components/NearbyComponents/NearbyView";

 

const nearby = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { triggerRefetch, nearbyLocations, centeredNearbyLocations } = useNearbyLocations();
 
  const router = useRouter();
 
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("triggering nearby locations refetch");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused");
  //     };
  //   }, [])
  // );

  // useEffect(() => {
  //   console.log('triggering neary locations refetch');
  //   triggerRefetch();
  // }, []);


  // useEffect(() => {
  //   if (pickNewSurroundingsMutation.isSuccess) {
  //     router.push("(drawer)/(exploretabs)");

  //   }

  // }, [pickNewSurroundingsMutation.isSuccess]);

  //wtf

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
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        {centeredNearbyLocations.length > 0 && (
          
            <NearbyView />
        )}
             
    
        </View>
      </View> 
  );
};

export default nearby;
