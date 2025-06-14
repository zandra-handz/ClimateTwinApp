import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useUserSettings } from "../context/UserSettingsContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
 
const useProtectedRoute = (isAuthenticatedd: boolean, isLoadingg: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);
  const { user, isAuthenticated, isInitializing: isLoading } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { lastState } = useSurroundingsWS();
 

  const goToRoot = (): void => {
    if (router.canDismiss()) {
      router.dismissAll();
    } else {
      console.log("Already at the root screen, no need to dismiss.");
      // console.log(segments[0]);
      // console.log(segments[1]);
    }
  };

  // might be causing issues since Expo 53 SDK update 
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
    if (!isNavigationReady || settingsAreLoading) { 
      return;
    }  

    const isOnSignIn = segments[0] === "signin";
    const isOnRecoverCreds = segments[0] === "recover-credentials";
    const isOnExploreTabs = segments[0] === "(drawer)/(exploretabs)"; 
      const isOnRootPage = (segments as string[]).length === 0; 
 

    if (!isAuthenticated && !isOnSignIn && !isOnRecoverCreds) { 

 
     // console.log('going to root!');
      goToRoot();
    } else if (isAuthenticated && (isOnSignIn || isOnRootPage)) { 
        router.push("/(drawer)/(homedashboard)");
      }  
       
  }, [isAuthenticated, settingsAreLoading, segments, isNavigationReady ]); 
};

export default useProtectedRoute;
