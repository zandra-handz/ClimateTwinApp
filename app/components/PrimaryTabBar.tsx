import { View  } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text,  TouchableOpacity } from 'react-native';
import { useGlobalStyles } from '../context/GlobalStylesContext'; 
import { AntDesign, Feather } from '@expo/vector-icons';
function PrimaryTabBar({ state, descriptors, navigation }) {
    

    
    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const icons = {
    tabs: (props) => <AntDesign name="home" size={appFontStyles.tabBarIcon.width} color={themeStyles.tabBarText.color} {...props}/>,
    friends: (props) => <Feather name="users" size={appFontStyles.tabBarIcon.width} color={themeStyles.tabBarText.color} {...props}/>,
    inbox: (props) => <AntDesign name="mail" size={appFontStyles.tabBarIcon.width} color={themeStyles.tabBarText.color} {...props}/>,
    treasures: (props) => <AntDesign name="gift" size={appFontStyles.tabBarIcon.width} color={themeStyles.tabBarText.color} {...props}/>,


};

  return (
    <View style={[themeStyles.darkerBackground, appContainerStyles.tabBarContainer]}>
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
        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
          key={route.name}
          style={appContainerStyles.tabBarButton}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress} 
          >
{
  icons[route.name]
    ? icons[route.name]({
        color: isFocused ? themeStyles.tabBarHighlightedText.color : themeStyles.tabBarText.color
      })
    : null
}


            <Text style={[ appFontStyles.tabBarText, { color: isFocused ? themeStyles.tabBarHighlightedText.color : themeStyles.tabBarText.color}]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
 

export default PrimaryTabBar