import { Tabs } from "expo-router";
import { Text, TouchableOpacity } from "react-native"; 
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";

import { useFriends } from '../../context/FriendsContext';

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
              headerTitle: "Treasures",
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
                  <AntDesign
                    name="gift"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />
<Stack.Screen
  name="[id]"
  options={({ route }) => ({
    headerShown: true,
    headerTitle: route.params?.descriptor || "Treasure", // Using `title` from params, fallback to "Treasure"
    headerTitleStyle: {
      color: constantColorsStyles.v1LogoColor.color,
    },
    headerStyle: {
      backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
    },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ paddingLeft: 10, paddingRight: 10 }}
      >
        <AntDesign
          name="gift"
          size={appFontStyles.exploreTabBarIcon.width}
          color={constantColorsStyles.v1LogoColor.color}
        />
      </TouchableOpacity>
    ),
    gestureEnabled: true,
  })}
/>

                      <Stack.Screen
            name="give"
            options={({ route }) => ({
              headerShown: true,
              headerTitle: route.params?.descriptor ? `Give ${route.params.descriptor}` : "Give treasure",

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
                  <MaterialIcons
                    name="add"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            })}
          />
        </Stack>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
