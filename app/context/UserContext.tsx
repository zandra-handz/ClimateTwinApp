import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  AccessibilityInfo,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, AppState } from "react-native";
import useProtectedRoute from "../hooks/useProtectedRoute";
import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
} from "../apicalls"; 
import { useAppMessage } from "./AppMessageContext";
import {  useSegments } from "expo-router";

//import { useRootNavigation } from "@react-navigation/native";

interface User {
  id?: string;
  username?: string;
  email?: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  appSettings: Record<string, any>;
  userNotificationSettings: Record<string, any>;
  onSignin: (username: string, password: string) => Promise<void>;
  onSignUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  reInitialize: () => Promise<void>;
  deAuthUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

 

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const TOKEN_KEY = "accessToken";



interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appSettings, setAppSettings] = useState<Record<string, any>>({});
  const [userNotificationSettings, setUserNotificationSettings] = useState<
    Record<string, any>
  >({});
  const queryClient = useQueryClient();
  const { showAppMessage } = useAppMessage();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const segments = useSegments(); 
  const isOnSignIn = segments[0] === "signin";
  const isOnAPreSignInPage = segments.length === 0 || segments[0] === "" || segments[0] === "secondindex" || segments[0] === "signin"; 

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current !== nextAppState) {
        appState.current = nextAppState;
        setAppStateVisible(nextAppState);
      }
    });
    return () => subscription.remove();
  }, []);

  useProtectedRoute(authenticated, loading); 

 
  
//   const reInitialize = async () => {
//     console.log('reinitializing!!!!');
//     showAppMessage(true, null, 'Initializing...');
//     setLoading(true);
//     console.log('use loading --> true');
//     const token = await SecureStore.getItemAsync(TOKEN_KEY);
//     if (token) {
//         let userData = null;

//         try {
//             userData = await getCurrentUser();
//             console.log(`REINIT USER DATA ON OTHER SIDE OF INTERCEPTOR: `, userData);
//         } catch (error) {
//             console.error('Error fetching current user:', error);
//             showAppMessage(true, null, 'Token detected but cannot fetch user');
          
//             await onSignOut();
//             return;
//         }
//         try {
//           // Fetch user settings using React Query's fetchQuery
//           const userSettingsData = await queryClient.fetchQuery({
//             queryKey: ['userSettings', userData?.id], 
//               queryFn: getUserSettings,
//           });
  
//           if (userSettingsData) {
//               setAppSettings((prev) => ({ ...prev, ...userSettingsData }));
//               setUserNotificationSettings({
//                   receive_notifications: userSettingsData?.receive_notifications || false,
//               });
//           }
//       } catch (error) {
//           console.error('Error fetching user settings:', error);
//       }

//         // const userSettingsData = await getUserSettings();
//         // if (userSettingsData) {
//         //     setAppSettings((prev) => ({ ...prev, ...userSettingsData }));
//         //     setUserNotificationSettings({
//         //         receive_notifications:
//         //             userSettingsData?.receive_notifications || false,
//         //     });
//         // }

//         if (userData) {
//             setUser(userData);
//             setAuthenticated(true);
//         } else {
//             showAppMessage(true, null, 'Oh no :( Could not initialize user.');
//             setAuthenticated(false);
//         }
//     } else {
//         showAppMessage(true, null, 'Not signed in.');
//         setUser(null);
//         setAuthenticated(false); 
//     }
    
//     setLoading(false);
//     console.log('use loading --> false', authenticated);

// };
let isReinitializing = false;

const reInitialize = async () => {
  if (isReinitializing) {
    showAppMessage(true, null, 'Reinitializing already in progress, new attempt returned');
    console.log('reInitialize already in progress');
    return;
  }

  isReinitializing = true;
  try {
    console.log('reinitializing!!!!');
    showAppMessage(true, null, 'Initializing...');
    setLoading(true);
    console.log('use loading --> true');

    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
      let userData = null;

      try {
        userData = await getCurrentUser();
        console.log(
          'REINIT USER DATA ON OTHER SIDE OF INTERCEPTOR: ',
          userData,
        );
      } catch (error) {
        console.error('Error fetching current user:', error);
        showAppMessage(true, null, 'Token detected but cannot fetch user');
        await onSignOut();
        return;
      }

      try {
        // Fetch user settings using React Query's fetchQuery
        const userSettingsData = await queryClient.fetchQuery({
          queryKey: ['userSettings', userData?.id],
          queryFn: getUserSettings,
        });

        if (userSettingsData) {
          setAppSettings((prev) => ({ ...prev, ...userSettingsData }));
          setUserNotificationSettings({
            receive_notifications:
              userSettingsData?.receive_notifications || false,
          });
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }

      if (userData) {
        setUser(userData);
        setAuthenticated(true);
 
        setTimeout(() => {
          setLoading(false);
          console.log(
            'use loading --> false',
            authenticated,
          ); // Might still log old state but UI will update correctly
        }, 0);
      } else {
        showAppMessage(true, null, 'Oh no :( Could not initialize user.');
        setAuthenticated(false);
        setLoading(false);
      }
    } else {
      showAppMessage(true, null, 'Not signed in.');
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  } finally {
    isReinitializing = false;
  }
};


// const reInitialize = async () => {
//   console.log('reinitializing!!!!');
//   showAppMessage(true, null, 'Initializing...');
//   setLoading(true);
//   console.log('use loading --> true');

//   const token = await SecureStore.getItemAsync(TOKEN_KEY);

//   if (token) {
//       let userData = null;

//       try {
//           userData = await getCurrentUser();
//           console.log(`REINIT USER DATA ON OTHER SIDE OF INTERCEPTOR: `, userData);
//       } catch (error) {
//           console.error('Error fetching current user:', error);
//           showAppMessage(true, null, 'Token detected but cannot fetch user');
//           await onSignOut();
//           return;
//       }

//       try {
//           // Fetch user settings using React Query's fetchQuery
//           const userSettingsData = await queryClient.fetchQuery({
//               queryKey: ['userSettings', userData?.id],
//               queryFn: getUserSettings,
//           });

//           if (userSettingsData) {
//               setAppSettings((prev) => ({ ...prev, ...userSettingsData }));
//               setUserNotificationSettings({
//                   receive_notifications: userSettingsData?.receive_notifications || false,
//               });
//           }
//       } catch (error) {
//           console.error('Error fetching user settings:', error);
//       }

//       if (userData) {
//           setUser(userData);
//           setAuthenticated(true);
//       } else {
//           showAppMessage(true, null, 'Oh no :( Could not initialize user.');
//           setAuthenticated(false);
//       }
//   } else {
//       showAppMessage(true, null, 'Not signed in.');
//       setUser(null);
//       setAuthenticated(false);
//   }
// };

// // ✅ Wait for `authenticated` to be updated before setting `loading` to `false`
// useEffect(() => {
//     if (authenticated !== null) {
//         setLoading(false);
//         console.log('use loading --> false', authenticated);
//     }
// }, [authenticated]); // Runs only when `authenticated` changes



useEffect(() => {
  if (authenticated && !loading && appSettings && Object.keys(appSettings).length > 0) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!APP SETTINGS', appSettings);
  }

  const cachedSettings = queryClient.getQueryData(['userSettings', user?.id]);

  if (cachedSettings) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!! REACT QUERY CACHE: ', cachedSettings);
  }
}, [appSettings]);


  // useEffect(() => {
  //   console.log('BEGINNING INITIALIZE!!!!!!!!!!!!!!!!!!!!!!!!');
  //   reInitialize();
  // }, []);


  useEffect(() => {
    if (appStateVisible === 'active' && !isOnSignIn) { //authenticated &&
         
    console.log('APP IN FOREGROUND, REINITTING IN USER CONTEXT!!!!!!!!!!!!!!!!!!!!!!!!');
   console.log(authenticated);
    reInitialize();
    }
  }, [appStateVisible]); 
  
  const updateUserSettingsMutation = useMutation({
    mutationFn: (newSettings) => updateUserSettings(user?.id, newSettings),
  onSuccess: (data) => {
    setAppSettings((prev) => ({ ...prev, ...data }));
    queryClient.invalidateQueries(["userSettings", user?.id]);  
    queryClient.refetchQueries(["userSettings", user?.id]).then(() => {
      
      const updatedSettings = queryClient.getQueryData(["userSettings", user?.id]);
      console.log("Refetched user settings:", updatedSettings);
    });
  },
    onError: (error) => {
      console.error("Error updating user settings:", error);
    },
  });
   
  const updateSettings = async (newSettings: Record<string, any>) => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }
  
    try {
      await updateUserSettingsMutation.mutateAsync(newSettings);  
    } catch (error) {
      console.error("Update settings error:", error);
    }
  };
  

    const signinMutation = useMutation({
        mutationFn: signinWithoutRefresh,
        onSuccess: () => {
            console.log('Sign in mutation is running reInit');
            reInitialize(); // Will run only after tokens are stored
        },
        onError: (error) => {
          console.error("Sign in mutation error:", error);
        },
      });

      const onSignin = async (username: string, password: string) => {
        try {
          // Call the mutation to sign in
          await signinMutation.mutateAsync({ username, password });
      
          // Call reInitialize after successful sign-in
          // await reInitialize();
        } catch (error) {
          console.error("Sign in error", error);
        }
      };



       
      

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (result) => {
      if (result.data) {
        await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
        await reInitialize();
      }
    },
  });

  const onSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await signupMutation.mutateAsync({ username, email, password });
      await onSignin(username, password);
    } catch (error) {
      console.error("Sign up error", error);
    }
  };

  const onSignOut = async () => {
    await signout();  

    // Reset user-related state

    setUser(null); 
    setAppSettings(null); 
    setUserNotificationSettings(null);  
    setAuthenticated(false);
    setLoading(false); 
    showAppMessage(true, null, 'Signed out.');

    queryClient.clear();
};

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: authenticated,
        isInitializing: loading,
        appSettings,
        userNotificationSettings,
        onSignin,
        onSignUp,
        onSignOut,
        reInitialize,
        updateSettings,
        // deAuthUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
