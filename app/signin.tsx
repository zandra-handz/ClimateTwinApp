import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions, 
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useUser } from "./context/UserContext";
import { useGlobalStyles } from "./context/GlobalStylesContext";
import { useAppMessage } from "./context/AppMessageContext"; 
import { useFonts } from "expo-font"; 
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; 

import * as SecureStore from 'expo-secure-store';

import { useRouter, Link } from "expo-router";


import { SafeAreaView } from "react-native-safe-area-context";
 
import { StatusBar } from 'react-native';
import SimpleBottomButton from "./components/SimpleBottomButton";

//a frienddate assistant for overwhelmed adults, and for people who just have a lot to talk about
 

const SignInScreen = () => {

const router = useRouter();
  //const route = useRoute();
  //const createNewAccount = route.params?.createNewAccount ?? false;
  const createNewAccount = false;

  const { showAppMessage } = useAppMessage();
  const { themeStyles, appFontStyles, appContainerStyles, gradientColors, manualGradientColors } =
    useGlobalStyles();
  const [showSignIn, setShowSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignInScreen, setSignInScreen] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const {
    user,
    onSignin,
    signinMutation,
    signupMutation,
    onSignUp,
    handleSignUp,
    reInitialize,
  } = useUser();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const verifyPasswordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [usernameInputVisible, setUsernameInputVisible] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const navigation = useNavigation();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [confirmedUserNotSignedIn, setConfirmedUserNotSignedIn] =
    useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  useLayoutEffect(() => {
    if (createNewAccount === true) {
      console.log("user wants to create new account");
      toggleMode();
    }
  }, [createNewAccount]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
  }, []);

//   useEffect(() => {
//     checkIfSignedIn();
//   }, []);

  const toggleMode = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setSignInScreen(false);
    setSignUpSuccess(false);
    setUsernameInputVisible(true);

    // Delay the focus function by 500ms (for example)
    setTimeout(() => {
      handleCreateAccountInitialFocus();
    }, 100); // Delay in milliseconds (500ms = 0.5 seconds)
  };

  const handleBackToSignIn = () => {
    setShowSignIn(true);
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
    setShowSignIn(true);
    setSignInScreen(true);
    setSignUpSuccess(false);
    if (usernameInputRef.current) {
      setUsernameInputVisible(true);

      usernameInputRef.current.focus();
    }
    setUsernameInputVisible(true);
  };

//   useEffect(() => {
//     if (signinMutation.isError) {
//       setPassword(null);
//       console.log("useeffect for sign in mutation error");
//       setUsernameInputVisible(true);

//       if (usernameInputRef.current) {
//         setUsernameInputVisible(true);
//         usernameInputRef.current.focus();
//       }
//     }
//   }, [signinMutation]);

  // const checkIfSignedIn = async () => {
  //   try {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY);
  //     if (token) {
  //       console.log(token);
  //       //showAppMessage(true, null, "Reinitializing...");
  //       reInitialize();
  //       // Optionally, handle any other logic needed after re-initialization
  //     } else {
  //       // No token found, show sign in
  //       setShowSignIn(true);
  //       setConfirmedUserNotSignedIn(true);
  //      // showAppMessage(true, null, "Signed out");
  //     }
  //   } catch (error) {
  //     console.error("Error checking sign-in status", error);
  //     // Handle errors as necessary
  //   }
  // };

  // useEffect(() => {
  //   console.log('user useeffect in auth screen triggered');
  //   if (user && user.authenticated) {
  //     console.log('navigating to home screen');
  //     navigateToHome();
  //   }

  // }, [user]);


  const navigateToRecoverCredentials = () => {
    router.push('/screen-recover-credentials'); // Navigate to the /recover-credentials screen
  };


  const navigateToHome = () => {
    //not the route anymore
    //router.push('(tabs)'); // Navigate to the /recover-credentials screen
  };

  const handleAuthentication = async () => {
    console.log('handleAuth pressed!');
    try {
        onSignin(username, password);

    } catch (error) {
        console.error(error);
    }
    // let result;
    // if (isSignInScreen) {
    //   try {
    //     showAppMessage(true, null, "Signing you in...");

    //     onSignin(username, password);
    //   } catch (error) {
    //     console.error(error);
    //     showAppMessage(true, null, `Error! Not signed in.`);
    //   }
    // } else {
    //   if (password !== verifyPassword) {
    //     //alert("Passwords do not match!");
    //     showAppMessage(true, null, "Oops! Passwords do not match");
    //     return;
    //   }
    //   console.log("passwords match, sending data...");
    //   result = await onSignUp(username, email, password);
    //   if (result && result.status === 201) {
    //     alert("Sign up was successful!");
    //     setSignUpSuccess(true);
    //     setLoading(false);
    //     navigation.navigate("Auth");
    //   } else if (result && result.error) {
    //     alert("Error: " + result.error);
    //   }
    // }
    // setLoading(false);
  };

  const handleNavigateBackToWelcomeScreen = () => {
    navigation.goBack();
  };

  const handleUsernameSubmit = () => {
    setUsernameInputVisible(false);
    if (passwordInputRef.current && username) {
      passwordInputRef.current.focus();
    }

    console.log("password input current");
  };

  const handleFirstPasswordSubmit = () => {
    setUsernameInputVisible(false);
    if (verifyPasswordInputRef.current) {
      verifyPasswordInputRef.current.focus();
    }

    console.log("password input current");
  };

  const handleCreateAccountInitialFocus = () => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  };

  const handleEmailSubmit = () => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  };

  if (!fontsLoaded) {
    return null; // Or any other loading indicator if fonts are not yet loaded
  }

  return (
    <>
      <StatusBar />
      <LinearGradient
        colors={[
          manualGradientColors.darkColor,
          manualGradientColors.lightColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container]}
      >
        <SafeAreaView
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleNavigateBackToWelcomeScreen}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: manualGradientColors.homeDarkColor,
              borderRadius: 20, // Half of the height/width to create a circle
            }}
          >
            <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}>
              x
            </Text>
          </TouchableOpacity>
          
          {/* <Text
                  style={styles.toggleButton} 
                  accessible={true} 
                >
                  {isSignInScreen ? "Sign in" : "Create new account"}
                </Text> */}
          <> 
              <View
                style={{ 
                  height: 40,
                  marginLeft: '2%',
                  paddingTop: "3%",
                }}
              >
                <Text
                  style={styles.toggleButton}
                  onPress={isSignInScreen ? toggleMode : handleBackToSignIn}
                  accessible={true}
                  accessibilityLabel="Toggle button"
                  accessibilityHint="Press to toggle between sign in and create account"
                >
                  {isSignInScreen ? "Create new account?" : "Go to sign in"}
                </Text>
              </View> 
              
          </>
          {!loading && username && password && !isSignInScreen && !isKeyboardVisible && (
                <View style={{width: '100%', position: 'absolute', bottom: 0, paddingBottom: 60, right: 0}}> 
                    <SimpleBottomButton
                      onPress={handleAuthentication}
                      title={isSignInScreen ? "Sign in" : "Create account"}
                    //   shapeSource={require("../assets/shapes/coffeecupdarkheart.png")}
                      shapeWidth={190}
                      shapeHeight={190}
                      shapePosition="left"
                      shapePositionValue={-48}
                      shapePositionVerticalValue={-23}
                      fontColor={themeStyles.primaryText.color}
                      accessible={true}
                      accessibilityLabel={
                        isSignInScreen
                          ? "Sign in button"
                          : "Create account button"
                      }
                      accessibilityHint="Press to sign in or create an account"
                    />  
                </View>
              )}
                            {!loading && username && password && isSignInScreen && (
                <>
                  <View style={{width: '100%', position: 'absolute', bottom: 0, paddingBottom: 60, right: 0}}> 
                   
                    <SimpleBottomButton
                      onPress={handleAuthentication}
                      title={isSignInScreen ? "Sign in" : "Create account"} 
                      fontColor={themeStyles.primaryText.color}
                      accessible={true}
                      accessibilityLabel={
                        isSignInScreen
                          ? "Sign in button"
                          : "Create account button"
                      }
                      accessibilityHint="Press to sign in or create an account"
                    />
                  </View>

                  {signUpSuccess && (
                    <Text
                      style={styles.successMessage}
                      accessible={true}
                      accessibilityLabel="Sign up success message"
                      accessibilityHint="Message indicating sign up was successful"
                    >
                      Sign up successful! Please log in.
                    </Text>
                  )}
                </>
              )}

          
        </SafeAreaView>

      </LinearGradient>

      {showSignIn && (
        <View
          style={[styles.form, { bottom: isKeyboardVisible ? 10 : "47%" }]}
          accessible={true}
          accessibilityLabel="Form container"
        >
          <Text
                  style={styles.inputHeaderText} 
                  accessible={true} 
                >
                  {isSignInScreen ? "Sign in" : "Create new account"}
                </Text>
          {!isSignInScreen  && (
            <View style={{ flexDirection: "column", width: "100%" }}> 
              <TextInput
                style={[styles.input, isEmailFocused && styles.inputFocused]}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                onSubmitEditing={handleEmailSubmit}
                ref={emailInputRef}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                accessible={true}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
                importantForAccessibility="yes"
              />
            </View>
          )} 
          <View style={{ flexDirection: "column", width: "100%" }}> 

            <TextInput
              style={[styles.input, isUsernameFocused && styles.inputFocused]}
              placeholder="Username"
              autoFocus={true}
              onChangeText={(text) => setUsername(text)}
              value={username}
              onSubmitEditing={() => handleUsernameSubmit()}
              ref={usernameInputRef}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
              accessible={true}
              accessibilityLabel="Username input"
              accessibilityHint="Enter your username"
              importantForAccessibility="yes"
            />
          </View>

         
            <View style={{ flexDirection: "column", width: "100%" }}> 
              <TextInput
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                placeholder="Password"
                autoFocus={false} //true
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={
                  isSignInScreen
                    ? handleAuthentication
                    : handleFirstPasswordSubmit
                }
                value={password}
                ref={passwordInputRef}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                accessible={true}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
                importantForAccessibility="yes"
              />

            </View> 

{isSignInScreen && (
            <View style={{ flexDirection: "row", width: "100%" }}> 
                <Text
                  style={styles.toggleButton}
                  onPress={() => navigateToRecoverCredentials()}
                  accessible={true}
                  accessibilityLabel="Toggle button"
                  accessibilityHint="Press to toggle between sign in and create account"
                >
                  {"Forgot username or password"}
                </Text>
              </View> 
              
  
)}
          {!isSignInScreen && (
            <View style={{ flexDirection: "column", width: "100%" }}>
          
              <TextInput
                style={[styles.input, isPasswordFocused && styles.inputFocused]}
                ref={verifyPasswordInputRef}
                placeholder="Verify Password"
                secureTextEntry={true}
                onChangeText={(text) => setVerifyPassword(text)}
                value={verifyPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                accessible={true}
                accessibilityLabel="Verify Password input"
                accessibilityHint="Re-enter your password for verification"
                importantForAccessibility="yes"
              />

            </View>
          )}
                       
        </View>
        
      )}
    </>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 20,
    height: 200,
    width: "100%",
    fontFamily: "Poppins-Regular",
    bottom: 10,
    paddingHorizontal: "4%",
    position: "absolute",
    //backgroundColor: 'blue',
    justifyContent: "flex-end",
    flex: 1,
    // width: "100%",
    // right: 0,
  },
  input: {
    fontFamily: "Poppins-Regular", 
    //fontWeight: 'bold',
    placeholderTextColor: "black",
    height: "auto",
    // borderBottomWidth: 3,
    borderWidth: 2.6,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center", 
    borderColor: "black",
    fontSize: 15,
  },
  inputFocused: {
    fontFamily: "Poppins-Regular",
    borderWidth: 3,
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,

    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 100,
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
  toggleButton: {
    color: "black",  
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    selfAlign: 'center', 
  },  
  inputHeaderText: {
    color: "black",  
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    selfAlign: 'center', 
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
    backgroundColor: "transparent", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    marginTop: 10,
    color: "green",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  xButtonText: {
    color: "black",
    fontSize: 30,
  },
});

export default SignInScreen;
