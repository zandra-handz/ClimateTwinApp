import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalStyles } from '../context/GlobalStylesContext'

const GoToItemButton = ({label, onPress}) => {
    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  
  
    return (
    <TouchableOpacity onPress={onPress} style={[appContainerStyles.goToItemButtonContainer, {borderColor: themeStyles.primaryText.color}]}>
      <Text style={[appFontStyles.GoToItemButtonText, themeStyles.primaryText]}>{label}</Text>
   
    </TouchableOpacity>

  )
}

export default GoToItemButton;