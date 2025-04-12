import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import { useGlobalStyles } from '../../src/context/GlobalStylesContext';
import { useUser } from '../../src/context/UserContext';
import { useColorScheme } from "react-native";
const CustomStatusBar = () => { 
    const { user, isAuthenticated, appSettings } = useUser();
    const { themeStyles } = useGlobalStyles();
      const colorScheme = useColorScheme();
    const [ color, setColor ] = useState();

      useEffect(() => {
        if (appSettings) {
  
            if (appSettings.manual_dark_mode === true) {
                setColor('light');
            } else if (appSettings.manual_dark_mode === false) {
                setColor('dark');
            } else {
                let phoneTheme;
                phoneTheme = colorScheme === "dark"? "light" : "dark";
                setColor(phoneTheme);
            } 
          };
     
         
           
        console.log(`setColor:`, color);
      }, [appSettings]);



 
   
  return (
    <>    
       
    <StatusBar
      style={color} 
      translucent={true}
     backgroundColor="transparent"
    /> 
      
    </>
  );
};

export default CustomStatusBar;