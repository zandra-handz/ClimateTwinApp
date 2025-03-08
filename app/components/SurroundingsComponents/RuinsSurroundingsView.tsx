import React from "react";
import { View } from "react-native";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import SingleImagePanel from "@/app/components/SingleImagePanel";

import useLLMScripts from "@/app/llm/useLLMScripts";

import RuinsHarmonyView from "./RuinsHarmonyView";

const RuinsSurroundingsView = ({ height }) => {
  const { ruinsSurroundings } = useSurroundings();
  const { yourRoleIsFriendlyDiligentHistorian, tellMeRecentHistoryOf } =
    useLLMScripts();

  const prompt = tellMeRecentHistoryOf(
    ruinsSurroundings?.latitude,
    ruinsSurroundings?.longitude,
    ruinsSurroundings?.name
  );
  const role = yourRoleIsFriendlyDiligentHistorian();

  return (
    <View style={{ flex: 1, height: height }}>
      <View style={{ height: 10, width: "100%" }}></View>
      {ruinsSurroundings?.id && (
        <>
          {ruinsSurroundings.streetViewImage && (
            <SingleImagePanel
              label={"Image"}
              value={ruinsSurroundings.streetViewImage}
            />
          )}
          <RuinsHarmonyView
            name={ruinsSurroundings.name}
            windCompass={ruinsSurroundings.windCompass}
            tags={ruinsSurroundings.tags}
            milesAway={ruinsSurroundings.milesAway}
            direction={ruinsSurroundings.direction}
            directionDegree={ruinsSurroundings.directionDegree}
            windHarmony={ruinsSurroundings.windHarmony}
          />

          {/* <SingleDetailPanel
            label={"Wind compass"}
            value={ruinsSurroundings.windCompass}
          /> */}

          {/* <SingleDetailPanel
            label={"Wind harmony"}
            value={ruinsSurroundings.windHarmony}
          /> */}
          {/* <SingleDetailPanel
            label={"Wind agreement score"}
            value={ruinsSurroundings.windAgreementScore}
          /> */}
          {/* <Groq givenRole={role} prompt={prompt} title={'history from Groq'} /> */}

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
