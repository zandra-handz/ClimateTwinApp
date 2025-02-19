import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";


// Hook for protected route handling

const useProtectedRoute = (isAuthenticated: boolean, isLoading: boolean) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);

  console.log('useProtectedRoute triggered, isAuthenticated:', isAuthenticated);
  console.log('useProtectedRoute triggered, is nav ready:', navigationRef.isReady());

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
    if (!isNavigationReady) {
      console.log("NAVIGATION IS NOT READY");
      return;
    } else {
      console.log('NAV IS READY!');
    }

    const isAuthGroup = segments[0] === "+not-found" || segments[0] === "(tabs)";
    const isHome = segments[0] === "(tabs)/(main)";
    const isOnSignIn = segments[0] === "signin";
    const isOnRootPage = segments.length === 0 || segments[0] === "" || segments[0] === "secondindex" ; 

    console.log(isNavigationReady);
    console.log(segments[0]);

    if (!isAuthenticated && !isOnSignIn) {
      console.log('Protected route redirecting to index');
      router.push("secondindex");
      //goToRoot();
    } else if (isAuthenticated && (isOnSignIn || isOnRootPage)) {
      console.log('Protected route redirecting to (tabs)');
      router.push("(tabs)/(main)");
    }
  }, [isAuthenticated, segments, isNavigationReady]);
};

export default useProtectedRoute;
