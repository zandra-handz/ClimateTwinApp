import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { getTwinLocation } from '../apicalls';

interface MatchedLocation {
  cloudiness: number;
  created_on: string;
  description: string;
  details: string;
  experience: string;
  explore_type: string;
  home_location: number;
  humidity: number;
  humidity_interaction: string;
  id: number;
  last_accessed: string;
  latitude: number;
  longitude: number;
  name: string;
  pressure: number;
  pressure_interaction: string;
  special_harmony: boolean;
  stronger_wind_interaction: string;
  sunrise_timestamp: number;
  sunset_timestamp: number;
  temperature: number;
  user: number;
  wind_direction: number;
  wind_friends: string;
  wind_speed: number;
  wind_speed_interaction: string;
}

interface MatchedLocationContextType {
  matchedLocation: MatchedLocation | null;
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchedLocationContext = createContext<MatchedLocationContextType | undefined>(undefined);

export const useMatchedLocation = (): MatchedLocationContextType => {
  const context = useContext(MatchedLocationContext);
  if (!context) {
    throw new Error('useMatchedLocation must be used within a MatchedLocationProvider');
  }
  return context;
};

interface MatchedLocationProviderProps {
  children: ReactNode;
}

export const MatchedLocationProvider: React.FC<MatchedLocationProviderProps> = ({ children }) => {
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
      if (data) {
        console.log('getTwinLocation query success:', data);
        // Data is already in the correct structure, no mapping needed here
      }
    },
  });

  return (
    <MatchedLocationContext.Provider value={{ matchedLocation, setTriggerFetch }}>
      {children}
    </MatchedLocationContext.Provider>
  );
};
