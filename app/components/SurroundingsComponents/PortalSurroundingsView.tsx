import React from "react";
import { View } from "react-native"; 
import { useSurroundings } from "../../context/CurrentSurroundingsContext"; 
import SingleDetailPanel from "@/app/components/SingleDetailPanel"; 
 

import WindFriendsView from "@/app/components/SurroundingsComponents/WindFriendsView";

const PortalSurroundingsView = ({height}) => {
   
    const { portalSurroundings, homeSurroundings } = useSurroundings(); 

  return ( 
        <View style={{ flex: 1, height: height }}>
          <>
            <WindFriendsView
              name={portalSurroundings.name}
              description={portalSurroundings.description}
              windSpeed={portalSurroundings.windSpeed}
              windDirection={portalSurroundings.windDirection}
              windFriends={portalSurroundings.windFriends}
              homeDescription={homeSurroundings.description}
              homeWindSpeed={homeSurroundings.windSpeed}
              homeWindDirection={homeSurroundings.windDirection}
            />

            <SingleDetailPanel
              label={"Experience"}
              value={portalSurroundings.experience}
            />

            <SingleDetailPanel
              label={"Details"}
              value={portalSurroundings.details}
            />

            <SingleDetailPanel
              label={"Wind speed interaction"}
              value={portalSurroundings.windSpeedInteraction}
            />

            <SingleDetailPanel
              label={"Pressure interaction"}
              value={portalSurroundings.pressureInteraction}
            />
            <SingleDetailPanel
              label={"Humidity interaction"}
              value={portalSurroundings.humidityInteraction}
            />
          </>
          </View>
 
  )
};

export default PortalSurroundingsView