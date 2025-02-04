import { Tabs } from "expo-router";
import ExploreTabBar from '../../components/ExploreTabBar';

export default () => {
  return (
    <Tabs
    tabBar={props=> <ExploreTabBar {...props} />}
    >

            <Tabs.Screen name="home" options={{ header: () => null }}/>
            <Tabs.Screen name="index" options={{ header: () => null }}/>
            <Tabs.Screen name="nearby" options={{ header: () => null }}>
        {/* Nested tabs inside home */}
        {/* {() => (
          // <Tabs>
          //   <Tabs.Screen name="homeMain" options={{ header: () => null }} />
          //   <Tabs.Screen name="homeDetails" options={{ header: () => null }} />
          // </Tabs>
        )} */}
      </Tabs.Screen>

      {/* <Tabs.Screen name="friends" options={{ header: () => null }} />
      <Tabs.Screen name="inbox" options={{ header: () => null }} />
      <Tabs.Screen name="treasures" options={{ header: () => null }} /> */}
    </Tabs>
  );
};
