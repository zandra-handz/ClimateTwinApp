import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery } from '@tanstack/react-query';
import { go, getTwinLocation } from '../apicalls';

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
  const [isSearchingForTwin, setIsSearchingForTwin] = useState<boolean>(false);


  


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

  // (NOBRIDGE) LOG  matched location! {
  // "cloudiness": 0, 
  // "created_on": "2025-02-03T21:23:33.204266Z", 
  // "description": "clear sky", 
  // "details": "Perpendicular winds may enhance conditions for severe weather, such as thunderstorms or tornadoes.", 
  // "experience": "Wind is from the left, which may result in variable weather patterns.", 
  // "explore_type": "twin_location", 
  // "home_location": 1348, 
  // "humidity": 66, 
  // "humidity_interaction": "Moderate humidity levels, 79 and 66 may contribute to comfortable weather conditions.", 
  // "id": 1384, 
  // "last_accessed": "2025-02-03T21:23:33.204320Z", 
  // "latitude": 39.74579350286426, 
  // "longitude": 33.77866798336945, 
  // "name": "Olunlu/Keskin/Kırıkkale, Türkiye", 
  // "pressure": 1018, 
  // "pressure_interaction": "1013 and 1018 represent opposite atmospheric pressure conditions.", 
  // "special_harmony": false, 
  // "stronger_wind_interaction": "Second Wind", 
  // "sunrise_timestamp": 1738644605, 
  // "sunset_timestamp": 1738681650, 
  // "temperature": 38.39, 
  // "user": 1, 
  // "wind_direction": 240, 
  // "wind_friends": "Perpendicular", 
  // "wind_speed": float, 
  // "wind_speed_interaction": str}

  return (
    <CurrentSurroundingsContext.Provider value={{ matchedLocation, setTriggerFetch }}>
      {children}
    </CurrentSurroundingsContext.Provider>
  );
};
