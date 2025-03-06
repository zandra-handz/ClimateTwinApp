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

  const ITEM_HEIGHT = 968;
  const ITEM_BOTTOM_MARGIN = 0; //Add to value for snapToInterval

  const [prompt, setPrompt] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (ruinsSurroundings?.id) {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        { id: "2", component: <RuinsSurroundingsView height={ITEM_HEIGHT} /> },
        {
          id: "3",
          component: <CurrentSurroundingsView height={ITEM_HEIGHT} />,
        },
      ]);
      let promptData = tellMeRecentHistoryOf(
        ruinsSurroundings?.latitude,
        ruinsSurroundings?.longitude,
        ruinsSurroundings?.name
      );
      let roleData = yourRoleIsFriendlyDiligentHistorian();
      setPrompt(promptData);
      setRole(roleData);
    } else if (portalSurroundings && portalSurroundings?.id) {
      setSurroundingsViews([
        { id: "1", component: <PortalSurroundingsView height={ITEM_HEIGHT} /> },
        {
          id: "3",
          component: <CurrentSurroundingsView height={ITEM_HEIGHT} />,
        },
      ]);
      let promptData = tellMeRecentHistoryOf(
        portalSurroundings?.latitude,
        portalSurroundings?.longitude,
        portalSurroundings?.name
      );
      let roleData = yourRoleIsFriendlyDiligentHistorian();
      setPrompt(promptData);
      setRole(roleData);
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
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <NotificationNotifier />
        <View style={appContainerStyles.innerFlexStartContainer}>
          {lastLocationId &&
            !isInitializingLocation &&
            portalSurroundings?.id &&
            surroundingsViews && (
              <>
                <PortalBanner />
                {/* 
            {portalSurroundings?.id && surroundingsViews && ( */}

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
                {prompt && role && lastLocationId && (
                  <Groq
                    givenRole={role}
                    prompt={prompt}
                    title={"history from Groq"}
                    cacheKey={'history'}
                    userId={user.id} 
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
