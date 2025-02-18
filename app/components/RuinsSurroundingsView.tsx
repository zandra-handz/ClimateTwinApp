import React from "react";
import { View } from "react-native";
import useHomeLocation from "../hooks/useHomeLocation";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import { useAppMessage } from "../context/AppMessageContext";

import { useActiveSearch } from "../context/ActiveSearchContext";

import WindFriendsView from "@/app/components/WindFriendsView";
import RuinsHarmonyView from "./RuinsHarmonyView";

const RuinsSurroundingsView = () => {
  const { portalSurroundings, ruinsSurroundings, homeSurroundings } =
    useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeLocation } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const { searchIsActive } = useActiveSearch();

  return (
    <View style={{ flex: 1 }}>
      {ruinsSurroundings && (
        <>
          <RuinsHarmonyView
            name={ruinsSurroundings.name}
            windCompass={ruinsSurroundings.windCompass}
            tags={ruinsSurroundings.tags}
            milesAway={ruinsSurroundings.milesAway}
            direction={ruinsSurroundings.direction}
            directionDegree={ruinsSurroundings.directionDegree}
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
      )}
    </View>
  );
};

export default RuinsSurroundingsView;
