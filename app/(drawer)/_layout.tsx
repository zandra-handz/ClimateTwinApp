import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExploreTabsHeader from "../components/ExploreTabsHeader";

import DrawerCustomizer from "../components/DrawerCustomizer";

export default () => {
  // export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <DrawerCustomizer {...props} />}>
        <Drawer.Screen
          name="(exploretabs)"
          options={{
            header: () => <ExploreTabsHeader />,
            drawerLabel: "Explore",
            title: "home",
          }}
        />

        <Drawer.Screen
          name="friends"
          options={{ header: () => null, drawerLabel: "Friends" }}
        />
        <Drawer.Screen
          name="(inbox)"
          options={{ header: () => null, drawerLabel: "Inbox" }}
        />
        <Drawer.Screen
          name="(treasures)"
          options={{ header: () => null, drawerLabel: "Treasures" }}
        />
        <Drawer.Screen
          name="history"
          options={{ header: () => null, drawerLabel: "History" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};
