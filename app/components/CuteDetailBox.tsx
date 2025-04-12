import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { AntDesign, Feather } from "@expo/vector-icons";

const CuteDetailBox = ({ iconOne, iconTwo, message, backgroundColor }) => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();
  return (
    <View
      style={[
        appContainerStyles.singleDetailPanelContainer,
       {backgroundColor: backgroundColor? backgroundColor : themeStyles.darkestBackground.backgroundColor}
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,

          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ flex: 1, paddingBottom: 6, flexDirection: "row" }}>
          {iconOne && (
            <AntDesign
              name={iconOne}
              size={appFontStyles.cuteDetailIcon.width}
              color={themeStyles.exploreTabBarText.color}
            />
          )}
          {iconTwo && (
            <View style={{ marginLeft: 6 }}>
              <Feather
                name={iconTwo}
                size={appFontStyles.cuteDetailIcon.width}
                color={themeStyles.exploreTabBarText.color}
              />
            </View>
          )}
        </View>
        <Text style={[themeStyles.primaryText]}>{message}</Text>
      </View>
    </View>
  );
};

export default CuteDetailBox;
