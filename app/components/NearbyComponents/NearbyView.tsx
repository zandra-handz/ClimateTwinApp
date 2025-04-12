import { View, FlatList } from "react-native"; 
import React, {useCallback, useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useNearbyLocations } from "../../../src/context/NearbyLocationsContext";
import { useSurroundings } from "@/src/context/CurrentSurroundingsContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import NearbyRuinUICard from "./NearbyRuinUICard";
import NearbyPortalUICard from "./NearbyPortalUICard";
import { useFocusEffect } from "expo-router"; 
 
const NearbyView = () => {
  const { appContainerStyles } = useGlobalStyles();
  const { centeredNearbyLocations, nearbyLocations } = useNearbyLocations();
  const { handlePickNewSurroundings } = useSurroundings();
  const { lastLocationId, baseLocationId } = useSurroundingsWS();
  const [copiedCenteredNearbyLocations, setCopiedCenteredNearbyLocations] = useState<NearbyLocation[]>([]);
  
//   useFocusEffect(
//     useCallback(() => {
//       console.log("triggering nearby locations refetch");
//        setCopiedCenteredNearbyLocations(centeredNearbyLocations)
//       return () => {
//         console.log("nearby location screen is unfocused");
//       };
//     }, [])
//   );
//  useEffect(() => {
//   setCopiedCenteredNearbyLocations(centeredNearbyLocations)
//  }, [centeredNearbyLocations]);

  return (
    <>
    {centeredNearbyLocations.length > 0 && (
      
    <View style={[appContainerStyles.dataListContainer]}>
     
     
          
      <FlatList
        data={centeredNearbyLocations}
       // extraData={centeredNearbyLocations} // force rerender
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 4 }}>
            {item.explore_type === "twin_location" && (
              <NearbyPortalUICard
              data={item}
              name={item.name}
              description={item.description}
              windSpeed={item.wind_speed}
              windDirection={item.wind_direction}
              windFriends={item.wind_friends}
              homeDescription={item.home_location.description}
              homeWindSpeed={item.home_location.wind_speed}
              homeWindDirection={item.home_location.wind_direction}
              onPress={handlePickNewSurroundings}
              />

              // <NearbyUICard
              //   data={item}
              //   onPress={onCardButtonPress}
              //   onOpenPress={onOpenButtonPress}
              //   onOpenTreasurePress={onOpenTreasurePress}
              // />
            )}
              {item.explore_type === "discovery_location" && (
                <View style={{height: 152, marginVertical: 4}}>
                <NearbyRuinUICard
                data={item}
                name={item.name}
                windCompass={item.wind_compass}
                tags={item.tags}
                milesAway={item.miles_away}
                direction={item.direction}
                directionDegree={item.direction_degree}
                windHarmony={item.wind_harmony}
                onPress={handlePickNewSurroundings}
                image={item.street_view_image}
                />
              {/* <NearbyUICard
                data={item}
                onPress={onCardButtonPress}
                onOpenPress={onOpenButtonPress}
                onOpenTreasurePress={onOpenTreasurePress}
              /> */}
              
                </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 0, height: 400 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

    </View>
    
  )}
  </>
  );
};

export default NearbyView;
