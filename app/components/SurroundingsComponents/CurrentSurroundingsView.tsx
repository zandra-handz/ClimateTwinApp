import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useInteractiveElements } from "@/src/context/InteractiveElementsContext";
import RuinsMappedTreasuresView from "../ItemChoicesComponents/RuinsMappedTreasuresView";
import PortalMappedTreasuresView from "../ItemChoicesComponents/PortalMappedTreasuresView";
import PortalUnmappedTreasuresView from "../ItemChoicesComponents/PortalUnmappedTreasuresView";

import RuinsUnmappedTreasuresView from "../ItemChoicesComponents/RuinsUnmappedTreasureView";
import { useGroqContext } from "@/src/context/GroqContext";
import useINaturalist from "@/app/hooks/useINaturalist";
import WindyMap from "../WindyMap";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";

const CurrentSurroundingsView = ({ height }) => {
  const { groqHistory } = useGroqContext();
  const { iNaturalist } = useINaturalist();
  const { lastLatAndLong } = useSurroundingsWS();
  const [latitude, longitude] = Array.isArray(lastLatAndLong)
    ? lastLatAndLong
    : [null, null];

  const { itemChoicesAsObjectTwin, itemChoicesAsObjectExplore } =
    useInteractiveElements();

  return (
    <>
      <View style={{ marginVertical: 10, height: 100 }}>
        <WindyMap lat={latitude} lon={longitude} zoom={12} />
      </View>

      <View style={{ height: height }}>
        {groqHistory && iNaturalist?.results?.length > 0 ? (
          <>
            {Object.keys(itemChoicesAsObjectExplore).length > 0 && (
              <RuinsUnmappedTreasuresView />
            )}
            {Object.keys(itemChoicesAsObjectTwin).length > 0 && (
              <PortalUnmappedTreasuresView />
            )}
          </>
        ) : (
          groqHistory && (
            <>
            {/* these buttons go straight to collect screen rn without groqscreen pulled up first, only pulls up when 
            you back out...  */}
              {/* {Object.keys(itemChoicesAsObjectExplore).length > 0 && (
                <RuinsMappedTreasuresView />
              )}
              {Object.keys(itemChoicesAsObjectTwin).length > 0 && (
                <PortalMappedTreasuresView />
              )} */}
            </>
          )
        )}
      </View>
    </>
  );
};

export default CurrentSurroundingsView;
