import { View, Text, ScrollView } from "react-native";
import React from "react"; 
import { useGlobalStyles } from "../context/GlobalStylesContext";

const ScrollDetailPanel = ({ label, value, height }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <View
      style={[
        appContainerStyles.scrollDetailPanelContainer,
        themeStyles.darkerBackground,
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <View style={appContainerStyles.groqHeaderRow}>
        <Text style={[themeStyles.primaryText, appFontStyles.groqHeaderText]}>
            
            
          {" "}
          {label}
        </Text>
        
        </View>
        <Text selectable={true} style={[themeStyles.primaryText, appFontStyles.groqResponseText]}>{value}</Text>
      </ScrollView>
    </View>
  );
};

export default ScrollDetailPanel;
