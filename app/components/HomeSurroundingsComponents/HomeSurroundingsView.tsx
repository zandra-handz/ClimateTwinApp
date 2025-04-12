import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import CurrentSurroundingsUICard from "../SurroundingsComponents/CurrentSurroundingsUICard";
import { useSurroundings } from "../../../src/context/CurrentSurroundingsContext";
 import MagnifiedNavButton from "../MagnifiedNavButton";
import { useActiveSearch } from "@/src/context/ActiveSearchContext";
const HomeSurroundingsView = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeSurroundings } = useSurroundings();
  const { handleGoHome, remainingGoes } = useActiveSearch();

  const remaining = remainingGoes === 'No limit'? 'Unlimited trips' : `Trips remaining: ${remainingGoes}`;

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
  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}99`;

  return (
    <>
        <View style={[appContainerStyles.dimmer, {backgroundColor: overlayColor}]}  >

          <View style={{paddingBottom: 200}}>
        <MagnifiedNavButton   direction={'left'} message={`Go home? (${remaining})`} onPress={handleGoHome}/>
  
            
        </View>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeSurroundingsView;