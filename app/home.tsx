import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useGeolocationWatcher } from './hooks/useCurrentLocationWatcher';

import  useHomeLocation from './hooks/useHomeLocation';
import { useGlobalStyles } from './context/GlobalStylesContext';
import { useUser } from './context/UserContext';
import WebSocketSearchingLocations from './components/WebSocketSearchingLocations';
import WebSocketCurrentLocation from './components/WebSocketCurrentLocation';
import { useRouter, Link } from "expo-router";

import { useAppMessage } from './context/AppMessageContext';

import SignoutSvg from './assets/svgs/signout.svg';

import { StatusBar } from 'expo-status-bar';

import { go } from './apicalls';

const home = () => {

  useGeolocationWatcher();
  const { user, onSignOut } = useUser();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [token, setToken] = useState<string | null>(null);
  const { homeLocation, homeRegion } = useHomeLocation();
  const { showAppMessage } = useAppMessage();

  const [refreshKey, setRefreshKey] = useState(0); // State to trigger a refresh


  const TOKEN_KEY = 'my-jwt';

  const router = useRouter();


  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        showAppMessage(true, null, `App has come to the foreground!`);
        handleRefresh();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment the key to force re-render
    showAppMessage(true, null, 'Page Refreshed!');
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, []);


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
  router.push('/signin'); // Navigate to the /recover-credentials screen
};

  const handleFindNewLocation = (startingAddress) => {
    go(startingAddress);
    //showAppMessage(true, null, `Searching for a portal!!`);
    handleRefresh();

  };


  useEffect(() => {
    console.log('home screen rerendered');
    showAppMessage(true, null, 'hihihihihi!');

  }, []);

  //for testing, hardcoded DRF auth token: `31abe86cc4359d469102c68fae094590c3683221`

  return (

    <>
          <StatusBar
          barStyle={themeStyles.primaryBackground.backgroundColor} 
          translucent={true}
          backgroundColor="transparent" 
        /> 
    <View style={[appContainerStyles.screenContainer, themeStyles.primaryBackground, {paddingTop: 90} ]}>

      <View style={appContainerStyles.innerFlexStartContainer}>
        
            <View style={[appContainerStyles.inScreenHeaderContainer, {height: '10%'}]}>
              <View style={{flexDirection: 'column'}}>
                {user && user.user && user.user.username && (
                  
            <Text style={[appFontStyles.solitaryHeaderMessageText, themeStyles.primaryText]}>{`Welcome back, ${user.user.username}`}</Text>
            
          )}
            { homeLocation && (
                <Text style={themeStyles.primaryText}>{homeLocation.address}</Text>
              )}
              
              </View>
              
            </View> 
      {token && user && user.authenticated && (
        <View style={[appContainerStyles.defaultScreenElementContainer, {  marginVertical: '1%'}]}>
        <WebSocketCurrentLocation userToken={token} />
        
          
        </View>
       )} 
       <TouchableOpacity 
       onPress={() => handleFindNewLocation(homeLocation?.address || 'Manchester, NH')}
        style={{height: '18%', width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
        <Text style={[themeStyles.primaryText, {fontSize: 50}]}>GO

        </Text>
       </TouchableOpacity>
        
    
       {token && user && user.authenticated && (
        <View style={[appContainerStyles.defaultScreenElementContainer, { borderColor: themeStyles.primaryText.color, height: 300, marginVertical: '1%'}]}>
        <WebSocketSearchingLocations userToken={token} />
        </View>
     )}  
  </View> 
  <View style={{width: '100%', alignItems: 'center', paddingHorizontal: '4%', flexDirection: 'row', justifyContent: 'space-between', height: 40}}>
     <SignoutSvg onPress={() => handleSignOut()} width={30} height={30} color={themeStyles.primaryText.color}/>
   
  </View>
    </View>
    </>
  );
};


export default home;