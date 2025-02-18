import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import WindSquare from "./WindSquare";

const RuinsHarmonyUICard = ({
  name,

  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree, 
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

    const formatWords = (words) => {
      return words
        .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
        .replace(/^\S+\s(\S)/, (match, p1) => match.toLowerCase()); // Lowercase the first letter of the second word
    };

  return (
    // <>
    // {value && (

    <View
      style={[
        appContainerStyles.windFriendsCardContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          top: 10,
          left: 10,
          height: 30,
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}>
          {name}
        </Text>
        <Text style={[themeStyles.primaryText]}>{milesAway} miles {direction.toLowerCase()} of portal</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          flexGrow: 1,
          flex: 1,
        }}
      > 
        <WindSquare
          windSpeed={null}
          windDirection={directionDegree}
          size={120}
          opacity={0.8}
          color={themeStyles.primaryText.color}
        />
      </View>
    </View>

    // )}

    // </>
  );
};

const styles = StyleSheet.create({
  desc: {
    fontWeight: "bold",
    position: "absolute", // Absolute position within the card
    top: 10, // Distance from the top of the card
    left: 10, // Distance from the left of the card
  },
});

export default RuinsHarmonyUICard;
