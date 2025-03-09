import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalStyles } from '../context/GlobalStylesContext'

const GoToItemButton = ({label, onPress}) => {
    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  
  
    return (
    <TouchableOpacity onPress={onPress} style={appContainerStyles.goToItemButtonContainer}>
      <Text style={appFontStyles.GoToItemButtonText}>{label}</Text>
   
    </TouchableOpacity>

  )
}

export default GoToItemButton;