import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";

const ActionsFooter = ({
  height=46,  //managed here instead of in styles
  onPressLeft,
  onPressRight,
  labelLeft = "Left button",
  labelRight = "Right button",
  onPressCenter,
  labelCenter = "Center button",
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
                {onPressCenter && (
          <TouchableOpacity
            style={appContainerStyles.footerButton}
            onPress={onPressCenter}
          >
            <Text
              style={[
                appFontStyles.actionFooterLabel,
                { color: constantColorsStyles.v1LogoColor.color },
              ]}
            >
              {labelCenter}
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
