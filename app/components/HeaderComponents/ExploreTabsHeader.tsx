import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerToggleButton } from "@react-navigation/drawer";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";

import RefreshSocketButton from "../Scaffolding/RefreshSocketButton";
 

//IMPORTANT: these both depend on SurroundingsWSContext to render appropriately
import WebSocketCurrentLocation from "./WebSocketCurrentLocation";
//(This also needs currentSurroundings from CurrentSurroundingsContext)
import CountDowner from "./CountDowner"; //needs: lastLocationName
//lastLocationName is triggered by appState so there is no need to use appState in CountDowner!

//This is on homedashboard tabs as well as explore tabs
const ExploreTabsHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { sendMessage, lastLocationName, lastLocationAccessTime } =
    useSurroundingsWS();
  // const { isAuthenticated, appSettings } = useUser();
  // const colorScheme = useColorScheme();
  // const { searchIsActive } = useActiveSearch();

  // const [statusIconTheme, setStatusIconTheme] = useState("light");

  // const statusBarStyle = () => {
  //   if (appSettings.manual_dark_mode !== null) {
  //     return appSettings.manual_dark_mode ? "light" : "dark";
  //   }
  //   return colorScheme || "dark";
  // };

  // useEffect(() => {
  //   if (isAuthenticated && appSettings) {
  //     const theme = statusBarStyle();
  //     setStatusIconTheme(theme);
  //     console.log(theme);
  //   }
  // }, [appSettings]);

  useEffect(() => {
    console.log("exploretabheader rerendered");
  }, []);

  const handleRefreshDataFromSocket = () => {
    console.log("sending refresh message to socket");
    sendMessage({ action: "refresh" });
  };

  return (
    <>
      {/* {statusIconTheme && (
      
      <StatusBar
        style={statusIconTheme}
        translucent={true}
        backgroundColor="transparent"
      />
      
    )} */}
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
              <>
                <CountDowner />

                
                <View style={{ marginHorizontal: 6 }}>
                  <RefreshSocketButton />
                </View>
                <DrawerToggleButton tintColor={themeStyles.primaryText.color} />
              </>
            </View>
          </View> 
        </View>
      </SafeAreaView>
    </>
  );
};

export default ExploreTabsHeader;
