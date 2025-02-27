import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useUser } from "./context/UserContext";
import { useGlobalStyles } from "./context/GlobalStylesContext";
import { useAppMessage } from "./context/AppMessageContext";
import { useRouter, Link } from "expo-router";
import SignInButton from "./components/SignInButton";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store"; 
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "react-native";
import { useAppState } from "./context/AppStateContext";
import CustomStatusBar from "./components/CustomStatusBar";


//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about

const TOKEN_KEY = "accessToken";

const Index = () => {
  //const { showMessage } = useMessage();
  const { themeStyles, manualGradientColors } = useGlobalStyles();
  const [showSignIn, setShowSignIn] = useState(true);
  const { reInitialize } = useUser();
  const { showAppMessage } = useAppMessage();
    const { appStateVisible } = useAppState();

  const router = useRouter();
  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  // useEffect(() => {
  //   if (usernameInputRef.current) {
  //     setUsernameInputVisible(true);

  //     usernameInputRef.current.focus();
  //   }
  // }, []);

  // const handleNavigateToAuthScreen = (userHitCreateAccount) => {
  //   navigation.navigate("Auth", { createNewAccount: !!userHitCreateAccount });
  // };


  //implement here: pass in prop to tell signin if creating new account
  const handleNavigateToSignIn = () => {
    router.push("/signin");
  };

  const handleNavigateToHome = () => {
    router.push("(tabs)");
  };
  

  //i think i should do a condiitional check for user.authenticated at a higher level to ensure
  // app screens can't be viewed at all if user logged out

  const checkIfSignedIn = async () => {
    console.log('checking if signed in');
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        console.log(token);
        showAppMessage(true, null, "Reinitializing...");
        reInitialize();
        //handleNavigateToHome();
      } else {
        setShowSignIn(true);
        setConfirmedUserNotSignedIn(true);
        //  showMessage(true, null, "Signed out");
      }
    } catch (error) {
      console.error("Error checking sign-in status", error);
      // Handle errors as necessary
    }
  };

  // useEffect(() => {
  //   checkIfSignedIn();
  // }, []);

  const handleCreateAccountInitialFocus = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  return (
    <>
     <CustomStatusBar/>
      <LinearGradient
        colors={[
          manualGradientColors.darkColor,
          manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 1 }} // REVERSED:  start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} //end={{ x: 1, y: 1 }}
        style={[styles.container]}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <> 
              <>
                <View
                  style={{
                    width: "100%",
                    paddingBottom: "20%",
                    paddingHorizontal: "3%",
                  }}
                >
                  {/* <LogoSmaller
                    accessible={true} //field not in component
                    accessibilityLabel="App Logo" //field not in component
                    accessibilityHint="This is the logo of the app" //field not in component
                  /> */}
                </View>
                <View
                  style={{
                    bottom: "3%",
                    paddingHorizontal: "3%",
                    width: "100%",
                    right: 0,
                    position: "absolute",
                  }}
                >
                  {/* <SignInButton
                    onPress={() => handleNavigateToSignIn()}
                    title={"Sign in"}
                    // shapeSource={require("../assets/shapes/coffeecupdarkheart.png")}
                    shapeWidth={190}
                    shapeHeight={190}
                    shapePosition="left"
                    shapePositionValue={-48}
                    shapePositionVerticalValue={-23}
                    fontColor={themeStyles.primaryText.color}
                    accessible={true}
                    accessibilityLabel={"Sign in button"}
                    accessibilityHint="Press to sign in or create an account"
                  /> */}

                  {/* <View style={{paddingTop: '3%'}}>

                    <Text
                      style={styles.nonSignInButtonText}
                      onPress={() => handleNavigateToAuthScreen(true)} 
                      accessible={true}
                      accessibilityLabel="Toggle button"
                      accessibilityHint="Press to toggle between sign in and create account"
                    >
                       New account
                    </Text>

                    </View> */}
                </View>
              </> 
          </>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 10,
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    bottom: 10,
    position: "absolute",
    backgroundColor: "blue",
    justifyContent: "flex-end",
    flex: 1,
    // width: "100%",
    // right: 0,
  },
  input: {
    fontFamily: "Poppins-Regular",
    placeholderTextColor: "lightgray",
    height: "auto",
    borderBottomWidth: 1,
    padding: 10,
    paddingTop: 14,
    //borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "orange",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,

    // position: "absolute",
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height + 100,
    justifyContent: "space-between",

    alignItems: "center",
    width: "100%",
    paddingHorizontal: "3%",
  },
  title: {
    fontSize: 62,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  inputTitleTextAndPadding: {
    paddingLeft: "3%",
    //paddingBottom: "2%",
    fontSize: 18,
    fontWeight: "bold",
  },
  appDescription: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  nonSignInButtonText: {
    color: "black",
    marginTop: 2,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    //fontWeight: "bold",
    fontSize: 14,
    lineHeight: 21,
  },
});

export default Index;
