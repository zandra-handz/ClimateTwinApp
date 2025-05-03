import { Stack } from "expo-router";
import { useUser } from "../src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import ComponentSpinner from "./components/Scaffolding/ComponentSpinner";

export default function AppRoutes() {
  const { isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();

  if (settingsAreLoading) {
    return <ComponentSpinner spinnerSize={60} isInitializerSpinner />;
  }
// initialRouteName="index">
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated && !settingsAreLoading}>
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated || settingsAreLoading}>
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
      <Stack.Protected guard={!isAuthenticated || settingsAreLoading}>
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
