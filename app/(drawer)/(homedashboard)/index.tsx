import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { useDeviceLocationContext } from "@/src/context/DeviceLocationContext";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useActiveSearch } from "../../../src/context/ActiveSearchContext";
import GoButton from "@/app/components/GoButton";
import TurnOnLocationButton from "@/app/components/TurnOnLocationButton";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
import WindyWindSquare from "@/app/components/SurroundingsComponents/WindyWindSquare";
import Temperatures from "@/app/animations/Temperatures";
import * as Sentry from "@sentry/react-native"; 
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";

const index = () => {
  const { deviceLocation } = useDeviceLocationContext();
  const { themeStyles, appContainerStyles, constantColorsStyles } = useGlobalStyles();
  const { isSearchingForTwin } = useActiveSearch(); 

 
  

  // useEffect(() => {
  //   if (deviceLocation) {
  //     console.log(`DEVICE LOCATION ADDRESS: `, deviceLocation.address);
  //   }
  // }, [deviceLocation]);

  return (
    <>
     <ComponentSpinner backgroundColor={themeStyles.primaryBackground.backgroundColor} spinnerType={'pulse'} isSocketSpinner={true}/>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/> */}

        <View style={appContainerStyles.innerFlexStartContainer}>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
                          {isSearchingForTwin && (
                            <>
                            
                <View
                  style={[
                    appContainerStyles.mapParentContainer,
                    {
                      borderColor: themeStyles.primaryText.color,
                    },
                  ]}
                >
                  <WebSocketSearchingLocations
                    //don't think am using the below
                    reconnectOnUserButtonPress={isSearchingForTwin}
                  />

                </View>
                <View style={{ height: 100, marginTop: 200 }}>
                    <Temperatures />
                  </View>
                </>

              )}
            <>
              {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
               */}
              <>
                <View
                  style={[
                    appContainerStyles.mapHomeScreenContainer,
                    { marginBottom: 20 },
                  ]}
                >
                  {!isSearchingForTwin &&
                    deviceLocation &&
                    deviceLocation?.address &&
                    deviceLocation?.latitude &&
                    deviceLocation?.longitude && (
                      <View style={{ width: "100%", height: "100%" }}>
                        <WindyWindSquare
                          lat={42.846411}
                          lon={-71.5046743}
                          zoom={11}
                        />
                      </View>
                    )}
                </View>

                <View style={{ height: 240 }}>
                  {!isSearchingForTwin &&
                    deviceLocation &&
                    deviceLocation?.address &&
                    deviceLocation?.latitude &&
                    deviceLocation?.longitude && (
                      <GoButton address={deviceLocation?.address} size={240} />
                    )}
                  {!deviceLocation?.address && <TurnOnLocationButton />}
                </View>
              </>

            </>
          </View>
        </View>
      </View>
    </>
  );
};

export default index;
