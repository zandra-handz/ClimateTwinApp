import { Animated, View, Text, ScrollView } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";

import ComponentSpinner from "./Scaffolding/ComponentSpinner";
import { useSurroundings } from "../../src/context/CurrentSurroundingsContext";
import useInlineComputations from "@/src/hooks/useInlineComputations";

const ScrollDetailPanel = ({ label, value, opacity, isLoading = false }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { currentSurroundings  } = useSurroundings(); // used to change the height of the groq Container
  const { getSurroundingsData } = useInlineComputations();
  const { 
    ruinsSurroundings, 
  } = getSurroundingsData(currentSurroundings);

  return (
    <Animated.View
      style={[
        appContainerStyles.groqHistoryScrollContainer,
        themeStyles.darkerBackground,
        {
          opacity: opacity || 1,
          height: ruinsSurroundings?.id
            ? ruinsSurroundings?.streetViewImage
              ? 312
              : 568 // height if there are no images
            : 420,
        },
      ]}
    >
      {isLoading && <ComponentSpinner showSpinner={true} />}

      {value && (
        <ScrollView
        showsVerticalScrollIndicator={false} 
      
          contentContainerStyle={{
            flexDirection: "column",
        

            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <View style={appContainerStyles.groqHeaderRow}>
            <Text
              style={[themeStyles.primaryText, appFontStyles.groqHeaderText]}
            > 
              {label}
            </Text>
          </View>
          <Text
            selectable={true}
            style={[themeStyles.primaryText, appFontStyles.groqResponseText]}
          >
            {value}
          </Text>
          <View style={{ height: 80 }} /> 
        </ScrollView>
      )}
    </Animated.View>
  );
};

export default ScrollDetailPanel;
