import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import { DrawerItem } from "@react-navigation/drawer";
import {  Feather } from "@expo/vector-icons";
import NewItemsDot from "./NewItemsDot";
import { useRouter } from "expo-router"; 

const FriendsWithNotifs = () => {
    const router = useRouter();  
  const {   themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();
 
 
  return (
    <View style={{ height: "auto" }}>
        <DrawerItem
          icon={() => (
            <Feather
              name="users"
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
          label="Friends"
          onPress={() => router.push("/(friends)")}
        />
 
        <View
          style={{
            position: "absolute",
            left: 120, // adjust manually
            height: "100%",
            justifyContent: "center",
            zIndex: 200,
          }}
        >

            <NewItemsDot showUnread={'friends'}/>
 
        </View> 
    </View>
  );
};

export default FriendsWithNotifs;
