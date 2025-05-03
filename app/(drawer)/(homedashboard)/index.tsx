import React from "react";
import { View } from "react-native";
import { useDeviceLocationContext } from "@/src/context/DeviceLocationContext";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import GoButton from "@/app/components/GoButton";
import TurnOnLocationButton from "@/app/components/TurnOnLocationButton";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
import WindyWindSquare from "@/app/components/SurroundingsComponents/WindyWindSquare";
import Temperatures from "@/app/animations/Temperatures";
import * as Sentry from "@sentry/react-native";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import useExploreRoute from "@/src/hooks/useExploreRoute";
import NotificationNotifier from "@/app/components/NotificationNotifier";
import { useUser } from "@/src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import { useActiveSearch } from "@/src/context/ActiveSearchContext";

const index = () => {
  const { deviceLocation } = useDeviceLocationContext();
  const {settingsAreLoading } = useUserSettings();
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const { lastState } = useSurroundingsWS();
  const { isAuthenticated, isInitializing } = useUser();
  const { remainingGoes, handleGo } = useActiveSearch();

 // useExploreRoute(lastState, isAuthenticated, isInitializing); //replace with settingsAreLoading

  return (
    <>
      <ComponentSpinner
        backgroundColor={themeStyles.primaryBackground.backgroundColor}
        spinnerType={"pulse"}
        isSocketSpinner={true}
      />
      <NotificationNotifier />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 50 },
        ]}
      >
        {/* <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/> */}
{(lastState === 'home' || lastState === 'searching for twin') && (
  
        <View style={appContainerStyles.innerFlexStartContainer}>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {lastState === "searching for twin" && (
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
                    reconnectOnUserButtonPress={(lastState === 'searching for twin')}
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
                  {(lastState !== 'searching for twin') &&
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
                  {(lastState !== 'searching for twin') &&
                    deviceLocation &&
                    deviceLocation?.address &&
                    deviceLocation?.latitude &&
                    deviceLocation?.longitude && (
                      <GoButton address={deviceLocation?.address} size={240} lastState={lastState} remainingGoes={remainingGoes} onPress={handleGo} />
                    )}
                  {!deviceLocation?.address && <TurnOnLocationButton />}
                </View>
              </>
            </>
          </View>
        </View>
        
)}
      </View>
    </>
  );
};

export default index;
