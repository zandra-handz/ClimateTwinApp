import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

const TopLevelRouter = ({ children }) => {
  const router = useRouter();
  const { user, onSignOut } = useUser();

  useEffect(() => {
    // If user is still loading, don't perform any check yet
    if (user.loading) return;

    // If the user is not authenticated, redirect to signin
    if (!user.authenticated) {
      router.push("/");
    }
  }, [user, router]);

  return <>{children}</>;
};

export default TopLevelRouter;
