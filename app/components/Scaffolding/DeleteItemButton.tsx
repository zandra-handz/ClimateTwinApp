import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalStyles } from '../../../src/context/GlobalStylesContext'
import { AntDesign, Feather } from '@expo/vector-icons'

const DeleteItemButton = ({label, onPress}) => {
    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  
  
    return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              //  position: "absolute",
               // right: 10,
               // bottom: 90,
              }}
            >
              <View style={{ marginHorizontal: 3 }}>
                <TouchableOpacity
                  style={[
                    appContainerStyles.floatingIconButtonContainer,
                    { borderColor: themeStyles.primaryText.color },
                  ]}
                  onPress={onPress}
                >
                  <Feather
                    name="delete"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={themeStyles.exploreTabBarText.color}
                    // onPress={handleCaptureImage}
                  />
                </TouchableOpacity>
              </View>
            </View>

  )
}

export default DeleteItemButton;