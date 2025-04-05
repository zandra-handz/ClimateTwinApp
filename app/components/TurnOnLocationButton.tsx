import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import * as Notifications from "expo-notifications";
 

import { useDeviceLocationContext } from "../context/DeviceLocationContext";
import fetchCurrentLocation from "../hooks/useCurrentLocationWatcher";

const TurnOnLocationButton = () => {
    const { handleGo, remainingGoes, searchIsActive } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { portalSurroundings } = useSurroundings();
  const { triggerNewPermissionRequest } = useDeviceLocationContext();
 



 
 

  const handleButtonPress = () => {
    triggerNewPermissionRequest();
    console.log('implement turn on location manually feature')
  };
  return (
    <> 
          <TouchableOpacity
            onPress={handleButtonPress}
            style={[
              appContainerStyles.bigGoButtonContainer,
              themeStyles.primaryOverlayBackground,
              { borderColor: themeStyles.tabBarHighlightedText.color },
            ]}
          >
            <>
            <View style={{flexWrap: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%'}}>
              
              <Text
                style={[themeStyles.primaryText, appFontStyles.goButtonText]}
              >
                Turn on location
              </Text>
              
            </View>
              {remainingGoes != "No limit" && (
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.remainingTripsText,
                  ]}
                >
                  {`${remainingGoes} left`}
                </Text>
              )}
              {remainingGoes === "No limit" && (
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.remainingTripsText,
                  ]}
                >
                  {`${remainingGoes}`}
                </Text>
              )}
            </>
          </TouchableOpacity>
    </>
  );
};

export default TurnOnLocationButton;
