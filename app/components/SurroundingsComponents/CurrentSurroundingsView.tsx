import React  from "react";
import { View } from "react-native";
import { useInteractiveElements } from "@/src/context/InteractiveElementsContext"; 
import PortalUnmappedTreasuresView from "../ItemChoicesComponents/PortalUnmappedTreasuresView";

import RuinsUnmappedTreasuresView from "../ItemChoicesComponents/RuinsUnmappedTreasureView";
import { useGroqContext } from "@/src/context/GroqContext";
import useINaturalist from "@/src/hooks/useINaturalist";
import WindyMap from "../WindyMap";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import useInlineComputations from "@/src/hooks/useInlineComputations";

const CurrentSurroundingsView = ({ height, pathPushToInteractScreen }) => {
  const { groqHistory } = useGroqContext();
  const { iNaturalist } = useINaturalist();
  const { lastLatAndLong } = useSurroundingsWS();
  const [latitude, longitude] = Array.isArray(lastLatAndLong)

    ? lastLatAndLong
    : [null, null];

  const { itemChoicesResponse } =
    useInteractiveElements(); 
    const { getItemChoices, getItemChoicesAsObjectTwin, getItemChoicesAsObjectExplore } = useInlineComputations();

    const  itemChoicesAsObjectTwin = getItemChoicesAsObjectTwin(itemChoicesResponse);
 
    const  itemChoicesAsObjectExplore = getItemChoicesAsObjectExplore(itemChoicesResponse);

    const  itemChoices  = getItemChoices(itemChoicesResponse);
 

  return (
    <>
      <View style={{ marginVertical: 10, height: 100 }}>
        <WindyMap lat={latitude} lon={longitude} zoom={12} />
      </View>

      <View style={{ height: height }}>
        {groqHistory && iNaturalist?.results?.length > 0 ? (
          <> 

            {Object.keys(itemChoicesAsObjectExplore).length > 0 && (

              <RuinsUnmappedTreasuresView itemChoices={itemChoices} pathPushToInteractScreen={pathPushToInteractScreen} />

            )} 
 
            {Object.keys(itemChoicesAsObjectTwin).length > 0 && (

              <PortalUnmappedTreasuresView itemChoices={itemChoices} pathPushToInteractScreen={pathPushToInteractScreen} />

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
