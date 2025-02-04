import { AppMessageContextProvider } from "./context/AppMessageContext";
import { GlobalStylesProvider } from "./context/GlobalStylesContext";
import { UserProvider } from "./context/UserContext";

import { CurrentSurroundingsProvider } from "./context/CurrentSurroundingsContext";
import { MatchedLocationProvider } from "./context/MatchedLocationContext";
import { NearbyLocationsProvider } from "./context/NearbyLocationsContext";
import { ActiveSearchProvider } from "./context/ActiveSearchContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router"; // Expo Router's Stack component
import TopLevelRouter from "./toprouter/TopLevelRouter"; // Import TopLevelRouter
import AppMessage from "./components/AppMessage";
import Header from "./components/Header";


export default function Layout() {
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GlobalStylesProvider>
            <AppMessageContextProvider>
              {/* Wrap Stack in TopLevelRouter to handle authentication checks */}
              <TopLevelRouter>
                <AppMessage />
                <MatchedLocationProvider>
                  <CurrentSurroundingsProvider>
                    <NearbyLocationsProvider>
                      <ActiveSearchProvider>
                        <Stack>
                          <Stack.Screen
                            name="index"
                            options={{
                              headerShown: false,
                              headerTitle: "Welcome",
                              headerStyle: {
                                backgroundColor: "teal",
                              },
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
                            }}
                          />
                          <Stack.Screen
                            name="(tabs)"
                            options={{
                              header: () => <Header />
                             }}
                          />
                        </Stack>
                      </ActiveSearchProvider>
                    </NearbyLocationsProvider>
                  </CurrentSurroundingsProvider>
                </MatchedLocationProvider>
              </TopLevelRouter>
            </AppMessageContextProvider>
          </GlobalStylesProvider>
        </UserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
