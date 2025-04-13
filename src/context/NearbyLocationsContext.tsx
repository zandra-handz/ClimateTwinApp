import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNearbyLocations } from '../calls/apicalls';
import { useSurroundingsWS } from './SurroundingsWSContext';

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
  nearbyLocations: NearbyLocation[] | undefined;
  centeredNearbyLocations: NearbyLocation[];
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
  const { user, isAuthenticated, isInitializing } = useUser();
  const { lastState, lastLocationId, baseLocationId } = useSurroundingsWS();
  const [centeredNearbyLocations, setCenteredNearbyLocations] = useState<NearbyLocation[]>([]);

  const queryClient = useQueryClient();



 // isPortal === 'yes' is not right

  const { data: nearbyLocations, isLoading, isError, isSuccess } = useQuery<NearbyLocation[]>({
    queryKey: ['nearbyLocations', baseLocationId],
    queryFn: getNearbyLocations,
    enabled: !!isAuthenticated && !isInitializing && !!lastLocationId && (lastState === 'exploring'), 
    //staleTime: 0,
    onError: (err) => {
      console.error('Error fetching location data:', err);
    },
    onSuccess: (data) => {
      if (data) {
        console.log('getTwinLocation query success:', data); 
      }
    },
  });

  useEffect(() => {
    if (lastLocationId && nearbyLocations && nearbyLocations.length > 0) {
      console.log(lastLocationId);
      
      console.log('FILTERING NEARBY LOCATIONS');
      const filteredData = nearbyLocations.filter(item => item.id !== lastLocationId);
      setCenteredNearbyLocations(filteredData);
      console.log('FILTERED DATA', filteredData[7]);


    } else {
      setCenteredNearbyLocations([]);
    }

  }, [nearbyLocations, lastLocationId]);

  
  const triggerRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['nearbyLocations', baseLocationId] });
  };
 
   

  return (
    <NearbyLocationsContext.Provider value={{ nearbyLocations, centeredNearbyLocations, triggerRefetch }}>
      {children}
    </NearbyLocationsContext.Provider>
  );
};
