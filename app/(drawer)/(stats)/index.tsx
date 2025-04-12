import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 

import { useAppMessage } from "../../../src/context/AppMessageContext";
 
import useStats from "@/app/hooks/useStats";
import StatsView from "@/app/components/StatsComponents/StatsView";
 

import DataList from "../../components/Scaffolding/DataList"; 
  
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { stats } = useStats();
 
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Nearby location screen is focused");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused"); 
  //     };
  //   }, [])
  // );
 

const handlePress = () => {
  console.log('Stats handlePress pressed!');

};
 
 
  
  return (
    <>
      {/* <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      /> */}
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        
        {stats && <StatsView listData={stats} onCardButtonPress={handlePress} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
