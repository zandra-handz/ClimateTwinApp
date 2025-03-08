import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";

const RefreshSocketButton = () => {
  const { themeStyles, appContainerStyles, appFontStyles, constantColorsStyles } = useGlobalStyles();
  const { handleRefreshDataFromSocket, isLocationSocketOpen, locationSocketColor } =
    useSurroundingsWS();
  return (
    <TouchableOpacity
      onPress={handleRefreshDataFromSocket}
      style={{
        zIndex: 2,
        height: "auto",
        width: "auto",
        height: 10,
        width: 10,
        // backgroundColor: isLocationSocketOpen ? constantColorsStyles.v1LogoColor.backgroundColor : locationSocketColor,
        backgroundColor: locationSocketColor,
        // paddingHorizontal: 8,
        // paddingVertical: 2,
        justifyContent: "center",
        borderRadius: 10 / 2,
      }}
    >
      {/* <Text style={[themeStyles.primaryText, { fontWeight: "bold" }]}> */}
      {/* <MaterialIcons
        name="refresh"
        size={appFontStyles.tinyIcon.width}
        color={constantColorsStyles.v1LogoColor.color}
      
      />  */}
      {/* </Text> */}
    </TouchableOpacity>
  );
};

export default RefreshSocketButton;
