import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useUser } from "../../context/UserContext";
import { DrawerItem } from "@react-navigation/drawer";
import {  Feather } from "@expo/vector-icons";
import NewItemsDot from "./NewItemsDot";
import { useRouter } from "expo-router";

const InboxWithNotifs = () => {
    const router = useRouter();
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
              name="mail"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
            
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Inbox"
          onPress={() => router.push("(inbox)")}
        />
 
        <View
          style={{
            position: "absolute",
            left: 110,
            height: "100%",
            justifyContent: "center",
            zIndex: 200,
          }}
        >

            <NewItemsDot />
 
        </View> 
    </View>
  );
};

export default InboxWithNotifs;
