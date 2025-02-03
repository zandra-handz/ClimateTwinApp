import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useGeolocationWatcher } from '../hooks/useCurrentLocationWatcher';

import  useHomeLocation from '../hooks/useHomeLocation';
import { useGlobalStyles } from '../context/GlobalStylesContext';
import { useUser } from '../context/UserContext';
import { useSurroundings } from '../context/CurrentSurroundingsContext'; 

import { useAppMessage } from '../context/AppMessageContext'; 

import { StatusBar } from 'expo-status-bar'; 

const friends = () => { 
    const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
    const { showAppMessage } = useAppMessage();
  
 

 
  

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
               
              
              </View>
              
            </View>   
         
  </View>  
    </View>
    </>
  );
};


export default friends;