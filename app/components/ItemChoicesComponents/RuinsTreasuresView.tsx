import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import { useRouter } from "expo-router";
import TreasureUICard from "../ItemChoicesComponents/TreasureUICard";

const RuinsTreasuresView = () => {
  const router = useRouter();
  const { itemChoicesAsObjectExplore } = useInteractiveElements();

  const handleCollectTreasure = (topic, base) => {
    if (topic) {
      router.push({
        pathname: "(treasures)/collect",
        params: { topic: topic, base: base },
      });
    }
  };

 
  //'street_view_image',
  const treasuresList = [
    ["name", "travel"],
    ["direction", "mountains"],
    ["direction_degree", "plants"],
    ["miles_away", "foods"],
    ["wind_compass", "wind"],
    ["wind_agreement_score", "birds"],
    ["wind_harmony", "wind"],
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

export default RuinsTreasuresView;
