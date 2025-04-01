import { Animated, View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import GroqImageCard from "./GroqImageCard";
import GoToItemButton from "../GoToItemButton";
import PexelsTray from "../PexelsComponents/PexelsTray";
import UnsplashTray from "../UnsplashComponents/UnsplashTray";
import SmithsonianTray from "../SmithsonianComponents/SmithsonianTray";

import INaturalistTray from "../INaturalistComponents/iNaturalistTray";
import { WebView } from "react-native-webview";
import useINaturalist from "@/app/hooks/useINaturalist";

import ComponentSpinner from "../Scaffolding/ComponentSpinner";
import { useFocusEffect } from "expo-router";

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
  const iNaturalistImageSize = 350;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [ wiki, setWiki ] = useState(null);

  const reAdjustedIndex = index ? index - 1 : null;

  

  const wikiLink = iNaturalist.results[reAdjustedIndex]?.taxon?.wikipedia_url
    ? iNaturalist.results[reAdjustedIndex].taxon.wikipedia_url.replace(/^http:/, "https:")
    : null;

  console.log(wikiLink);

  useFocusEffect(
    React.useCallback(() => {
      handleAvgPhotoColor(null);
      console.log(`index in groqfullscreen: `, index);
      console.log(`index in groqfullscreen: `, reAdjustedIndex);

      return () => {
        handleAvgPhotoColor(null);
      };
    }, [])
  );

  useEffect(() => {
    console.log("groqscreen color animation triggered");

    Animated.timing(fadeAnim, {
      toValue: avgPhotoColor ? 1 : 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [avgPhotoColor]);

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
            height: 700,
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
          <ComponentSpinner showSpinner={true} />
        )}
        <View
          style={{
            flexDirection: "column",
            paddingVertical: 8,
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
              }}
            >
              <INaturalistTray
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

          {/* 
                {images && !pexelImages && (

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

          <View
            style={{
              height: images[0] ? "44%" : "34%",
              width: "100%",
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
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
        </View>
      </Animated.View>
    </>
  );
};

export default GroqFullScreen;
