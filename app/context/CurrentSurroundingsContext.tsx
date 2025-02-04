import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { getExploreLocation } from '../apicalls';

interface ExploreLocation { //commented out is the data we get from the original matched location
  //cloudiness: number;
  created_on: string;
  // description: string;
  // details: string;
  // experience: string;
  // explore_type: string;
  // home_location: number;
  // humidity: number;
  // humidity_interaction: string;
  id: number;
  explore_location: number;
  last_accessed: string;
  twin_location: number;
  // latitude: number;
  // longitude: number;
  // name: string;
  // pressure: number;
  // pressure_interaction: string;
  // special_harmony: boolean;
  // stronger_wind_interaction: string;
  // sunrise_timestamp: number;
  // sunset_timestamp: number;
  // temperature: number;
  user: number;
  // wind_direction: number;
  // wind_friends: string;
  // wind_speed: number;
  // wind_speed_interaction: string;
}

interface CurrentSurroundingsContextType {
  exploreLocation: ExploreLocation | null;
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

  const { data: exploreLocation, isLoading, isError, isSuccess } = useQuery<ExploreLocation | null>({
    queryKey: ['exploreLocation'],
    queryFn: getExploreLocation,
    enabled: !!user && !!user.authenticated,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => {
      if (data) {
        console.log('getTwinLocation query success:', data);
        // Data is already in the correct structure, no mapping needed here
      }
    },
  });

  return (
    <CurrentSurroundingsContext.Provider value={{ exploreLocation, setTriggerFetch }}>
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
