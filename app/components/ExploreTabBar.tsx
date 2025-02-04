import { View } from "react-native";
import { useLinkBuilder } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
function ExploreTabBar({ state, descriptors, navigation }) {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
 
  const { buildHref } = useLinkBuilder();

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
      <Feather
        name="compass"
        size={appFontStyles.exploreTabBarIcon.width}
        color={themeStyles.exploreTabBarText.color}
        {...props}
      />
    ), 
  };

  return (
    <View
      style={[themeStyles.darkerBackground, appContainerStyles.exploreTabBarContainer]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        //added just to prevent expo adding routes per the video i am following, however i didn't see this in the first place
        //so expo may have already done something about this? vid is from 7 months ago
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
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

        return (
          <TouchableOpacity
            key={route.name}
            style={appContainerStyles.exploreTabBarButton}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
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
              ]}
            >
              {label === 'index' ? 'now' : label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default ExploreTabBar;
