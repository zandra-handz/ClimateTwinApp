import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { Image } from "expo-image";

const SingleImagePanel = ({ label, value }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  const streetViewUrl = value || null;

  return (
    <View
      style={[
        appContainerStyles.singleDetailPanelContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          paddingHorizontal: 10,
          paddingVertical: 8,

          width: "100%",
          justifyContent: "flex-start",
        }}
      >
       
       {streetViewUrl && (
          <Image
            source={streetViewUrl}
            style={{ width: '100%', height: 190, borderRadius: 30 }}
            contentFit="contain"
          />
        )}
      </View>
    </View>
  );
};

export default SingleImagePanel;
