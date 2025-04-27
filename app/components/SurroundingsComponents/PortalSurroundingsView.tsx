import React from "react";
import { View } from "react-native";
// import { useSurroundings } from "../../../src/context/CurrentSurroundingsContext";

import MagnifiedNavButton from "../MagnifiedNavButton";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import WindyWindFriendsView from "./WindyWindFriendsView";

const PortalSurroundingsView = ({
  height,
  portalSurroundings,
  ruinsSurroundings,
  homeSurroundings,
  onPress,
}) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  // const {
  //   portalSurroundings,
  //   ruinsSurroundings,
  //   homeSurroundings,
  //   handlePickNewSurroundings,
  // } = useSurroundings();
  const isDisabled = !!ruinsSurroundings?.id;

  const handleExploreLocation = async () => {
    const formattedData = {
      explore_type: "twin_location",
      id: portalSurroundings?.id,
    };
    onPress(formattedData);
  };

  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}CC`; //99 is slightly lighter

  return (
    <View style={{ flex: 1, height, position: "relative" }}>
      <View style={{ height: 90, width: "100%" }} />

      <View
        style={{
          borderRadius: 20,
          width: "100%",
          zIndex: 1, // Ensures this section is below the overlay
        }}
      >
        {portalSurroundings &&
          portalSurroundings?.name &&
          portalSurroundings?.id && (
            <WindyWindFriendsView
              name={portalSurroundings.name}
              description={portalSurroundings.description}
              windSpeed={portalSurroundings.windSpeed}
              windDirection={portalSurroundings.windDirection}
              windFriends={portalSurroundings.windFriends}
              homeDescription={homeSurroundings.description}
              homeWindSpeed={homeSurroundings.windSpeed}
              homeWindDirection={homeSurroundings.windDirection}
              homeLat={homeSurroundings.latitude}
              homeLon={homeSurroundings.longitude}
              //homeZoom set inside
              portalLat={portalSurroundings.latitude}
              portalLon={portalSurroundings.longitude}
              //portalZoom set inside
            />
          )}

        {/* <SingleDetailPanel label="Details" value={portalSurroundings.details} />
         <SingleDetailPanel
          label={"Experience"}
          value={portalSurroundings.experience}
        />  
        <SingleDetailPanel label="Wind speed interaction" value={portalSurroundings.windSpeedInteraction} />
      */}
      </View>

      {isDisabled && (
        <View
          style={[appContainerStyles.dimmer, { backgroundColor: overlayColor }]}
        >
          <View style={{ paddingTop: 280 }}>
            <MagnifiedNavButton
              message={"Go back to portal location"}
              onPress={handleExploreLocation}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default PortalSurroundingsView;
