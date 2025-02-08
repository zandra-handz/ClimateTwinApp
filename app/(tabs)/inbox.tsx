import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../context/GlobalStylesContext"; 

import { useAppMessage } from "../context/AppMessageContext";
import useInbox from "../hooks/useInbox";

import { StatusBar } from "expo-status-bar";

import DataList from "../components/DataList";
import { useFocusEffect } from "expo-router";
  
const inbox = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { inboxItems } = useInbox();
 
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Nearby location screen is focused");
  //     triggerRefetch();
  //     return () => {
  //       console.log("nearby location screen is unfocused"); 
  //     };
  //   }, [])
  // );
 

const handleOpenInboxItem = () => {
  console.log('Inbox Item pressed!');

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
        
        {inboxItems && <DataList listData={inboxItems} onCardButtonPress={handleOpenInboxItem} />}
 
          </View>
      </View>
    </>
  );
};

export default inbox;
