import React, { useState, useCallback, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";

import { useAppMessage } from "../../context/AppMessageContext";
 

import { StatusBar } from "expo-status-bar";
import { useActiveSearch } from "../../context/ActiveSearchContext";

import DataList from "../../components/DataList";
import HomeSurroundingsView from "@/app/components/HomeSurroundingsView";
import { useFocusEffect } from "expo-router";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";

const home = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { homeSurroundings } = useSurroundings();
  const { searchIsActive } = useActiveSearch(); 

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Nearby location screen is focused");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused");
  //     };r
  //   }, [])
  // );

  const handlePress = () => {
    console.log("handlePress in launchpad pressed!");
  };

  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 90 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {homeSurroundings && !searchIsActive && (
            <HomeSurroundingsView /> 
          )}
        </View>
      </View>
    </>
  );
};

export default home;
