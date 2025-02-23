import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../context/GlobalStylesContext"; 

import { useAppMessage } from "../context/AppMessageContext";
import useTreasures from "../hooks/useTreasures";

import { StatusBar } from "expo-status-bar";

import DataList from "../components/DataList";
import { useFocusEffect } from "expo-router";
  
const treasures = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { treasures } = useTreasures();
 
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Nearby location screen is focused");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused"); 
  //     };
  //   }, [])
  // );
 

const handleGiveTreasure = () => {
  console.log('handleGiveTreasure pressed!');

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
        
        {treasures && <DataList listData={treasures} onCardButtonPress={handleGiveTreasure} />}
 
          </View>
      </View>
    </>
  );
};

export default treasures;
