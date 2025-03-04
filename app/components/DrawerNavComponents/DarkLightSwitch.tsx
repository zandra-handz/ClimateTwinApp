import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { DrawerItem } from "@react-navigation/drawer";
import {  Feather } from "@expo/vector-icons";

const DarkLightSwitch = () => {
  const { appSettings, updateSettings } = useUser();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();

  const currentMode =
    lightOrDark === "dark" ? {  mode: 'Light', icon: "sun" } : { mode: 'Dark', icon: "moon" };
  //const pressColor = lightOrDark === "dark" ? "white" : "black";
  const pressColor = themeStyles.primaryText.color;
  const handlePress = () => {
    if (appSettings?.manual_dark_mode == null) {
      console.log("lightDark handlePress PRESSED");
      updateSettings({ manual_dark_mode: false });
    } else if (appSettings?.manual_dark_mode === false) {
      console.log("lightDark handlePress PRESSED");
      updateSettings({ manual_dark_mode: true });
    } else if (appSettings?.manual_dark_mode === true) {
      console.log("lightDark handlePress PRESSED");
      updateSettings({ manual_dark_mode: false });
    }
  };

  const handleReset = () => {
    // Just pass the settings, no need to pass the user ID
    updateSettings({ manual_dark_mode: null });
  };

  return (
    <View style={{ height: "auto" }}>
      <DrawerItem
                icon={() => (
                    <Feather
                      name={currentMode?.icon}
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
        label={currentMode?.mode}
        onPress={() => handlePress()}
      />

      {appSettings && appSettings.manual_dark_mode != null && (
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
              Sync to phone
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DarkLightSwitch;
