import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerToggleButton } from "@react-navigation/drawer"; 

import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
  
const HomeHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();  
 

    useEffect(() => {
      console.log('exploretabheader rerendered');
  
    }, []);

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
          
             
               
              <DrawerToggleButton tintColor={themeStyles.primaryText.color} />
         
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeHeader;
