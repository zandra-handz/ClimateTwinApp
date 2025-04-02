import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the context value
interface AppMessageData {
  result: boolean | null;
  resultData: any;
  resultsMessage: string;
}

interface AppMessageContextType {
  messageQueue: AppMessageData[]; // Now it's a queue (array)
  showAppMessage: (result: boolean, resultData: any, resultsMessage?: string) => void;
  hideAppMessage: () => void;
  removeMessage: () => void; // Removes message from the queue
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
  const [messageQueue, setMessageQueue] = useState<AppMessageData[]>([]);

  const showAppMessage = (result: boolean, resultData: any, resultsMessage = 'Action successful') => {
    setMessageQueue(prevQueue => [...prevQueue, { result, resultData, resultsMessage }]);
  };

  const hideAppMessage = () => {
    setMessageQueue([]);
  };

  const removeMessage = () => {
    setMessageQueue(prevQueue => prevQueue.slice(1)); // Remove the first message from the queue
  };

  return (
    <AppMessageContext.Provider value={{ messageQueue, showAppMessage, hideAppMessage, removeMessage }}>
      {children}
    </AppMessageContext.Provider>
  );
};
