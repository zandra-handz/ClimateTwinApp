import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  AppState,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";

import { useAppMessage } from "../../context/AppMessageContext";
import { useNearbyLocations } from "../../context/NearbyLocationsContext";

import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import DataList from "../../components/DataList";
import { useFocusEffect } from "expo-router";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import { useActiveSearch } from "@/app/context/ActiveSearchContext";
import { useSurroundings } from "@/app/context/CurrentSurroundingsContext";

import { pickNewSurroundings } from "@/app/apicalls";

const nearby = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { triggerRefetch, nearbyLocations } = useNearbyLocations();
  const { currentSurroundings, ruinsSurroundings, handlePickNewSurroundings } = useSurroundings();
  const router = useRouter();

  const { itemChoices, triggerItemChoicesRefetch } = useInteractiveElements();

  useFocusEffect(
    useCallback(() => {
      console.log("triggering neary locations refetch");
      triggerRefetch();
      return () => {
        console.log("nearby location screen is unfocused");
      };
    }, [])
  );

  // useEffect(() => {
  //   console.log('triggering neary locations refetch');
  //   triggerRefetch();
  // }, []);

  //wtf

  // backend is so confused on this lol, you need to submit {'explore_location' : [location id]} if data.explore_type is discovery_location
  // else you need to submit {'twin_location' : [the same id]}
  // WHY DID PAST ME DO THIS
  // I believe it has to add more data to twin locations.
  // originally, twin location couldn't be an explore location (?)
  //this will move to the surroundings context so that i can control behaviors based on mutations
  const handleExploreLocation = async (data) => {
    //console.log('handle explore location pressed!', data);

    await handlePickNewSurroundings(data);
    setTimeout(() => {
      router.push("(drawer)/(exploretabs)");
    }, 0);
    

    //   if (data && data.explore_type) {
    //     const locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
    // //MOVE TO HOOK AND USE A MUTATION TO TRIGGER THE REFRESH
    //     pickNewSurroundings({ [locationType]: data.id });
    //     //refreshSurroundingsManually();
    //   }
  };

 
  
  useEffect(() => {
    if (currentSurroundings) {
      triggerItemChoicesRefetch();
    }
  }, [currentSurroundings]);

  return (
    <>
      {/* <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      /> */}
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {nearbyLocations && (
            <DataList
              listData={nearbyLocations}
              onCardButtonPress={handleExploreLocation}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default nearby;
