import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

const Avatar = ({ image, size = 100 }) => {

  const { themeStyles } = useGlobalStyles();

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
            cachePolicy="memory-disk"
          />
        </View>
      )}
      {!image && (
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
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: themeStyles.primaryBackground.backgroundColor,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather
            name='user'
            size={size / 1.3}
            opacity={.6}
            color={themeStyles.primaryText.color}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Avatar;
