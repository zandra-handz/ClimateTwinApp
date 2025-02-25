import { Tabs } from "expo-router";
import ExploreTabBar from '../../components/ExploreTabBar';
 

export default () => {
  return (
    <Tabs 
    tabBar={props=> <ExploreTabBar {...props} />}
    >

            <Tabs.Screen name="home" />
            <Tabs.Screen name="index" />
            <Tabs.Screen name="nearby"  />  
    </Tabs>
  );
};
