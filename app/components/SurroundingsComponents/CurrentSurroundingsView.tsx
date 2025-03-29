import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import RuinsTreasuresView from "../ItemChoicesComponents/RuinsTreasuresView";
import PortalTreasuresView from "../ItemChoicesComponents/PortalTreasuresView";
import { useGroqContext } from "@/app/context/GroqContext";
import INaturalistTray from "../INaturalistComponents/iNaturalistTray";
import useINaturalist from "@/app/hooks/useINaturalist";

const CurrentSurroundingsView = ({ height }) => {
  const { groqHistory } = useGroqContext();
  const { iNaturalist } = useINaturalist();

  useEffect(() => {
    if (iNaturalist) {
      console.log(`Inaturalist detected in CurrentSurroundingsView, `, iNaturalist.results.length);
    }
  }, [iNaturalist]);

  const { itemChoicesAsObjectTwin, itemChoicesAsObjectExplore } = useInteractiveElements();

  return (
    <>
      {iNaturalist && iNaturalist.results && iNaturalist.results.length > 0 && (
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {iNaturalist.results.map((item, index) => (
              <View key={index} style={{ width: 300, marginRight: 20 }}>
                {/* Pass the observation data to the INaturalistTray */}
                <INaturalistTray index={index} observation={item} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {groqHistory && (
        <View style={{ height: height }}>
          {Object.keys(itemChoicesAsObjectExplore).length > 0 && (
            <RuinsTreasuresView />
          )}
          {Object.keys(itemChoicesAsObjectTwin).length > 0 && (
            <PortalTreasuresView />
          )}
        </View>
      )}
    </>
  );
};

export default CurrentSurroundingsView;
