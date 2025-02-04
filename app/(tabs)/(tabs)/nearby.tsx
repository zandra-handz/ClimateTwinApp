import React, { useState, useEffect, useRef } from "react";
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

import DataList from "../../components/DataList";


import { exploreLocation } from "@/app/apicalls";

const nearby = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { nearbyLocations, nearbyLocationsCount } = useNearbyLocations();

  useEffect(() => {
    if (nearbyLocations) {
      console.log(`nearby locations! `, nearbyLocations);
      console.log(nearbyLocationsCount);
    }
  }, [nearbyLocations]);



  //wtf

  // backend is so confused on this lol, you need to submit {'explore_location' : [location id]} if data.explore_type is discovery_location
  // else you need to submit {'twin_location' : [the same id]}
  // WHY DID PAST ME DO THIS
  // I believe it has to add more data to twin locations. 
  // originally, twin location couldn't be an explore location (?)
//this will move to the surroundings context so that i can control behaviors based on mutations
  const handleExploreLocation = (data) => {
    console.log('handle explore location pressed!', data);
  
    if (data && data.explore_type) {
      const locationType = data.explore_type === 'discovery_location' ? 'explore_location' : 'twin_location';
  
      exploreLocation({ [locationType]: data.id }); 
    }
  };
  
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
          { paddingTop: 90 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          <View
            style={[
              appContainerStyles.inScreenHeaderContainer,
              { height: "2%" },
            ]}
          >
            
        </View> 
            {nearbyLocations && <DataList listData={nearbyLocations} onCardButtonPress={handleExploreLocation} />}
          </View>
      </View>
    </>
  );
};

export default nearby;
