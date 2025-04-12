import { View, Text } from 'react-native';
import React from 'react';
import useInbox from '../../hooks/useInbox';
import { useGlobalStyles } from '../../../src/context/GlobalStylesContext';
 

const NewItemsDot = () => {
    const { unreadCount, inboxItems } = useInbox();
    
    const { themeStyles, appFontStyles, appContainerStyles, constantColorsStyles } = useGlobalStyles();
  return (
    <> 
       {unreadCount > 0 && (
        
    <View style={[appContainerStyles.newItemsNonCircle, {backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor}]}>
      <Text style={[appFontStyles.newItemsText, {color: constantColorsStyles.v1LogoColor.color}]}>{ inboxItems?.filter(item => item.is_read === false).length || 0} new</Text>
    </View>
    
  )}
    
    
    </>
  )
}

export default NewItemsDot;