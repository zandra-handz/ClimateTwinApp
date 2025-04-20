import {
  View,
  Text,
  TouchableOpacity,
  //Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useUser } from "../../../src/context/UserContext"; 
import { Image } from "expo-image";
import ClimateTwinLogo from "../../assets/images/logo.png";
import DarkLightSwitch from "./DarkLightSwitch";
import { AntDesign, Feather  } from "@expo/vector-icons"; 
import InboxWithNotifs from "./InboxWithNotifs";


//Remove for production (?)
import DeviceLocationSwitch from "./DeviceLocationSwitch";
import PushNotifsSwitch from "./PushNotifsSwitch";

const DrawerCustomizer = (props) => {
  const {
    lightOrDark,
    themeStyles,
    constantColorsStyles,
    appContainerStyles,
    appFontStyles,
  } = useGlobalStyles();
  const { user, onSignOut } = useUser();

  const username = user?.username || null;
  const email = user?.email || null;

  const handleSignOut = () => {
    onSignOut();
  };

  const router = useRouter();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: 0,
        paddingStart: 0,
        paddingEnd: 0,
      }}
      style={[themeStyles.darkerBackground, appContainerStyles.drawerContainer]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themeStyles.darkerBackground.backgroundColor,
        }}
      >
        {/* <CustomStatusBar /> */}
        {/* <StatusBar translucent={true} /> */}
        <View
          style={[
            //themeStyles.primaryBackground,
            constantColorsStyles.v1LogoColor,
            appContainerStyles.drawerHeaderContainer,
          ]}
        >
          <View style={appContainerStyles.drawerHeaderMainRow}>
            <View style={appContainerStyles.drawerHeaderImageContainer}>
              <Image
                source={ClimateTwinLogo}
                style={{ width: 100, height: 180, resizeMode: "cover" }}
                //  contentFit="contain"
              />
            </View>
            {/* <ClimateTwinLogoSvg
            height={200}
            width={200}
            style={{ top: -40, left: -30 }}
            color={themeStyles.primaryText.color}
          /> */}
            <View style={appContainerStyles.drawerHeaderUserInfo}>
              <Text
                style={[
                  appFontStyles.drawerHeaderWelcomeText,
                  { color: constantColorsStyles.v1LogoColor.color },
                ]}
              >
                Hiya, {username}!
              </Text>
              <Text style={{ color: constantColorsStyles.v1LogoColor.color }}>
                {email}
              </Text>
            </View>
          </View>
          <View style={appContainerStyles.drawerHeaderBottomRow}>
            <Text
              style={[
                appFontStyles.drawerHeaderSubRowText,
                { color: constantColorsStyles.v1LogoColor.color },
              ]}
            >
              ClimateTwin App
            </Text>
          </View>
        </View>
        <DrawerItem
          icon={() => (
            <Feather
              name="compass"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Go!"
          onPress={() => router.push("/(exploretabs)")}
        />
        <DrawerItem
          icon={() => (
            <Feather
              name="users"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
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
        <InboxWithNotifs/> 
        <DrawerItem
          icon={() => (
            <AntDesign
              name="gift"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
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
        <DrawerItem
          icon={() => (
            <Feather
              name="rewind" //activity
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="History"
          onPress={() => router.push("/(history)")}
        />
                <DrawerItem
          icon={() => (
            <Feather
              name="activity" //activity
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Stats"
          onPress={() => router.push("/(stats)")}
        />
        <DrawerItem
                  icon={() => (
                    <Feather
                      name="zoom-in"
                      size={appFontStyles.exploreTabBarIcon.width}
                      color={themeStyles.exploreTabBarText.color}
                      {...props}
                    />
                  )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Accessibility"
          onPress={() => router.push("/(treasures)")}
        />
        <DarkLightSwitch />
        <DeviceLocationSwitch />
        <PushNotifsSwitch />
        <DrawerItem
          icon={() => (
            <AntDesign
              name="setting"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"lightblue"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Manage account"
          onPress={() => router.push("/(profile)")}
        />
        <DrawerItem
          icon={() => (
            <AntDesign
              name="logout"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.exploreTabBarText.color}
              {...props}
            />
          )}
          labelStyle={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          pressColor={"red"}
          style={[
            themeStyles.darkerBackground,
            appContainerStyles.drawerButtonContainer,
            { borderBottomColor: themeStyles.primaryText.color },
          ]}
          label="Sign Out"
          onPress={() => handleSignOut()}
        />

        {/* <TouchableOpacity
          onPress={() => handleSignOut()}
          style={[
            appContainerStyles.drawerSignoutButton,
            themeStyles.darkerBackground,
          ]}
        >
          <Text
            style={[themeStyles.primaryText, appFontStyles.drawerLabelText]}
          >
            Sign out
          </Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    alignItems: "center",
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DrawerCustomizer;
