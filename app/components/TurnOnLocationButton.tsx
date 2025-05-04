import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppMessage } from "@/src/context/AppMessageContext";
import { useAppState } from "@/src/context/AppStateContext";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
 import { useDeviceLocationContext } from "../../src/context/DeviceLocationContext";
 import * as Linking from "expo-linking";  
 import MetaGuider from "./MetaGuider";
 
const TurnOnLocationButton = () => { 
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { appState } = useAppState();
  const { showAppMessage } = useAppMessage();
   const [metaGuiderVisible, setMetaGuiderVisible] = useState<boolean>(false);
  
  const { triggerNewPermissionRequest } = useDeviceLocationContext();
    const [returningFromPhoneSettings, setReturningFromPhoneSettings] =
      useState<boolean>(false);

  // const handleButtonPress = () => {
  //   triggerNewPermissionRequest();
  // //  console.log("implement turn on location manually feature");
  // };

  
    const handlePhonesettingsState = () => {
      setReturningFromPhoneSettings(true);
      Linking.openSettings(); 
    };

  const handleReset = async () => {
    showAppMessage(
      true,
      null,
      `To change your location setting, please visit your phone's system settings.`,
      handlePhonesettingsState,
      "Settings"
    );
    

  }
    useEffect(() => {
      if (appState === "active" && returningFromPhoneSettings) {
        triggerNewPermissionRequest();
        setReturningFromPhoneSettings(false);
      }
    }, [appState]);

  return (
    <>
      <TouchableOpacity
        onPress={handleReset}
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
      <MetaGuider
          title={"title"}
          message={`To change notification settings, please visit your phone's system settings.`}
          isVisible={metaGuiderVisible}
          onPress={handlePhonesettingsState}
        />
    </>
  );
};

export default TurnOnLocationButton;
