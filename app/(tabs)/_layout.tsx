import { Tabs } from "expo-router";
import { Text } from 'react-native';
import { TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Drawer } from 'expo-router/drawer';
import PrimaryTabBar from '../components/PrimaryTabBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabHeader from "../components/TabHeader";

export default () => {

// export default function Layout() {
  return (
    // <Tabs
    //   tabBar={props=> <PrimaryTabBar {...props} />}
    //   >
<GestureHandlerRootView style={{ flex: 1 }}>
  
    <Drawer>
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


      {/* //   <Tabs.Screen name="(tabs)" options={{ header: () => null }} />
    
      // <Tabs.Screen name="friends" options={{ header: () => null }} />
      // <Tabs.Screen name="inbox" options={{ header: () => null }} />
      // <Tabs.Screen name="treasures" options={{ header: () => null }} /> */}


      <Drawer.Screen name="(tabs)" options={{ header: () => <TabHeader />, drawerLabel: 'Explore', title: 'home' }} />
    
      <Drawer.Screen name="friends" options={{ header: () => null,drawerLabel: 'Friends' }} />
      <Drawer.Screen name="inbox" options={{ header: () => null, drawerLabel: 'Inbox' }} />
      <Drawer.Screen name="treasures" options={{ header: () => null, drawerLabel: 'Treasures' }} />
    </Drawer>
    
</GestureHandlerRootView>
  );
};
