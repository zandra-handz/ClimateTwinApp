import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform  } from "react-native";
import { useUser } from "./UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "../calls/apicalls";
import { useAppState } from "./AppStateContext";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

interface UserSettings {
  id: number | null;
  user: number | null;
  expo_push_token: string | null;
  high_contrast_mode: boolean;
  interests: string | null;
  language_preference: string | null;
  large_text: boolean;
  manual_dark_mode: boolean;
  receive_notifications: boolean;
  screen_reader: boolean;
}

interface UserSettingsContextType {
  userSettings: UserSettings;
  settingsState: Record<string, any | null>;
  handleUpdateUserSettings: (newSettings: Record<string, any>) => Promise<void>;
  triggerUserSettingsRefetch: () => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};

interface UserSettingsProviderProps {
  children: ReactNode;
}

export const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient();
  const [settingsState, setSettingsState] = useState<Record<string, any> | null>(null);
    const [ settingsAreLoading, setSettingsAreLoading ] = useState(true);

  //  console.log(`SETTINGS RE LOADINGGGGGGGG`, settingsAreLoading);
  const {
    data: userSettings,
    isPending,
    isLoading,
    isSuccess: settingsLoaded,
    isError,
  } = useQuery<UserSettings | null, Error>({
    queryKey: ["userSettings", user?.id],
    queryFn: getUserSettings,
    enabled: !!(isAuthenticated && user?.id),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setSettingsState(null);
      setSettingsAreLoading(false); // optional
      queryClient.removeQueries(["userSettings", user?.id]);
    }
  }, [isAuthenticated]);


  useEffect(() => { 
    if (settingsLoaded) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ settings loaded!');
        setSettingsState(userSettings);
        // this below also sets settingsLoaded so keep an eye on for race condition
        if (userSettings?.receive_notifications) { 
            handleRegisterForNotifications();
        } else { 
            handleRemoveNotificationPermissions();
        }
        setSettingsAreLoading(false);
        
    }

  }, [settingsLoaded]);


//   useEffect(() => {
//     if (settingsState?.receive_notifications) {
//         handleRegisterForNotifications();
//     } else {
//         handleRemoveNotificationPermissions();
//     }
// }, [settingsState]);


  const triggerUserSettingsRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: ["userSettings", user?.id],
    });
    // queryClient.refetchQueries({
    //   queryKey: ["userSettings", user?.id],
    // });
  };

    const updateUserSettingsMutation = useMutation<
      Record<string, any>,
      Error,
      Record<string, any>
    >({
      mutationFn: (newSettings) => updateUserSettings(user?.id, newSettings),
      onSuccess: (data) => {
        setSettingsState((prev) => ({ ...prev, ...data }));
  
        // queryClient.invalidateQueries({ queryKey: ["userSettings", user?.id] });
        // queryClient
        //   .refetchQueries({ queryKey: ["userSettings", user?.id] })
        //   .then(() => {
        //     const updatedSettings = queryClient.getQueryData([
        //       "userSettings",
        //       user?.id,
        //     ]);
        //   });
      },
      onError: (error) => {
        console.error("Error updating user settings:", error);
      },
    });

    const handleUpdateUserSettings = async (newSettings: Record<string, any>) => {
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







      // NOTIFICATIONS/LISTENERS/SUBSCRIPTIONS

        const getNotificationPermissionStatus = async () => {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync(); 
          return existingStatus;
        };



        
  const handleRegisterForNotifications = async () => {
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
        

        // if issues with below, note that original code was straight api call:
        // (same for remove)
                await updateUserSettings(user.id, {
                  receive_notifications: true,
                  expo_push_token: pushTokenString,
                });
        
        // await handleUpdateUserSettings(  {
        //   receive_notifications: true,
        //   expo_push_token: pushTokenString,
        // });
      } else {
        handleRemoveNotificationPermissions();
      }
    }
  };

    const handleRemoveNotificationPermissions = async () => {
      await SecureStore.deleteItemAsync("pushToken");
      if (user) {
        await updateUserSettings(user.id, {
            receive_notifications: false,
            expo_push_token: null,
          });
        // await handleUpdateUserSettings({
        //   receive_notifications: false,
        //   expo_push_token: null,
        // });
      }
    };
  



  return (
    <UserSettingsContext.Provider
      value={{
        userSettings,
        settingsState,
        settingsLoaded,
        handleUpdateUserSettings,
        updateUserSettingsMutation,
        triggerUserSettingsRefetch,
        handleRegisterForNotifications,
        handleRemoveNotificationPermissions,
        getNotificationPermissionStatus,
        settingsAreLoading,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
