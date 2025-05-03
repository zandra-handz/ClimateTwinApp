import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useUser } from "../../../src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { DrawerItem } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";

const DarkLightSwitch = () => { 
  const {settingsState, handleUpdateUserSettings } = useUserSettings();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();

  const currentMode =
    lightOrDark === "dark"
      ? { mode: "Light", icon: "sun" }
      : { mode: "Dark", icon: "moon" };
  //const pressColor = lightOrDark === "dark" ? "white" : "black";
  const pressColor = themeStyles.primaryText.color;
  const handlePress = () => {
    if (settingsState?.manual_dark_mode == null) {
      //console.log("lightDark handlePress PRESSED");
      handleUpdateUserSettings({ manual_dark_mode: false });
    } else if (settingsState?.manual_dark_mode === false) {
      // console.log("lightDark handlePress PRESSED");
      handleUpdateUserSettings({ manual_dark_mode: true });
    } else if (settingsState?.manual_dark_mode === true) {
      // console.log("lightDark handlePress PRESSED");
      handleUpdateUserSettings({ manual_dark_mode: false });
    }
  };

  const handleReset = () => { 
    handleUpdateUserSettings({ manual_dark_mode: null });
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

      {settingsState && settingsState.manual_dark_mode != null && (
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
