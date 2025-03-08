import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";

import CurrentSurroundingsView from "@/app/components/SurroundingsComponents/CurrentSurroundingsView";
import PortalSurroundingsView from "@/app/components/SurroundingsComponents/PortalSurroundingsView";
import RuinsSurroundingsView from "@/app/components/SurroundingsComponents/RuinsSurroundingsView";

import { useUser } from "@/app/context/UserContext";

import NotificationNotifier from "@/app/components/NotificationNotifier";

import PortalBanner from "@/app/components/PortalBanner";

import Groq from "@/app/components/Groq";
import GroqHistory from "@/app/components/GroqHistory";
import useLLMScripts from "@/app/llm/useLLMScripts";

const index = () => {
  const { user } = useUser();
  useGeolocationWatcher();
  const {
    portalSurroundings,
    ruinsSurroundings,
    locationId,
    isInitializingLocation,
  } = useSurroundings();
  const { lastLocationId } = useSurroundingsWS();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const [surroundingsViews, setSurroundingsViews] = useState({});
  const { yourRoleIsFriendlyDiligentHistorian, tellMeRecentHistoryOf } =
    useLLMScripts();

  const [portalBannerVisible, setPortalBannerVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current; // Animated opacity for the banner
  const ITEM_HEIGHT = 968;
  const ITEM_BOTTOM_MARGIN = 0;

  useEffect(() => {
    if (ruinsSurroundings?.id) {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "2", component: <RuinsSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "3", component: <CurrentSurroundingsView height={ITEM_HEIGHT} /> },
      ]);
    } else if (portalSurroundings && portalSurroundings?.id) {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "3", component: <CurrentSurroundingsView height={ITEM_HEIGHT} /> },
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
      if (index === 1) {
        setPortalBannerVisible(false);
      } else {
        setPortalBannerVisible(true);
      }
    } else {
      console.warn("Attempted to scroll to an invalid index:", index);
    }
  };

  // Track scroll position to fade in/out the portal banner
  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Set the fade effect for the banner based on scroll position
    const fadeValue = offsetY / ITEM_HEIGHT;
    opacity.setValue(Math.max(0, 1 - fadeValue)); // Ensure opacity doesn't go below 0

    if (offsetY < ITEM_HEIGHT) {
      setPortalBannerVisible(true); // Show banner when at top (index 0)
    } else {
      setPortalBannerVisible(false); // Hide banner when scrolling down
    }
  };

  return (
    <View style={[appContainerStyles.screenContainer, themeStyles.primaryBackground]}>
      <NotificationNotifier />
      {portalBannerVisible && (
              <>
              <Animated.View style={{ opacity, position: 'absolute', width: '100%', left: 0, right: 0, top: 0, zIndex: 2 }}>
                <PortalBanner />
              </Animated.View>

              </>
            )}
      <View style={appContainerStyles.innerFlexStartContainer}>
        {!isInitializingLocation && portalSurroundings?.id && surroundingsViews && (
          <>

                          
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
              onScroll={onScroll} // Add scroll event handler
            />
            <GroqHistory
              title={"history from Groq"}
              cacheKey={"history"}
              userId={user?.id}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default index;
