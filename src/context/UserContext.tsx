import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  // AccessibilityInfo,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform, AppState } from "react-native";
import { useAppState } from "./AppStateContext";
import useProtectedRoute from "../hooks/useProtectedRoute"; 
import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
  deleteUserAccount,
} from "../calls/apicalls";
import { useAppMessage } from "./AppMessageContext";
import { useNavigationContainerRef, useSegments } from "expo-router";

import { User } from "../types/UserContextTypes";

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  appSettings: Record<string, any>;
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
  const [loading, setLoading] = useState(false);
  const [appSettings, setAppSettings] = useState<Record<string, any>>({});
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

  useEffect(() => {
    if (navigationRef.isReady()) {
      setNavigationReady(true);
    }

    const unsubscribe = navigationRef.addListener("state", () => {
      setNavigationReady(true);
    });

    return () => unsubscribe && unsubscribe();
  }, [navigationRef.isReady()]); 

  // useProtectedRoute(authenticated, loading); // moved to main index file

  let isReinitializing = false;

  const reInitialize = async () => {
    if (isReinitializing) {
      return;
    }

    showAppMessage(true, null, "DEBUG: Reinitiaizing user!");
    isReinitializing = true;
    try {
     // console.log("reinitializing!!!!"); 
      setLoading(true);  
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        let userData = null;

        try {
          userData = await getCurrentUser();
     
        } catch (error) {
          console.error("Error fetching current user:", error);
          showAppMessage(true, null, "Token detected but cannot fetch user");
          await onSignOut();
          return;
        }

        try {
          //This will check cache first, then hit up endpoint if nothing in cache
          const userSettingsData = await queryClient.fetchQuery({
            queryKey: ["userSettings", userData?.id],
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
          console.error("Error fetching user settings:", error);
        }

        if (userData) {
          setUser(userData);
          setAuthenticated(true);

          setTimeout(() => {
            setLoading(false);
            console.log("use loading --> false", authenticated); // Might still log old state but UI will update correctly
          }, 0);
        } else {
          showAppMessage(true, null, "Oh no :( Could not initialize user.");
          setAuthenticated(false);
          setLoading(false);
        }
      } else {
        showAppMessage(true, null, "Not signed in.");
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
      }
    } finally {
      isReinitializing = false;
    }
  };

  useEffect(() => {
    if (
      authenticated &&
      !loading &&
      appSettings &&
      Object.keys(appSettings).length > 0
    ) {}
    const cachedSettings = queryClient.getQueryData(["userSettings", user?.id]);
    if (cachedSettings) {}
  }, [appSettings]);

  // useEffect(() => {
  //   if (appState === "active" && isNavigationReady && !isOnSignIn) {
  //     reInitialize();
  //   }
  // }, [appState, isNavigationReady]);


  useEffect(() => {
    if (appState === "active" && !isOnSignIn) {
      reInitialize();
    }
  }, [appState]);


  const updateUserSettingsMutation = useMutation<
    Record<string, any>,
    Error,
    Record<string, any>
  >({
    mutationFn: (newSettings) => updateUserSettings(user?.id, newSettings),
    onSuccess: (data) => {
      setAppSettings((prev) => ({ ...prev, ...data }));

      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
      queryClient
        .refetchQueries({ queryKey: ["userSettings", user?.id] })
        .then(() => {
          const updatedSettings = queryClient.getQueryData([
            "userSettings",
            user?.id,
          ]);
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
   // setLoading(true);
    await signout();
    setUser(null);
    setAppSettings(null);
    setUserNotificationSettings(null);
    setAuthenticated(false);
    setLoading(false);
    showAppMessage(true, null, "Signed out.");
    

    queryClient.clear();
  };

  useEffect(() => {
 
    if (appSettings?.receive_notifications) { 
      registerForNotifications();
    } else { 
      removeNotificationPermissions();
    }
  }, [appSettings]);

  const getNotificationPermissionStatus = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync(); 
    return existingStatus;
  };

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
      let finalStatus = await getNotificationPermissionStatus();

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status; 
      }

      if (finalStatus === "granted" && user) {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;

        await SecureStore.setItemAsync("pushToken", pushTokenString);
        await updateUserSettings(user.id, {
          receive_notifications: true,
          expo_push_token: pushTokenString,
        });
      } else {
        removeNotificationPermissions();
      }
    }
  };

  const removeNotificationPermissions = async () => {
    await SecureStore.deleteItemAsync("pushToken");
    if (user) {
      await updateUserSettings(user.id, {
        receive_notifications: false,
        expo_push_token: null,
      });
    }
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
        isInitializing: loading,
        appSettings,
        userNotificationSettings,
        onSignin,
        onSignUp,
        onSignOut,
        reInitialize,
        updateSettings,
        registerForNotifications,
        removeNotificationPermissions,
        getNotificationPermissionStatus,
        handleDeleteUserAccount,
        deleteUserAccountMutation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
