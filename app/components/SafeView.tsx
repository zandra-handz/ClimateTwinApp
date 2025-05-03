import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomStatusBar from "./CustomStatusBar";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

export const SafeView = ({
  children,
  style,
  includeCustomStatusBar = true,
  primaryBackground = false,
}) => {
  const insets = useSafeAreaInsets();

  const top = typeof insets.top === "number" ? insets.top : 0;
  const bottom = typeof insets.bottom === "number" ? insets.bottom : 0;
  const left = typeof insets.left === "number" ? insets.left : 0;
  const right = typeof insets.right === "number" ? insets.right : 0;

  const { themeStyles } = useGlobalStyles();

  return (
    <View
      style={[
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
          backgroundColor: primaryBackground ? themeStyles.primaryBackground.backgroundColor : 'transparent',
        },
        style,
      ]}
    >
      {includeCustomStatusBar && <CustomStatusBar />}
      {children}
    </View>
  );
};

export default SafeView;
