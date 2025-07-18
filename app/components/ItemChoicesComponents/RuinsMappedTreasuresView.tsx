import { View,  FlatList  } from "react-native";
import React  from "react"; 
import { useRouter } from "expo-router";
import TreasureUICard from "./TreasureUICard";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";


//Mapped = Item details influence groq/item query
//used for Pexel images
const RuinsMappedTreasuresView = (strippedItemChoicesAsObjectExplore) => { // haven't tested this approach of passing this in
  const router = useRouter(); 
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
              strippedItemChoicesAsObjectExplore[item[0]] && ( // Check if item exists and if the value exists in itemChoicesAsObjectExplore
                <TreasureUICard
                  label={`${item[1]}`}
                  value={formatValue([
                    `explore_location__${item[0]}`,
                    strippedItemChoicesAsObjectExplore[item[0]],
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

export default RuinsMappedTreasuresView;
