import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import WindSquare from "../SurroundingsComponents/WindSquare";

const NearbyPortalUICard = ({
    data,
  name,
  description,
  windFriends,
  windSpeed,
  windDirection,
  homeDescription,
  homeWindSpeed,
  homeWindDirection,
  onPress,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { lastLocationId } = useSurroundingsWS();
  const [isUserHere, setIsUserHere] = useState(false);

  useEffect(() => {
    if (lastLocationId && lastLocationId === data.id) {
      setIsUserHere(true);
    } else {
      setIsUserHere(false);
    }
  }, [lastLocationId]);

  const handlePress = () => {
    if (isUserHere) {
      console.log("Already visiting!");
    } else {
      onPress(data);
    }
  };

  const formatDescription = (description) => {
    return description
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^\S+\s(\S)/, (match, p1) => match.toLowerCase()); // Lowercase the first letter of the second word
  };

  return (
    <>
      {!isUserHere && (

        <TouchableOpacity
          onPress={handlePress}
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
              height: "auto",
              width: "100%",
              justifyContent: "flex-start",
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}
            >
              {name}
            </Text>
            <Text style={[themeStyles.primaryText]}>
              {formatDescription(description)}
            </Text>
            <Text style={[themeStyles.primaryText]}>{windFriends}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              flexGrow: 1,
              flex: 1,
            }}
          >
            <WindSquare
              windSpeed={homeWindSpeed || 50}
              windDirection={homeWindDirection}
              size={50}
              opacity={0.8}
              color={themeStyles.primaryText.color}
            />
            <WindSquare
              windSpeed={windSpeed || 50}
              windDirection={windDirection}
              size={120}
              opacity={0.8}
              color={themeStyles.primaryText.color}
            />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default NearbyPortalUICard;
