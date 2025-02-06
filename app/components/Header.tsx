import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import WebSocketCurrentLocation from "../components/WebSocketCurrentLocation"; 

import SignoutSvg from "../assets/svgs/signout.svg";


const Header = ({appIsInForeground}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { user, onSignOut } = useUser(); 

  const handleSignOut = () => {
    onSignOut(); 
  };

  return (
    <SafeAreaView style={[themeStyles.primaryBackground, {flex: 1}]}>
      <View
        style={[
          appContainerStyles.headerContainer,
          themeStyles.primaryBackground,
        ]}
      >
              <View
        style={appContainerStyles.headerRow}
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
          <SignoutSvg
            onPress={() => handleSignOut()}
            width={30}
            height={30}
            color={themeStyles.primaryText.color}
          /> 
        </View> 

        <WebSocketCurrentLocation 
            //  token={token}
                reconnectSocket={appIsInForeground} 
              />
               
      </View>
    </SafeAreaView>
  );
};

export default Header;
