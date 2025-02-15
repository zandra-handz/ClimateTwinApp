import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Alert } from 'react-native';
import { useUser } from "../context/UserContext";
import { useAppState } from "../context/AppStateContext";

const TopLevelRouter = ({ children }) => {
  const router = useRouter();
  const { appStateVisible } = useAppState();
  const { user, onSignOut, reInitialize } = useUser();

//expo router.push and router.replace resolve to the index of the current scope, not root
//found this dismissAll solution here: https://stackoverflow.com/questions/78932668/i-cant-navigate-back-to-root-on-expo-router
//not sure if there are drawbacks to using this  
const goToRoot = (): void => {
  if (router.canDismiss()) {
    router.dismissAll();
  } else {
    console.log("Already at the root screen, no need to dismiss.");
  }
};


  const goToHome = () => {
    router.push("(tabs)");
  };

  // useEffect(() => {
  //   if (appStateVisible === 'active') {
  //     console.log('TopRouterNav: appStateVisible triggering reinitialization');
  //     //Alert.alert("APP VISIBLE", "Attempting to reinitialize user");
  //     reInitialize();
  //   }

  // }, [appStateVisible]);

  useEffect(() => {
    console.log('use effect in top router!');
    // If user is still loading, don't perform any check yet
    if (user.loading) {
      console.log('TOP ROUTER: user is loading, router will not nav anywhere for now');
      return;
    }

    // If the user is not authenticated, redirect to signin
    if (!user.authenticated) {
      console.log('TOP ROUTER user not authenticated! Navving to root screen if not already there.');
      goToRoot();
      //router.replace("/signin");
    }
    if (user && user.authenticated) {
      console.log('TOP ROUTER: user authenticated! Navving to home');
      goToHome();
    
    };
  }, [user, router]);

  return <>{children}</>;
};

export default TopLevelRouter;
