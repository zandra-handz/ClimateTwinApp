import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react"; 
import ItemChoiceUICard from "../ItemChoicesComponents/ItemChoiceUICard"; 
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import CardAnimationWrapper from "../CardAnimationWrapper";
import { useRouter } from "expo-router";
import TreasureUICard from "../ItemChoicesComponents/TreasureUICard";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";



const PortalTreasuresView = () => {
    
      const router = useRouter(); 
      const { itemChoicesAsObjectTwin } = useInteractiveElements();
      const { lastLocationName } = useSurroundingsWS();
     
    
        


const handleCollectTreasure = (topic, base) => {
    if (topic) {
        router.push({
            pathname: "(treasures)/collect",
            params: { name: lastLocationName, topic: topic, base: base},
        })
    }

}


const treasuresList = [
    ['name', 'travel'], 
    ['temperature', 'storms'], 
    ['description', 'weather'], 
    ['wind_direction', 'wind'], 
    ['wind_speed', 'birds'], 
    ['wind_friends', 'navigation'], 
    ['special_harmony', 'plants'], 
    ['sunrise_timestamp', 'breakfast'], 
    ['sunset_timestamp', 'alcohol']
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
              itemChoicesAsObjectTwin[item[0]] && ( // Check if item exists and if the value exists in itemChoicesAsObjectExplore
                <TreasureUICard
                  label={`${item[1]}`}
                  value={formatValue([
                    `twin_location__${item[0]}`,
                    itemChoicesAsObjectTwin[item[0]],
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

export default PortalTreasuresView