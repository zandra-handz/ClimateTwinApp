import React, { useEffect, useState, useMemo } from 'react';
// import { StatusBar } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import { useGlobalStyles } from '../../src/context/GlobalStylesContext';
import { useUser } from '../../src/context/UserContext';
import { useColorScheme } from "react-native";
import { useRouter, usePathname, useSegments } from 'expo-router';  // Import useRouter

const CustomStatusBar = () => { 
    const { user, isAuthenticated, appSettings } = useUser();
    const { themeStyles } = useGlobalStyles();
    const colorScheme = useColorScheme();
    const [color, setColor] = useState();
    const router = useRouter();  // Get router to access the current screen
    const segments = useSegments();
    const pathname = usePathname(); // is this? right??

    useEffect(() => {
        if (appSettings) {
            if (appSettings.manual_dark_mode === true) {
                setColor('light');
            } else if (appSettings.manual_dark_mode === false) {
                setColor('dark');
            } else {
                let phoneTheme;
                phoneTheme = colorScheme === "dark" ? "light" : "dark";
                setColor(phoneTheme);
            } 
        }
        
        // Log the screen and color change
        console.log(`Current screen: ${pathname}, ${segments} setColor in CustomStatusBar: ${color}`);
    }, [appSettings, pathname]); // Make sure to add router.pathname to dependencies



    // const statusBarColor = useMemo(() => {
    //     if (appSettings) {
    //         if (appSettings.manual_dark_mode === true) {
    //             return 'light';
    //         } else if (appSettings.manual_dark_mode === false) {
    //             return 'dark';
    //         } else {
    //             return colorScheme === 'dark' ? 'light' : 'dark';
    //         }
    //     }
    //     return 'auto'; // fallback if appSettings is undefined
    // }, [appSettings, colorScheme]);

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
