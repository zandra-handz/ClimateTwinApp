import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";

 

const useExploreRoute = (isExploring: boolean, isInitializingLocation: boolean, isAuthenticated: boolean) => {
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
    if (!isNavigationReady || isInitializingLocation) { 
      return;
    }  
    const isOnSignIn = segments[0] === "signin";
    const isOnExploreTabs = segments[1] === "(exploretabs)"; 
    const isOnDashboard = segments[1] === "(homedashboard)";
    console.log(segments[0]);
   
    // console.log(isNavigationReady);
    console.log(segments[1]);

                                                  //was previously !isOnDashboard but couldn't open other drawer screens when not exploring
    if (!isExploring && !isInitializingLocation && isOnExploreTabs && isAuthenticated) {
        console.log('going to dashboard!!!'); 
      router.replace("(homedashboard)")
    } else if (isExploring && isOnDashboard && isAuthenticated) { 
      router.replace("(exploretabs)");
    }
    console.log(`IS EXPLORING?`, isExploring);
  }, [ isInitializingLocation, isExploring, segments, isNavigationReady]);
};

export default useExploreRoute;
