
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

import * as MediaLibrary from "expo-media-library";
import {
  useShareIntentContext,
  ShareIntentProvider,
  ShareIntentModule,
  getScheme,
  getShareExtensionKey,
} from "expo-share-intent";

import { Stack } from "expo-router";

import { AppMessageContextProvider } from "./context/AppMessageContext";
import { GlobalStylesProvider } from "./context/GlobalStylesContext";
import { UserProvider } from "./context/UserContext";
import { AppStateProvider } from "./context/AppStateContext";
import { CurrentSurroundingsProvider } from "./context/CurrentSurroundingsContext";
import { NearbyLocationsProvider } from "./context/NearbyLocationsContext";
import { ActiveSearchProvider } from "./context/ActiveSearchContext";
import { InteractiveElementsProvider } from "./context/InteractiveElementsContext";
import { GroqProvider } from "./context/GroqContext";
import { SurroundingsWSProvider } from "./context/SurroundingsWSContext";


import AppMessage from "./components/AppMessage";
import CustomStatusBar from "./components/CustomStatusBar";

export default function Layout() {
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
            <AppStateProvider>
              <GlobalStylesProvider>
                <AppMessage />
                <CustomStatusBar />

                <SurroundingsWSProvider>
                  <GroqProvider>
                    <CurrentSurroundingsProvider>
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
          </UserProvider>
        </AppMessageContextProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
