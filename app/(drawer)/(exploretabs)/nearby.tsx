import React, {  useCallback, useEffect } from "react";
import { 
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import { useNearbyLocations } from "../../context/NearbyLocationsContext";
 
import { useRouter } from "expo-router"; 
import { useFocusEffect } from "expo-router"; 
import { useSurroundings } from "@/app/context/CurrentSurroundingsContext";
import NearbyView from "../../components/NearbyComponents/NearbyView";

 

const nearby = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { triggerRefetch, nearbyLocations } = useNearbyLocations();
  const { handlePickNewSurroundings } = useSurroundings();
  const router = useRouter();
 
  useFocusEffect(
    useCallback(() => {
      console.log("triggering nearby locations refetch");
      triggerRefetch();
      return () => {
        console.log("nearby location screen is unfocused");
      };
    }, [])
  );

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
  const handleExploreLocation = async (data) => {
 
    await handlePickNewSurroundings(data);
 
  };

  

  return ( 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {nearbyLocations && (
            <NearbyView
              listData={nearbyLocations}
              onCardButtonPress={handleExploreLocation}
            />
          )}
        </View>
      </View> 
  );
};

export default nearby;
