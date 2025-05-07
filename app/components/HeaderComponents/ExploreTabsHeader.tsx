import React from "react";
import { View } from "react-native"; 
import SafeView from "../SafeView";
import { DrawerToggleButton } from "@react-navigation/drawer";

import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext";

import RefreshSocketButton from "../Scaffolding/RefreshSocketButton";
 import { useSegments } from "expo-router";

//IMPORTANT: these both depend on SurroundingsWSContext to render appropriately
import WebSocketCurrentLocation from "./WebSocketCurrentLocation";
//(This also needs currentSurroundings from CurrentSurroundingsContext)
import CountDowner from "./CountDowner"; //needs: lastLocationName
//lastLocationName is triggered by appState so there is no need to use appState in CountDowner!

//This is on homedashboard tabs as well as explore tabs
const ExploreTabsHeader = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const segments = useSegments();
  const { sendMessage } =
    useSurroundingsWS(); 

 

    const isOnInteractOrCollectScreen = ((segments[segments.length - 1] === 'interact') || (segments[segments.length - 1] === 'collect'));
  

  return (
    <> 
    {!isOnInteractOrCollectScreen && (

      <SafeView style={[themeStyles.primaryBackground, { flex: 1 }]}>
        <View
          style={[
            appContainerStyles.headerContainer,
            themeStyles.primaryBackground, 
          ]}
        >
          <View style={appContainerStyles.headerRow}>
            
            <WebSocketCurrentLocation />

            <View style={{ flexDirection: "row", alignItems: "center", height: '100%' }}>
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
      </SafeView>
      
    )}
    </>
  );
};

export default ExploreTabsHeader;
