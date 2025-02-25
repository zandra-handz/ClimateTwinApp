import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, View, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
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

  const { portalSurroundings, ruinsSurroundings, homeSurroundings } =
    useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { homeLocation } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const { searchIsActive } = useActiveSearch();
  const [containerHeight, setContainerHeight] = useState(0);

  const ITEM_HEIGHT = 700;
  const ITEM_BOTTOM_MARGIN = 0; //Add to value for snapToInterval

  const surroundingsViews = [
    { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
    { id: "2", component: <RuinsSurroundingsView height={ITEM_HEIGHT}  /> },
    { id: "3", component: <CurrentSurroundingsView /> },
  ];

 
  const flatListRef = useRef(null);

  //to prevent the sometimes-occurring cannot scroll to index of null error
  useFocusEffect(
    React.useCallback(() => {
      if (flatListRef.current && surroundingsViews.length > 0) {
        if (ruinsSurroundings?.id) {
          scrollToIndex(1);
        } else {
          scrollToIndex(0);
        }
      }
    }, [ruinsSurroundings, surroundingsViews])
  );
  



  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Your code here
  //   }, [depA, depB])
  // );

  const scrollToIndex = (index) => {
    if (flatListRef.current && surroundingsViews.length > index) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    } else {
      console.warn("Attempted to scroll to an invalid index:", index);
    }
  };
  

  return (
    <> 
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
              
              <Animated.FlatList
                ref={flatListRef}
                data={surroundingsViews}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT + ITEM_BOTTOM_MARGIN,
                  offset: (ITEM_HEIGHT + ITEM_BOTTOM_MARGIN) * index,
                  index,
                })}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : `surView-${index}`
                }
                renderItem={({ item }) => <View>{item.component}</View>}
                initialNumToRender={3} 
                snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN}

                snapToAlignment="start" // Align items to the top of the list when snapped
                decelerationRate="fast" // Optional: makes the scroll feel snappier
                keyboardDismissMode="on-drag"// Customize based on how many items you want rendered initially
              />
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
