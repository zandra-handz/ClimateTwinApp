import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { go } from '../apicalls';

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
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null);
  const [searchIsActive, setSearchIsActive] = useState<boolean>(false);


  const handleGo = (address) => {
    // Make sure `user?.user?.address` is valid before calling the mutation
    if (address) {
      mutation.mutate(address);
    } else {
      console.error('User address is unavailable');
    }
  };

  const mutation = useMutation({
    mutationFn: (address) => go(address), // Ensure you pass the required argument
    onMutate: () => {
      setSearchIsActive(true);
    },
    onSuccess: (data) => {
      // Create a new data object with a timestamp
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
    },
    onError: (err) => {
      console.error('Error fetching go data:', err);
    }
  });
  

  // search status is updated by current location websocket (component WebSocketCurrentLocation)
  const closeSearchExternally = () => {
    setSearchIsActive(false);  

  };

  return (
    <ActiveSearchContext.Provider value={{ activeSearch, searchIsActive, handleGo, closeSearchExternally }}>
      {children}
    </ActiveSearchContext.Provider>
  );
};
