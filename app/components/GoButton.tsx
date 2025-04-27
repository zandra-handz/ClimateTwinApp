import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";

import AnimatedCircle from "../animations/AnimatedCircle";

const GoButton = ({
  address,
  size = 240,
  lastState,
  remainingGoes,
  onPress,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  const buttonTopMessage =
    remainingGoes !== "0" ? `Open a portal` : `No trips left`;

  const buttonLowerMessage =
    remainingGoes === "No limit"
      ? `No limit`
      : remainingGoes === "0"
      ? ``
      : remainingGoes === "1"
      ? `1 trip left`
      : `${remainingGoes} left`;

  console.log(buttonLowerMessage);

  const handlePress = () => {
    if (remainingGoes !== "0" && lastState !== "searching for twin") {
      onPress(address);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          appContainerStyles.bigGoButtonContainer,
          themeStyles.primaryOverlayBackground,
          {
            height: size,
            width: size,
            borderRadius: size / 2,
            borderColor: themeStyles.tabBarHighlightedText.color,
          },
        ]}
      >
        <View style={{ position: "absolute", top: 0 }}>
          <AnimatedCircle width={size} height={size} />
        </View>
        <>
          <View
            style={{
              flexWrap: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              width: "100%",
            }}
          >
            <Text style={[themeStyles.primaryText, appFontStyles.goButtonText]}>
              {buttonTopMessage}
            </Text>
          </View>
          <View style={{ position: "absolute", bottom: 26 }}>
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.remainingTripsText,
              ]}
            >
              {buttonLowerMessage}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    </>
  );
};

export default GoButton;
