import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Flow,
  Swing,
  Chase,
  Circle,
  CircleFade,
  Fold,
  Grid,
  Pulse,
  Wander,
  Wave,
} from "react-native-animated-spinkit";
import { useUser } from "@/src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useSurroundings } from "@/src/context/CurrentSurroundingsContext";

const spinners = {
  circle: Circle,
  chase: Chase,
  swing: Swing,
  pulse: Pulse,
  grid: Grid,
  flow: Flow,
  circleFade: CircleFade,
  fold: Fold,
  wander: Wander,
  wave: Wave,
};

const ComponentSpinner = ({
  spinnerSize = 40,
  spinnerType = "pulse", //flow",
  showSpinner = false,
  backgroundColor = "transparent",
  useGradientBackground = false,
  isInitializerSpinner = false,
  isSocketSpinner = false,
  isInitAndSocketSpinner = false,
  offsetStatusBarHeight = false,
}) => {
  const {  constantColorsStyles } = useGlobalStyles();
  const { isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { isLocationSocketOpen, lastState } = useSurroundingsWS();
  const { pickNewSurroundingsMutation } = useSurroundings();

  // if (!showSpinner) return null;

  const offset = -100;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    <>

{isInitAndSocketSpinner &&
      (settingsAreLoading || (!isLocationSocketOpen &&
        isAuthenticated) || (pickNewSurroundingsMutation.isPending && isAuthenticated) ) && (
          <View
            style={[
              styles.container,
              {
                backgroundColor: backgroundColor,
                top: offsetStatusBarHeight ? offset : 0,
              }, //themeStyles.darkerBackground
            ]}
          > 
              <Spinner
                size={spinnerSize}
                color={'red'}
              //  color={constantColorsStyles.v1LogoColor.backgroundColor}
              /> 
          </View>
        )}

      {isInitializerSpinner &&
      (settingsAreLoading) && (
      //  ((isInitializing) || (!lastState && isAuthenticated)) && (
          <LinearGradient
            colors={[
              "pink", //"teal",
              constantColorsStyles.v1LogoColor.backgroundColor,
              // "transparent",
              // "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.container,
              { top: offsetStatusBarHeight ? offset : 0 },
            ]}
          >
            {/* {(isInitializing || (!lastState && isAuthenticated)) ? ( */}

              <Spinner
                size={spinnerSize}
                color={constantColorsStyles.v1LogoColor.backgroundColor}
              />
            {/* // ) : null} */}

          </LinearGradient>
        )}

      {isSocketSpinner &&
        !isLocationSocketOpen &&
        isAuthenticated &&
        !settingsAreLoading && (
          <View
            style={[
              styles.container,
              {
                backgroundColor: backgroundColor,
                top: offsetStatusBarHeight ? offset : 0,
              }, //themeStyles.darkerBackground
            ]}
          >
            {!isLocationSocketOpen && isAuthenticated && !settingsAreLoading ? (
              <Spinner
                size={spinnerSize}
                color={'red'}
              //  color={constantColorsStyles.v1LogoColor.backgroundColor}
              />
            ) : null}
          </View>
        )}

      {!isInitializerSpinner && !isSocketSpinner && !isInitAndSocketSpinner && (
        <View
          style={[
            styles.container,
            {
              backgroundColor: backgroundColor,
              top: offsetStatusBarHeight ? offset : 0,
            }, //themeStyles.darkerBackground
          ]}
        >
          {showSpinner ? (
            <Spinner
              size={spinnerSize}
              color={constantColorsStyles.v1LogoColor.backgroundColor}
            />
          ) : null}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // This ensures it fills the entire parent container
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
    //backgroundColor: "red",
  },

  //FOR FULL SCREEN:
  // container: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  //   zIndex: 5000, // High zIndex to stay on top
  //   elevation: 5000, // Ensures Android rendering priority
  // },
});

export default ComponentSpinner;
