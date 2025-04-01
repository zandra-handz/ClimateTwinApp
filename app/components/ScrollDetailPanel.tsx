import { Animated, View, Text, ScrollView } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
 
import GroqImageCard from "./GroqComponents/GroqImageCard";

import ComponentSpinner from "./Scaffolding/ComponentSpinner";
import { useSurroundings } from "../context/CurrentSurroundingsContext";

const ScrollDetailPanel = ({ label, value, opacity, images, isLoading=false }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { ruinsSurroundings, portalSurroundings } = useSurroundings(); // used to change the height of the groq Container


  return (
    <Animated.View
      style={[
        appContainerStyles.groqHistoryScrollContainer,
        themeStyles.darkerBackground,
        { opacity: opacity || 1, height: ruinsSurroundings.id? 270 : 360 },
      ]}
    >
              {isLoading && (
          
          <ComponentSpinner showSpinner={true} />
          
         )}

         {value && (
          

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
          <View
            style={{
              width: "100%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              height: "auto",
            }}
          >
            <GroqImageCard value={images[0]} />
          </View>
        )}
        <View style={appContainerStyles.groqHeaderRow}>
          <Text style={[themeStyles.primaryText, appFontStyles.groqHeaderText]}>
            {" "}
            {label}
          </Text>
        </View>
        <Text
          selectable={true}
          style={[themeStyles.primaryText, appFontStyles.groqResponseText]}
        >
          {value}
        </Text>
      </ScrollView>
      
    )}
    </Animated.View>
  );
};

export default ScrollDetailPanel;
