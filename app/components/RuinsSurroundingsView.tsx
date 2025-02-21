import React from "react";
import { View } from "react-native";
import useHomeLocation from "../hooks/useHomeLocation";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import SingleImagePanel from "@/app/components/SingleImagePanel";
import { useAppMessage } from "../context/AppMessageContext";

import { useActiveSearch } from "../context/ActiveSearchContext";

import WindFriendsView from "@/app/components/WindFriendsView";
import RuinsHarmonyView from "./RuinsHarmonyView";

const RuinsSurroundingsView = ({ height }) => {
  const { portalSurroundings, ruinsSurroundings, homeSurroundings } =
    useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeLocation } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const { searchIsActive } = useActiveSearch();

  return (
    <View style={{ flex: 1, height: height }}>
      {ruinsSurroundings?.id && (
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
            label={"Wind compass"}
            value={ruinsSurroundings.windCompass}
          />
          {ruinsSurroundings.streetViewImage && (
            <SingleImagePanel
              label={"Image"}
              value={ruinsSurroundings.streetViewImage}
            />
          )}

          {/* <SingleDetailPanel
            label={"Wind harmony"}
            value={ruinsSurroundings.windHarmony}
          /> */}
          <SingleDetailPanel
            label={"Wind agreement score"}
            value={ruinsSurroundings.windAgreementScore}
          />
          {ruinsSurroundings.tags && ruinsSurroundings.tags.historic && (
            <SingleDetailPanel
              label={"#"}
              value={ruinsSurroundings.tags.historic}
            />
          )}

          {ruinsSurroundings.tags && ruinsSurroundings.tags.description && (
            <SingleDetailPanel
              label={"Ruins description"}
              value={ruinsSurroundings.tags.description}
            />
          )}
        </>
      )}
    </View>
  );
};

export default RuinsSurroundingsView;
