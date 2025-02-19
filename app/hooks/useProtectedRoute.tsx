import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { useState, useEffect } from "react";


// Hook for protected route handling
//(i am passing in authenticated instead of the full user, because this is now set as its own variable 
//in the context, separate from the user object)
const useProtectedRoute = (user: User | null) => {
  const navigationRef = useNavigationContainerRef();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setNavigationReady] = useState(false);

  console.log('useProtectedRoute triggered, user data: ', user);
  console.log('useProtectedRoute triggered, is nav ready: ', navigationRef.isReady());


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

    const isAuthGroup = segments[0] === ("+not-found" || '(tabs)');
    const isHome = segments[0] === ("(tabs)/(main)");
    console.log(isNavigationReady);
    console.log(segments[0]);

    if (!user && isHome) {
        console.log('rpotected route navving to index');
      //router.push("/index");
      goToRoot();
    } else if (user && !isHome) {
        console.log('rpotected route navving to (tabs)');
      router.push("(tabs)/(main)");
    }
  }, [user, segments, isNavigationReady]);
};

export default useProtectedRoute;
