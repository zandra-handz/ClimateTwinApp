import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useColorScheme } from "react-native";
import { useUser } from "../context/UserContext";

//IMPORTANT: these both depend on SurroundingsWSContext to render appropriately
import WebSocketCurrentLocation from "../components/WebSocketCurrentLocation";
//(This also needs currentSurroundings from CurrentSurroundingsContext)
import CountDowner from "../components/CountDowner"; //needs: lastLocationName
//lastLocationName is triggered by appState so there is no need to use appState in CountDowner!

const ExploreTabsHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { isAuthenticated, appSettings } = useUser();
  const colorScheme = useColorScheme();

  const [statusIconTheme, setStatusIconTheme] = useState('light');

  const statusBarStyle = () => { 
        if (appSettings.manual_dark_mode !== null) { 
          return appSettings.manual_dark_mode ? "light" : "dark";
        }
        return colorScheme || "dark";
      };  

  useEffect(() => {
    if (isAuthenticated && appSettings) {
      const theme = statusBarStyle();
      setStatusIconTheme(theme);
      console.log(theme);
    }

  }, [appSettings]);

  return (
    <>
    {statusIconTheme && (
      
      <StatusBar
        style={statusIconTheme}
        translucent={true}
        backgroundColor="transparent"
      />
      
    )}
      <SafeAreaView style={[themeStyles.primaryBackground, { flex: 1 }]}>
        <View
          style={[
            appContainerStyles.headerContainer,
            themeStyles.primaryBackground,
          ]}
        >
          <View style={appContainerStyles.headerRow}>
            <WebSocketCurrentLocation />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CountDowner />
              <DrawerToggleButton tintColor={themeStyles.primaryText.color} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ExploreTabsHeader;
