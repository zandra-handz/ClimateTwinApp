import { AppMessageContextProvider } from "./context/AppMessageContext";
import { GlobalStylesProvider } from "./context/GlobalStylesContext";
import { UserProvider } from "./context/UserContext";
import { useRef, useState } from "react";
import { AppState } from "react-native";
import { AppStateProvider } from "./context/AppStateContext";
import { CurrentSurroundingsProvider } from "./context/CurrentSurroundingsContext";
import { NearbyLocationsProvider } from "./context/NearbyLocationsContext";
import { ActiveSearchProvider } from "./context/ActiveSearchContext";
import { InteractiveElementsProvider } from "./context/InteractiveElementsContext";
import { SurroundingsWSProvider } from "./context/SurroundingsWSContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import AppMessage from "./components/AppMessage";
import CustomStatusBar from "./components/CustomStatusBar";

export default function Layout() {
  const queryClient = new QueryClient();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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
                <ActiveSearchProvider>
                <SurroundingsWSProvider>
                  <CurrentSurroundingsProvider>
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
                  </CurrentSurroundingsProvider>
                  </SurroundingsWSProvider>
                </ActiveSearchProvider>
              </GlobalStylesProvider>
            </AppStateProvider>
          </UserProvider>
        </AppMessageContextProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
