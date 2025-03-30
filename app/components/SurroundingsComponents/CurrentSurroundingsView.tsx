import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import RuinsTreasuresView from "../ItemChoicesComponents/RuinsTreasuresView";
import PortalTreasuresView from "../ItemChoicesComponents/PortalTreasuresView";
import { useGroqContext } from "@/app/context/GroqContext";
import INaturalistTray from "../INaturalistComponents/iNaturalistTray";
import useINaturalist from "@/app/hooks/useINaturalist";
import WindyMap from "../WindyMap";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";


const CurrentSurroundingsView = ({ height }) => {
  const { groqHistory } = useGroqContext();
  const { iNaturalist } = useINaturalist();
  const { lastLatAndLong } = useSurroundingsWS();
  const [latitude, longitude] = Array.isArray(lastLatAndLong) ? lastLatAndLong : [null, null];
   

  useEffect(() => {
    if (iNaturalist) {
      console.log(`Inaturalist detected in CurrentSurroundingsView, `, iNaturalist.results.length);
    }
  }, [iNaturalist]);

  const { itemChoicesAsObjectTwin, itemChoicesAsObjectExplore } = useInteractiveElements();

  return (
    <> 
    <View style={{marginVertical: 10, height: 100}}>

    <WindyMap lat={latitude} lon={longitude} zoom={12}/>
    
    </View>

     
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
                <INaturalistTray index={index} observation={item} onPress={() => console.log('iNaturalist card pressed!')} />
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
