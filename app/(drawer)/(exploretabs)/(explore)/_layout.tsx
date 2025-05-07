import { Stack } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import ExploreTabsHeader from "@/app/components/HeaderComponents/ExploreTabsHeader";

export default () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="interact"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* <Stack.Screen
                    name="interact"
                    options={({ route }) => ({
                      headerShown: false,
                      headerTitle:
                        route.params?.topic && route.params?.name
                          ? `${route.params?.topic} in ${route.params?.name}`
                          : route.params?.topic || "Treasure",
                      // Using `title` from params, fallback to "Treasure"
                      headerTitleStyle: {
                        color: constantColorsStyles.v1LogoColor.color,
                      },
                      headerStyle: {
                        backgroundColor:
                          // avgPhotoColor ? avgPhotoColor :
                          constantColorsStyles.v1LogoColor.backgroundColor,
                      },
                      headerLeft: () => (
                        <TouchableOpacity
                          onPress={() => router.back()}
                          style={{ paddingLeft: 10, paddingRight: 10 }}
                        >
                          <AntDesign
                            name="exclamation"
                            size={appFontStyles.exploreTabBarIcon.width}
                            color={constantColorsStyles.v1LogoColor.color}
                          />
                        </TouchableOpacity>
                      ),
                      gestureEnabled: true,
                    })}
                  /> */}
      <Stack.Screen
        name="collect"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* <Stack.Screen
                    name="collect"
                    options={({ route }) => ({
                      headerShown: false,
                      headerTitle:
                        route.params?.topic && route.params?.name
                          ? `${route.params?.topic} in ${route.params?.name}`
                          : route.params?.topic || "Treasure",
                      // Using `title` from params, fallback to "Treasure"
                      headerTitleStyle: {
                        color: constantColorsStyles.v1LogoColor.color,
                      },
                      headerStyle: {
                        backgroundColor:
                          // avgPhotoColor ? avgPhotoColor :
                          constantColorsStyles.v1LogoColor.backgroundColor,
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
                  /> */}
    </Stack>
  );
};
