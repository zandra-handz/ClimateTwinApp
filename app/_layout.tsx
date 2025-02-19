import { AppMessageContextProvider, useAppMessage } from "./context/AppMessageContext";
import { GlobalStylesProvider } from "./context/GlobalStylesContext";
import { UserProvider, useUser } from "./context/UserContext";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { AppStateProvider } from "./context/AppStateContext";
import { CurrentSurroundingsProvider } from "./context/CurrentSurroundingsContext";
import { NearbyLocationsProvider } from "./context/NearbyLocationsContext";
import { ActiveSearchProvider } from "./context/ActiveSearchContext";
import { InteractiveElementsProvider } from "./context/InteractiveElementsContext";
import { SurroundingsWSProvider } from "./context/SurroundingsWSContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { notifyManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router"; // Expo Router's Stack component
import TopLevelRouter from "./toprouter/TopLevelRouter"; // Import TopLevelRouter
import AppMessage from "./components/AppMessage";
import Header from "./components/Header";

export default function Layout() {
  const queryClient = new QueryClient();
  // const { user, reInitialize } = useUser(); 

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



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AppStateProvider>
            <GlobalStylesProvider>
              <AppMessageContextProvider>
                {/* Wrap Stack in TopLevelRouter to handle authentication checks */}
                <TopLevelRouter>
                  <AppMessage />
                  <ActiveSearchProvider>
                    <CurrentSurroundingsProvider>
                      <NearbyLocationsProvider>
                        <InteractiveElementsProvider>
                          <SurroundingsWSProvider>
                          <Stack screenOptions={{ headerShown: false }}>

                              {/* {user?.authenticated ? ( */}
                                
                              <Stack.Screen
                                name="(tabs)"
                                options={{
                                  headerShown: false, 
                                  gestureEnabled: false,
                                
                                }}
                              />

                              
                            {/* ) : (  */}
                              <>
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
                                  name="secondindex"
                                  options={{
                                    headerShown: false,
                                    headerTitle: "Welcome Again",
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
                              </>
                            {/* )} */}
                            </Stack>
                          </SurroundingsWSProvider>
                        </InteractiveElementsProvider>
                      </NearbyLocationsProvider>
                    </CurrentSurroundingsProvider>
                  </ActiveSearchProvider>
                </TopLevelRouter>
              </AppMessageContextProvider>
            </GlobalStylesProvider>
          </AppStateProvider>
        </UserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}