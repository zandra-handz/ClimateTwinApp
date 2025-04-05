import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNearbyLocations } from '../apicalls'; 
import { useSurroundingsWS } from './SurroundingsWSContext';

import { useActiveSearch } from "@/app/context/ActiveSearchContext";

interface NearbyLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  explore_type: string;
  created_on: string;
  last_accessed: string;
  miles_away?: number;
  wind_agreement_score?: number;
  wind_compass?: string;
  tags?: Record<string, string>;
}

interface NearbyLocationsContextType {
  nearbyLocations: NearbyLocation[]; 
   setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const NearbyLocationsContext = createContext<NearbyLocationsContextType | undefined>(undefined);

export const useNearbyLocations = (): NearbyLocationsContextType => {
  const context = useContext(NearbyLocationsContext);
  if (!context) {
    throw new Error('useNearbyLocations must be used within a NearbyLocationsProvider');
  }
  return context;
};

interface NearbyLocationsProviderProps {
  children: ReactNode;
}

export const NearbyLocationsProvider: React.FC<NearbyLocationsProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isInitializing } = useUser(); 
  const { lastMessage } = useSurroundingsWS();
  const { isExploring } = useActiveSearch();
  const queryClient = useQueryClient();  


  const searchComplete = lastMessage === 'Search complete!' || lastMessage === 'Clear' || lastMessage === '';


  const { data: nearbyLocations, isLoading, isError, isSuccess } = useQuery<NearbyLocation[]>({
    queryKey: ['nearbyLocations', lastMessage],
    queryFn: getNearbyLocations,
    enabled: !!isAuthenticated && !isInitializing,// && searchComplete,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => {
      if (data) {
        console.log('getTwinLocation query success:', data); 
      }
    },
  });

  
  const triggerRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['nearbyLocations', lastMessage] });
  };
 
   

  return (
    <NearbyLocationsContext.Provider value={{ nearbyLocations, triggerRefetch }}>
      {children}
    </NearbyLocationsContext.Provider>
  );
};
