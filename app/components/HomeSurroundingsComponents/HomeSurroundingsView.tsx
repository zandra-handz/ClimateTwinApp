import { View, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundings } from "../../../src/context/CurrentSurroundingsContext";
import MagnifiedNavButton from "../MagnifiedNavButton";
import { useActiveSearch } from "@/src/context/ActiveSearchContext";

const HomeSurroundingsView = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { homeSurroundings } = useSurroundings();
  const { handleGoHome, remainingGoes } = useActiveSearch();

  const remaining =
    remainingGoes === "No limit"
      ? "Unlimited trips"
      : `Trips remaining: ${remainingGoes}`;

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

  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };
  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}99`;

  return (
    <>
      <View
        style={[appContainerStyles.dimmer, { backgroundColor: overlayColor }]}
      >
        <View style={{ paddingBottom: 200 }}>
          <MagnifiedNavButton
            direction={"left"}
            message={`Go home? (${remaining})`}
            onPress={handleGoHome}
          />
        </View>
      </View>
    </>
  );
};

export default HomeSurroundingsView;
