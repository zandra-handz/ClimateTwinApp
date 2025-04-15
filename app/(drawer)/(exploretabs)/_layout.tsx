import { Tabs } from "expo-router";
import React, { useState } from 'react';
import ExploreTabBar from '../../components/ExploreTabsComponents/ExploreTabBar';
import CustomStatusBar from "../../components/CustomStatusBar";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
 


export default () => {
  const [ doubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);
 

  const openDoubleChecker = () => {
    setDoubleCheckerVisible(true);
  }
  
  return (
    <>
    <CustomStatusBar/> 
       {/* {pickNewSurroundingsMutation.isPending && (
        <ComponentSpinner showSpinner={true} spinnerSize={50} spinnerType={'circleFade'} backgroundColor={themeStyles.primaryBackground.backgroundColor}/>
      )} */}
  
    <Tabs 
    tabBar={props=> <ExploreTabBar {...props} openDoubleChecker={openDoubleChecker}  />}
    > 

            <Tabs.Screen name="home" />
            <Tabs.Screen name="index" />
            <Tabs.Screen name="nearby"  />  
    </Tabs>
    
    </>
  );
};
