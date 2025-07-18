//create another stylesheet for AppStandards or something
//include borderradiuses, fadingedges for flatlists, paddings, etc

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
import { useUserSettings } from "./UserSettingsContext";

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
  appFontStyles: Record<string, any>;
  appContainerStyles: Record<string, any>;
  constantColorsStyles: Record<string, any>;
  appMiscStyles: Record<string, any>;
  themeStyleSpinners: Record<string, string>;
  nonCustomHeaderPage: boolean;
  avgPhotoColor: string | null;
  handleAvgPhotoColor: (color: string) => void;
  setNonCustomHeaderPage: React.Dispatch<React.SetStateAction<boolean>>;
  lightOrDark: "light" | "dark";
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
  const { isAuthenticated } = useUser();
  const { settingsState } = useUserSettings();
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
    if (settingsState) {
      // console.log(
      //   `APP SETTINGS IN GLOBAL STYLES: ${settingsState.manual_dark_mode}`
      // );
      const determineTheme = () => {
        if (settingsState.manual_dark_mode !== null) {
          return settingsState.manual_dark_mode ? "dark" : "light";
        }
        return colorScheme || "dark";
      };

      setStyles((prevStyles) => ({
        ...prevStyles,
        fontSize: settingsState.large_text ? 20 : 16,
        highContrast: settingsState.high_contrast_mode,
        screenReader: settingsState.screen_reader,
        receiveNotifications: settingsState.receive_notifications,
        theme: determineTheme(),
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        theme: colorScheme || "dark",
      }));
    }
  }, [settingsState, colorScheme]);

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
  const lightOrDark = styles.theme;

  const themeStyles = styles.theme === "dark" ? darkThemeStyles : lightThemeStyles;
  const constantColorsStyles = constantColors;
  const appFontStyles = fontStyles;
  const appContainerStyles = containerStyles;
  const appMiscStyles = miscStyles;

  const [avgPhotoColor, setAvgPhotoColor] = useState<string | null>(null);


  const handleAvgPhotoColor = (color: string) => {
    setAvgPhotoColor((prevColor) => {
      if (prevColor === color) {
        console.log("handleAvgPhotoColor skipped: Color is the same.");
        return prevColor;
      }
      console.log("handleAvgPhotoColor triggered!!!!!!!", color);
      return color;
    });
  };
  

  const themeStyleSpinners = {
    homeScreen: "flow",
  };

  return (
    <GlobalStylesContext.Provider
      value={{
        ...styles,
        themeStyles,
        lightOrDark,
        appFontStyles,
        constantColorsStyles,
        appMiscStyles,
        appContainerStyles,
        themeStyleSpinners,
        nonCustomHeaderPage,
        setNonCustomHeaderPage,
        avgPhotoColor,
        handleAvgPhotoColor,
      }}
    >
      {children}
    </GlobalStylesContext.Provider>
  );
};

const constantColors = StyleSheet.create({
  v1LogoColor: {
    backgroundColor: '#60aa68',
    color: '#ffffff',
  }

});

const containerStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "column",
    // paddingVertical: "0%",
    zIndex: 10,
  },
  portalBannerContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 70,  
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center', 
    justifyContent: "center", 

  },

  emptyBannerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10, 
    height: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center', 
    justifyContent: "center",

  },
  portalTempsAndSvgContainer: {
    width: '100%', 
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
   

  },
  mapHomeScreenContainer: {
    overflow: 'hidden',
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center', 
    borderRadius: 240 / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    flexWrap: 'wrap', 
    height: 240,
    width: 240, 
    borderWidth: StyleSheet.hairlineWidth,
    
  }, 
  bigGoButtonContainer: {
    overflow: 'hidden',
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    flexWrap: 'wrap',  
    // height: 240,
    // width: 240, 
    // borderRadius: 240 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    
  }, 
  goButtonContainer: {
    overflow: 'hidden',
    textAlign: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto', 
    borderWidth: StyleSheet.hairlineWidth,
    
  }, 
  drawerContainer: {
    width: '100%',
    flex: 1,
  },
  drawerHeaderContainer: { 
    width: '100%',
    flex: 1, 
    height: 200,
    paddingTop:30, 
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'column',
     
  },
  drawerHeaderMainRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: 110,
    alignContent: 'center',

  },
  drawerHeaderImageContainer: {
    //position: 'absolute',
    //top: 30,
    //left: -20,
    width: 110,
    overflow: 'hidden',  
    height: 110,
    
    
  },
  drawerHeaderUserInfo: {
    paddingTop: 30, //custom tinkering ugh 
    flex: 1, 
    height: 'auto', 
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',//this needs both alignItems and alignContents, NO i do not understand why
    
   // backgroundColor: 'teal',
    flexWrap: 'wrap',
    justifyContent: 'flex-end', 

  },
  drawerHeaderBottomRow: {
    flexDirection: 'column',
    justifyContent: 'flex-end', 
    width: '100%',
    flex: 1,  

  },
  drawerButtonContainer: { 
    marginHorizontal: 10,
    borderBottomWidth: 1, 
    borderRadius: 0,

  },
  drawerSignoutButton: {
    marginTop: 20,
    padding: 10,
    width: '100%',
    flexShrink: 1,
    backgroundColor: "red", 
    borderRadius: 5,

  },
  drawerLightDarkButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    padding: 10, 
    flexShrink: 1,  
    borderRadius: 5,
    justifyContent: 'space-between',

  },

  newItemsCircle: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    textAlign: 'center',
    alignItems: 'center',

  },
  newItemsNonCircle: {
    height: 'auto',
    width: 'auto',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

  },


  startingPointTempContainer: {
    height: '100%', 
    flexDirection: 'column',
    justifyContent: 'center', 
    marginRight: -10,

  },
  portalTempContainer: { 
    marginLeft: 6,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center', 

  },
  headerContainer: {
    flexDirection: "column",
    //justifyContent: 'space-between',
    height: 44, 
    alignItems: "center",
    paddingHorizontal: 10,
   // backgroundColor: 'pink',
    zIndex: 100,
  },
  headerRow: {
    flexDirection: "row",
    width: "100%",
    height: '100%',
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  appMessageButton: {
    textAlign: 'center',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    paddingVertical: 6, 
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,

    borderRadius: 20,
    height: 'auto',

  },
  notifierContainer: {
    height: 180,
    width: '96%',  
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center', 
    top: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 20,  
    borderWidth: 0, 
    padding: 20,
    zIndex: 2,
  },
  notifierTextContainer: { 
    flex: 1,
    // flexWrap: 'flex', 
    width: "100%", 
    alignItems: 'center',
    justifyContent: 'center',

  },
  notifierButtonTray: {
    width: "100%", 
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    overflow: "hidden",

  },
  notifierButton: {
    height: '100%',
    width: 'auto',
    maxWidth: '31%',
   // flexGrow: 1,
    flex: 1,  

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,

  },
  messageBox: { //use with primaryLightBackground color
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    // flexWrap: 'flex',
    height: 'auto',
    flexShrink: .8,
    overflow: 'hidden',
    

  },
  cuteDetailBox: { //use with primaryLightBackground color
    padding: 20,
    //paddingHorizontal: 20,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 16, 
    // flexWrap: 'flex',
    height: 'auto',
    textAlign: 'left', 
    overflow: 'hidden',
    

  },
  cuteDetailIconPositioner: {
    width: 'auto',
    paddingHorizontal: 6,
    marginHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  embeddedPickerContainer: { 
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 10,
    paddingVertical: 0,
    borderRadius: 20,
    top: 0,
    bottom: 0,
    height: "100%", 
    width: "100%", 
 
  },
  pickerContainer: { 
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',     
    padding: 10, 
    borderRadius: 20,
    position: 'absolute',
    width: 'auto',   
    bottom: 80,  
    right: 10,
    zIndex: 20,
    elevation: 20,

  },

  nextToPickerContainer: {
    //flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',     
    padding: 10, 
    borderRadius: 20,
    position: 'absolute',
    width: 'auto',
    
  //  top: 30, // DOWNWARD
    bottom: 44, // UPWARD
    right: 60,
    zIndex: 40,

  },
  nextToNextToPickerContainer: {
    //flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',     
    padding: 10, 
    borderRadius: 20,
    position: 'absolute',
    width: 'auto',
    
  //  top: 30, // DOWNWARD
    bottom: 44, // UPWARD
    right: 121,
    zIndex: 100,

  },

  pickerButtonsHeaderContainer: {
    padding: 10,
    borderRadius: 20,  
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems:'center',
    height: 40, 

  },

  pickerButtonContainer: {
    paddingHorizontal: 10,
    borderRadius: 10,  
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems:'center',
     

  },
  dCPickerButtonContainer: {
    paddingHorizontal: 4,
    borderRadius: 10,  
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems:'center',
     

  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
    paddingVertical: 15,
    //width: '90%',
    borderRadius: 25,
    borderCurve: "continuous",
    //shadowColor set in themeStyles
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },

  tabBarButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  exploreTabBarContainer: {
   height: 60, // 66  // managed in component
   width: '100%',
   // position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 0,
    paddingTop: 6,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  
    
    //width: '90%',
    // borderRadius: 25,
    borderRadius: 0,
    // borderTopLeftRadius: 0,
    // borderTopRightRadius: 0,
    borderCurve: "continuous",
    //shadowColor set in themeStyles
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },

  exploreTabBarButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 1, // 'gap' between icon and label! 
    
  },
  mapContainer: {
    //borderRadius: 20,
    //width: "100%", // Makes it fill the container's width
    width: 480,
    
    aspectRatio: 1280 / 640, // This keeps the original aspect ratio (1280x640)
    zIndex: 0, // Adjust z-index if needed
  },
  innerFlexStartContainer: {
    width: "100%", 
   // paddingHorizontal: "2%",
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
  mapParentContainer: {
    paddingTop: 24,
   // flexDirection: "row",
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center", 
    overflow: 'hidden',
    borderRadius: 400 / 2,
    borderWidth: 0,

  },
  defaultElementRow: {
    flexDirection: "row",
    width: "40%",
    height: "auto",
    flexWrap: "wrap",
    flex: 1,
  },
  dataListContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: 'flex-start',
    flex: 1,
    zIndex: 1000,
  },
  dataCardContainer: {
    height: "auto",
    padding: 30,
    borderRadius: 30,
    width: "100%",
    flexDirection: "column",
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  countDownerContainer: {
    overflow: 'hidden',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',

  },
  signOutButtonContainer: {
    overflow: 'hidden',
    textAlign: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',

  },
  surroundingsCardContainer: { 
    borderRadius: 10,
    padding: 10,
    paddingTop: 10, 
    marginVertical: 10,
    width: '28%',  
    alignItems: 'center',
    justifyContent: 'center', 
    marginEnd: 4,
    marginStart: 4,
    flexGrow: 1,
    height: 100,
    textAlign: 'center',
    overflow: 'hidden',

  }, 
  magNavButtonContainer: { 
    padding: 0,
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 3,

  },
  magNavTextContainer: {
    width: '100%',
     height: 'auto', 
     flexWrap: 'wrap',
     overflow: 'hidden',
     textAlign: 'center',
     alignItems: 'center',
     justifyContent: 'center',
     alignContent: 'center', //need this one to center horizontally

  },

  dimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,  
   // backgroundColor: pass in background color to element and 
   //add these two digits to end of six digit for overlay color/opacity:
   //FF (100%), E6 (90%), CC (80%), B3 (70%), 99 (60%), 80 (50%), 66 (40%), 4D (30%), 33 (20%), 1A (10%), 00 (0%)
  
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
    elevation: 1000,
    borderRadius: 20,

  },
  interactHeaderRow: {

    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center', 
     
   // paddingBottom: 10,
  },
  groqHeaderRow: {
    width: '100%',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start', 
     
   // paddingBottom: 10,

  },
  windFriendsCardContainer: { 
    borderRadius: 20,
    padding: 10,  
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center', 
    //flexGrow: 1, 
    height: 230,
    overflow: 'hidden',

  },
  ruinsHarmonyCardContainer: { 
    borderRadius: 20,
    padding: 10, 
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center', 
 
    height: 152,
    overflow: 'hidden',

  },
  smallImageContainer: {
    position: 'absolute',
    right: 0,  
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    
    //top: 30,
    //left: -20,
    //width: 110,
    width: '60%',
    overflow: 'hidden',  
    alignItems: 'center',
    height: '100%',
    borderRadius: 10
  }, 
  treasureCardContainer: { 

    marginBottom: 10,
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center',   
    height: "auto",
    padding: 10,
    borderRadius: 30, 
    flexDirection: "column",
    flex: 1,
   // borderWidth: StyleSheet.hairlineWidth,
  },
  treasureHeaderRow: {
    width: '100%',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
      
    paddingVertical: 10,

  },
  treasureCollectionDetailsSubheader: {
    width: '100%',
    textAlign: 'left',
    height: 'auto',
    paddingTop: 4,
    marginBottom: 20,
  },
  treasureDescriptionContainer: {
    width: '100%',
    textAlign: 'left',
    //height: 100, 
    borderRadius: 6, 
    padding: 20,
    flexGrow: 1,

  },
  historyCardContainer: { 

    marginBottom: 10,  
    alignItems: 'center',
    justifyContent: 'center',   
    height: "auto",
    padding: 20,
    borderRadius: 6,
    width: "100%",
    flexDirection: "column",
    flex: 1,
    zIndex: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemCardContainer: { 

    marginBottom: 10,  
    alignItems: 'center',
    justifyContent: 'center',   
    height: "auto",
    padding: 30,
    borderRadius: 6,
    width: "100%",
    flexDirection: "column",
    flex: 1,
    zIndex: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemHeaderRow: {
    width: '100%',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
      
    paddingVertical: 10,

  },
  itemCollectionDetailsSubheader: {
    width: '100%',
    textAlign: 'left',
    height: 'auto',
    paddingTop: 4,
    marginBottom: 20,
  },
  itemDescriptionContainer: {
    width: '100%',
    textAlign: 'left',
    height: 40,
    marginVertical: 4,
    // height: 'auto',
    // flexWrap: 'flex',
    borderRadius: 16, 
    padding: 20,

  },
  friendHeaderRow: {
    width: '100%',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
      
    paddingVertical: 10,

  },

  floatingIconButtonContainer: {
    //padding: 8,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    height: 46,
    width: 46,
    borderRadius: 46 / 2,

  },
  


  singleDetailPanelContainer: {
    borderRadius: 6, // matching: userBioContainer
    padding: 10,  
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center', 
 
    height: 'auto',
    overflow: 'hidden',
  

  },
  groqImageContainer: {
    borderRadius: 20, 
    // padding: 10, 
    // marginBottom: 10,
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center', 
 
    height: 'auto',
    overflow: 'hidden',
  

  },
  navBoxContainer: {
   // borderRadius: 20, controlled by parent container when used im MagnifiedNavButton  
    padding: 10,  
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center', 
 
    height: 'auto',
    overflow: 'hidden',
  

  },
    //groqHistory and Groq use this currently
  scrollDetailPanelContainer: {
    borderRadius: 20, 
    padding: 0,  
    width: '100%', 
    alignSelf: 'center', 
    alignItems: 'center',
    justifyContent: 'center', 
 
    height: 270,
    overflow: 'hidden', 
    zIndex: 100,
    position: 'absolute',
    bottom: 78,
    borderWidth: StyleSheet.hairlineWidth
  },
  groqHistoryScrollContainer: {
    borderRadius: 20, 
    padding: 20,  
    width: '100%', 
    alignSelf: 'center', 
    alignItems: 'center',
    justifyContent: 'center', 
 
   // height: 270, managed dynamically now, 360 for portal, 270 for ruins
    overflow: 'hidden', 
    zIndex: 100,
    position: 'absolute',
    bottom: 0,
    borderColor: 'teal',
    borderWidth: StyleSheet.hairlineWidth
  },
  groqScrollFullScreenContainer: {
   // borderRadius: 20,    
    width: '100%', 
    flex: 1,
    alignSelf: 'center', 
    alignItems: 'center',
    justifyContent: 'center', 
 
    overflow: 'hidden', 
    zIndex: 100,
    borderWidth: StyleSheet.hairlineWidth
  },
  statRow: {
    width: '100%',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 'auto', 
   
    flexWrap: 'wrap',
    marginVertical: 4,


  },

  // based on ruinsHarmony card in nearby ruins ui 
  doubleCheckerContainer: { 
    borderRadius: 20,
    padding: 20,  
    width: '100%',   
   // width: 400, used when debugging friendpicker interfering with double checker modal
    textAlign: 'left',
    height: 170, 
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 20000,
    elevation: 20000,

  },
  doubleCheckerWithMessageContainer: { 
    borderRadius: 20,
    padding: 20,  
    width: '100%',   
   // width: 400, used when debugging friendpicker interfering with double checker modal
    textAlign: 'left',
    height: 270, 
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 20000,
    elevation: 20000,

  },
  doubleCheckerWithMessageDisplayContainer: { 
    borderRadius: 20,
    padding: 20,  
    width: '100%',   
   // width: 400, used when debugging friendpicker interfering with double checker modal
    textAlign: 'left',
    height: 200, 
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 20000,
    elevation: 20000,

  },
  doubleCheckerQuestionContainer: {
   flexShrink: 1,
    //backgroundColor: 'orange',
    padding: 0,
    justifyContent: 'center',
    alignContent: 'center',
    height: 'auto',
    width: '100%',
    flexDirection: 'column',
  //  flexWrap: 'flex',
   // backgroundColor: 'pink',
   // height: '5%', 

  },
  doubleCheckerButtonRow: {
    width: '100%',
   // backgroundColor: 'lightblue',
    flexDirection: 'row',
    height: 40,
    
    justifyContent: 'space-between',
    overflow: 'hidden',
    zIndex: 20000,
    elevation: 20000,

  },
  dCNoButton: {
    height: '100%',
    width: '49%',
    flex: 1,
    flexDirection: 'row',
    borderBottomLeftRadius: 30,  
    justifyContent: 'center', 
    alignItems: 'center',  
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'lightblue',
    //borderColor: 'hotpink',

  },
  dCYesButton: {
    height: '100%',
    width: '49%',
    flex: 1,
    flexDirection: 'row',
    borderBottomRightRadius: 30,   
    paddingHorizontal: '4%',
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
 
  },
  dCBackgroundContainer: {
    flex: 1, 
    width: '100%',
    //height: 200, 
    margin: 0,
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.84)", 
    paddingHorizontal: '6%',
    elevation: 15000,
    zIndex: 15000, 

  },

  userBioContainer: {
    width: '100%',
    textAlign: 'left',  
    height: 'auto', 
    borderRadius: 6, // matching: singleDetailPanelContainer
    padding: 20,

  },
  goToItemButtonContainer: {  
    padding: 10,  
    width: '100%',  
    alignItems: 'center',
    justifyContent: 'center',  
    height: "auto", 
    borderRadius: 10, 
    flexDirection: "column",
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,

  },
  textInputAndTextBlockContainer: {
    padding: 20,  
    width: '100%',  
   // alignItems: 'center',
   // justifyContent: 'center',  
    height: "auto", 
    alignSelf: 'center',
    borderRadius: 20, 
    flexDirection: "column",
    flex: 1,
    borderWidth: 1,


  },
  twoButtonFooterContainer: { 
   position: 'absolute',
    zIndex: 10000,
    elevation: 10000,
    bottom: 0, 
    right: 0,
    left: 0,
    paddingTop: 6,
    paddingBottom: 4,
    //height: 80,  managed in Footer component because it changes if keyboard is visible
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  footerButton: {
    width: '30%', //50%',
    height: '100%', 
    flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center', 
    justifyContent: 'center',

  },
  keyboardOpenFooterContainer: {
    flexDirection: "row",
    //flex: 1,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between", 
    height: 40,

  },
  keyboardFooterButton: {
    width: '33%',
    height: '100%', 
   // flexGrow: 1,
    textAlign: 'center',
    alignItems: 'center', 
    justifyContent: 'center',

  },
});


const miscStyles = StyleSheet.create({
  exploreTabScreen: {
    paddingTop: 50,
  }

})
 

const isBetaUser = { 

};

const fontStyles = StyleSheet.create({
  headerText: {
    fontSize: 28,
  },
  bannerHeaderText: {
    fontSize: 19,
    fontWeight: 'bold',
    lineHeight: 24,  

  },
  drawerHeaderWelcomeText: {
    fontSize: 30,
    fontWeight: 'bold',

  },
  drawerHeaderSubRowText: {
    fontSize: 15,
    fontWeight: 'bold',

  },
  newItemsText: {
    fontSize: 13,
    fontWeight: 'bold',

  },
  goButtonText: {
    fontSize: 36, 
    textAlign: 'center',  

  },
  smallGoButtonText: {
    fontSize: 26,

  },
  goHomeButtonText: {
    fontSize: 16,

  },
  windCompassText: {
    fontSize: 12, 

  },
  appMessageButtonText: {
    fontWeight: 'bold',
    fontSize: 15,

  },
  notifierText: {

    fontSize: 17,
  },
  notifierButtonText: {
    fontWeight: 'bold',
    fontSize: 15,

  },
  drawerLabelText: {
    fontSize: 15, 

  },
  startingPointTempText: {
    fontSize: 18,

  },
  startingPointHumidityText: {
    fontSize: 12,

  },
  portalTempText: {
    fontSize: 28,

  },
  portalHumidityText: {
    fontSize: 14,

  },
  remainingTripsText: {
    fontSize: 16,

  },
  goButtonPortalSize: {
    fontSize: 50,
  },
  magNavText: {
    fontSize: 20,
    lineHeight: 24, 

  },
  groqHeaderText: {

    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  groqResponseText: { // using for NothingHere subMessage too
    fontSize: 15,
    lineHeight: 20,

  },
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
  treasureHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  treasureDescriptionText: {
    fontSize: 15,
    lineHeight: 20,
  },
  treasureCollectionDetailsBoldText: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  treasureCollectionDetailsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  itemDescriptionText: {
    fontSize: 15,
    lineHeight: 20,
  },
  itemCollectionDetailsBoldText: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  itemCollectionDetailsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabBarText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  tabBarIcon: {
    height: 22,
    width: 22,
  },
  exploreTabBarText: {
    fontSize: 12,
  //  fontWeight: "bold",
  },
  exploreTabBarIcon: {
    height: 22,
    width: 22,
  },
  dCQuestionText: { // also used in FriendPicker menu as header
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',

  },
  dCOptionalText: {
    fontSize: 16,
    lineHeight: 22, 

  },
  dCButtonText: { // used in DebounceUserSearch and UserListItem too
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'bold',

  },
  dCPickerButtonText: { // used in DebounceUserSearch and UserListItem too
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 'bold',

  },
  cuteDetailIcon: {

    height: 14,
    width: 14,
  },
  magNavArrowIcon: {
    height: 26,
    width: 26,

  },
  tinyIcon: {
    height: 14,
    width: 14,
  },
  cuteDetailText: {
    fontSize: 13,
    fontWeight: 'bold',

  },
  countDownText: {
    fontSize: 13,
    fontWeight: 'bold',
    
  },
  signOutText: {
    fontSize: 12,
    fontWeight: 'bold',
    
  },
  statText: {
    fontSize: 14,
    lineHeight: 20,

  },
  GoToItemButtonText: {
    fontSize: 17,
    // fontWeight: 'bold',

  },
  friendingFunctionsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',

  },
 
  actionFooterLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  profileHeaderText: {
    fontSize: 32,
    fontWeight: 'bold',

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
    // fontColor: "black",
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
    backgroundColor: "#d3d3d3",
  },
  primaryOverlayBackground: {
    backgroundColor: "#c9c9c9",

  },
  darkerBackground: {
    backgroundColor: "#ccc",
  },
  darkestBackground: {
    backgroundColor: "darkgray",
  },
  primaryBorder: {
    color: "#121212",
  },
  primaryText: {
    color: "#121212",
  },
  tabBarText: {
    color: "#121212",
  },
  tabBarHighlightedText: {
    color: "teal",
  },
  exploreTabBarText: {
    color: "#121212",
  },
  exploreTabBarHighlightedText: {
    color: "teal",
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
    // position: 'absolute',
    // top: 0,
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
  primaryOverlayBackground: {
    backgroundColor: "#1a1a1a",
  },
  darkerBackground: {
    backgroundColor: "#2B2B2B",
  },
  darkestBackground: {
    backgroundColor: "#242424",
  },
  primaryBorder: {
    color: "#d3d3d3",
  },
  primaryText: {
    color: "#d3d3d3",
  },
  tabBarText: {
    color: "#d3d3d3",
  },
  tabBarHighlightedText: {
    color: "teal",
  },
  exploreTabBarText: {
    color: "#d3d3d3",
  },
  exploreTabBarHighlightedText: {
    color: "teal",
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
    // placeholderTextColor: "darkgray",
    // borderWidth: 1,
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
 // headerTextColor: "#d3d3d3",
});

export default GlobalStylesProvider;
