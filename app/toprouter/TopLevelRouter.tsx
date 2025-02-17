import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { AppState } from 'react-native';
import { useUser } from "../context/UserContext";
import { useAppState } from "../context/AppStateContext";
import { useAppMessage } from "../context/AppMessageContext";

const TopLevelRouter = ({ children }) => {
  const router = useRouter();
  //const { appStateVisible } = useAppState();
  const { user, deAuthUser, reInitialize } = useUser();
  const { showAppMessage } = useAppMessage();


  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     console.log("Next AppState:", nextAppState);
      
  //     if (appState.current !== nextAppState) {
  //       appState.current = nextAppState;  // Update ref
  //       setAppStateVisible(nextAppState); // Trigger re-render
  //     }
  //   });
  
  //   return () => subscription.remove(); // Correct cleanup
  // }, []);
  
  // useEffect(() => {
  //   console.log("AppState Visible Changed:", appStateVisible);
  
  //   if (appStateVisible === "active") {
  //     console.log("Reinitializing user...");
  //     showAppMessage(true, null, 'Deauthing and reinitializing user!');
  //     deAuthUser();
  //     reInitialize();
  //   } else {
  //     deAuthUser();
  //   }
  // }, [appStateVisible]);

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
 
 

  useEffect(() => {
    if (user?.authenticated) {
      router.replace("/(tabs)"); // Redirect to main app
    } else {
      goToRoot();
      //router.replace("/signin"); // Redirect to sign-in if not authenticated
    }
  }, [user?.authenticated]);


  // useEffect(() => {
  //   console.log('use effect in top router!');
  //   // If user is still loading, don't perform any check yet
  //   // if (user.loading) {
  //   //   console.log('TOP ROUTER: user is loading, router will not nav anywhere for now');
  //   //   showAppMessage(true, null,'TOP ROUTER: user is loading, router will not nav anywhere for now');
  //   //   return;
  //   // }

  //   // If the user is not authenticated, redirect to signin
  //   if (!user.authenticated) {
  //     console.log('TOP ROUTER user not authenticated! Navving to root screen if not already there.');
  //     showAppMessage(true, null,'TOP ROUTER user not authenticated! Navving to root screen if not already there.');
     
  //     goToRoot();
  //     //router.replace("/signin");
  //   }
  //   if (user?.authenticated) {
  //     showAppMessage(true, null,'TOP ROUTER: user authenticated! Navving to home.');
     
  //     console.log('TOP ROUTER: user authenticated! Navving to home');
  //     goToHome();

    
  //    };
  // }, [user, router]);

  return <>{children}</>;
};

export default TopLevelRouter;
