import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, View, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext"; 
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";

import CurrentSurroundingsView from "@/app/components/CurrentSurroundingsView"; 
 
import PortalSurroundingsView from "@/app/components/PortalSurroundingsView";
import RuinsSurroundingsView from "@/app/components/RuinsSurroundingsView";
 

import { useActiveSearch } from "../../context/ActiveSearchContext";
import NotificationNotifier from "@/app/components/NotificationNotifier";

import PortalBanner from "@/app/components/PortalBanner";
 

const home = () => {
  useGeolocationWatcher();
  const { user, isAuthenticated } = useUser(); 

  const { portalSurroundings, ruinsSurroundings } =
    useSurroundings();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { homeLocation } = useHomeLocation(); 
  const { searchIsActive } = useActiveSearch(); 
  const [surroundingsViews, setSurroundingsViews ] = useState({});

  const ITEM_HEIGHT = 700;
  const ITEM_BOTTOM_MARGIN = 0; //Add to value for snapToInterval

 
  useEffect(() => {
    if (ruinsSurroundings?.id) {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "2", component: <RuinsSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "3", component: <CurrentSurroundingsView height={ITEM_HEIGHT} /> }
      ]);
    } else {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "3", component: <CurrentSurroundingsView height={ITEM_HEIGHT} /> }
      ]);
    }
  }, [portalSurroundings, ruinsSurroundings]);
  

 
  const flatListRef = useRef(null);
 
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
           <NotificationNotifier />
          <View style={appContainerStyles.innerFlexStartContainer}>
            <PortalBanner address={homeLocation?.address || "Manchester, NH"} />

            {portalSurroundings && !searchIsActive && surroundingsViews && (
              
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
                initialNumToRender={ruinsSurroundings?.id ? 3 : 2} 
                snapToInterval={ITEM_HEIGHT + ITEM_BOTTOM_MARGIN}

                snapToAlignment="start" 
                decelerationRate="fast"
                keyboardDismissMode="on-drag" 
              />
            )} 

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
