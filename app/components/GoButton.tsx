import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";

import AnimatedCircle from "../animations/AnimatedCircle";

const GoButton = ({
  address,
  size = 240,
  lastState,
  topMessage,
  bottomMessage,
  onPress,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

 

  console.log(`GO BUTTON:`, bottomMessage);

  const handlePress = () => {
    if (topMessage !== "No trips left" && lastState !== "searching for twin") {
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
              {topMessage}
            </Text>
          </View>
          <View style={{ position: "absolute", bottom: 26 }}>
            <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.remainingTripsText,
              ]}
            >
              {bottomMessage}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    </>
  );
};

export default GoButton;
