import { useEffect, useRef, useState } from "react";
import { Alert, AppState, Platform } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import ComponentSpinner from "./components/Scaffolding/ComponentSpinner";

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
import { UserProvider } from "../src/context/UserContext";
import { DeviceLocationProvider } from "../src/context/DeviceLocationContext";
import { AppStateProvider } from "../src/context/AppStateContext";
import { CurrentSurroundingsProvider } from "../src/context/CurrentSurroundingsContext";
import { NearbyLocationsProvider } from "../src/context/NearbyLocationsContext";
import { ActiveSearchProvider } from "../src/context/ActiveSearchContext";
import { InteractiveElementsProvider } from "../src/context/InteractiveElementsContext";
import { GroqProvider } from "../src/context/GroqContext";
import { SurroundingsWSProvider } from "../src/context/SurroundingsWSContext";

import AppMessage from "./components/AppMessage";
import CustomStatusBar from "./components/CustomStatusBar";

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://b003b07ef14d51d700aac9ce83006d95@o4509079411752960.ingest.us.sentry.io/4509079412801536",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function Layout() {
  const queryClient = new QueryClient();

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
  

  // useEffect(() => {
  //   // hellofriendh had load fonts here

  //   const notificationSubscription =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       console.log("Notification received in foreground:", notification);
  //       Alert.alert(
  //         notification.request.content.title,
  //         notification.request.content.body
  //       );
  //     });
  //   return () => notificationSubscription.remove();
  // }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     )

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log("AppState", appState.current);
  //     //showAppMessage(true, null, 'Reinitializing user!');

  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  //useProtectedRoute is now what is navigating depending on user states
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppMessageContextProvider>
          <UserProvider>
            <DeviceLocationProvider>
              <AppStateProvider>
                <GlobalStylesProvider>
                  <AppMessage />
                  <CustomStatusBar />

                  <SurroundingsWSProvider>
                    <GroqProvider>
                      <CurrentSurroundingsProvider>
                      <ComponentSpinner spinnerSize={60}   isInitializerSpinner={true} />
                 
                        <ActiveSearchProvider>
                          <NearbyLocationsProvider>
                            <InteractiveElementsProvider>
                              <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen
                                  name="(drawer)"
                                  options={{
                                    headerShown: false,
                                    gestureEnabled: false,
                                  }}
                                />

                                <Stack.Screen
                                  name="index"
                                  options={{
                                    headerShown: false,
                                    headerTitle: "Welcome",
                                    headerStyle: {
                                      backgroundColor: "teal",
                                    },
                                    gestureEnabled: false,
                                  }}
                                />
                                <Stack.Screen
                                  name="signin"
                                  options={{
                                    headerShown: false,
                                    headerTitle: "Sign in",
                                    headerStyle: {
                                      backgroundColor: "teal",
                                    },
                                    gestureEnabled: false,
                                  }}
                                />
                              </Stack>
                            </InteractiveElementsProvider>
                          </NearbyLocationsProvider>
                        </ActiveSearchProvider>
                      </CurrentSurroundingsProvider>
                    </GroqProvider>
                  </SurroundingsWSProvider>
                </GlobalStylesProvider>
              </AppStateProvider>
            </DeviceLocationProvider>
          </UserProvider>
        </AppMessageContextProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
});
