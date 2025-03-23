import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import CurrentSurroundingsUICard from "../SurroundingsComponents/CurrentSurroundingsUICard";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import ThreeJS from "../ThreeJS";

const HomeSurroundingsView = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeSurroundings } = useSurroundings();

  // Combine both portalLocation and ruinsLocation into one array of key-value pairs
  const combinedData = [
    ...(homeSurroundings.id !== null
      ? Object.entries(homeSurroundings)
          .filter(([key, value]) => value) // Filter out empty values
          .map(([key, value]) => ({
            label: key,
            value: value,
          }))
      : []),
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
      <View style={{ backgroundColor: 'red', height: 300, width: 300, borderWidth: 2, borderColor: 'blue' }}>
        <ThreeJS />
      </View>
      {/* Uncomment other components once ThreeJS is working */}
      {/* <Text style={[styles.title, appFontStyles.text]}>Current Surroundings</Text> */}
          {/* <FlatList
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
      /> */}
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

export default HomeSurroundingsView;