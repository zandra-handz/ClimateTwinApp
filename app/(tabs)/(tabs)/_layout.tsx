import { Tabs } from "expo-router";
import ExploreTabBar from '../../components/ExploreTabBar';
import TabHeader from "@/app/components/Header";

export default () => {
  return (
    <Tabs
    screenOptions={{
      header: () => <TabHeader   />
    }}
    tabBar={props=> <ExploreTabBar {...props} />}
    >

            <Tabs.Screen name="home" />
            <Tabs.Screen name="index" />
            <Tabs.Screen name="nearby"  />
        {/* Nested tabs inside home */}
        {/* {() => (
          // <Tabs>
          //   <Tabs.Screen name="homeMain" options={{ header: () => null }} />
          //   <Tabs.Screen name="homeDetails" options={{ header: () => null }} />
          // </Tabs>
        )} */} 

      {/* <Tabs.Screen name="friends" options={{ header: () => null }} />
      <Tabs.Screen name="inbox" options={{ header: () => null }} />
      <Tabs.Screen name="treasures" options={{ header: () => null }} /> */}
    </Tabs>
  );
};
