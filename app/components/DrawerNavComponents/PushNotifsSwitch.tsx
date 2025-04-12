import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useUser } from "../../../src/context/UserContext";
import { useAppState } from "@/src/context/AppStateContext";
import { useAppMessage } from "@/src/context/AppMessageContext";

import { DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";

import MetaGuider from "../MetaGuider";

const PushNotifsSwitch = () => {
  const { appSettings, registerForNotifications, getNotificationPermissionStatus, removeNotificationPermissions } = useUser();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();

  const { isAppForeground, isAppBackground, isAppInactive } = useAppState();
const { showAppMessage } = useAppMessage();
  const [metaGuiderVisible, setMetaGuiderVisible ] = useState<boolean>(false);
  const [ returningFromPhoneSettings, setReturningFromPhoneSettings ] = useState<boolean>(false);
 
  const pressColor = themeStyles.primaryText.color;

  const setting = appSettings?.receive_notifications === true ? 'On' : 'Off';
 

  const handleReset = async () => {
    console.log('handleReset triggered');
    const currentPhonePermission = await getNotificationPermissionStatus();
    const userSettingsPermission = appSettings?.receive_notifications;

    console.log(currentPhonePermission);
    console.log(userSettingsPermission);
 
    if (currentPhonePermission === 'granted') {
      console.log('current permissions is granted');
      showAppMessage(true, null, `To change notification settings, please visit your phone's system settings.`, handlePhoneAppSettings, 'Settings');
    } else {
      showAppMessage(true, null, `To change notification settings, please visit your phone's system settings.`, handlePhoneAppSettings, 'Settings');
   
      // doesn't seem to work
      //maybe we don't check if granted is true in this function 
      //and just ask for permission every time
      //registerForNotifications();


    } 

  };

  const handlePhoneAppSettings = () => {
    
    setReturningFromPhoneSettings(true);
    Linking.openSettings();
    setMetaGuiderVisible(false);



  };

  useEffect(() => {
    if (isAppForeground && returningFromPhoneSettings) {
      console.log('returning from phone app settings!');
      registerForNotifications();
      setReturningFromPhoneSettings(false);
    }

  }, [isAppForeground]);

  return (
    <View style={{ height: "auto" }}>
      <DrawerItem
        icon={() => (
          <AntDesign
            name={'notification'}
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
        label={'Notifications'}
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
          <MetaGuider title={'title'} message={`To change notification settings, please visit your phone's system settings.`} isVisible={metaGuiderVisible} onPress={handlePhoneAppSettings} />
        </View> 
    </View>
  );
};

export default PushNotifsSwitch;
