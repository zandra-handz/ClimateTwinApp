import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, Keyboard, View } from "react-native";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";

const KeyboardOpenFooter = ({
  labelLeft,
  onPressLeft,
  isDisabledLeft = false,
  labelCenter,
  onPressCenter,
  isDisabledCenter = false,
  labelRight,
  onPressRight,
  isDisabledRight = false,
}) => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      {isKeyboardVisible && (
        <View
          style={[
            appContainerStyles.keyboardOpenFooterContainer,
            constantColorsStyles.v1LogoColor,
          ]}
        >
          {labelLeft && onPressLeft && (
            <TouchableOpacity
              onPress={isDisabledLeft ? null : onPressLeft}
              style={[
                appContainerStyles.keyboardFooterButton,
                constantColorsStyles.v1LogoColor,
              ]}
            > 
                <Text
                  style={[
                    appFontStyles.openKeyboardButtonText,
                    constantColorsStyles.v1LogoColor.color,
                  ]}
                >
                  {labelLeft}
                </Text> 
            </TouchableOpacity>
          )}
          {labelCenter && onPressCenter && (
            <TouchableOpacity
              onPress={isDisabledCenter ? null : onPressCenter}
              style={[
                appContainerStyles.keyboardFooterButton,
                constantColorsStyles.v1LogoColor,
              ]}
            > 
                <Text
                  style={[
                    appFontStyles.openKeyboardButtonText,
                    constantColorsStyles.v1LogoColor.color,
                  ]}
                >
                  {labelCenter}
                </Text> 
            </TouchableOpacity>
          )}
          {labelRight && onPressRight && (
            <TouchableOpacity
              onPress={isDisabledRight ? null : onPressRight}
              style={[
                appContainerStyles.keyboardFooterButton,
                constantColorsStyles.v1LogoColor,
              ]}
            > 
                <Text
                  style={[
                    appFontStyles.openKeyboardButtonText,
                    constantColorsStyles.v1LogoColor.color,
                  ]}
                >
                  {labelRight}
                </Text> 
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export default KeyboardOpenFooter;
