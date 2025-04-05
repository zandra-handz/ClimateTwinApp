import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

// Define the context and its type
interface AppStateContextProps {
  isAppForeground: boolean;
  isAppInactive: boolean;
  isAppBackground: boolean;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

// Custom hook to access the context
export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// AppStateProvider component to wrap the app and provide the state
export const AppStateProvider: React.FC = ({ children }) => {
  const [isAppForeground, setIsAppForeground] = useState<boolean>(false);
  const [isAppInactive, setIsAppInactive] = useState<boolean>(false);
  const [isAppBackground, setIsAppBackground] = useState<boolean>(true);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setIsAppForeground(true);
        setIsAppInactive(false);
        setIsAppBackground(false);
      } else if (nextAppState === 'background') {
        setIsAppForeground(false);
        setIsAppInactive(false);
        setIsAppBackground(true);
      } else if (nextAppState === 'inactive') {
        setIsAppForeground(false);
        setIsAppInactive(true);
        setIsAppBackground(false);
      }
    });

    // Cleanup on unmount
    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <AppStateContext.Provider value={{ isAppForeground, isAppInactive, isAppBackground }}>
      {children}
    </AppStateContext.Provider>
  );
};
