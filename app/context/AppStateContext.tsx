import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

interface AppStateContextProps {
  appStateVisible: string;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("AppState changed:", nextAppState);
      console.log("Previous AppState:", appState.current);

      const previousAppState = appState.current;
      appState.current = nextAppState;

      if (previousAppState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
      }

      setAppStateVisible(nextAppState);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppStateContext.Provider value={{ appStateVisible }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
