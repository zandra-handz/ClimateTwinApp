import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useUser } from "../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import WebSocketCurrentLocation from "../components/WebSocketCurrentLocation";

import SignoutSvg from "../assets/svgs/signout.svg";

import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";

import { DrawerToggleButton } from "@react-navigation/drawer";

const ExploreTabsHeader = () => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { user, onSignOut } = useUser();

  const handleSignOut = () => {
    onSignOut();
  };

  return (
    <SafeAreaView style={[themeStyles.primaryBackground, { flex: 1 }]}>
      <View
        style={[
          appContainerStyles.headerContainer,
          themeStyles.primaryBackground,
        ]}
      >
        {/* <View style={{position: 'absolute', top: 100}}>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View> */}

        <View style={appContainerStyles.headerRow}>
          {/* <View>
          {user && user.user && user.user.username && (
            <Text
              style={[
                appFontStyles.headerText,
                themeStyles.primaryText,
              ]}
            >{`Welcome back, ${user.user.username}!`}</Text>
          )}
        </View>  */}

        {/* </View> */}
        {/* <View
          style={{
            zIndex: 30000,
            justifyContent: "flex-end",
            flexDirection: "row",
            paddingHorizontal: 20,
            alignItems: "center",
            top: -30,
            width: "100%",
          }}
        > */}
          <WebSocketCurrentLocation />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => handleSignOut()} style={[appContainerStyles.signOutButtonContainer, themeStyles.darkerBackground]}
            ><Text style={[appFontStyles.signOutText, themeStyles.primaryText]}>Sign out</Text></TouchableOpacity>
          {/* <SignoutSvg
            onPress={() => handleSignOut()}
            width={22}
            height={22}
            color={themeStyles.primaryText.color}
          /> */}
          <DrawerToggleButton tintColor={themeStyles.primaryText.color} />
       
       
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExploreTabsHeader;
