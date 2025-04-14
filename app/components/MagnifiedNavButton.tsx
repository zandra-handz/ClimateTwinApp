import { View, Text,  TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import React from "react"; 
import NavBox from "./NavBox";
import { AntDesign, Feather } from "@expo/vector-icons";

const MagnifiedNavButton = ({message='Go back', direction='up', onPress}) => {
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
        <NavBox direction={direction} message={message}/>
       
    </TouchableOpacity>
  );
};

export default MagnifiedNavButton;
