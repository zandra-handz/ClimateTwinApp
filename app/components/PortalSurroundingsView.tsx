import React from "react";
import { View } from "react-native"; 
import useHomeLocation from "../hooks/useHomeLocation";
import { useGlobalStyles } from "../context/GlobalStylesContext"; 
import { useSurroundings } from "../context/CurrentSurroundingsContext"; 
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import { useAppMessage } from "../context/AppMessageContext";
 
import { useActiveSearch } from "../context/ActiveSearchContext";
 

import WindFriendsView from "@/app/components/WindFriendsView";

const PortalSurroundingsView = ({height}) => {
   
    const { portalSurroundings, homeSurroundings } = useSurroundings();
    const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
    const { homeLocation } = useHomeLocation();
    const { showAppMessage } = useAppMessage();
    const { searchIsActive } = useActiveSearch();

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