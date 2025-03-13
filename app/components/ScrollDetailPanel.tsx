import { Animated, View, Text, ScrollView } from "react-native";
import React from "react"; 
import { useGlobalStyles } from "../context/GlobalStylesContext";
import SingleImagePanel from "./SingleImagePanel";
import GroqImageCard from "./GroqComponents/GroqImageCard";

const ScrollDetailPanel = ({ label, value, opacity, images }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <Animated.View
      style={[
        appContainerStyles.scrollDetailPanelContainer,
        themeStyles.darkerBackground, { opacity: opacity || 1}
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
                {images && (
        <View style={{width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'center', height: 'auto'}}>
          
        <GroqImageCard value={images[0]}/>
        </View>
      )}
        <View style={appContainerStyles.groqHeaderRow}>
        <Text style={[themeStyles.primaryText, appFontStyles.groqHeaderText]}>
            
            
          {" "}
          {label}
        </Text>

        
        </View>
        <Text selectable={true} style={[themeStyles.primaryText, appFontStyles.groqResponseText]}>{value}</Text>

      
      </ScrollView>
    </Animated.View>
  );
};

export default ScrollDetailPanel;
