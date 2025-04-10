import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { usePathname } from "expo-router";


 

const useExploreRoute = (lastState: string, isAuthenticated: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const pathname = usePathname(); 
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
    if (!isNavigationReady || !lastState) { 
      return;
    }  
    const isOnSignIn = segments[0] === "signin";
    const isOnExploreTabs = segments[1] === "(exploretabs)"; 
    const isOnDashboard = segments[1] === "(homedashboard)";

    // const isOnExploreTabs = pathname?.startsWith("/exploretabs");
    // const isOnDashboard = pathname?.startsWith("/homedashboard");
    console.log(segments[0]);
   
    // console.log(isNavigationReady);
    console.log(segments[1]);

                                                  //was previously !isOnDashboard but couldn't open other drawer screens when not exploring
    if ((lastState === 'home' || lastState === 'searching for twin') && isOnExploreTabs && isAuthenticated) {
        console.log('going to dashboard!!!'); 
      router.replace("(homedashboard)")
    } else if ((lastState === 'exploring' || lastState === 'searching for ruins') && isOnDashboard && isAuthenticated) { 
      router.replace("(exploretabs)");
    }
    console.log(`LAST STATE`, lastState);
  }, [ lastState, segments, isNavigationReady]);
};

export default useExploreRoute;
