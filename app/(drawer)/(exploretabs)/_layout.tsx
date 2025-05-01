import { Tabs } from "expo-router";
import React, { useState } from 'react';
import ExploreTabBar from '../../components/ExploreTabsComponents/ExploreTabBar';
import CustomStatusBar from "../../components/CustomStatusBar"; 
 


export default () => {
  const [ doubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);
 

  const openDoubleChecker = () => {
    setDoubleCheckerVisible(true);
  }
  
  return (
    <>
    <CustomStatusBar/>  
  
    <Tabs 
      screenOptions={{
        animationEnabled: true, // Enables crossfade/slide animation
      }}
    tabBar={props=> <ExploreTabBar {...props} openDoubleChecker={openDoubleChecker}  />}
    > 

            <Tabs.Screen name="home" />
            <Tabs.Screen name="index" />
            <Tabs.Screen name="nearby"  />  
    </Tabs>
    
    </>
  );
};
