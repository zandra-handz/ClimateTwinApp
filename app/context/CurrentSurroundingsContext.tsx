import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { getExploreLocation } from '../apicalls';
 
import { useNearbyLocations } from './NearbyLocationsContext';  

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



  // (NOBRIDGE) LOG  handle explore location pressed! {"cloudiness": 1, "created_on": "2025-02-06T00:01:23.731950Z", "description": "clear sky", "details": "Slantwise winds could contribute to variable weather patterns with scattered precipitation.", "experience": "Wind is from the left, which may result in variable weather patterns.", "explore_type": "twin_location", "home_location": 1441, "humidity": 62, "humidity_interaction": "Match", "id": 1477, "last_accessed": "2025-02-06T00:01:23.731976Z", "latitude": 47.7231589959676, "longitude": 14.139293334559785, "name": "Hinterstoder, Austria", "pressure": 1040, "pressure_interaction": "High atmospheric pressure may contribute to stable and clear weather conditions.", "special_harmony": false, "stronger_wind_interaction": "yours", "sunrise_timestamp": 1738823014, "sunset_timestamp": 1738858291, "temperature": 18.64, "user": 1, "wind_direction": 148, "wind_friends": "Slantwise", "wind_speed": 1.34, "wind_speed_interaction": "Wind has a mild effect on your wind, contributing to a gentle breeze."}   
  // (NOBRIDGE) LOG  {"twin_location": 1477}
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
        console.log('getExploreLocation success:', data);
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
