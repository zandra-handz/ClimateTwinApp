import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react'; 
import { useGlobalStyles } from "../context/GlobalStylesContext";
import useGoes from '../hooks/useGoes';
import { useActiveSearch } from '../context/ActiveSearchContext';


const GoButton = ({address}) => {
  const { handleGo, remainingGoes } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();



  const handleButtonPress = () => {
    handleGo(address);

  };
  
  return (
    <View style={{width: '100%', height: appFontStyles.goButtonText.fontSize + 60 }}>
      {remainingGoes && remainingGoes !== '0' && (
        
          <TouchableOpacity
            onPress={handleButtonPress}
            style={{
              height: '100%', 
              width: "100%", 
              flex: 1,
              alignItems: "center", 
           
            }}
          >
            <>
            <Text style={[themeStyles.primaryText, appFontStyles.goButtonText]}>GO</Text>
            <Text style={[themeStyles.primaryText, { fontSize: 10 }]}>{remainingGoes && `Remaining trips: ${remainingGoes}`}</Text>
            </>
          </TouchableOpacity>
      )}
      {remainingGoes && remainingGoes === '0' && (
         <Text style={[themeStyles.primaryText, { fontSize: 16, marginVertical: 20 }]}>No trips left for today. Your wings need to rest! </Text>

      )}
          
      
    </View>
  )
}

export default GoButton;