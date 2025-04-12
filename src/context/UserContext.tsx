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
import useProtectedRoute from "../../app/hooks/useProtectedRoute";
import useImageUploadFunctions from "../../app/hooks/useImageUploadFunction";
import {
  signup,
  signin,
  signinWithoutRefresh,
  signout,
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
} from "../calls/apicalls";
import { useAppMessage } from "./AppMessageContext";
import { useNavigationContainerRef, useSegments } from "expo-router"; 
 
interface User {
  id?: string;
  username?: string;
  email?: string; 
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
  const navigationRef = useNavigationContainerRef();
  const { imageUri } = useImageUploadFunctions();
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
   const [isNavigationReady, setNavigationReady] = useState(false);
  const isOnSignIn = segments[0] === "signin";
 
      useEffect(() => {
        if (navigationRef.isReady()) {
          setNavigationReady(true);
        }
    
        const unsubscribe = navigationRef.addListener("state", () => {
          setNavigationReady(true);
        });
    
        return () => unsubscribe && unsubscribe();
      }, [navigationRef.isReady()]);
    

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

  let isReinitializing = false;

  const reInitialize = async () => {
    if (isReinitializing) {
      showAppMessage(
        true,
        null,
        "Reinitializing already in progress, new attempt returned"
      );
      console.log("reInitialize already in progress");
      return;
    }

    isReinitializing = true;
    try {
      console.log("reinitializing!!!!");
     // showAppMessage(true, null, "Initializing...");
      setLoading(true);
      //console.log("use loading --> true");

      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        let userData = null;

        try {
          userData = await getCurrentUser();
          // console.log(
          //   "REINIT USER DATA ON OTHER SIDE OF INTERCEPTOR: ",
          //   userData
          // );
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
    ) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!APP SETTINGS", appSettings);
    }

    const cachedSettings = queryClient.getQueryData(["userSettings", user?.id]);

    if (cachedSettings) {
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!! REACT QUERY CACHE: ",
        cachedSettings
      );
    }
  }, [appSettings]);

  useEffect(() => {
    if (
      appStateVisible === "active" &&

      isNavigationReady &&
      !isOnSignIn
    ) {
     // console.log("Current segment:", segments[0]);
      console.log(
        "APP IN FOREGROUND, REINITTING IN USER CONTEXT!!!!!!!!!!!!!!!!!!!!!!!!"
      );
      reInitialize();
    }
  }, [appStateVisible, isNavigationReady]);
  

  const updateUserSettingsMutation = useMutation<Record<string, any>, Error, Record<string, any>>({
 
    mutationFn: (newSettings) => updateUserSettings(user?.id, newSettings),
    onSuccess: (data) => {
      setAppSettings((prev) => ({ ...prev, ...data }));

      // queryClient.invalidateQueries(["userSettings", user?.id]);
      // queryClient.refetchQueries(["userSettings", user?.id]).then(() => {
      //   const updatedSettings = queryClient.getQueryData([
      //     "userSettings",
      //     user?.id,
      //   ]);
      //   console.log("Refetched user settings:", updatedSettings);
      // });

      queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
queryClient.refetchQueries({ queryKey: ["userSettings", user?.id] }).then(() => {
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
      console.log("Sign in mutation is running reInit");
      reInitialize();  
    },
    onError: (error) => {
      console.error("Sign in mutation error:", error);
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
    },
  });

  const onSignUp = async (username, email, password) => {
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
    setLoading(false);
    showAppMessage(true, null, "Signed out.");

    queryClient.clear();
  };


  useEffect(() => {
    console.log('usernotifs useEffect triggered in context: ', appSettings?.receive_notifications);
    if (appSettings?.receive_notifications) {
        console.log('registering for notifs');
        registerForNotifications();
    } else {
        console.log('removing notifs permissions');
        removeNotificationPermissions();
    }
}, [appSettings]);


const getNotificationPermissionStatus = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log(`existingStatus: `, existingStatus);
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
          console.log(`new status: `, status);
      }

      if (finalStatus === "granted" && user) {
          const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
          const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

          await SecureStore.setItemAsync('pushToken', pushTokenString);
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
    await SecureStore.deleteItemAsync('pushToken');
    if (user) {
        await updateUserSettings(user.id, { receive_notifications: false, expo_push_token: null });
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
