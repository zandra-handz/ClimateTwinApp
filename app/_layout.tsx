// _layout.tsx
import { AppMessageContextProvider } from "./context/AppMessageContext"; // Adjust the path as needed
import { GlobalStylesProvider } from "./context/GlobalStylesContext";
import { UserProvider } from "./context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";



export default function Layout() {
  const queryClient = new QueryClient();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GlobalStylesProvider>
            <AppMessageContextProvider> 
              <Stack>
              <Stack.Screen
              name='index'
              options={{
                headerShown: false,
                headerTitle: 'Sign in',
                headerStyle: {
                  backgroundColor: 'teal',
                }
              }}
              /> 
              <Stack.Screen
              name='home'
              options={{
                headerShown: false,
                headerTitle: 'Home',
                headerStyle: {
                  backgroundColor: 'teal',
                }
              }}
              />
              </Stack>

            </AppMessageContextProvider>
          </GlobalStylesProvider>
        </UserProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
