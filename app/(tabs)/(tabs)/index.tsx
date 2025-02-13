import React, { useState, useEffect, useCallback, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import { useFocusEffect } from "expo-router";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import { useMatchedLocation } from "../../context/MatchedLocationContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
import WebSocketCurrentLocation from "../../components/WebSocketCurrentLocation";
import { useRouter, Link } from "expo-router";
import { useNearbyLocations } from "@/app/context/NearbyLocationsContext";
import DataList from "../../components/DataList";

import CurrentSurroundingsView from "@/app/components/CurrentSurroundingsView";

import { useAppMessage } from "../../context/AppMessageContext";
import { DrawerToggleButton } from "@react-navigation/drawer";

import SignoutSvg from "../../assets/svgs/signout.svg";

import { StatusBar } from "expo-status-bar";

import { useActiveSearch } from "../../context/ActiveSearchContext";

import GoButton from "@/app/components/GoButton";

const home = () => {
  useGeolocationWatcher();
  const { user, onSignOut } = useUser();
  const { itemChoices, triggerItemChoicesRefetch } = useInteractiveElements();
  const { matchedLocation } = useMatchedLocation();
  const { currentSurroundings, portalLocation, ruinsLocation } = useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [token, setToken] = useState<string | null>(null);
  const { homeLocation, homeRegion } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const {
    handleGo,
    searchIsActive,
    gettingExploreLocations,
    exploreLocationsAreReady,
  } = useActiveSearch();

  const TOKEN_KEY = "accessToken";

  const router = useRouter();
 

  // useFocusEffect(
  //   useCallback(() => {
  //     triggerItemChoicesRefetch();
  //     return () => {
  //       console.log("item choices is unfocused");
  //     };
  //   }, [])
  // );

  useEffect(() => {
    if (portalLocation) {
      console.log('PORTAL LOCATION!!!!!', portalLocation);
    }

  }, [portalLocation]);



  useEffect(() => {
    if (ruinsLocation) {
      console.log('RUINS LOCATION!!!!!', ruinsLocation);
    }

  }, [ruinsLocation]);



  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          <GoButton address={homeLocation?.address || "Manchester, NH"} />

          {/* {exploreLocation && !searchIsActive && (
            <View style={appContainerStyles.innerFlexStartContainer}>
              <DataList
                listData={[exploreLocation]}
                onCardButtonPress={() => {}}
              />
            </View>
          )} */}

          {portalLocation && !searchIsActive && (
            <CurrentSurroundingsView />
            // <View style={appContainerStyles.innerFlexStartContainer}>
            //   <DataList
            //     listData={[currentSurroundings]}
            //     onCardButtonPress={() => {}}
            //   />
            // </View>
          )}
          {/* {itemChoices && currentSurroundings && !searchIsActive && (
          <View style={appContainerStyles.innerFlexStartContainer}>
            <DataList listData={[ currentSurroundings, ...itemChoices]} onCardButtonPress={() => {}} />
          </View>
        )} */}

          {user && user.authenticated && searchIsActive && (
            <View
              style={[
                appContainerStyles.defaultScreenElementContainer,
                {
                  borderColor: themeStyles.primaryText.color,
                  height: 300,
                  marginVertical: "1%",
                },
              ]}
            >
              <WebSocketSearchingLocations
                reconnectOnUserButtonPress={searchIsActive}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default home;
