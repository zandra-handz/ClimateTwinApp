import { View, FlatList } from "react-native";
import React  from "react";   
import { useRouter } from "expo-router";
import TreasureUICard from "./TreasureUICard";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";


//Mapped = Item details influence groq/item query
//used for Pexel images
const PortalMappedTreasuresView = ( strippedItemChoicesAsObjectTwin) => { //have not tested this approach of passing it in this way
    
      const router = useRouter();  
      const { lastLocationName } = useSurroundingsWS();
     
    
      const handleCollectTreasure = (topic, base) => {
        if (topic) {
          router.push({
            pathname: "(treasures)/collect",
            params: {
              name: lastLocationName, // Pass `name` directly, not wrapped in locationData
              topic,
              base,
            },
          });
        }
      };
      


// const handleCollectTreasure = (topic, base) => {
//     if (topic) {
//         router.push({
//             pathname: "(treasures)/collect",
//             params: { name: lastLocationName, topic: topic, base: base},
//         })
//     }

// }


const treasuresList = [
    ['name', 'travel'], 
    ['temperature', 'storms'], 
    ['description', 'weather'], 
    ['wind_direction', 'ancient sword'], 
    ['wind_speed', 'birds'], 
    ['wind_friends', 'ancient dagger'], 
    ['special_harmony', 'plants'], 
    ['sunrise_timestamp', 'breakfast'], 
    ['sunset_timestamp', 'trees']
  ];
  
  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value);  
    }
    return value;  
  };
 
  return (
    <> 
        
        <FlatList
        data={treasuresList}
        renderItem={({ item }) => (
          <>
            {item &&
              strippedItemChoicesAsObjectTwin[item[0]] && ( // Check if item exists and if the value exists in itemChoicesAsObjectExplore
                <TreasureUICard
                  label={`${item[1]}`}
                  value={formatValue([
                    `twin_location__${item[0]}`,
                    strippedItemChoicesAsObjectTwin[item[0]],
                  ])}
                  onPress={handleCollectTreasure}
                />
              )}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}  
        ListFooterComponent={<View style={{ height: 100 }}></View>}
      />
       
    </>
  );
}; 

export default PortalMappedTreasuresView