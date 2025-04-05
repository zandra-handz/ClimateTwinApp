import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
 import { useDeviceLocationContext } from "../context/DeviceLocationContext";
 
const TurnOnLocationButton = () => { 
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
 
  const { triggerNewPermissionRequest } = useDeviceLocationContext();

  const handleButtonPress = () => {
    triggerNewPermissionRequest();
    console.log("implement turn on location manually feature");
  };
  return (
    <>
      <TouchableOpacity
        onPress={handleButtonPress}
        style={[
          appContainerStyles.bigGoButtonContainer,
          themeStyles.primaryOverlayBackground,
          { borderColor: themeStyles.tabBarHighlightedText.color },
        ]}
      >
        <>
          <View
            style={{
              flexWrap: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              width: "100%",
            }}
          >
            <Text style={[themeStyles.primaryText, appFontStyles.goButtonText]}>
              Turn on location
            </Text>
          </View>  
        </>
      </TouchableOpacity>
    </>
  );
};

export default TurnOnLocationButton;
