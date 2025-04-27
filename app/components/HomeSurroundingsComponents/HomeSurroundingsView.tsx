import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import MagnifiedNavButton from "../MagnifiedNavButton"; 

const HomeSurroundingsView = ({remainingGoes, onPress }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  
  const message =
    remainingGoes === "No limit"
    ? `No limit`
    : remainingGoes === "0"
    ? ``
    : remainingGoes === "1"
    ? `One trip left`
    : `${remainingGoes} left`;

  
  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}99`;

  return (
    <>
      <View
        style={[appContainerStyles.dimmer, { backgroundColor: overlayColor }]}
      >
        <View style={{ paddingBottom: 200 }}>
          <MagnifiedNavButton
            direction={"left"}
            message={`Go home? (${message})`}
            onPress={onPress}
          />
        </View>
      </View>
    </>
  );
};

export default HomeSurroundingsView;
