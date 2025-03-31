import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import { useRouter } from "expo-router";
import TreasureUICard from "./TreasureUICard";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";


//Unmapped = image results are arbitrarily assigned to base
//used for iNaturalist -- iNaturalist returns much more revelant results
//than Pexel with just the location coords
const RuinsUnmappedTreasuresView = () => {
  const router = useRouter();
  const { itemChoicesAsObjectExplore,  locationPropertiesList } = useInteractiveElements();
  const { lastLocationName } = useSurroundingsWS();

  // const handleCollectTreasure = (topic, base) => {
  //   if (topic) {
  //     router.push({
  //       pathname: "(treasures)/collect",
  //       params: { name: lastLocationName, topic: topic, base: base },
  //     });
  //   }
  // };

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
  

 
  //'street_view_image',
  const treasuresList = [
    ["name", "ancient sword"],
    ["direction", "mountains"],
    ["direction_degree", "plants"],
    ["miles_away", "trees"],
    ["wind_compass", "wind"],
    ["wind_agreement_score", "weapons"],
    ["wind_harmony", "birds"],
  ];

  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value); // If it's an object or array, convert to string
    }
    return value; // Return as is if it's a primitive value (string, number, etc.)
  };

  return (
    <>
      <FlatList
        data={treasuresList}
        renderItem={({ item }) => (
          <>
            {item &&
              itemChoicesAsObjectExplore[item[0]] && ( // Check if item exists and if the value exists in itemChoicesAsObjectExplore
                <TreasureUICard
                  label={`${item[1]}`}
                  value={formatValue([
                    `explore_location__${item[0]}`,
                    itemChoicesAsObjectExplore[item[0]],
                  ])}
                  onPress={handleCollectTreasure}
                />
              )}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Three cards per row
        ListFooterComponent={<View style={{ height: 100 }}></View>}
      />
    </>
  );
};

export default RuinsUnmappedTreasuresView;
