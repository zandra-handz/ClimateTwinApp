import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the context value
interface AppMessageData {
  result: boolean | null;
  resultData: any; // You can refine this type depending on your data
  resultsMessage: string;
}

interface AppMessageContextType {
  appMessageData: AppMessageData;
  showAppMessage: (result: boolean, resultData: any, resultsMessage?: string) => void;
  hideAppMessage: () => void;
}

// Create the context with the correct type
const AppMessageContext = createContext<AppMessageContextType | undefined>(undefined);

// Custom hook to use the AppMessageContext
export const useAppMessage = () => {
  const context = useContext(AppMessageContext);

  if (!context) {
    throw new Error('useAppMessage must be used within an AppMessageContextProvider');
  }

  return context;
};

// Define the type for children prop
interface AppMessageContextProviderProps {
  children: ReactNode;
}

export const AppMessageContextProvider: React.FC<AppMessageContextProviderProps> = ({ children }) => {
  const [appMessageData, setAppMessageData] = useState<AppMessageData>({
    result: false,
    resultData: null,
    resultsMessage: '',
  });

  const showAppMessage = (result: boolean, resultData: any, resultsMessage = 'Action successful') => {
    setAppMessageData({ result, resultData, resultsMessage });
  };

  const hideAppMessage = () => {
    setAppMessageData({ result: null, resultData: null, resultsMessage: '' });
  };

  return (
    <AppMessageContext.Provider value={{ appMessageData, showAppMessage, hideAppMessage }}>
      {children}
    </AppMessageContext.Provider>
  );
};
