import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity, 
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useGeolocationWatcher } from "../../hooks/useCurrentLocationWatcher";
import { useFocusEffect } from "expo-router";
import useHomeLocation from "../../hooks/useHomeLocation";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import { useMatchedLocation } from "../../context/MatchedLocationContext";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import WebSocketSearchingLocations from "../../components/WebSocketSearchingLocations";
import WebSocketCurrentLocation from "../../components/WebSocketCurrentLocation";
import { useRouter, Link } from "expo-router";
import { useNearbyLocations } from "@/app/context/NearbyLocationsContext";
import DataList from "../../components/DataList";

import { useAppMessage } from "../../context/AppMessageContext";
import { DrawerToggleButton } from "@react-navigation/drawer";

import SignoutSvg from "../../assets/svgs/signout.svg";

import { StatusBar } from "expo-status-bar";

import { useActiveSearch } from "../../context/ActiveSearchContext";

const home = () => {
  useGeolocationWatcher();
  const { user, onSignOut } = useUser(); 
  const { itemChoices, triggerItemChoicesRefetch } = useInteractiveElements();
  const { matchedLocation } = useMatchedLocation();
  const { exploreLocation } = useSurroundings();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [token, setToken] = useState<string | null>(null);
  const { homeLocation, homeRegion } = useHomeLocation();
  const { showAppMessage } = useAppMessage();
  const { handleGo, searchIsActive, gettingExploreLocations, exploreLocationsAreReady } = useActiveSearch();
 

  const TOKEN_KEY = "accessToken";

  const router = useRouter();



    useFocusEffect(
      useCallback(() => { 
        triggerItemChoicesRefetch();
        return () => {
          console.log("item choices is unfocused"); 
        };
      }, [])
    );


  // useEffect(() => {
  //   if (itemChoices) {
  //     console.log('ITEM CHOICES! ', itemChoices);
  //   }

  // }, [itemChoices]);


      //  useFocusEffect(
      //    useCallback(() => {
      //      if ( user && user.authenticated) { //if app is in foreground, might be an unnecessary check but I'm not sure
            
      //      setToken(null);
      //      fetchToken();
      //     //  setTriggerReconnectAfterFetch(true);
           
      //     }
     
      //      return () => { 
      //        setToken(null);
      //       //  setTriggerReconnectAfterFetch(false);
      //      };
      //    }, [])
      //  );

  // useEffect(() => {
  //   if (matchedLocation) {
  //     console.log(`matched location!`, matchedLocation.name);
  //   }

  // }, [matchedLocation]);

  useEffect(() => {
    if (exploreLocation) {
      console.log(`explore location!`, exploreLocation.name);
    }
  }, [exploreLocation]);

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [openSocketForGoPress, setOpenSocketForGoPress] = useState(false);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       showAppMessage(true, null, `App has come to the foreground!`);
  //       // handleRefresh();
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  // const handleRefresh = () => {
  //   setRefreshKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  //   showAppMessage(true, null, "Page Refreshed!");
  // };

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
  //       setToken(storedToken);
  //     } catch (error) {
  //       console.error("Failed to retrieve token:", error);
  //     }
  //   };

  //   fetchToken();
  // }, []);


       const fetchToken = async () => {
        console.log('fetching user token in current main screen');
        try {
          const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
          console.log(storedToken);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to retrieve token:', error);
        }
      };

  const handleSignOut = () => {
    onSignOut();
    // navigateToSignInScreen();
  };

  // useEffect(() => {
  //   if (!user.authenticated) {
  //     navigateToSignInScreen();

  //   }

  // }, [user]);

  const navigateToSignInScreen = () => {
    router.push("/signin"); // Navigate to the /recover-credentials screen
  };

  const handleFindNewLocation = (startingAddress) => {
    setOpenSocketForGoPress(true);
    console.log(startingAddress);
    handleGo(startingAddress);
    // gettingExploreLocations();
    showAppMessage(true, null, `Searching for a weather portal!!`);
    //handleRefresh();
    setOpenSocketForGoPress(false);
  };

  // useEffect(() => {
  //   console.log("home screen rerendered");
  //   showAppMessage(true, null, "hihihihihi!");
  // }, []);

  //for testing, hardcoded DRF auth token: `31abe86cc4359d469102c68fae094590c3683221`

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
        ]}
      >
        {/* <View style={{   zIndex: 30000,  justifyContent: 'flex-end', flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', top: -30,  width: '100%'}}>

          
        <WebSocketCurrentLocation  
              />
         <DrawerToggleButton tintColor={themeStyles.primaryText.color}/>
         
        </View>  */}
               
        <View style={appContainerStyles.innerFlexStartContainer}>
       
          <TouchableOpacity
            onPress={() =>
              handleFindNewLocation(homeLocation?.address || "Manchester, NH")
            }
            style={{
              height: "auto",
              width: "100%",
              paddingVertical: '2%',
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={[themeStyles.primaryText, { fontSize: 50 }]}>GO</Text>
          </TouchableOpacity>

          {itemChoices && !searchIsActive && (
          <View style={appContainerStyles.innerFlexStartContainer}>
        
        <DataList listData={itemChoices} onCardButtonPress={() => {}} />
      </View>
)}
 

          {user && user.authenticated && searchIsActive && (
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
                reconnectOnUserButtonPress={openSocketForGoPress}
              />
            </View>

          )}
        </View>

   
      </View>
    </>
  );
};

export default home;
