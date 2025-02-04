import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNearbyLocations } from '../apicalls';

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
  twinLocations: NearbyLocation[];
  discoveryLocations: NearbyLocation[];
  triggerRefetch: () => void;
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
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery<NearbyLocation[]>({
    queryKey: ['nearbyLocations'],
    queryFn: getNearbyLocations,
    enabled: !!user && !!user.authenticated,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
  });

  // Ensure data is always an array
  const nearbyLocations = data ?? [];

  const nearbyLocationsCount = Array.isArray(nearbyLocations) ? nearbyLocations.length : 0;

  // Check if nearbyLocations has been loaded before filtering
  const twinLocations = nearbyLocations?.length ? nearbyLocations.filter((loc) => loc.explore_type === 'twin_location') : [];
  const discoveryLocations = nearbyLocations?.length ? nearbyLocations.filter((loc) => loc.explore_type === 'discovery_location') : [];

  // Function to trigger a manual refetch
  const triggerRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['nearbyLocations'] });
  };

  return (
    <NearbyLocationsContext.Provider value={{ nearbyLocations, nearbyLocationsCount, twinLocations, discoveryLocations, triggerRefetch }}>
      {children}
    </NearbyLocationsContext.Provider>
  );
};
