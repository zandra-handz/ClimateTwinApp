import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Platform } from "react-native";
import { useFonts } from "expo-font"; 
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationNotifier from "./components/NotificationNotifier";

import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
// import SafeView from "./components/SafeView";
import ComponentSpinner from "./components/Scaffolding/ComponentSpinner";
import { enableScreens } from 'react-native-screens';
enableScreens(false); 

import * as MediaLibrary from "expo-media-library";
import {
  useShareIntentContext,
  ShareIntentProvider,
  ShareIntentModule,
  getScheme,
  getShareExtensionKey,
} from "expo-share-intent";

import { Stack } from "expo-router";

import { AppMessageContextProvider } from "../src/context/AppMessageContext";
import { GlobalStylesProvider } from "../src/context/GlobalStylesContext";
import {  UserProvider } from "../src/context/UserContext";
import { UserSettingsProvider } from "@/src/context/UserSettingsContext";


import { DeviceLocationProvider } from "../src/context/DeviceLocationContext";
import { AppStateProvider } from "../src/context/AppStateContext";
import { FriendsProvider } from "@/src/context/FriendsContext";
import { PendingRequestsProvider } from "@/src/context/PendingRequestsContext";
import { TreasuresProvider } from "@/src/context/TreasuresContext";
import { CurrentSurroundingsProvider } from "../src/context/CurrentSurroundingsContext";
import { NearbyLocationsProvider } from "../src/context/NearbyLocationsContext";
import { ActiveSearchProvider } from "../src/context/ActiveSearchContext";
import { InteractiveElementsProvider } from "../src/context/InteractiveElementsContext";
import { GroqProvider } from "../src/context/GroqContext";
import { SurroundingsWSProvider } from "../src/context/SurroundingsWSContext";
import AppRoutes from "./AppRoutes";

import AppMessage from "./components/AppMessage";
import CustomStatusBar from "./components/CustomStatusBar";

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://b003b07ef14d51d700aac9ce83006d95@o4509079411752960.ingest.us.sentry.io/4509079412801536",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function AppLayout() {
 // const queryClient = new QueryClient();
  const [queryClient] = useState(() => new QueryClient())
  const appState = useRef(AppState.currentState);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntentContext();

  useEffect(() => {
    let permissionsGranted = false;
    async function requestPermissions() {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          console.log("Media permissions granted!");
          permissionsGranted = true;
        } else {
          console.warn("Media permissions denied.");
          permissionsGranted = false;
        }
      } else {
        permissionsGranted = true;
      }
    }

    requestPermissions();
  }, [hasShareIntent, shareIntent]);


    const [fontsLoaded] = useFonts({
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    });


    SplashScreen.preventAutoHideAsync();

    
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

 



  //useProtectedRoute is now what is navigating depending on user states
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <AppMessageContextProvider>
            <UserProvider>
              <UserSettingsProvider>
              <DeviceLocationProvider>
                <GlobalStylesProvider>
                  <AppMessage />
                  <CustomStatusBar />
                  <SurroundingsWSProvider>
                    <PendingRequestsProvider>
                      <FriendsProvider>
                        <TreasuresProvider>
                          <GroqProvider>
                            <ActiveSearchProvider>
                              <CurrentSurroundingsProvider>
                                <ComponentSpinner
                                  spinnerSize={60}
                                  isInitializerSpinner={true}
                                />

                                <NearbyLocationsProvider>
                                  <InteractiveElementsProvider>
                                    <AppRoutes />
                               
                                  </InteractiveElementsProvider>
                                </NearbyLocationsProvider>
                              </CurrentSurroundingsProvider>
                            </ActiveSearchProvider>
                          </GroqProvider>
                        </TreasuresProvider>
                      </FriendsProvider>
                    </PendingRequestsProvider>
                  </SurroundingsWSProvider>
                </GlobalStylesProvider>
              </DeviceLocationProvider> 
              </UserSettingsProvider>
            </UserProvider>
          </AppMessageContextProvider>
        </AppStateProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
});
