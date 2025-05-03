import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";  

const useExploreRoute = (lastState: string, isAuthenticated: boolean, isInitializing: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();  
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);
 

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
    if (!lastState || !isAuthenticated || isInitializing) { 
    // if (!isNavigationReady || !lastState || !isAuthenticated || isInitializing) { 
      return;
    }  


    const isOnSignIn = segments[0] === "signin";
    const isOnExploreTabs = segments[1] === "(exploretabs)"; 
    const isOnDashboard = segments[1] === "(homedashboard)";

    console.log(segments[0]);
    console.log(segments[1]);
   console.log('explore route triggered');
    // console.log(isNavigationReady);
 

                                                  //was previously !isOnDashboard but couldn't open other drawer screens when not exploring
    if ((lastState === 'home' || lastState === 'searching for twin') && (segments[1] === "(exploretabs)")) {
       // console.log('going to dashboard!!!'); 
      router.replace("/(homedashboard)")
    } else if ((lastState === 'exploring' || lastState === 'searching for ruins') && isOnDashboard) { 
      router.replace("/(exploretabs)");
    }
   // console.log(`LAST STATE`, lastState);
  }, [ lastState, segments, isAuthenticated, isInitializing]);
  // }, [ lastState, segments, isNavigationReady, isAuthenticated, isInitializing]);
};

export default useExploreRoute;
