import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StyleSheet, AccessibilityInfo } from "react-native";
import { useColorScheme } from "react-native";
import { useUser } from "./UserContext";

// Define the types for the global styles state
interface GradientColors {
  darkColor: string;
  lightColor: string;
}

interface Styles {
  fontSize: number;
  highContrast: boolean;
  screenReader: boolean;
  receiveNotifications: boolean;
  theme: "light" | "dark";
  gradientColors: GradientColors;
  gradientColorsHome: GradientColors;
  manualGradientColors: {
    darkColor: string;
    lightColor: string;
    homeDarkColor: string;
    homeLightColor: string;
  };
  gradientDirection: { x: number; y: number };
}

// Define the type for the context value
interface GlobalStylesContextType extends Styles {
  themeStyles: Record<string, any>;
  themeStyleSpinners: Record<string, string>;
  nonCustomHeaderPage: boolean;
  setNonCustomHeaderPage: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with the appropriate types
const GlobalStylesContext = createContext<GlobalStylesContextType | undefined>(
  undefined
);

export const useGlobalStyles = () => {
  const context = useContext(GlobalStylesContext);
  if (!context) {
    throw new Error(
      "useGlobalStyles must be used within a GlobalStylesProvider"
    );
  }
  return context;
};

// Type the props for GlobalStylesProvider
interface GlobalStylesProviderProps {
  children: ReactNode;
}

export const GlobalStylesProvider: React.FC<GlobalStylesProviderProps> = ({
  children,
}) => {
  const { user, appSettings } = useUser();
  const colorScheme = useColorScheme();
  const [nonCustomHeaderPage, setNonCustomHeaderPage] =
    useState<boolean>(false);

  // Default state with types
  const [styles, setStyles] = useState<Styles>({
    fontSize: 16,
    highContrast: false,
    screenReader: false,
    receiveNotifications: false,
    theme: colorScheme || "light", // default to light if undefined
    gradientColors: {
      darkColor: "#4caf50",
      lightColor: "#a0f143",
    },
    gradientColorsHome: {
      darkColor: "#000002",
      lightColor: "#163805",
    },
    manualGradientColors: {
        // darkColor: "#09B1EC", 
        // lightColor: "#65C2F5", 
      darkColor: "#0463CA",
      lightColor: "#0487E2",
      homeDarkColor: "#000002",
      homeLightColor: "#163805",
    },
    gradientDirection: { x: 1, y: 0 },
  });

  useEffect(() => {
    if (user.authenticated && appSettings) {
      console.log(
        `APP SETTINGS IN GLOBAL STYLES: ${appSettings.manual_dark_mode}`
      );
      const determineTheme = () => {
        if (appSettings.manual_dark_mode !== null) {
          return appSettings.manual_dark_mode ? "dark" : "light";
        }
        return colorScheme || "dark";
      };

      setStyles((prevStyles) => ({
        ...prevStyles,
        fontSize: appSettings.large_text ? 20 : 16,
        highContrast: appSettings.high_contrast_mode,
        screenReader: appSettings.screen_reader,
        receiveNotifications: appSettings.receive_notifications,
        theme: determineTheme(),
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        theme: colorScheme || "dark",
      }));
    }
  }, [user.authenticated, appSettings, colorScheme]);

  // Effect to adjust styles based on the theme
  useEffect(() => {
    if (styles.theme === "light") {
      setStyles((prevStyles) => ({
        ...prevStyles,
        gradientColors: {
          darkColor: "#ffffff",
          lightColor: "#ffffff",
        },
        gradientColorsHome: {
          darkColor: "#ffffff",
          lightColor: "#ffffff",
        },
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        gradientColors: {
          darkColor: "#4caf50",
          lightColor: "#a0f143",
        },
        gradientColorsHome: {
          darkColor: "#000002",
          lightColor: "#163805",
        },
      }));
    }
  }, [styles.theme]);

  // Define theme styles for dark and light modes
  const themeStyles =
    styles.theme === "dark" ? darkThemeStyles : lightThemeStyles;
  const appFontStyles = fontStyles;
  const appContainerStyles = containerStyles;

  const themeStyleSpinners = {
    homeScreen: "flow",
  };

  return (
    <GlobalStylesContext.Provider
      value={{
        ...styles,
        themeStyles,
        appFontStyles,
        appContainerStyles,
        themeStyleSpinners,
        nonCustomHeaderPage,
        setNonCustomHeaderPage,
      }}
    >
      {children}
    </GlobalStylesContext.Provider>
  );
};

const containerStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
    paddingVertical: "3%",
  },
  innerFlexStartContainer: {
    width: "100%",
    paddingHorizontal: "3%",
    flexDirection: "column",
    flex: 1,
  },
  inScreenHeaderContainer: {
    width: "100%",
    padding: "4%",
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    height: "auto",
    borderRadius: 10,
    backgroundColor: "teal",
  },
  defaultScreenElementContainer: {
    padding: "4%",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: 'orange',
    borderRadius: 20,
    borderWidth: 1,
  },
  defaultElementRow: {
    flexDirection: "row",
    width: "100%",
    height: "auto",
    flexWrap: "wrap",
    flex: 1,
  },
});

const fontStyles = StyleSheet.create({
  solitaryHeaderMessageText: {
    fontSize: 20,
  },
  subHeaderMessageText: {
    fontSize: 16,
  },
  emphasizedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

const lightThemeStyles = StyleSheet.create({
  dangerZoneText: {
    color: "#B22222",
  },
  signinText: {
    color: "black",
    fontFamily: "Poppins-Bold",
  },
  signInAppDescription: {
    fontColor: "black",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "3%",
  },
  primaryBackground: {
    backgroundColor: "#ffffff",
  },
  darkerBackground: {
    backgroundColor: "#ccc",
  },
  primaryText: {
    color: "#121212",
  },
  headerTextSize: {
    fontSize: 18,
  },
  genericIcon: {
    color: "#121212",
  },
  selectedIconBorder: {
    borderColor: "darkgreen",
  },
  subHeaderText: {
    color: "#121212",
  },
  input: {
    color: "#121212",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: "100%",
    borderColor: "lightgray",
    backgroundColor: "white",
    placeholderTextColor: "lightgray",
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    fontSize: 16,
  },
  borderColor: {
    color: "white",
  },
  friendFocusSection: {
    backgroundColor: "white",
  },
  friendFocusSectionText: {
    color: "#121212",
  },
  friendFocusSectionIcon: {
    color: "#121212",
  },
  modalContainer: {
    backgroundColor: "white",
  },
  modalText: {
    color: "#121212",
  },
  modalIconColor: {
    color: "#121212",
  },
  toggleButtonColor: {
    backgroundColor: "#ccc",
  },
  toggleOn: {
    backgroundColor: "#4cd137",
  },
  toggleOff: {
    backgroundColor: "#dcdde1",
  },
  footerContainer: {
    backgroundColor: "white",
    borderTopWidth: 0.4,
    borderColor: "black",
  },
  headerContainer: {
    backgroundColor: "white",
    borderBottomWidth: 0.4,
    borderColor: "transparent",
  },
  headerContainerNoBorder: {
    backgroundColor: "white",
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: "gray",
  },
  footerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#121212",
  },
  footerIcon: {
    color: "#121212",
  },
  headerText: {
    color: "#121212",
  },
  headerIcon: {
    color: "#121212",
  },
  upcomingNavIcon: {
    color: "#121212",
  },
  upcomingNavText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#121212",
  },
  header: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#121212",
});

const darkThemeStyles = StyleSheet.create({
  dangerZoneText: {
    color: "#B22222",
  },
  signinText: {
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  signInAppDescription: {
    fontColor: "black",
    fontSize: 16,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "3%",
  },

  primaryBackground: {
    backgroundColor: "#121212",
  },
  darkerBackground: {
    backgroundColor: "#2B2B2B",
  },
  darkestBackground: {
    backgroundColor: "#242424",
  },
  primaryText: {
    color: "#d3d3d3",
  },
  headerTextSize: {
    fontSize: 18,
  },
  genericIcon: {
    color: "#d3d3d3",
  },
  selectedIconBorder: {
    borderColor: "#d4edda",
  },
  subHeaderText: {
    color: "#d3d3d3",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  input: {
    color: "#d3d3d3",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    backgroundColor: "#121212",
    placeholderTextColor: "darkgray",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: "100%",
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    fontSize: 16,
  },
  borderColor: {
    color: "#121212",
  },
  friendFocusSection: {
    backgroundColor: "#121212",
  },
  friendFocusSectionText: {
    color: "#d3d3d3",
  },
  friendFocusSectionIcon: {
    color: "#d3d3d3",
  },
  modalContainer: {
    backgroundColor: "#2B2B2B",
  },
  modalText: {
    color: "#d3d3d3",
  },
  modalIconColor: {
    color: "#d3d3d3",
  },
  toggleButtonColor: {
    backgroundColor: "#ccc",
  },
  toggleOn: {
    backgroundColor: "#4cd137",
  },
  toggleOff: {
    backgroundColor: "#dcdde1",
  },
  footerContainer: {
    backgroundColor: "#000002",
    borderTopWidth: 0.2,
    borderColor: "#4caf50",
  },
  headerContainer: {
    backgroundColor: "#000002",
    borderBottomWidth: 0.4,
    borderColor: "transparent",
  },
  headerContainerNoBorder: {
    backgroundColor: "#121212",
  },

  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  divider: {
    width: 0.4,
    backgroundColor: "#ccc",
  },
  footerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#d3d3d3",
  },
  footerIcon: {
    color: "#d3d3d3",
  },
  headerText: {
    color: "#d3d3d3",
  },
  headerIcon: {
    color: "#d3d3d3",
  },
  UpcomingNavText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    textAlign: "center",
    color: "#d3d3d3",
  },
  upcomingNavIcon: {
    color: "#d3d3d3",
  },
  header: {
    backgroundColor: "black",
    borderBottomColor: "darkgray",
    borderBottomWidth: 1,
  },
  headerTextColor: "#d3d3d3",
});

export default GlobalStylesProvider;
