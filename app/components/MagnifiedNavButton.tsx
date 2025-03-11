import { View, Text,  TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import React from "react";
import SingleDetailPanel from "./SingleDetailPanel";
import NavBox from "./NavBox";
import { AntDesign, Feather } from "@expo/vector-icons";

const MagnifiedNavButton = ({message, onPress}) => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[appContainerStyles.magNavButtonContainer, {backgroundColor: themeStyles.primaryText.color, borderColor: themeStyles.primaryText.color}]}
    > 
        {/* <Text style={[themeStyles.primaryText]}>{message}</Text> */}
        <NavBox direction={'up'} message="Go back"/>
       
    </TouchableOpacity>
  );
};

export default MagnifiedNavButton;
