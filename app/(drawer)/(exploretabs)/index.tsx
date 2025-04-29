import React, { useEffect, useRef, useState, useMemo } from "react";
import { Animated, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useGeolocationWatcher } from "../../../src/hooks/useCurrentLocationWatcher";

import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useSurroundings } from "../../../src/context/CurrentSurroundingsContext";
import useInlineComputations from "@/src/hooks/useInlineComputations";
import CurrentSurroundingsView from "@/app/components/SurroundingsComponents/CurrentSurroundingsView";
import PortalSurroundingsView from "@/app/components/SurroundingsComponents/PortalSurroundingsView";
import RuinsSurroundingsView from "@/app/components/SurroundingsComponents/RuinsSurroundingsView";

import { useUser } from "@/src/context/UserContext";

import NotificationNotifier from "@/app/components/NotificationNotifier";

import PortalBanner from "@/app/components/PortalBanner";

import GroqHistory from "@/app/components/GroqComponents/GroqHistory";

import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";

const index = () => {
  const { user } = useUser();
  // useGeolocationWatcher();
  const {
    currentSurroundings,
    // portalSurroundings,
    // ruinsSurroundings,
    currentSurroundingsIsPending,
    pickNewSurroundingsMutation,
    handlePickNewSurroundings,
  } = useSurroundings();

  const { getSurroundingsData } = useInlineComputations();
  const {
    portalSurroundings,
    ruinsSurroundings,
    homeSurroundings,
    locationId,
    lastAccessed,
  } = getSurroundingsData(currentSurroundings);

  const [surroundingsData, setSurroundingsData] = useState(null);

  useEffect(() => {
    if (currentSurroundings) {
      const data = getSurroundingsData(currentSurroundings);
      setSurroundingsData(data);
    }
  }, [currentSurroundings]);

  const { themeStyles, appContainerStyles } = useGlobalStyles();
  // const [surroundingsViews, setSurroundingsViews] = useState({});

  const [portalBannerVisible, setPortalBannerVisible] = useState(true);

  const [groqVisible, setGroqVisible] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current; // Animated opacity for the banner
  const groqOpacity = useRef(new Animated.Value(1)).current;
  const ITEM_HEIGHT = 968;
  const ITEM_BOTTOM_MARGIN = 0;

  const surroundingsViews = useMemo(() => {
    const computeSurroundingsViews = (
      portalSurroundings,
      ruinsSurroundings
    ) => {
      if (ruinsSurroundings?.id && portalSurroundings?.id) {
        return [
          {
            id: "1",
            component: (
              <PortalSurroundingsView
                height={ITEM_HEIGHT}
                portalSurroundings={portalSurroundings}
                ruinsSurroundings={ruinsSurroundings}
                homeSurroundings={homeSurroundings}
                onPress={handlePickNewSurroundings}
              />
            ),
          },
          {
            id: "2",
            component: (
              <RuinsSurroundingsView
                height={ITEM_HEIGHT}
                ruinsSurroundings={ruinsSurroundings}
              />
            ),
          },
          {
            id: "3",
            component: <CurrentSurroundingsView height={ITEM_HEIGHT} />,
          },
        ];
      } else if (portalSurroundings?.id) {
        return [
          {
            id: "1",
            component: (
              <PortalSurroundingsView
                height={ITEM_HEIGHT}
                portalSurroundings={portalSurroundings}
                ruinsSurroundings={ruinsSurroundings}
                homeSurroundings={homeSurroundings}
                onPress={handlePickNewSurroundings}
              />
            ),
          },
          {
            id: "3",
            component: <CurrentSurroundingsView height={ITEM_HEIGHT} />,
          },
        ];
      } else {
        return [
          {
            id: "3",
            component: <CurrentSurroundingsView height={ITEM_HEIGHT} />,
          },
        ];
      }
    };
    if (surroundingsData) {

      return computeSurroundingsViews(surroundingsData.portalSurroundings, surroundingsData.ruinsSurroundings);
 
    }
  
  }, [surroundingsData]);

  const flatListRef = useRef(null);

  const handleAutoScroll = () => {
    if (flatListRef.current && surroundingsViews.length > 0) {
      if (ruinsSurroundings?.id) {
        console.log("yes ruins");
        scrollToIndex(1);
        setGroqVisible(true);
      } else {
        console.log("no ruins");
        scrollToIndex(0);
        //scrollToIndex(0);
        setGroqVisible(true);
        groqOpacity.setValue(1);
        opacity.setValue(1);
      }
    } else {
      console.log("surroundingsView not ready");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleAutoScroll();
    }, [surroundingsViews])
  );

  // useEffect(() => {
  //   handleAutoScroll();

  // }, [surroundingsViews]);

  const scrollToIndex = (index) => {
   // console.log("SCROLL TO INDEX!");
    if (flatListRef.current && surroundingsViews.length > index) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      handleVisibilityToggles(index);
    } else {
      console.warn("Attempted to scroll to an invalid index:", index);
    }
  };

  const handleVisibilityToggles = (index) => {
    if (index === 1) {
      setPortalBannerVisible(false);
      if (ruinsSurroundings?.id) {
        setGroqVisible(true);
      } else {
        setGroqVisible(false);
      }
    } else {
      setPortalBannerVisible(true);
      if (ruinsSurroundings?.id) {
        setGroqVisible(true);
      } else {
        setGroqVisible(false);
      }
    }
  };

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const fadeValue = offsetY / ITEM_HEIGHT;
    opacity.setValue(Math.max(0, 1 - fadeValue)); // Ensure opacity doesn't go below 0

    const groqFadeValue = Math.min(1, offsetY / ITEM_HEIGHT);
    groqOpacity.setValue(
      ruinsSurroundings?.id ? groqFadeValue : 1 - groqFadeValue
    );

    //console.log("offsetY:", offsetY, "contentHeight:", contentHeight); // Add debug logs

    if (offsetY < ITEM_HEIGHT) {
      setPortalBannerVisible(true);
      setGroqVisible(!ruinsSurroundings?.id);
    } else {
      setPortalBannerVisible(false);
      setGroqVisible(!!ruinsSurroundings?.id);
    }

    const totalSections = Math.floor(contentHeight / ITEM_HEIGHT);
    if (totalSections >= 3 && offsetY >= ITEM_HEIGHT * 2) {
      setGroqVisible(false);
      groqOpacity.setValue(0);
      //console.log("At least at the third section!");
    }
  };

  return (
    <>
      <ComponentSpinner
        backgroundColor={themeStyles.primaryBackground.backgroundColor}
        spinnerType={"pulse"}
        isSocketSpinner={true}
      />

      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <NotificationNotifier />
        {portalBannerVisible && (
          <>
            <Animated.View
              style={{
                opacity,
                position: "absolute",
                width: "100%",
                left: 0,
                right: 0,
                top: 0,
                zIndex: 2,
              }}
            >
              <PortalBanner
                locationId={locationId}
                portalSurroundings={portalSurroundings}
                homeSurroundings={homeSurroundings}
              />
            </Animated.View>
          </>
        )}
        <View style={appContainerStyles.innerFlexStartContainer}>
          {surroundingsViews && ( // removed !currentSurroundingsIsPending and put refreshing below to test that out
            <>
              <Animated.FlatList
                ref={flatListRef}
                data={surroundingsViews} 
                refreshing={currentSurroundingsIsPending} 
                fadingEdgeLength={20}
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
                onScroll={onScroll}
                extraData={surroundingsViews} // This tells FlatList to re-render when surroundingsViews changes
              />

              {groqVisible && (
                // <Animated.View style={{ opacity: groqOpacity, width: '100%', zIndex: 1000, bottom: 20, right: 0, left: 0, position: 'absolute' }}>

                <GroqHistory
                  title={"history from Groq"}
                  cacheKey={"history"}
                  userId={user?.id}
                  opacity={groqOpacity}
                />
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
};

export default index;
