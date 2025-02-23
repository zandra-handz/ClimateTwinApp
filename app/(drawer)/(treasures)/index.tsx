import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View, 
} from "react-native"; 
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 

import { useAppMessage } from "../../context/AppMessageContext";
import useTreasures from "../../hooks/useTreasures";

import { StatusBar } from "expo-status-bar";

import DataList from "../../components/DataList";
import { useFocusEffect } from "expo-router";

import ActionsFooter from "@/app/components/ActionsFooter";
  
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { treasures } = useTreasures();
  const router = useRouter();

const handlePress = () => {
    console.log('Treasure item pressed!');

};
 
 
const handleViewTreasure = (id, descriptor) => {
    if (id) {
        router.push({
            pathname: "(treasures)/[id]",
            params: { id: id, descriptor: descriptor},
        })
    }

}

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
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        
        {treasures && <DataList listData={treasures} onCardButtonPress={handlePress} onOpenTreasurePress={handleViewTreasure} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
