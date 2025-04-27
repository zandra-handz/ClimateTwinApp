import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
 
const useProtectedRoute = (isAuthenticated: boolean, isLoading: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);
 

  const goToRoot = (): void => {
    if (router.canDismiss()) {
      router.dismissAll();
    } else {
      console.log("Already at the root screen, no need to dismiss.");
      console.log(segments[0]);
      console.log(segments[1]);
    }
  };

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
    if (!isNavigationReady || isLoading) { 
      return;
    }  

    const isOnSignIn = segments[0] === "signin";
    const isOnRecoverCreds = segments[0] === "recover-credentials";
    const isOnExploreTabs = segments[0] === "(drawer)/(exploretabs)"; 
      const isOnRootPage = (segments as string[]).length === 0; 
 

    if (!isAuthenticated && !isOnSignIn && !isOnRecoverCreds) { 

 
      console.log('going to root!');
      goToRoot();
    } else if (isAuthenticated && !isOnExploreTabs && (isOnSignIn || isOnRootPage)) {
      console.log('going to explore screen!');
      router.push("/(drawer)");
    }
  }, [isAuthenticated, isLoading, segments, isNavigationReady]); 
};

export default useProtectedRoute;
