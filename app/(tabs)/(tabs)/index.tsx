import React from "react";
import { View } from "react-native";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";

import CurrentSurroundingsView from "@/app/components/CurrentSurroundingsView";

import { useAppMessage } from "../../context/AppMessageContext";

import { StatusBar } from "expo-status-bar";

import { useActiveSearch } from "../../context/ActiveSearchContext";

import PortalBanner from "@/app/components/PortalBanner";

import WindFriendsView from "@/app/components/WindFriendsView";

const home = () => {
  useGeolocationWatcher();
  const { user } = useUser();
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
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          <PortalBanner address={homeLocation?.address || "Manchester, NH"} />

          {/* {exploreLocation && !searchIsActive && (
            <View style={appContainerStyles.innerFlexStartContainer}>
              <DataList
                listData={[exploreLocation]}
                onCardButtonPress={() => {}}
              />
            </View>
          )} */}

          {portalSurroundings && !searchIsActive && (
            <>
              <WindFriendsView
                description={portalSurroundings.description}
                windSpeed={portalSurroundings.windSpeed}
                windDirection={portalSurroundings.windDirection}
                windFriends={portalSurroundings.windFriends}
                homeDescription={homeSurroundings.description}
                homeWindSpeed={homeSurroundings.windSpeed}
                homeWindDirection={homeSurroundings.windDirection}
              />
              <CurrentSurroundingsView />
            </>
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
