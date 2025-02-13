import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import CurrentSurroundingsUICard from "./CurrentSurroundingsUICard";
import { useSurroundings } from "../context/CurrentSurroundingsContext";

const CurrentSurroundingsView = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { portalLocation, ruinsLocation } = useSurroundings();

  // Combine both portalLocation and ruinsLocation into one array of key-value pairs
  const combinedData = [
    ...Object.entries(portalLocation).map(([key, value]) => ({
      label: key,
      value: value,
    })),
    ...Object.entries(ruinsLocation).map(([key, value]) => ({
      label: key,
      value: value,
    })),
  ];

  // Helper function to convert objects or arrays to strings
  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value); // If it's an object or array, convert to string
    }
    return value; // Return as is if it's a primitive value (string, number, etc.)
  };

  return (
    <View style={styles.container}>
      {/* <Text style={[styles.title, appFontStyles.text]}>
        Current Surroundings
      </Text> */}
      <FlatList
        data={combinedData}
        renderItem={({ item }) => ( 
            <CurrentSurroundingsUICard
              label={item.label}
              value={formatValue(item.value)}
            /> 
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Three cards per row
        ListFooterComponent={<View style={{height: 200}}></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0, 
    width: "100%",
    justifyContent: 'space-between', 
    alignItems: "center", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CurrentSurroundingsView;
