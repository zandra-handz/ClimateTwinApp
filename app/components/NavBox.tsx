import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import {  Feather } from "@expo/vector-icons";

const NavBox = ({ direction, message, backgroundColor }) => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();
  return (
    <View
      style={[
        appContainerStyles.navBoxContainer,
       {backgroundColor: backgroundColor? backgroundColor : themeStyles.darkestBackground.backgroundColor}
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,
        

          width: "100%",
          width: 300,
          justifyContent: "flex-start",
        }}
      >
        <View style={{  paddingBottom: 10,  justifyContent: 'center', flexDirection: "row" }}>
      {direction && (
        //up, down, left, right
            <Feather
              name={`arrow-${direction}`}
              size={appFontStyles.magNavArrowIcon.width}
              color={themeStyles.primaryText.color}
            /> 
            
      )}
        </View>
        <View style={appContainerStyles.magNavTextContainer}>
        <Text style={[themeStyles.primaryText, appFontStyles.magNavText]}>{message}</Text>
        
            
        </View>
      </View>
    </View>
  );
};

export default NavBox;
