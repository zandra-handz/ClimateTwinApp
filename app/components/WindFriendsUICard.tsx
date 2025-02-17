import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import WindSquare from "./WindSquare";

const WindFriendsUICard = ({
  description,
  windFriends,
  windSpeed,
  windDirection,
  homeDescription,
  homeWindSpeed,
  homeWindDirection,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  const formatDescription = (description) => {
    return description
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
      <View style={{flexDirection: 'column', top: 10, left: 10, height: 30, width: '100%', justifyContent: 'flex-start'}}>
      <Text
        style={[ 
          themeStyles.primaryText,
          appFontStyles.bannerHeaderText,
        ]}
      >
        {formatDescription(description)}
      </Text>
      <Text style={[ themeStyles.primaryText]}>
          {windFriends}
        </Text>

      </View>
 
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%", height: "100%", flexGrow: 1, flex: 1 }}>
      <WindSquare
          windSpeed={homeWindSpeed || 50}
          windDirection={homeWindDirection || 60}
          size={50}
          opacity={.8}
          color={themeStyles.primaryText.color}
        />
        <WindSquare
          windSpeed={windSpeed || 50}
          windDirection={windDirection || 60}
          size={120}
          opacity={.8}
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

export default WindFriendsUICard;
