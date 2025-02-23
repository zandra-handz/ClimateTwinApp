import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";

const ActionsFooter = ({
    height=80, //THis is what the global styles setting is as well
  onPressLeft,
  onPressRight,
  labelLeft = "Left button",
  labelRight = "Right button",
}) => { 


  const { constantColorsStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();
  return (
    <View
      style={[
        appContainerStyles.twoButtonFooterContainer,
        constantColorsStyles.v1LogoColor, { height: height}
      ]}
    >
      <>
        {onPressLeft && (
          <TouchableOpacity
            style={appContainerStyles.footerButton}
            onPress={onPressLeft}
          >
            <Text
              style={[
                appFontStyles.actionFooterLabel,
                { color: constantColorsStyles.v1LogoColor.color },
              ]}
            >
              {labelLeft}
            </Text>
          </TouchableOpacity>
        )}
        {onPressRight && (
          <TouchableOpacity
            style={appContainerStyles.footerButton}
            onPress={onPressRight}
          >
            <Text
              style={[
                appFontStyles.actionFooterLabel,
                { color: constantColorsStyles.v1LogoColor.color },
              ]}
            >
              {labelRight}
            </Text>
          </TouchableOpacity>
        )}
      </>
    </View>
  );
};

export default ActionsFooter;
