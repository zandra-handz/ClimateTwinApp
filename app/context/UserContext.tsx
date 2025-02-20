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
} from "../apicalls";
import { runOnRuntime } from "react-native-reanimated";
import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";

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

//   const useProtectedRoute = (user: User | null) => {
//     //console.log('usePROTECTEDROUTERUNNING, rootNavigation value: ', rootNavigation);
//     const rootNavigation = useNavigationContainerRef();
//     const navigationRef = useNavigationContainerRef();
    
//     console.log('usePROTECTEDROUTERUNNING, userData: ', user);
//     console.log('usePROTECTEDROUTERUNNING, navigationRef value: ', navigationRef.isReady());
   

//     const segments = useSegments();
//     const router = useRouter();
//     const [isNavigationReady, setNavigationReady] = useState(false);

//     useEffect(() => {
//         if (navigationRef.isReady()) {
//           setNavigationReady(true);
//           console.log("NAVIGATION READY");
//         } else {
//           console.log("Navigation ref is not ready yet.");
//         }
    
//         const unsubscribe = navigationRef.addListener("state", () => {
//           setNavigationReady(true);
//           console.log("NAVIGATION READY (via state listener)");
//         });
    
//         return () => unsubscribe && unsubscribe();
//       }, [navigationRef.isReady()]);

//     useEffect(() => {
//         console.log('authenticated triggered useProtected route!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
//       if (!isNavigationReady) {
//         console.log("NAVIGATION IS NOT READY");
//         return;
//       }

//       const isAuthGroup = segments[0] === "(auth)";

//       if (!user && !isAuthGroup) {
//         router.push("/sign-in");
//       } else if (user && isAuthGroup) {
//         router.push("(tabs)");
//       }
//     }, [user, authenticated, segments, isNavigationReady]);
//   };


  //   useEffect(() => {
  //     if (appStateVisible === "active") {
  //       deAuthUser();
  //       reInitialize();
  //     } else {
  //       deAuthUser();
  //     }
  //   }, [appStateVisible]);


  

  const reInitialize = async () => {
    setLoading(true);
    setAuthenticated(false);
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      const userData = await getCurrentUser();
      const userSettingsData = await getUserSettings();

      if (userSettingsData) {
        setAppSettings((prev) => ({ ...prev, ...userSettingsData }));
        setUserNotificationSettings({
          receive_notifications:
            userSettingsData?.receive_notifications || false,
        });
      }

      if (userData) {
        setUser(userData);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }

      
     // useProtectedRoute(userData || null);
    } else {
      setUser(null);
      setAuthenticated(false);
     // useProtectedRoute(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    console.log('BEGINNING INITIALIZE!!!!!!!!!!!!!!!!!!!!!!!!');
    reInitialize();
  }, []);


  useEffect(() => {
    if (appStateVisible === 'active' && authenticated && !isOnSignIn) {
         
    console.log('APP IN FOREGROUND, REINITTING IN USER CONTEXT!!!!!!!!!!!!!!!!!!!!!!!!');
   
    reInitialize();
    }
  }, [appStateVisible]);

    // const deAuthUser = () => {
    //   setAuthenticated(false);
    //   setLoading(true);
    // };

    const signinMutation = useMutation({
        mutationFn: signinWithoutRefresh,
        onSuccess: () => {
            console.log('removed reinit from sign in mutation for now');
         // reInitialize(); // Will run only after tokens are stored
        },
        onError: (error) => {
          console.error("Sign in mutation error:", error);
        },
      });

//in case i end up needing async
    //   const signinMutation = useMutation({
    //     mutationFn: signinWithoutRefresh,
    //     onSuccess: async () => {
    //       console.log("Tokens should now be saved before reInitialize runs.");
    //       await reInitialize(); // Ensures it waits for any potential async operations
    //     },
    //     onError: (error) => {
    //       console.error("Sign in mutation error:", error);
    //     },
    //   });
      
    const onSignin = async (username: string, password: string) => {
        try {
          // Call the mutation to sign in
          await signinMutation.mutateAsync({ username, password });
      
          // Call reInitialize after successful sign-in
          await reInitialize();
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
    setAuthenticated(false);
    setUser(null);
    
    
 
    setAppSettings(null); 
    setUserNotificationSettings(null);   
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
        // deAuthUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
