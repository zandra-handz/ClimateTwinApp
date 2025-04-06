import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { useAppState } from "@/app/context/AppStateContext";
import { DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";

const PushNotifsSwitch = () => {
  const { appSettings, registerForNotifications } = useUser();
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();

  const { isAppForeground, isAppBackground, isAppInactive } = useAppState();


  const [ returningFromPhoneSettings, setReturningFromPhoneSettings ] = useState<boolean>(false);
 
  const pressColor = themeStyles.primaryText.color;

  const setting = appSettings?.receive_notifications === true ? 'On' : 'Off';
 

  const handleReset = () => {
    if (appSettings?.receive_notifications === true) {
      setReturningFromPhoneSettings(true);
      Linking.openSettings();
      // app state will then trigger registering for notifications upon return to app
     
    } else {
      registerForNotifications();

    } 

  };

  useEffect(() => {
    if (isAppForeground && returningFromPhoneSettings) {
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
        </View> 
    </View>
  );
};

export default PushNotifsSwitch;
