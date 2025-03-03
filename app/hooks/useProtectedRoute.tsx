import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";


// Hook for protected route handling

const useProtectedRoute = (isAuthenticated: boolean, isLoading: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);

  // console.log('useProtectedRoute triggered, isAuthenticated:', isAuthenticated);
  // console.log('useProtectedRoute triggered, isLoading:', isLoading);
  // console.log('useProtectedRoute triggered, is nav ready:', navigationRef.isReady());
  // console.log(segments[0]);

  const goToRoot = (): void => {
    if (router.canDismiss()) {
      router.dismissAll();
    } else {
      console.log("Already at the root screen, no need to dismiss.");
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
      // console.log("NAVIGATION IS NOT READY");
      // console.log(segments[0]);
      return;
    } 
    // else {
    //   console.log('NAV IS READY!');
    //   console.log(segments[0]);
    // } 
    const isOnSignIn = segments[0] === "signin";
    const isOnExploreTabs = segments[0] === "(drawer)/(exploretabs)";
    const isOnRootPage = segments.length === 0 || segments[0] === "" || segments[0] === "secondindex" ; 

    // console.log(isNavigationReady);
    // console.log(segments[0]);

    if (!isAuthenticated && !isOnSignIn) {
      // console.log('Protected route redirecting to index');

      //I may be able to get rid of secondindex and go back to using goToRoot
      //because the actual looping issue seemed to be either signin flow fumbling reinit
      //or not using a loading state to prevent things from running while user is in the process if reinitializing
      //uh but this has been a long debug session and i don't want to touch anything right now 
      //since it finally seems to work
      //router.replace("/");
      goToRoot();
    } else if (isAuthenticated && !isOnExploreTabs && (isOnSignIn || isOnRootPage)) {
      // console.log('Protected route redirecting to (main)');
      router.push("(drawer)");
    }
  }, [isAuthenticated, isLoading, segments, isNavigationReady]);
};

export default useProtectedRoute;
