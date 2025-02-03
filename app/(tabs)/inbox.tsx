import React from 'react';
import {   View } from 'react-native';
 
import { useGlobalStyles } from '../context/GlobalStylesContext'; 

import { StatusBar } from 'expo-status-bar'; 
const inbox = () => { 
    const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles(); 
  
 

  

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


export default inbox;