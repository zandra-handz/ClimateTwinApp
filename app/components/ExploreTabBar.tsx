import { View } from "react-native";
import { useLinkBuilder } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import NearbyButton from "./NearbyButton";
import { useActiveSearch } from "../context/ActiveSearchContext";

function ExploreTabBar({ state, descriptors, navigation, isNearbyDisabled }) {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { buildHref } = useLinkBuilder();
  const { exploreLocationsAreReady } = useActiveSearch();

  const icons = {
    index: (props) => (
      <MaterialIcons
        name="my-location"
        size={appFontStyles.exploreTabBarIcon.width}
        color={themeStyles.exploreTabBarText.color}
        {...props}
      />
    ),
    home: (props) => (
      <AntDesign
        name="home"
        size={appFontStyles.exploreTabBarIcon.width}
        color={themeStyles.exploreTabBarText.color}
        {...props}
      />
    ),
    nearby: (props) => (
      <NearbyButton 
        color={props.color} 
      />
    ),
  };

  return (
    <View style={[themeStyles.darkerBackground, appContainerStyles.exploreTabBarContainer]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'nearby' && !exploreLocationsAreReady) return; // Prevent navigation if disabled

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Check if this is the "nearby" tab and apply the disabled condition
        const isNearbyTab = route.name === "nearby";
        const disabled = isNearbyTab && isNearbyDisabled;

        return (
          <TouchableOpacity
            key={route.name}
            style={[
              appContainerStyles.exploreTabBarButton,
              disabled && { opacity: 0.5 }, // Change opacity for disabled state
            ]}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={disabled} // Disable touch event if the tab is disabled
          >
            {icons[route.name]
              ? icons[route.name]({
                  color: isFocused
                    ? themeStyles.exploreTabBarHighlightedText.color
                    : themeStyles.exploreTabBarText.color,
                })
              : null}

            <Text
              style={[
                appFontStyles.exploreTabBarText,
                {
                  color: isFocused
                    ? themeStyles.exploreTabBarHighlightedText.color
                    : themeStyles.exploreTabBarText.color,
                },
                route.name === "nearby" && { opacity: exploreLocationsAreReady ? 1 : 0 },
                disabled && { color: themeStyles.exploreTabBarText.color, opacity: 0.5 }, // Modify text color for disabled
              ]}
            >
              {label === "index" ? "now" : label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default ExploreTabBar;
