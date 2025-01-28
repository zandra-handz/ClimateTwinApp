

import React, { createContext, useContext, useState, useEffect, AccessibilityInfo } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import Constants from "expo-constants";
import { Platform } from 'react-native';
import { signup, signin, signinWithoutRefresh, signout, getCurrentUser, getUserSettings } from '../apicalls';

const UserContext = createContext({});


export const useUser = () => useContext(UserContext);

const TOKEN_KEY = 'my-jwt';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        user: null,
        authenticated: false,
        loading: true,
    });
    const [appSettings, setAppSettings] = useState({});
    const [userNotificationSettings, setUserNotificationSettings] = useState({});
    const queryClient = useQueryClient(); 


    useEffect(() => {
        if (appSettings) {
            console.log('app settings useeffect in context: ', appSettings);
        }

    }, [appSettings]);

    
    // Reinitialize user data function
    const reInitialize = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
           // const userData = null;
           const userData = await getCurrentUser();
           const userSettingsData = await getUserSettings();
            if (userData) {
                setUser(prev => ({
                    ...prev,
                    user: userData,
                    authenticated: true,
                    loading: false, 
                })); 
            } else {
                // Handle case where user data is null
                setUser(prev => ({ ...prev, authenticated: false, loading: false }));
            }

            if (userSettingsData) {
                setAppSettings(userSettingsData || {});
                
                
                setUserNotificationSettings({
                    receive_notifications: userSettingsData?.receive_notifications || false
                }); 
            }
        } else {
            setUser({ user: null, authenticated: false, loading: false });
        }
    }; 
 
    const { data: currentUserData } = useQuery({
        queryKey: ['fetchUser'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) return await getCurrentUser();
            return null;
        },
        enabled: user.authenticated,
        onSuccess: (data) => {
            if (data) {
                setUser(prev => ({
                    ...prev,
                    user: data,
                    authenticated: true,
                    loading: false
                }));
            //     setAppSettings(data.settings || {});
            //     console.log('user app settings', appSettings);
            //     setUserNotificationSettings({ receive_notifications: data.settings?.receive_notifications || false });
            }
        },
        onError: () => {
            setUser(prev => ({ ...prev, loading: false }));
        }
    });

    

    useEffect(() => {
        const fetchInitialSettings = async () => {
            console.log('SCREEN READER CONTEXT');
            try {
                const isActive = await AccessibilityInfo.isScreenReaderEnabled();
                setAppSettings(prevSettings => ({
                    ...prevSettings,
                    screen_reader: isActive,
                }));
            } catch (error) {
                console.error('Error fetching initial screen reader status:', error);
            }
        };
    
        if (user.authenticated && currentUserData && appSettings) {
            fetchInitialSettings();
        }
    }, [user.authenticated]);
    
    
    const signinMutation = useMutation({
        mutationFn: signinWithoutRefresh, //swapped this out with signin 1/1/2025 could be buggy
        onMutate: () => {  
            console.log('signin is fetching from onMutate');
        },
        onSuccess: async (result) => { 
            if (result.data) {
                const { access: token, refresh } = result.data;
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                await SecureStore.setItemAsync('refreshToken', refresh);
                await reInitialize();  
            }
        },
        onError: (error) => {
            console.error('Sign in mutation error:', error);
            //alert("Sign-in failed: " + (error.response?.data.msg || 'Unknown error occurred'));
        },
        onSettled: () => { 
          //  signinMutation.reset();

        },
    });
    

const onSignin = async (username, password) => {
    try {
        
        const credentials = { username, password };

         //console.log('Signing in with credentials:', credentials);
 
        await signinMutation.mutateAsync(credentials);
    } catch (error) {
        console.error('Sign in error', error); 
    }
};


//giving me a lot of errors when I try to log the new user in but it does log them in
const onSignUp = async (username, email, password) => {
    try {
        
        const credentials = { username, email, password };

         console.log('Signing in with credentials:', credentials);
        
 
        await signupMutation.mutateAsync( credentials );
        onSignin(username, password);
    } catch (error) {
        console.error('Sign up error', error); 
    }
};


    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: async (result) => {
            if (result.data) {
                await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
                await reInitialize(); // Refetch user data after sign-up
            }
        }
    });

    // const updateAppSettings = async (newSettings) => {
    //     try {
    //         await updateAppSettingsMutation.mutateAsync({
    //             userId: user.user.id, // User ID
    //             fieldUpdates: newSettings // Pass newSettings directly as fieldUpdates
    //         });
    //     } catch (error) {
    //         console.error('Error updating app settings:', error);
    //     }
    // };

    // const updateAppSettingsMutation = useMutation({
    //     mutationFn: (data) => updateUserAccessibilitySettings(data.userId, data.setting),
    //     onSuccess: (data) => {
    //         setAppSettings(data); // Assuming the API returns updated settings
            
    //         queryClient.setQueryData(['fetchUser'], (oldData) => ({
    //             ...oldData,
    //             settings: data.settings
    //         }));
    //     },
    //     onError: (error) => {
    //         console.error('Update app settings error:', error);
    //     }
    // });

    const onSignOut = async () => {
        await signout(); // Call your signout API function
        await SecureStore.deleteItemAsync(TOKEN_KEY); // Clear access token
        await SecureStore.deleteItemAsync('refreshToken'); // Clear refresh token if applicable
        await SecureStore.deleteItemAsync('pushToken'); // Clear push token if applicable
    
        // Reset user-related state
        setUser({
            user: null,
            authenticated: false,
            loading: false,
            credentials: {
                token: null,  
            },
        });
     
        // setAppSettings(null); 
        // setUserNotificationSettings(null);   
        queryClient.clear();
    };
    
 
    useEffect(() => {
        console.log('usernotifs useEffect triggered in context');
        if (userNotificationSettings?.receive_notifications) {
            console.log('registering for notifs');
            registerForNotifications();
        } else {
            console.log('removing notifs permissions');
            removeNotificationPermissions();
        }
    }, [userNotificationSettings]);


    const registerForNotifications = async () => {
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus === "granted") {
                const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
                await SecureStore.setItemAsync('pushToken', pushTokenString);
                //await updateUserAccessibilitySettings(user.user.id, { receive_notifications: true, expo_push_token: pushTokenString });
                console.log(pushTokenString);
            }
        }
    };

    const removeNotificationPermissions = async () => {
        await SecureStore.deleteItemAsync('pushToken');
        if (user.user) {
          //  await updateUserAccessibilitySettings(user.user.id, { receive_notifications: false, expo_push_token: null });
        } 
    };

    return (
        <UserContext.Provider value={{
            user,
            appSettings,
            userNotificationSettings, 
            handleSignup: signupMutation.mutate,
            onSignin, 
            onSignUp,
            // updateAppSettingsMutation, 
            // updateAppSettings,
            signinMutation,
            signupMutation,
            onSignOut,
            reInitialize, // Added to the context
            updateUserSettings: setAppSettings,
            updateUserNotificationSettings: setUserNotificationSettings, 
        }}>
            {children}
        </UserContext.Provider>
    );
};
