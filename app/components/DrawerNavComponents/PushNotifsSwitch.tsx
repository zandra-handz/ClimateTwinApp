import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useUser } from "../../../src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useAppState } from "@/src/context/AppStateContext";
import { useAppMessage } from "@/src/context/AppMessageContext";

import { DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import MetaGuider from "../MetaGuider";

const PushNotifsSwitch = () => {
 

  const { settingsState,
    handleRegisterForNotifications,
    getNotificationPermissionStatus
  } = useUserSettings();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();

  const { appState } = useAppState();
  const { showAppMessage } = useAppMessage();
  const [metaGuiderVisible, setMetaGuiderVisible] = useState<boolean>(false);
 
  const [returningFromPhoneSettings, setReturningFromPhoneSettings] =
    useState<boolean>(false);

  const pressColor = themeStyles.primaryText.color;

  const setting = settingsState?.receive_notifications === true ? "On" : "Off";

  const handleReset = async () => { 
    const currentPhonePermission = await getNotificationPermissionStatus();
    const userSettingsPermission = settingsState?.receive_notifications;

    // console.log(currentPhonePermission);
    // console.log(userSettingsPermission);

    if (currentPhonePermission === "granted") {
     // console.log("current permissions is granted");
      showAppMessage(
        true,
        null,
        `To change notification settings, please visit your phone's system settings.`,
        handlePhonesettingsState,
        "Settings"
      );
    } else {
      showAppMessage(
        true,
        null,
        `To change notification settings, please visit your phone's system settings.`,
        handlePhonesettingsState,
        "Settings"
      );

      // doesn't seem to work
      //maybe we don't check if granted is true in this function
      //and just ask for permission every time
      //registerForNotifications();
    }
  };

  const handlePhonesettingsState = () => {
    setReturningFromPhoneSettings(true);
    Linking.openSettings();
    setMetaGuiderVisible(false);
  };

  useEffect(() => {
    if (appState === "active" && returningFromPhoneSettings) { 
      handleRegisterForNotifications();
      setReturningFromPhoneSettings(false);
    }
  }, [appState]);

  return (
    <View style={{ height: "auto" }}>
      <DrawerItem
        icon={() => (
          <Feather
            name={settingsState?.receive_notifications ? "bell" : "bell-off"}
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
        label={"Notifications"}
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
            {setting}
          </Text>
        </TouchableOpacity>
        <MetaGuider
          title={"title"}
          message={`To change notification settings, please visit your phone's system settings.`}
          isVisible={metaGuiderVisible}
          onPress={handlePhonesettingsState}
        />
      </View>
    </View>
  );
};

export default PushNotifsSwitch;
