import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect, 
  // AccessibilityInfo,
} from "react";
import * as SecureStore from "expo-secure-store"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
 
import { useAppState } from "./AppStateContext";
//import useProtectedRoute from "../hooks/useProtectedRoute"; 
import {
  signup, 
  signinWithoutRefresh,
  signout,
  getCurrentUser, 
  deleteUserAccount,
} from "../calls/apicalls";
import { useAppMessage } from "./AppMessageContext";
import { useNavigationContainerRef, useSegments } from "expo-router";
import { useWatchAppState } from "../hooks/useWatchAppState";
import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  appSettings: Record<string, any | null>;
  userNotificationSettings: Record<string, any>;
  onSignin: (username: string, password: string) => Promise<void>;
  onSignOut: () => void;
  onSignUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  reInitialize: () => Promise<void>;
  updateSettings: (newSettings: Record<string, any>) => Promise<void>
  deAuthUser: () => void;
  handleDeleteUserAccount: () => void;
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
  const navigationRef = useNavigationContainerRef();  
  const [appSettings, setAppSettings] = useState<Record<string, any> | null>(null);
  const [userNotificationSettings, setUserNotificationSettings] = useState<
    Record<string, any>
  >({});
  const queryClient = useQueryClient();
  const { showAppMessage } = useAppMessage(); 
const { appState } = useAppState();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);
  const isOnSignIn = segments[0] === "signin";

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 

  // useEffect(() => {
  //   if (navigationRef.isReady()) {
  //     setNavigationReady(true);
  //   }

  //   const unsubscribe = navigationRef.addListener("state", () => {
  //     setNavigationReady(true);
  //   });

  //   return () => unsubscribe && unsubscribe();
  // }, [navigationRef.isReady()]); 

  // useProtectedRoute(authenticated, loading); // moved to main index file

  let isReinitializing = false;

  const reInitialize = async () => {
    if (isReinitializing) {
      return;
    }

   // showAppMessage(true, null, "DEBUG: Reinitializing user!");
    isReinitializing = true;
    try {  
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        let userData = null;

        try {
          userData = await getCurrentUser();
     
        } catch (error) { 
          showAppMessage(true, null, "Token detected but cannot fetch user");
          await onSignOut();
          return;
        }
 

        if (userData) {
          setUser(userData);
          setAuthenticated(true);
 
        } else {
          showAppMessage(true, null, "Oh no :( Could not initialize user.");
          setAuthenticated(false); 
        }
      } else {
        showAppMessage(true, null, "Not signed in.");
        setUser(null);
        setAuthenticated(false); 
      }
    } finally {
      isReinitializing = false;
    }
  }; 

  
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


  const prevAppState = usePrevious(appState);

  // useEffect(() => {
  //   if (
  //     prevAppState !== "active" &&
  //     appState === "active" &&
  //     !isOnSignIn
  //   ) {
  //     reInitialize();
  //   }
  // }, [appState, prevAppState]);

  useWatchAppState((newState) => {
    if (newState === 'active') {
      showAppMessage(true, null, '(Debug) app in forground');
      reInitialize(); // or whatever logic you want
    }
  });

  // useEffect(() => {
  //   if (appState === "active" && !isOnSignIn) {
  //     reInitialize();
  //   }
  // }, [appState]); 
  
  // I don't want this to run every time segment changes lol
 // }, [appState, prevAppState, isOnSignIn]);

 
 
  const signinMutation = useMutation({
    mutationFn: signinWithoutRefresh,
    onSuccess: () => {
      reInitialize();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signinMutation.reset();
      }, 2000);
    },
  });


  const onSignin = async (username: string, password: string) => {
    try {
      await signinMutation.mutateAsync({ username, password });
    } catch (error) {
      console.error("Sign in error", error);
    }
  };

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (result) => {
      // if (result.data) {
      //     await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      //     await reInitialize(); // Refetch user data after sign-up
      // }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      } 
      timeoutRef.current = setTimeout(() => {
        signupMutation.reset();
      }, 2000);
    },
  });

  const onSignUp = async (username: string, email: string, password: string) => {
    try {
      const credentials = { username, email, password };
      await signupMutation.mutateAsync(credentials);
      onSignin(username, password);
    } catch (error) {
      console.error("Sign up error", error);
    }
  };

  const onSignOut = async () => {
   
    await signout();
    setUser(null);
    setAppSettings(null);
    setUserNotificationSettings(null);
    setAuthenticated(false);
 
    showAppMessage(true, null, "Signed out.");
    

    queryClient.clear();
  };  
 
 

  const deleteUserAccountMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      console.log("User deleted");
      onSignOut();
 

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteUserAccountMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteUserAccountMutation.reset();
      }, 2000);
    },
  });


  const handleDeleteUserAccount = async () => {
    try {
      await deleteUserAccountMutation.mutateAsync();
    } catch (error) {
      console.error("Delete user error", error);
    }
  };


  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: authenticated, 
        appSettings,
        userNotificationSettings,
        onSignin,
        onSignUp,
        onSignOut,
        reInitialize,  
        handleDeleteUserAccount,
        deleteUserAccountMutation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
