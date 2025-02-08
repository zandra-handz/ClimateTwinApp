import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNearbyLocations } from '../apicalls';
import { useActiveSearch } from './ActiveSearchContext';

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
  clearData: () => void;
  refetchNearbyLocations: () => void; // Expose refetch function
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
  const { exploreLocationsAreReady } = useActiveSearch();

  const { data, refetch } = useQuery<NearbyLocation[]>({
    queryKey: ['nearbyLocations'],
    queryFn: getNearbyLocations,
    enabled: !!user && !!user.authenticated,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
  });

  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>(data ?? []);
  const twinLocations = nearbyLocations?.length ? nearbyLocations.filter((loc) => loc.explore_type === 'twin_location') : [];
  const discoveryLocations = nearbyLocations?.length ? nearbyLocations.filter((loc) => loc.explore_type === 'discovery_location') : [];

  const triggerRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['nearbyLocations'] });
  };

  const clearData = () => {
    setNearbyLocations([]); 
    queryClient.removeQueries({ queryKey: ['nearbyLocations'] });
  };

  // Function to manually refetch the nearby locations, even if data is cleared
  const refetchNearbyLocations = async () => {
    // If query data has been removed from cache, manually trigger the fetch
    if (!queryClient.getQueryData(['nearbyLocations'])) {
      // This will directly call the query function to fetch the data
      try {
        const fetchedData = await getNearbyLocations(); // Manually call the function to fetch data
        setNearbyLocations(fetchedData); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching nearby locations:', error);
      }
    } else {
      refetch(); // If the data is still in the cache, use the refetch method
    }
  };


  useEffect(() => {
    console.log('explorelocations', exploreLocationsAreReady);
    if (exploreLocationsAreReady) {
      refetchNearbyLocations();
    } else {
      clearData();
    }

  }, [exploreLocationsAreReady]);

  return (
    <NearbyLocationsContext.Provider value={{ nearbyLocations, twinLocations, discoveryLocations, triggerRefetch, clearData, refetchNearbyLocations }}>
      {children}
    </NearbyLocationsContext.Provider>
  );
};
