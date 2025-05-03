import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
  
import { DrawerItem } from "@react-navigation/drawer";
import {  Feather } from "@expo/vector-icons";
import NewItemsDot from "./NewItemsDot";
import { useRouter } from "expo-router";

const InboxWithNotifs = () => {
    const router = useRouter();  
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();


  
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
          onPress={() => router.push("/(inbox)")}
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

            <NewItemsDot showUnread={'all'}/>
 
        </View> 
    </View>
  );
};

export default InboxWithNotifs;
