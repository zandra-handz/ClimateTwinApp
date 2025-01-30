import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useGeolocationWatcher } from './hooks/useCurrentLocationWatcher';

import  useHomeLocation from './hooks/useHomeLocation';
import { useGlobalStyles } from './context/GlobalStylesContext';
import { useUser } from './context/UserContext';
import WebSocketSearchingLocations from './components/WebSocketSearchingLocations';
import WebSocketCurrentLocation from './components/WebSocketCurrentLocation';
import { useRouter, Link } from "expo-router";

import { StatusBar } from 'expo-status-bar';

import { go } from './apicalls';

const home = () => {

  useGeolocationWatcher();
  const { user, onSignOut } = useUser();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [token, setToken] = useState<string | null>(null);
  const { homeLocation, homeRegion } = useHomeLocation();

  const TOKEN_KEY = 'my-jwt';

  const router = useRouter();

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

useEffect(() => {
  if (!user.authenticated) {
    navigateToSignInScreen();

  }

}, [user]);


const navigateToSignInScreen = () => {
  router.push('/'); // Navigate to the /recover-credentials screen
};

  const handleFindNewLocation = (startingAddress) => {
    go(startingAddress);

  };

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
      {token && (
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
        
    
      {token && (
        <View style={[appContainerStyles.defaultScreenElementContainer, { borderColor: themeStyles.primaryText.color, height: 120, marginVertical: '1%'}]}>
        <WebSocketSearchingLocations userToken={token} />
        </View>
     )}  
  </View> 
  <View style={{width: '103%', alignItems: 'center', paddingHorizontal: '4%', flexDirection: 'row', justifyContent: 'space-between', height: 40}}>
     <Text onPress={() => onSignOut()} style={[themeStyles.primaryText, appFontStyles.footerText]}>
      Log out
     </Text>
  </View>
    </View>
    </>
  );
};


export default home;