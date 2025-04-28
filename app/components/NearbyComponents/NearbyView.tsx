import { View, FlatList } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import { useSurroundings } from "@/src/context/CurrentSurroundingsContext"; 
import NearbyRuinUICard from "./NearbyRuinUICard";
import NearbyPortalUICard from "./NearbyPortalUICard";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";

const NearbyView = ({ centeredNearbyLocations }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const { handlePickNewSurroundings, pickNewSurroundingsMutation } =
    useSurroundings();

  return (
    <>
      {pickNewSurroundingsMutation.isPending && (
        <ComponentSpinner
          offsetStatusBarHeight={true}
          showSpinner={true}
          spinnerSize={50}
          spinnerType={"circleFade"}
          backgroundColor={themeStyles.primaryBackground.backgroundColor}
        />
      )}

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
 
              )}
              {item.explore_type === "discovery_location" && (
                <View style={{ height: 152, marginVertical: 4 }}>
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
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 0 }}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
    </>
  );
};

export default NearbyView;
