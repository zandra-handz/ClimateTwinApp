import { Stack } from "expo-router";
import { useUser } from "../src/context/UserContext";
import ComponentSpinner from "./components/Scaffolding/ComponentSpinner";

export default function AppRoutes() {
  const { isAuthenticated, isInitializing } = useUser();

  if (isInitializing) {
    return <ComponentSpinner spinnerSize={60} isInitializerSpinner />;
  }
// initialRouteName="index">
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated && !isInitializing}>
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated || isInitializing}>
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
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated || isInitializing}>
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
      </Stack.Protected>
    </Stack>
  );
}
