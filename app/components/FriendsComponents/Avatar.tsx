import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

const Avatar = ({image, size=100}) => {
  return (
    <View>
              {image && (
                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: 0,
                    paddingVertical: 10,
                    borderRadius: size / 2,
                    alignItems: "center",
                    alignContent: "center",
      
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    // key={imageUri}
                    source={{ uri: image }}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      backgroundColor: "pink",
                    }}
                    contentFit="cover" //change to contain to fit whole image
                  />
                </View>
              )}
    </View>
  )
}

export default Avatar