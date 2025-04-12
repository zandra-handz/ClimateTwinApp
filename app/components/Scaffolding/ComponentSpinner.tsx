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
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { LinearGradient } from "expo-linear-gradient";

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

const ComponentSpinner = (
  { spinnerSize = 90, spinnerType = "flow", showSpinner = false, backgroundColor='transparent', useGradientBackground=false, isInitializerSpinner=false  },
 
) => {
  const { themeStyles, constantColorsStyles } = useGlobalStyles();
  const { isInitializing } = useUser();
  const { isLocationSocketOpen } = useSurroundingsWS();

  // if (!showSpinner) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    <>
    {useGradientBackground && (isInitializing || !isLocationSocketOpen) && (
      
      <LinearGradient
        colors={[
          // 'teal', 
          // constantColorsStyles.v1LogoColor.backgroundColor,
          'transparent', 'transparent'
          
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container]}
      >
      {(isInitializing || !isLocationSocketOpen) ? (
         
          <Spinner
            size={spinnerSize}
            color={constantColorsStyles.v1LogoColor.backgroundColor}
          /> 
      ) : null}
    </LinearGradient>
    )}

{!useGradientBackground && (
      
      <View
        style={[
          styles.container, {backgroundColor: backgroundColor}//themeStyles.darkerBackground
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
  textContainer: {
    position: "absolute",
    top: "36%",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    backgroundColor: 'pink',
    justifyContent: "center",
    alignItems: "center", 
    width: '100%',
  },
  loadingTextBold: {
    fontSize: 22,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingBottom: 20,
  },
});

export default ComponentSpinner;
