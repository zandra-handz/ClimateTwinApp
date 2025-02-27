import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import CurrentSurroundingsUICard from "./CurrentSurroundingsUICard";
import ItemChoiceUICard from "./ItemChoiceUICard";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import CardAnimationWrapper from "./CardAnimationWrapper";
import { useRouter } from "expo-router";


const CurrentSurroundingsView = ( {height}) => {
 const { currentSurroundings } =
    useSurroundings();

  const router = useRouter();


 
  const { itemChoices  } = useInteractiveElements();

  // Combine both portalLocation and ruinsLocation into one array of key-value pairs
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const getCombinedData = () => {
      if (!itemChoices || !currentSurroundings || currentSurroundings.id === null) return [];

      //console.log(itemChoices);
      
      return Object.entries(itemChoices)
        .filter(([_, value]) => value) // Filter out empty values
        .map(([key, value]) => ({ label: key, value }));
    };
  
    setCombinedData(getCombinedData);
  }, [itemChoices]);  


  const handleCollectTreasure = (id, base) => {
    if (id) {
        router.push({
            pathname: "(treasures)/collect",
            params: { id: id, base: base},
        })
    }

}


  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value); // If it's an object or array, convert to string
    }
    return value; // Return as is if it's a primitive value (string, number, etc.)
  };

  return (
    <View style={{  height: height }}> 
      {combinedData && (
        
      <FlatList
        data={combinedData}
        renderItem={({ item }) => (
          <ItemChoiceUICard
            label={item.label}
            value={formatValue(item.value)}
            onPress={handleCollectTreasure}
          />
          
             
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Three cards per row
        ListFooterComponent={<View style={{ height: 100 }}></View>}
      />
      
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CurrentSurroundingsView;
