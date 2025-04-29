import { Animated, View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import GroqImageCard from "./GroqImageCard";
import GoToItemButton from "../GoToItemButton";
import PexelsTray from "../PexelsComponents/PexelsTray";
import UnsplashTray from "../UnsplashComponents/UnsplashTray";
import SmithsonianTray from "../SmithsonianComponents/SmithsonianTray";

import INaturalistHeader from "../INaturalistComponents/INaturalistHeader";
import { WebView } from "react-native-webview";
import useINaturalist from "@/app/hooks/useINaturalist";
import { SafeAreaView } from "react-native-safe-area-context";
import ComponentSpinner from "../Scaffolding/ComponentSpinner";
import { useFocusEffect } from "expo-router";

import useInlineComputations from "@/app/hooks/useInlineComputations";

const GroqFullScreen = ({
  dataObject = {},
  opacity,
  images,
  isMinimized,
  isLoading,
  isKeyboardVisible,
  base,
  topic,
  index,
  goToCollect,
  collectInProgress,
}) => {
  const {
    themeStyles,
    appFontStyles,
    appContainerStyles,
    avgPhotoColor,
    handleAvgPhotoColor,
  } = useGlobalStyles();

  const debug = true;

  const { iNaturalist } = useINaturalist();
  const { getWikiLink } = useInlineComputations();
  const iNaturalistImageSize = 300;
  const [fadeAnim] = useState(new Animated.Value(0));
 

  const reAdjustedIndex = index ? index - 1 : null;

  const wikiLink = getWikiLink(iNaturalist, reAdjustedIndex);

  // const wikiLink = iNaturalist?.results[reAdjustedIndex]?.taxon?.wikipedia_url
  //   ? iNaturalist.results[reAdjustedIndex].taxon.wikipedia_url.replace(/^http:/, "https:")
  //   : null;

  // console.log(wikiLink);


  // DON'T DELETE BECAUSE COOL AND TOOK FOREVER
  // BUT DOESN'T WORK WITH INATURALIST
  // useFocusEffect(
  //   React.useCallback(() => {
  //     handleAvgPhotoColor(null);
  //     console.log(`index in groqfullscreen: `, index);
  //     console.log(`index in groqfullscreen: `, reAdjustedIndex);

  //     return () => {
  //       handleAvgPhotoColor(null);
  //     };
  //   }, [])
  // );

  // useEffect(() => {
  //   console.log("groqscreen color animation triggered");

  //   Animated.timing(fadeAnim, {
  //     toValue: avgPhotoColor ? 1 : 0,
  //     duration: 1000,
  //     useNativeDriver: false,
  //   }).start();
  // }, [avgPhotoColor]);

  return (
    <>
   

      <Animated.View
        style={[
          appContainerStyles.groqScrollFullScreenContainer,
          // themeStyles.darkerBackground,
          {
            borderColor: "transparent",
            // backgroundColor: avgPhotoColor
            //   ? avgPhotoColor
            //   : themeStyles.darkerBackground.backgroundColor,
            height: '100%',  
            opacity: opacity || 1,
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                themeStyles.primaryBackground.backgroundColor,
                avgPhotoColor ? avgPhotoColor : "transparent",
              ], // Color transition (white to tomato)
            }),
          },
        ]}
      >
        {!dataObject?.altImageSearchQuery && (
          <ComponentSpinner showSpinner={true} backgroundColor={themeStyles.primaryBackground.backgroundColor} />
        )}
        
        <View
          style={{
            flexDirection: "column",
            paddingVertical: 10,
            flex: 1,
            //  justifyContent: "flex-end",
          }}
        >
          
          {index && (
            <View
              style={{
                width: "100%",
                height: iNaturalistImageSize,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <INaturalistHeader
                index={reAdjustedIndex}
                item={null}
                topic={topic}
                base={base}
                onPress={() =>
                  console.log("Disable this empty onPress in GroqFullScreen")
                }
                height={"100%"}
                width={"100%"}
              />
            </View>
          )}

          {dataObject?.altImageSearchQuery && !index && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* just change the -Tray prefix to change hook to an unsplash image */}

              <View style={{ width: "16%", marginRight: 20 }}>
                <PexelsTray
                  queryString={dataObject?.altImageSearchQuery}
                  base={dataObject?.base || null}
                  photoNumber={1}
                />
              </View>
              <View style={{ width: "16%", marginRight: 20 }}>
                <PexelsTray
                  queryString={dataObject?.altImageSearchQuery}
                  base={dataObject?.base || null}
                  photoNumber={2}
                />
              </View>
              <View style={{ width: "16%", marginRight: 20 }}>
                <PexelsTray
                  queryString={dataObject?.altImageSearchQuery}
                  base={dataObject?.base || null}
                  photoNumber={3}
                />
              </View>
              <View style={{ width: "16%", marginRight: 20 }}>
                <PexelsTray
                  queryString={dataObject?.altImageSearchQuery}
                  base={dataObject?.base || null}
                  photoNumber={4}
                />
              </View>

              {/* {dataObject?.altImageSearchQuery && (
                    <View style={{ width: "16%", marginRight: 20 }}>
                      <SmithsonianTray
                        queryString={dataObject?.altImageSearchQuery}
                        base={dataObject?.base || null}
                        photoNumber={1}
                      />
                    </View>
                  )} */}
            </ScrollView>
          )} 

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 60,
              marginBottom: 10,
              justifyContent: "center",
            }}
          >
            <GoToItemButton
              onPress={() => goToCollect()}
              label={
                !collectInProgress
                  ? "Found a treasure here?"
                  : "Finish saving treasure"
              }
            />
          </View>
          {iNaturalist && wikiLink && (
            <View
              style={{
                height: 120,
                zIndex: 1000,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <WebView
                style={{ flex: 1 }}
                originWhitelist={["*"]}
                source={{
                  uri: wikiLink,
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="always"
                startInLoadingState={true}
                onError={(error) => console.error("WebView error:", error)}
                androidLayerType="hardware"
                forceDarkOn={true}
              />
            </View>
          )}
        {dataObject && dataObject?.textBody && (
          
          <View
            style={{
              height: wikiLink ? 200 : 350,
              
              width: "100%",
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
              padding: 10,
              marginTop: 10, 
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
      </Animated.View>
      
         
    </>
  );
};

export default GroqFullScreen;
