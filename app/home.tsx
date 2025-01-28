import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useGeolocationWatcher } from './hooks/useCurrentLocationWatcher';
import  useHomeLocation from './hooks/useHomeLocation';
import { useGlobalStyles } from './context/GlobalStylesContext';
import WebSocketComponent from '../components/WebSocketComponent';
import WebSocketCurrentLocation from '../components/WebSocketCurrentLocation';

import { go } from './apicalls';

const home = () => {

  useGeolocationWatcher();
  const { themeStyles } = useGlobalStyles();
  const [token, setToken] = useState<string | null>(null);
  const { homeLocation, homeRegion } = useHomeLocation();

  const TOKEN_KEY = 'my-jwt';

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


  const handleFindNewLocation = (startingAddress) => {
    go(startingAddress);

  };

  //for testing, hardcoded DRF auth token: `31abe86cc4359d469102c68fae094590c3683221`

  return (
    <SafeAreaView style={[themeStyles.container, {  backgroundColor: themeStyles.primaryBackground }]}>
            <View style={{width: '100%', height: '50%'}}>
              <>
              { homeLocation && (
                <Text>{homeLocation.address}</Text>
              )}
      {token && (
        <WebSocketCurrentLocation userToken={token} />
       )} 
       <TouchableOpacity 
       onPress={() => handleFindNewLocation(homeLocation?.address || 'Manchester, NH')}
        style={{height: 'auto', width: '100%',  alignItems: 'center', justifyContent: 'center'}}>
        <Text style={[themeStyles.primaryText, {fontSize: 50}]}>GO

        </Text>
       </TouchableOpacity>
       
       </>
      </View>
      <View style={{width: '100%', height: '20%' }}>
      {token ? (
        <WebSocketComponent userToken={token} />
      ) : (
        <View>
          <Text>Loading token...</Text>
        </View>
      )} 
      </View>

    </SafeAreaView>
  );
};


export default home;