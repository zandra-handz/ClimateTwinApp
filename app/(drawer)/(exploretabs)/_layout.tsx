import { Tabs } from "expo-router";
import React, { useState } from "react";
import ExploreTabBar from "../../components/ExploreTabsComponents/ExploreTabBar";
 
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import SafeView from "@/app/components/SafeView"; 
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import { useSegments } from "expo-router";

export default () => {
  const [doubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
const { themeStyles } = useGlobalStyles();
const segments = useSegments();
  const openDoubleChecker = () => {
    setDoubleCheckerVisible(true);
  };
 

  const isOnInteractOrCollectScreen = ((segments[segments.length - 1] === 'interact') || (segments[segments.length - 1] === 'collect'));

  

  return (
    <>
      <SafeView style={{flex: 1, backgroundColor: themeStyles.primaryBackground.backgroundColor}}>
      <ComponentSpinner
        backgroundColor={themeStyles.primaryBackground.backgroundColor}
        spinnerType={"pulse"}
        isInitAndSocketSpinner={true}
      /> 
      <Tabs
       initialRouteName="(explore)"
        screenOptions={{ 
         headerShown: false,  
          header: () => null, 
        }}
        tabBar={(props) => (
          <ExploreTabBar {...props}   backButtonMode={isOnInteractOrCollectScreen} />
        )}
      >
        
        <Tabs.Screen name="home"   />
        <Tabs.Screen name="(explore)" />
        <Tabs.Screen name="nearby"  />
      </Tabs>
   
      </SafeView>
    </>
  );
};
