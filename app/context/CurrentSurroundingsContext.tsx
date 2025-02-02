import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { getTwinLocation } from '../apicalls';

interface MatchedLocation {
  // Define the structure of the `matchedLocation` object
  id: string;
  name: string;
  // Add other fields here as needed
}

interface CurrentSurroundingsContextType {
  matchedLocation: MatchedLocation | null;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentSurroundingsContext = createContext<CurrentSurroundingsContextType | undefined>(undefined);

export const useSurroundings = (): CurrentSurroundingsContextType => {
  const context = useContext(CurrentSurroundingsContext);
  if (!context) {
    throw new Error('useSurroundings must be used within a CurrentSurroundingsProvider');
  }
  return context;
};

interface CurrentSurroundingsProviderProps {
  children: ReactNode;
}

export const CurrentSurroundingsProvider: React.FC<CurrentSurroundingsProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

  const { data: matchedLocation, isLoading, isError, isSuccess } = useQuery<MatchedLocation | null>({
    queryKey: ['matchedLocation'],
    queryFn: getTwinLocation,
    enabled: !!user && !!user.authenticated,  
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => {
      console.log('getTwinLocation query success:', data);
    },
  });

  return (
    <CurrentSurroundingsContext.Provider value={{ matchedLocation, setTriggerFetch }}>
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
