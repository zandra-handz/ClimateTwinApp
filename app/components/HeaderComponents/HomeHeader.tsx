import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerToggleButton } from "@react-navigation/drawer"; 

import RefreshSocketButton from "../Scaffolding/RefreshSocketButton";

import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import ProgressBar from "../Scaffolding/ProgressBar";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import ProgressCircle from "../Scaffolding/ProgressCircle";
  
const HomeHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();  
  const { lastMessage } = useSurroundingsWS();
 

    useEffect(() => {
      console.log('homeheader rerendered');
  
    }, []);

    // useEffect(() => {
    //   console.log('LASTMESSAGE TRIGGERED IN HOME HEADER')

    // }, [lastMessage]);

  return (
    <> 
      <SafeAreaView style={[themeStyles.primaryBackground, { flex: 1 }]}>
        <View
          style={[
            appContainerStyles.headerContainer,
            themeStyles.primaryBackground,
          ]}
        >
          <View style={appContainerStyles.headerRow}>  

            <View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "flex-end" }}>
          
             <RefreshSocketButton />
               
              <DrawerToggleButton tintColor={themeStyles.primaryText.color} />
         
            </View> 
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeHeader;
