import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from 'react';
import { useUser } from './UserContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';  
import { go, getRemainingGoes } from '../apicalls';

interface ActiveSearch {
  id: string;
  name: string;
  // Add other fields as needed
}

interface ActiveSearchContextType {
  activeSearch: ActiveSearch | null;
  isSearchingForTwin: boolean;
  triggerActiveSearch: () => void;
}

const ActiveSearchContext = createContext<ActiveSearchContextType | undefined>(undefined);

export const useActiveSearch = (): ActiveSearchContextType => {
  const context = useContext(ActiveSearchContext);
  if (!context) {
    throw new Error('useActiveSearch must be used within an ActiveSearchProvider');
  }
  return context;
};

interface ActiveSearchProviderProps {
  children: ReactNode;
}

export const ActiveSearchProvider: React.FC<ActiveSearchProviderProps> = ({ children }) => {
  const { user } = useUser(); 
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null);
  const [searchIsActive, setSearchIsActive] = useState<boolean>(false);
  const [exploreLocationsAreReady, setExploreLocationsAreReady] = useState<boolean>(true);
  const [manualSurroundingsRefresh, setManualSurroundingsRefresh ] = useState<boolean>(false);

  useEffect(() => {
    console.log("User changed. Resetting context...");
    setActiveSearch(null);
    setSearchIsActive(false);
    setExploreLocationsAreReady(true);
    setManualSurroundingsRefresh(false);
  }, [user]);


  
  const { data: remainingGoes, isLoading, isFetching, isSuccess, isError } = useQuery({
    queryKey: ['remainingGoes'],
    queryFn: () => getRemainingGoes(),
    enabled: !!user && !!user.authenticated,
    onSuccess: (data) => { 
        
    }
});


const refetchRemainingGoes = () => {
    queryClient.invalidateQueries({ queryKey: ['remainingGoes'] });
  };


  const handleGo = (address) => {
    // Make sure `user?.user?.address` is valid before calling the mutation
    if (address) {
      sendGoRequestMutation.mutate(address);
    } else {
      console.error('User address is unavailable');
    }
  };

  const sendGoRequestMutation = useMutation({
    mutationFn: (address) => go(address),
    onMutate: () => {
      setSearchIsActive(true);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoRequestMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      refetchRemainingGoes();

      const dataWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(), // Add a timestamp when the data is fetched
      }; 
      // Cache the data with the timestamp
      // NOT USING YET, USING JUST THE EXISTENCE OF ACTIVESEARCH FOR RN
     // queryClient.setQueryData(['activeSearch', user?.user?.id], dataWithTimestamp);
  
      // Optionally update the activeSearch state with the new data
      setActiveSearch(dataWithTimestamp);
      console.log('Data with timestamp:', dataWithTimestamp);
 

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoRequestMutation.reset();
      }, 2000);
    },
  });



  const gettingExploreLocations = () => {
    setExploreLocationsAreReady(false);

  };


  
  const foundExploreLocations = () => {
    setExploreLocationsAreReady(true);

  };
  

  // search status is updated by current location websocket (component WebSocketCurrentLocation)
  const closeSearchExternally = () => {
    setSearchIsActive(false);  

  };

  const refreshSurroundingsManually = () => {
    setManualSurroundingsRefresh(true);
   

  };

  const resetRefreshSurroundingsManually = () => {
    setManualSurroundingsRefresh(false);
   

  };

  return (
    <ActiveSearchContext.Provider value={{ activeSearch, searchIsActive, exploreLocationsAreReady, gettingExploreLocations, foundExploreLocations, handleGo, closeSearchExternally, refreshSurroundingsManually,  resetRefreshSurroundingsManually, manualSurroundingsRefresh, remainingGoes }}>
      {children}
    </ActiveSearchContext.Provider>
  );
};
