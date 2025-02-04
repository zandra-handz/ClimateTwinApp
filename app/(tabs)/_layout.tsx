import { Tabs } from "expo-router";
import { Text } from 'react-native';
import { TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import PrimaryTabBar from '../components/PrimaryTabBar';
export default () => {

// export default function Layout() {
  return (
    <Tabs
      tabBar={props=> <PrimaryTabBar {...props} />}
      >
      {/* <TabSlot />
      <TabList style={{display: 'none'}}>
        <TabTrigger name="home" href="/(tabs)">
        <TabButton>
          <Text>home</Text>
          
          
        </TabButton>
        </TabTrigger>
        <TabTrigger name="friends" href="/friends">
          <Text>friends</Text>
        </TabTrigger>
        <TabTrigger name="inbox" href="/inbox">
          <Text>inbox</Text>
        </TabTrigger>
        <TabTrigger name="treasures" href="/treasures">
          <Text>treasures</Text>
        </TabTrigger>
      </TabList> */}


        <Tabs.Screen name="(tabs)" options={{ header: () => null }} />
    
      <Tabs.Screen name="friends" options={{ header: () => null }} />
      <Tabs.Screen name="inbox" options={{ header: () => null }} />
      <Tabs.Screen name="treasures" options={{ header: () => null }} />
    </Tabs>
  );
};
