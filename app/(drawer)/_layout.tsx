import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExploreTabsHeader from "../components/HeaderComponents/ExploreTabsHeader";
import HomeHeader from "../components/HeaderComponents/HomeHeader";

import DrawerCustomizer from "../components/DrawerNavComponents/DrawerCustomizer";

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://b003b07ef14d51d700aac9ce83006d95@o4509079411752960.ingest.us.sentry.io/4509079412801536",
  enableInExpoDevelopment: true, // Set to true if using Expo Go
  debug: true, // Enable debugging logs
});


export default () => {
  // export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <DrawerCustomizer {...props} />}>
      <Drawer.Screen
          name="(homedashboard)"
          options={{
           header: () => <HomeHeader />,
            drawerLabel: "Home",
            title: "home",
          }}
        /> 

        <Drawer.Screen
          name="(exploretabs)"
          options={{
            header: () => <ExploreTabsHeader />,
            drawerLabel: "Explore",
            title: "explore",
          }}
        />  


        <Drawer.Screen
          name="(friends)"
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
          name="(history)"
          options={{ header: () => null, drawerLabel: "History" }}
        />
        <Drawer.Screen
          name="(stats)"
          options={{ header: () => null, drawerLabel: "Stats" }}
        />
                <Drawer.Screen
          name="(profile)"
          options={{ header: () => null, drawerLabel: "Profile" }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};
