import React  from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "../src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useGlobalStyles } from "../src/context/GlobalStylesContext"; 
import { useRouter } from "expo-router";
import SignInButton from "./components/SignInButton"; 
import { LinearGradient } from "expo-linear-gradient";
import CustomStatusBar from "./components/CustomStatusBar";
 
const index = () => {
  const { themeStyles,  constantColorsStyles } =
    useGlobalStyles(); 
  const { isAuthenticated  } = useUser();

  const { settingsAreLoading } = useUserSettings(); 

    //WHERE WAS USING BEFORE MAY 3
   // useProtectedRoute(isAuthenticated, isInitializing);

  
  
    // moved to drawer layout 
    // useExploreRoute(lastState, isAuthenticated, isInitializing); 

  const router = useRouter(); 
 

   
  const handleNavigateToSignIn = () => {
    router.push("/signin");
  }; 

  return (
    <>
      <CustomStatusBar />
      <LinearGradient
        colors={[
          "teal",
          //manualGradientColors.lightColor,
          constantColorsStyles.v1LogoColor.backgroundColor,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // start={{ x: 0, y: 1 }} // REVERSED:  start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 0 }} //end={{ x: 1, y: 1 }}
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
                {!isAuthenticated && !settingsAreLoading && (
                  <SignInButton
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
                  />
                )}
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
    fontSize: 14,
    lineHeight: 21,
  },
});

export default index;
