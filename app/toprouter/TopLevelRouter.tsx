import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

const TopLevelRouter = ({ children }) => {
  const router = useRouter();
  const { user, onSignOut } = useUser();

//expo router.push and router.replace resolve to the index of the current scope, not root
//found this dismissAll solution here: https://stackoverflow.com/questions/78932668/i-cant-navigate-back-to-root-on-expo-router
//not sure if there are drawbacks to using this  
  const goToRoot = (): void => {
      router.dismissAll()
  };

  useEffect(() => {
    console.log('use effect in top router!');
    // If user is still loading, don't perform any check yet
    if (user.loading) return;

    // If the user is not authenticated, redirect to signin
    if (!user.authenticated) {
      console.log('navigation triggered!');
      goToRoot();
      //router.replace("/signin");
    }
  }, [user, router]);

  return <>{children}</>;
};

export default TopLevelRouter;
