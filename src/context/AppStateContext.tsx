import React, { createContext, useEffect, useRef, useState, useContext } from "react";
import { AppState, AppStateStatus } from "react-native";

const AppStateContext = createContext<{ appState: AppStateStatus }>({ appState: "active" });
 
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
 
export const AppStateProvider = ({ children }) => {
  const appState = useRef(AppState.currentState);
  const [state, setState] = useState<AppStateStatus>(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextState => {
      appState.current = nextState;
      setState(nextState);
    });

    return () => subscription.remove();
  }, []);

  // Usage in components:
  // appState === 'active'/'background'/'inactive'
  return (
    <AppStateContext.Provider value={{ appState: state }}>
      {children} 
    </AppStateContext.Provider>
  );
};  
