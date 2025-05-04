// For test purposes, not sure if will leave in for production builds

import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppState } from "@/src/context/AppStateContext";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useAppMessage } from "@/src/context/AppMessageContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useDeviceLocationContext } from "@/src/context/DeviceLocationContext";
import { DrawerItem } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons"; 

import * as Linking from "expo-linking";

const DeviceLocationSwitch = () => {
  const { appState } = useAppState();
  const { showAppMessage } = useAppMessage();
  const { settingsState, handleUpdateUserSettings } = useUserSettings();
  const { deviceLocation, triggerNewPermissionRequest } =
    useDeviceLocationContext();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
 
  const [returningFromPhoneSettings, setReturningFromPhoneSettings] =
    useState<boolean>(false);
  const pressColor = themeStyles.primaryText.color;

  const handleReset = () => {
    showAppMessage(
      true,
      null,
      `To change your location setting, please visit your phone's system settings.`,
      handlePhonesettingsState,
      "Settings"
    );
  };

  const handlePhonesettingsState = () => {
    setReturningFromPhoneSettings(true);
    Linking.openSettings(); 
  };

  useEffect(() => {
    if (appState === "active" && returningFromPhoneSettings) {
      triggerNewPermissionRequest();
      setReturningFromPhoneSettings(false);
    }
  }, [appState]);

  return (
    <View style={{ height: "auto" }}>
      <DrawerItem
        icon={() => (
          <Feather
            name={"map-pin"}
            size={appFontStyles.exploreTabBarIcon.width}
            color={themeStyles.exploreTabBarText.color}
          />
        )}
        labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
        pressColor={pressColor}
        style={[
          themeStyles.darkerBackground,
          appContainerStyles.drawerButtonContainer,
          { borderBottomColor: themeStyles.primaryText.color },
        ]}
        label={"Device Location"}
        onPress={() => handleReset()}
      />
      <View
        style={{
          position: "absolute",
          right: 10,
          height: "100%",
          justifyContent: "center",
          zIndex: 200,
        }}
      >
        <TouchableOpacity onPress={() => handleReset()} style={[]}>
          <Text
            style={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          >
            {deviceLocation?.address && "On"}
            {!deviceLocation?.address && "Off"}
          </Text>
        </TouchableOpacity>
 
      </View>
    </View>
  );
};

export default DeviceLocationSwitch;
