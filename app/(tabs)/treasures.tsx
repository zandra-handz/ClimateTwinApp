import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  AppState,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useGlobalStyles } from "../context/GlobalStylesContext"; 

import { useAppMessage } from "../context/AppMessageContext";
import { useNearbyLocations } from "../context/NearbyLocationsContext";

import { StatusBar } from "expo-status-bar";

import DataList from "../components/DataList";
import { useFocusEffect } from "expo-router";
 

import { useInteractiveElements } from "../context/InteractiveElementsContext";

const treasures = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const {  itemChoices } = useInteractiveElements();
 
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Nearby location screen is focused");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused"); 
  //     };
  //   }, [])
  // );
 



  //wtf

  // backend is so confused on this lol, you need to submit {'explore_location' : [location id]} if data.explore_type is discovery_location
  // else you need to submit {'twin_location' : [the same id]}
  // WHY DID PAST ME DO THIS
  // I believe it has to add more data to twin locations. 
  // originally, twin location couldn't be an explore location (?)
//this will move to the surroundings context so that i can control behaviors based on mutations
  const handleFindTreasure = (data) => {
    console.log('handlefind treasure pressed!', data);
  
    // if (data && data.explore_type) {
    //   const locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
  
    //   exploreLocation({ [locationType]: data.id }); 
    //   refreshSurroundingsManually();
    // }
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
        
        {itemChoices && <DataList listData={itemChoices} onCardButtonPress={handleFindTreasure} />}
 
          </View>
      </View>
    </>
  );
};

export default treasures;
