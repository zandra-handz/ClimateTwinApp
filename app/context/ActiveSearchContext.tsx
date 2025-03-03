import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { go, getRemainingGoes, expireSurroundings } from "../apicalls";

interface ActiveSearch {
  id: string;
  name: string; 
}

interface ActiveSearchContextType {
  activeSearch: ActiveSearch | null;
  isSearchingForTwin: boolean;
  triggerActiveSearch: () => void;
}

const ActiveSearchContext = createContext<ActiveSearchContextType | undefined>(
  undefined
);

export const useActiveSearch = (): ActiveSearchContextType => {
  const context = useContext(ActiveSearchContext);
  if (!context) {
    throw new Error(
      "useActiveSearch must be used within an ActiveSearchProvider"
    );
  }
  return context;
};

interface ActiveSearchProviderProps {
  children: ReactNode;
}

export const ActiveSearchProvider: React.FC<ActiveSearchProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null);
  const [searchIsActive, setSearchIsActive] = useState<boolean>(false);
  const [userIsHome, setUserIsHome] = useState<boolean>(false);
  const [locationUpdateWSIsOpen, setlocationUpdateWSIsOpen] =
    useState<boolean>(false);
  const [exploreLocationsAreReady, setExploreLocationsAreReady] =
    useState<boolean>(true);
  const [manualSurroundingsRefresh, setManualSurroundingsRefresh] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("isAuthenticated === false --> resetting ActiveSearch context");
      setActiveSearch(null);
      setSearchIsActive(false);
      //setExploreLocationsAreReady(true);
      //setManualSurroundingsRefresh(false);
    }
  }, [isAuthenticated]);

  const {
    data: remainingGoes,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["remainingGoes"],
    queryFn: () => getRemainingGoes(),
    enabled: !!isAuthenticated && !isInitializing,
    onSuccess: (data) => {},
  });

  const refetchRemainingGoes = () => {
    queryClient.invalidateQueries({ queryKey: ["remainingGoes"] });
    queryClient.refetchQueries({ queryKey: ["remainingGoes"] });
  };

  const handleGo = (address) => {
    // Make sure `user?.user?.address` is valid before calling the mutation
    if (address) {
      sendGoRequestMutation.mutate(address);
    } else {
      console.error("User address is unavailable");
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
     // refetchRemainingGoes();  if the search errors and no location is created, this will be the same, so maybe don't bother fetching it here

      const dataWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(), // Add a timestamp when the data is fetched
      };
      // Cache the data with the timestamp
      // NOT USING YET, USING JUST THE EXISTENCE OF ACTIVESEARCH FOR RN
      // queryClient.setQueryData(['activeSearch', user?.user?.id], dataWithTimestamp);

      // Optionally update the activeSearch state with the new data
      setActiveSearch(dataWithTimestamp);
      console.log("Data with timestamp:", dataWithTimestamp);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoRequestMutation.reset();
      }, 2000);
    },
  });



  
  const handleGoHome = () => { 
      sendGoHomeMutation.mutate();
   
  };

  const sendGoHomeMutation = useMutation({
    mutationFn: expireSurroundings,
    onMutate: () => { 
      console.log('go home mutation activated');
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoHomeMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => { 

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoHomeMutation.reset();
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
   refetchRemainingGoes();
  };

  const refreshSurroundingsManually = () => {
    setManualSurroundingsRefresh(true);
  };

  const resetRefreshSurroundingsManually = () => {
    setManualSurroundingsRefresh(false);
  };

  const handleLocationUpdateWSIsOpen = () => {
    setlocationUpdateWSIsOpen(true);
  };

  const handleLocationUpdateWSIsClosed = () => {
    setlocationUpdateWSIsOpen(false);
  };

  return (
    <ActiveSearchContext.Provider
      value={{
        activeSearch,
        searchIsActive,
        exploreLocationsAreReady,
        gettingExploreLocations,
        foundExploreLocations,
        handleGo,
        closeSearchExternally,
        refreshSurroundingsManually,
        resetRefreshSurroundingsManually,
        locationUpdateWSIsOpen,
        handleLocationUpdateWSIsOpen,
        handleLocationUpdateWSIsClosed,
        manualSurroundingsRefresh,
        remainingGoes,
        handleGoHome,
      }}
    >
      {children}
    </ActiveSearchContext.Provider>
  );
};
