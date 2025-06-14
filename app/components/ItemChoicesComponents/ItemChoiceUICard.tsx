import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

const ItemChoiceUICard = ({ label, value, onPress }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^\S+\s(\S)/, (match, p1) => match.toLowerCase()); // Lowercase the first letter of the second word
  };

  const handleCollectTreasure = () => {
    console.log('LABEL GETTING PASSED IN:', label);
    console.log(value);
    onPress(label, value);
  };

  return ( 
    <TouchableOpacity
      onPress={handleCollectTreasure}
      style={[
        appContainerStyles.surroundingsCardContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <Text style={[styles.label, themeStyles.primaryText]}>
        {formatLabel(label)}
      </Text>
      <View style={{ width: "100%", height: "100%", flexGrow: 1, flex: 1 }}>
        <Text style={[styles.value, themeStyles.primaryText]}>{value}</Text>
      </View>
    </TouchableOpacity> 
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
    position: "absolute", // Absolute position within the card
    top: 10, // Distance from the top of the card
    left: 10, // Distance from the left of the card
  },
  value: {
    fontSize: 11,
    textAlign: "left",
  },
});

export default ItemChoiceUICard;
