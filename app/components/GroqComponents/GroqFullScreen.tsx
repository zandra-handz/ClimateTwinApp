import { Animated, View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import GroqImageCard from "./GroqImageCard";
import GoToItemButton from "../GoToItemButton";
import PexelsTray from "../PexelsComponents/PexelsTray";
import UnsplashTray from "../UnsplashComponents/UnsplashTray";
import SmithsonianTray from "../SmithsonianComponents/SmithsonianTray";

import ComponentSpinner from "../Scaffolding/ComponentSpinner"; 
import { useFocusEffect } from "expo-router";

const GroqFullScreen = ({
  dataObject = {},
  opacity, 
  images,
  fullScreenToggle,
  isMinimized,
  isLoading,
  isKeyboardVisible,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles, avgPhotoColor, handleAvgPhotoColor } =
    useGlobalStyles();

  const debug = true; 

  const [fadeAnim] = useState(new Animated.Value(0));  


      useFocusEffect(
        React.useCallback(() => {
          console.log('setting color to null in groqfullscreen');
          handleAvgPhotoColor(null); 
       
          return () => {
            console.log('setting color to null in groqfullscreen return');
            handleAvgPhotoColor(null); 
           
          };
        }, [])
      );
  

    useEffect(() => {
      console.log('groqscreen color animation triggered');
      
      Animated.timing(fadeAnim, {
        toValue: avgPhotoColor ? 1 : 0,  
        duration: 1000,                 
        useNativeDriver: false,       
      }).start();
    }, [avgPhotoColor]);

  // useEffect(() => {
  //   if (searchKeyword && debug) {
  //     console.log(
  //       "GROQFULLSCREEN DEBUG: searchKeyword passed into component: ",
  //       searchKeyword
  //     );
  //   }
  // }, [searchKeyword]);

  return (
    <>
      {!isKeyboardVisible && (
        <>
        {/* {!isMinimized && (
          
         <BackgroundFadeIn triggerFade={true} />
         
        )} */}
        <Animated.View
          style={[
            appContainerStyles.groqScrollFullScreenContainer,
            // themeStyles.darkerBackground,
            {
              borderColor: "transparent",
              // backgroundColor: avgPhotoColor
              //   ? avgPhotoColor
              //   : themeStyles.darkerBackground.backgroundColor,
              height: !isMinimized ? 700 : 140,
              opacity: opacity || 1,
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [themeStyles.primaryBackground.backgroundColor, avgPhotoColor ? avgPhotoColor : 'transparent'], // Color transition (white to tomato)
              }),
            },
          ]}
        >
          {/* <BackgroundFadeIn triggerFade={true} /> */}
          {!dataObject?.altImageSearchQuery && <ComponentSpinner showSpinner={true} />}
          {/* {value && ( */}

          {dataObject && dataObject.altImageSearchQuery && (
           
            
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 10,
                paddingVertical: 8,

                width: "100%",
                justifyContent: "flex-start",
              }}
            > 
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {/* just change the -Tray prefix to change hook to an unsplash image */}
{!isMinimized && dataObject?.altImageSearchQuery && (
    <View style={{width: '16%', marginRight: 20}}>
      
    <PexelsTray queryString={dataObject?.altImageSearchQuery} base={dataObject?.base || null} photoNumber={1} />
  
    </View>
  )}
    {!isMinimized && dataObject?.altImageSearchQuery && (
    <View style={{width: '16%', marginRight: 20}}>
      
    <PexelsTray queryString={dataObject?.altImageSearchQuery} base={dataObject?.base || null} photoNumber={2} />
  
    </View>
  )}
  {!isMinimized && dataObject?.altImageSearchQuery && (
    <View style={{width: '16%', marginRight: 20}}>
      
    <PexelsTray queryString={dataObject?.altImageSearchQuery} base={dataObject?.base || null} photoNumber={3} />
  
    </View>
  )}

{!isMinimized && dataObject?.altImageSearchQuery && (
    <View style={{width: '16%', marginRight: 20}}>
      
    <PexelsTray queryString={dataObject?.altImageSearchQuery} base={dataObject?.base || null} photoNumber={4} />
  
    </View>
  )}

{/* {!isMinimized && dataObject?.altImageSearchQuery && (
    <View style={{width: '16%', marginRight: 20}}>
      
    <SmithsonianTray queryString={dataObject?.altImageSearchQuery} base={dataObject?.base || null} photoNumber={1} />
  
    </View>
  )}
   */}

</ScrollView>

              {/* 
                {!isMinimized && images && !pexelImages && (

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
                    
                )} */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: 72,
                  justifyContent: "center",
                }}
              >
                <GoToItemButton
                  onPress={() => fullScreenToggle()}
                  label={
                    !isMinimized ? "Found a treasure here?" : "Open Groq yapper"
                  }
                />
              </View>
              {!isMinimized && (
                <View
                  style={{
                    height: images[0] ? "44%" : "90%",
                    width: "100%",
                    backgroundColor:
                      themeStyles.primaryBackground.backgroundColor,
                    padding: 20,
                    borderRadius: 20,
                  }}
                >
                  <ScrollView>
                    <View style={appContainerStyles.groqHeaderRow}>
                  
                        
                      <Text
                        style={[
                          themeStyles.primaryText,
                          appFontStyles.groqHeaderText,
                        ]}
                      >
                        {" "}
                        {dataObject?.textHeader && dataObject.textHeader}
                      </Text>
                       
                    </View> 
                      
                    <Text
                      selectable={true}
                      style={[
                        themeStyles.primaryText,
                        appFontStyles.groqResponseText,
                      ]}
                    >
                      {dataObject?.textBody && dataObject.textBody}
                    </Text> 
                  </ScrollView>
                </View>
              )}
            </View> 
            
          )}
        </Animated.View>
        </>
      )}
    </>
  );
};

export default GroqFullScreen;
