import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExploreTabsHeader from "../components/HeaderComponents/ExploreTabsHeader";
import HomeHeader from "../components/HeaderComponents/HomeHeader";
import { useUser } from "@/src/context/UserContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import DrawerCustomizer from "../components/DrawerNavComponents/DrawerCustomizer";
// import SafeView from "../components/SafeView";
import * as Notifications from "expo-notifications";

import useExploreRoute from "../../src/hooks/useExploreRoute";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default () => {
  const { isAuthenticated, isInitializing } = useUser();

  const { lastState } = useSurroundingsWS();


  const isExploring : boolean = (lastState === 'exploring' || lastState === 'searching for ruins'
  );

  const isHome : boolean = (lastState === 'home' || lastState === 'searching for twin'
  );

  useExploreRoute(lastState, isAuthenticated, isInitializing);
  // export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <DrawerCustomizer {...props} />}>
        {/* <Drawer.Protected
          guard={isHome}
        > */}
          <Drawer.Screen
            name="(homedashboard)"
            options={{
              header: () => <HomeHeader />,
              drawerLabel: "Home",
              title: "home",
            }}
          />
        {/* </Drawer.Protected> */}
        <Drawer.Protected
          guard={isExploring}
        >
          <Drawer.Screen
            name="(exploretabs)"
            options={{
              header: () => <ExploreTabsHeader />,
              drawerLabel: "Explore",
              title: "explore",
            }}
          />
        </Drawer.Protected>
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
