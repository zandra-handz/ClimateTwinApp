import { Animated, View, Text, ScrollView } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import GroqImageCard from "./GroqImageCard"; 
import GoToItemButton from "../GoToItemButton";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
import { useFocusEffect } from "expo-router"; 

const GroqFullScreen = ({
  label,
  value,
  opacity,
  images,
  fullScreenToggle,
  isMinimized,
  isLoading,
  isKeyboardVisible,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <>
     
    {!isKeyboardVisible && (

   
      <Animated.View
        style={[
          appContainerStyles.groqScrollFullScreenContainer,
          themeStyles.darkerBackground,
          { height: !isMinimized ? 690 : 140, opacity: opacity || 1 },
        ]}
      >
        {isLoading && (
          
         <ComponentSpinner showSpinner={true} />
         
        )}
        {/* <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      > */}
      {value && (
        
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
            paddingVertical: 8,

            width: "100%",
            justifyContent: "flex-start",
          }}
        > 

        {!isMinimized && images && (

            <View
              style={{
                width: "100%",
               
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
                height: 'auto', 
              }}
            >
              <GroqImageCard value={images[0]} />
            </View> 
            
        )}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 90,
              justifyContent: "center",
            }}
          >
            <GoToItemButton
              onPress={() => fullScreenToggle()}
              label={!isMinimized ? "Found a treasure here?" : "Open Groq yapper"}
            />
          </View>
          {!isMinimized && (
            
          <View style={{ height: images[0] ? '36%' : '90%', width: "100%" }}>
            <ScrollView>
              <View style={appContainerStyles.groqHeaderRow}>
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.groqHeaderText,
                  ]}
                >
                  {" "}
                  {label}
                </Text>
              </View>
              <Text
                selectable={true}
                style={[
                  themeStyles.primaryText,
                  appFontStyles.groqResponseText,
                ]}
              >
                {value}
              </Text>
            </ScrollView>
          </View>
          
        )}
        </View>
        
      )}
      </Animated.View>
       )}
    </>
  );
};

export default GroqFullScreen;
