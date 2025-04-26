import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import { DrawerItem } from "@react-navigation/drawer";
import {  AntDesign  } from "@expo/vector-icons";
import NewItemsDot from "./NewItemsDot";
import { useRouter } from "expo-router"; 

const TreasuresWithNotifs = () => {
    const router = useRouter(); 
  const { lightOrDark, themeStyles, appContainerStyles, appFontStyles } =
    useGlobalStyles();
 
 
  return (
    <View style={{ height: "auto" }}>
        <DrawerItem
          icon={() => (
            <AntDesign
              name="gift"
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
          label="Treasures"
          onPress={() => router.push("/(treasures)")}
        />
 
        <View
          style={{
            position: "absolute",
            left: 140,  //adjust manually
            height: "100%",
            justifyContent: "center",
            zIndex: 200,
          }}
        >

            <NewItemsDot showUnread={'gifts'}/>
 
        </View> 
    </View>
  );
};

export default TreasuresWithNotifs;
