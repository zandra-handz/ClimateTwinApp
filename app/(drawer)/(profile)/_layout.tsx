import { Tabs } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

import { Stack } from "expo-router"; // Expo Router's Stack component

export default () => {
  const { themeStyles, constantColorsStyles, appFontStyles } =
    useGlobalStyles();
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTitle: "My account",
              headerTitleStyle: {
                color: constantColorsStyles.v1LogoColor.color,
              },
              headerStyle: {
                backgroundColor:
                  constantColorsStyles.v1LogoColor.backgroundColor,
              },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => console.log("icon is pressable!")}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                >
                  <Feather
                    name="users"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="upload"
            options={{
              headerShown: true,
              headerTitle: "Upload avatar",
              headerTitleStyle: {
                color: constantColorsStyles.v1LogoColor.color,
              },
              headerStyle: {
                backgroundColor:
                  constantColorsStyles.v1LogoColor.backgroundColor,
              },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => console.log("icon is pressable!")}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                >
                  <Feather
                    name="users"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />

          <Stack.Screen
            name="edit"
            options={{
              headerShown: true,
              headerTitle: "Edit bio",
              headerTitleStyle: {
                color: constantColorsStyles.v1LogoColor.color,
              },
              headerStyle: {
                backgroundColor:
                  constantColorsStyles.v1LogoColor.backgroundColor,
              },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => console.log("icon is pressable!")}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                >
                  <Feather
                    name="info"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />

          {/* <Stack.Screen
            name="[id]"
            options={({ route }) => ({
              headerShown: true,
              headerTitle: route.params?.friendName || "Profile",
              headerTitleStyle: {
                color: constantColorsStyles.v1LogoColor.color,
              },
              headerStyle: {
                backgroundColor:
                  constantColorsStyles.v1LogoColor.backgroundColor,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                >
                  <AntDesign
                    name="user"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            })}
          />

          <Stack.Screen
            name="search"
            options={{
              headerShown: true,
              headerTitle: "Search users",
              headerTitleStyle: {
                color: constantColorsStyles.v1LogoColor.color,
              },
              headerStyle: {
                backgroundColor:
                  constantColorsStyles.v1LogoColor.backgroundColor,
              },

              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => console.log("icon is pressable!")}
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                >
                  <Feather
                    name="search"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          /> */}
        </Stack>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
