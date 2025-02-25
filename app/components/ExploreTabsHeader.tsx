import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerToggleButton } from "@react-navigation/drawer";

import { useGlobalStyles } from "../context/GlobalStylesContext"; 


//IMPORTANT: these both depend on SurroundingsWSContext to render appropriately
import WebSocketCurrentLocation from "../components/WebSocketCurrentLocation";
//(This also needs currentSurroundings from CurrentSurroundingsContext)
import CountDowner from "../components/CountDowner"; //needs: lastLocationName
//lastLocationName is triggered by appState so there is no need to use appState in CountDowner!



const ExploreTabsHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();

  return (
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
  );
};

export default ExploreTabsHeader;
