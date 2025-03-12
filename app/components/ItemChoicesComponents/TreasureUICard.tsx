import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";

const TreasureUICard = ({ label, value, onPress }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^\S+\s(\S)/, (match, p1) => match.toLowerCase()); // Lowercase the first letter of the second word
  };

  const handleCollectTreasure = () => {
 
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
      <Text style={[ themeStyles.primaryText]}>
        {label}
      </Text> 
    </TouchableOpacity> 
  );
};
 

export default TreasureUICard;
