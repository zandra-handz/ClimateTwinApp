import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext";

const WebSocketCurrentLocation: React.FC = () => {
  
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { locationUpdateWSIsOpen, lastLocationName, lastState } =
    useSurroundingsWS();

  return (
    <View style={appContainerStyles.defaultElementRow}>
      {lastLocationName &&
        locationUpdateWSIsOpen &&
        lastState !== "searching for twin" &&
         (
          <>
            <Text
              style={[
                appFontStyles.subHeaderMessageText,
                themeStyles.primaryText,
              ]}
            >
              {lastLocationName && lastLocationName !== "You are home"
                ? `you are in: `
                : ``}
            </Text>
            <Text
              style={[appFontStyles.emphasizedText, themeStyles.primaryText]}
            >
              {lastLocationName}
            </Text>
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  updatesContainer: {
    flexGrow: 1,
  },
  updateCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default WebSocketCurrentLocation;
