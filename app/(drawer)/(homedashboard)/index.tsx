import React, { useEffect } from "react";
import { View, Button } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useActiveSearch } from "../../context/ActiveSearchContext";
import GoButton from "@/app/components/GoButton";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
import WindyMap from "@/app/components/WindyMap";
import WindyWindSquare from "@/app/components/SurroundingsComponents/WindyWindSquare";
import * as Sentry from '@sentry/react-native';

const index = () => {
  const { homeLocation } = useGeolocationWatcher(); 
  //const { homeLocation } = useHomeLocation(); 
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { searchIsActive } = useActiveSearch();
  


  useEffect(() => {
    if (homeLocation) {
      console.log(`HOMELOCATION: `, homeLocation.longitude);
    }

  }, [homeLocation]);

  return (
    <>
    
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>

        <View style={appContainerStyles.innerFlexStartContainer}>
        {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
        */}
          {!searchIsActive && homeLocation && homeLocation?.address && homeLocation?.latitude && homeLocation?.longitude && (
            <>
              <View
                style={{
                  width: "100%", 
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <View style={[appContainerStyles.mapHomeScreenContainer, {marginBottom: 20}]}>
                <View style={{  width: '100%', height: '100%'}}>
                  <WindyWindSquare lat={42.846411} lon={-71.5046743} zoom={11} />

                </View>
                
                  
                </View>

                <GoButton address={homeLocation?.address || "Manchester, NH"} />
              </View>
            </>
          )}
          {searchIsActive && (
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

export default index;
