import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
const Header = () => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { user } = useUser();

  return (
    <SafeAreaView style={[themeStyles.primaryBackground, {flex: 1}]}>
      <View
        style={[
          appContainerStyles.headerContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <View>
          {user && user.user && user.user.username && (
            <Text
              style={[
                appFontStyles.headerText,
                themeStyles.primaryText,
              ]}
            >{`Welcome back, ${user.user.username}!`}</Text>
          )}
        </View>
        <View>
          <Text style={themeStyles.primaryText}>' '</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
