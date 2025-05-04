import { Tabs } from "expo-router";
import { Text, TouchableOpacity } from "react-native"; 
import { GestureHandlerRootView } from "react-native-gesture-handler";  
import SafeView from "@/app/components/SafeView";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
 

import { Stack } from "expo-router";  

export default () => {
  const { themeStyles, constantColorsStyles, appFontStyles } =
    useGlobalStyles();
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <SafeView
        style={{
          flex: 1,
          backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
        }}
      > */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTitle: "Your travel history",
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
                    name="rewind"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={constantColorsStyles.v1LogoColor.color}
                  />
                </TouchableOpacity>
              ),
              gestureEnabled: true,
            }}
          />
        </Stack>
      {/* </SafeView> */}
    </GestureHandlerRootView>
  );
};
