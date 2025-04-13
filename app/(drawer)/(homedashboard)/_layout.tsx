import { Tabs } from "expo-router";
import ExploreTabBar from '../../components/ExploreTabsComponents/ExploreTabBar';
import CustomStatusBar from "../../components/CustomStatusBar";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";

export default () => {
  return (
    <>
    {/* <CustomStatusBar/> */}
  
  
    <Tabs 
    tabBar={props=> <ExploreTabBar {...props} />}
    > 
 
            <Tabs.Screen name="index" /> 
    </Tabs>
    
    </>
  );
};
