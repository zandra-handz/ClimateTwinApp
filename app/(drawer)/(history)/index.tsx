import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 

import { useAppMessage } from "../../context/AppMessageContext";
import useHistory from "../../hooks/useHistory";

import { StatusBar } from "expo-status-bar";

import DataList from "../../components/DataList"; 
  
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { history } = useHistory();
 
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
  console.log('History handlePress pressed!');

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
          { paddingTop: 90 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        
        {history && <DataList listData={history} onCardButtonPress={handlePress} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
