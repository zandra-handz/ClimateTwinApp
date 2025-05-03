import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

const NothingHere = ({ message, subMessage, offsetStatusBarHeight }) => {
  const { themeStyles, appFontStyles } = useGlobalStyles();

  const offset = -100;

  return (
    <View
      style={[
        styles.container,
        themeStyles.primaryBackground,
        { top: offsetStatusBarHeight ? offset : 0 },
      ]}
    >
      <Text style={[appFontStyles.bannerHeaderText, themeStyles.primaryText]}>
        {message}
      </Text>
      <Text style={[appFontStyles.groqResponseText, themeStyles.primaryText]}>
        {subMessage}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
});

export default NothingHere;
