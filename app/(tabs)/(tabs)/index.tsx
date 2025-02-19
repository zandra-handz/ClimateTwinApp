import React, { useRef } from "react";
import { View, ScrollView } from "react-native";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";

import CurrentSurroundingsView from "@/app/components/CurrentSurroundingsView";
import SingleDetailPanel from "@/app/components/SingleDetailPanel";
import { useAppMessage } from "../../context/AppMessageContext";

import PortalSurroundingsView from "@/app/components/PortalSurroundingsView";
import RuinsSurroundingsView from "@/app/components/RuinsSurroundingsView";
import { StatusBar } from "expo-status-bar";

import { useActiveSearch } from "../../context/ActiveSearchContext";

import PortalBanner from "@/app/components/PortalBanner";

import WindFriendsView from "@/app/components/WindFriendsView";

const home = () => {
  useGeolocationWatcher();
  const { user, isAuthenticated } = useUser();
  //const { itemChoices, triggerItemChoicesRefetch } = useInteractiveElements();

  const { portalSurroundings, homeSurroundings } = useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeLocation } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const { searchIsActive } = useActiveSearch();

  // useFocusEffect(
  //   useCallback(() => {
  //     triggerItemChoicesRefetch();
  //     return () => {
  //       console.log("item choices is unfocused");
  //     };
  //   }, [])
  // );

  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      {isAuthenticated && (
        
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          <PortalBanner address={homeLocation?.address || "Manchester, NH"} />

          {portalSurroundings && !searchIsActive && (
            <ScrollView style={{ flex: 1 }}>
              <PortalSurroundingsView />
              <RuinsSurroundingsView />

              <CurrentSurroundingsView />
            </ScrollView>
          )}
          {/* {itemChoices && currentSurroundings && !searchIsActive && (
          <View style={appContainerStyles.innerFlexStartContainer}>
            <DataList listData={[ currentSurroundings, ...itemChoices]} onCardButtonPress={() => {}} />
          </View>
        )} */}

          {isAuthenticated && searchIsActive && (
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
      
    )}
    </>
  );
};

export default home;
