// For test purposes, not sure if will leave in for production builds

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useDeviceLocationContext } from "@/app/context/DeviceLocationContext";
import { DrawerItem } from "@react-navigation/drawer";
import {  AntDesign, Feather } from "@expo/vector-icons";

import * as Linking from "expo-linking";



const DeviceLocationSwitch = () => {
  const { appSettings, updateSettings } = useUser();
  const { deviceLocation, triggerNewPermissionRequest } = useDeviceLocationContext();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();
 
  const pressColor = themeStyles.primaryText.color;
 
  const handleReset = () => {
    if (deviceLocation?.address) {
        Linking.openSettings();
    } else {
        triggerNewPermissionRequest();
    } 
  };

  return (
    <View style={{ height: "auto" }}>
      <DrawerItem
                icon={() => (
                    <Feather
                      name={'map-pin'}
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
        label={'Device Location'}
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
              {deviceLocation?.address && 'On'}
              {!deviceLocation?.address && 'Off'}
            </Text>
          </TouchableOpacity>
        </View> 
    </View>
  );
};

export default DeviceLocationSwitch;
