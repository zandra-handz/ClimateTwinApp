import { Tabs } from "expo-router";
import React, { useState } from "react";
import ExploreTabBar from "../../components/ExploreTabsComponents/ExploreTabBar";
import CustomStatusBar from "../../components/CustomStatusBar";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
// import SafeView from "@/app/components/SafeView";

export default () => {
  const [doubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
const { themeStyles } = useGlobalStyles();
  const openDoubleChecker = () => {
    setDoubleCheckerVisible(true);
  };

  return (
    <>
      {/* <SafeView style={{flex: 1, backgroundColor: themeStyles.primaryBackground.backgroundColor}}> */}

      <Tabs
        screenOptions={{ 
         headerShown: false,  
          header: () => null, 
        }}
        tabBar={(props) => (
          <ExploreTabBar {...props} openDoubleChecker={openDoubleChecker} />
        )}
      >
        <Tabs.Screen name="home"   />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="nearby"  />
      </Tabs>
      {/* </SafeView> */}
    </>
  );
};
