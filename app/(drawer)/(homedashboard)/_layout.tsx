import { Tabs } from "expo-router";
import ExploreTabBar from '../../components/ExploreTabsComponents/ExploreTabBar'; 



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
