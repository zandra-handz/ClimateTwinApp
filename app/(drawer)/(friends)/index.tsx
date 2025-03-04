import React from "react";
import { 
  View, 
} from "react-native"; 
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 

import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";

import { StatusBar } from "expo-status-bar";

import DataList from "../../components/Scaffolding/DataList";
import { useFocusEffect } from "expo-router";
  
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  const { showAppMessage } = useAppMessage();
  const { friends } = useFriends();
 
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
  console.log('Friend handlePress pressed!');

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
        
        {friends && <DataList listData={friends} onCardButtonPress={handlePress} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
