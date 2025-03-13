import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { Image } from "expo-image";

const GroqImageCard = ({  value }) => {
  const { themeStyles,  appContainerStyles } = useGlobalStyles();

  const streetViewUrl = value || null;

  return (
    <View
      style={[
        appContainerStyles.groqImageContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 0,
          paddingVertical: 0,

          width: "100%",
          justifyContent: "center",
        }}
      >
       
       {streetViewUrl && (
          <Image
            source={streetViewUrl}
            style={{ width: 500, height: 300, borderRadius: 30 }}
            contentFit="cover"  //contain
          />
        )}
      </View>
    </View>
  );
};

export default GroqImageCard;
