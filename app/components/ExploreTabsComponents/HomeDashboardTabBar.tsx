import { View } from "react-native";
import React from "react";
import { useLinkBuilder } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { AntDesign } from "@expo/vector-icons";
import NearbyButton from "./NearbyButton";
import NowButton from "./NowButton"; 
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import SafeView from "../SafeView";


function HomeDashboardTabBar({ state, descriptors, navigation, isNearbyDisabled }) {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { buildHref } = useLinkBuilder(); 
  const { lastState } = useSurroundingsWS();

  const icons = {
    index: (props) => <NowButton color={props.color} lastState={lastState}  />,
    home: (props) => (
      <AntDesign
        name="home"
        size={appFontStyles.exploreTabBarIcon.width}
        color={themeStyles.exploreTabBarText.color}
        {...props}
      />
    ),
    nearby: (props) => <NearbyButton color={props.color} lastState={lastState} />,
  };

  return (
    <>
      <View
        style={[
          themeStyles.darkerBackground,
          appContainerStyles.exploreTabBarContainer,
          { borderColor: "teal",  height: 70, marginTop: 11 },
        ]}
      >
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
            if (route.name === "nearby" && lastState === "searching for ruins")
              return; // Prevent navigation if disabled

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

          const isNearbyTab = route.name === "nearby";
          const disabled = isNearbyTab && isNearbyDisabled;

          return (
            <TouchableOpacity
              key={route.name}
              style={[
                appContainerStyles.exploreTabBarButton,
                disabled && { opacity: 0.5 }, 
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
                  (route.name === "nearby" || route.name === "home") && {
                    opacity: lastState !== "searching for ruins" ? 1 : 0,
                  },
                  route.name === "index" && {
                    opacity: lastState !== "searching for twin" ? 1 : 0,
                  },
                  disabled && {
                    color: themeStyles.exploreTabBarText.color,
                    opacity: 0.5,
                  },  
                ]}
              >
                {label === "index" ? "now" : label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

export default HomeDashboardTabBar;