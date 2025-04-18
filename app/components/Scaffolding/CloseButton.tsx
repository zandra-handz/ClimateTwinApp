import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useGlobalStyles } from '../../../src/context/GlobalStylesContext'
import { AntDesign, Feather } from '@expo/vector-icons'

const CloseButton = ({ onPress, backgroundColor='transparent'}) => {
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
                    { borderColor: themeStyles.primaryText.color,
                        backgroundColor: backgroundColor
                    },
                  ]}
                  onPress={onPress}
                >
                  <Feather
                    name="x"
                    size={appFontStyles.exploreTabBarIcon.width}
                    color={themeStyles.primaryText.color}
                    // onPress={handleCaptureImage}
                  />
                </TouchableOpacity>
              </View>
            </View>

  )
}

export default CloseButton;