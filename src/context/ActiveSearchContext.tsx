import React, {
  createContext,
  useContext,
  useRef, 
  ReactNode, 
  useEffect,
} from "react";
import { useUser } from "./UserContext";
import { useUserSettings } from "./UserSettingsContext";
import { useSurroundingsWS } from "./SurroundingsWSContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { go, getRemainingGoes, expireSurroundings, getHistory } from "../calls/apicalls";

 
 
interface ActiveSearchContextType {
  
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
  const { user, isAuthenticated  } = useUser();
  const { settingsAreLoading } = useUserSettings();

  const { lastState, lastLocationName, lastLocationId } = useSurroundingsWS();

  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);  

 

  // useExploreRoute(lastState, isAuthenticated);
  const {
    data: history,
    refetch: refetchHistory,
    isSuccess: historyIsSuccess,
 
  } = useQuery({
    queryKey: ["history", user?.id],
    queryFn: () => getHistory(),
    enabled: !!isAuthenticated && !settingsAreLoading && (lastState === 'home' || lastState === 'exploring'), //initializing may not be necessary
  
  });




  useEffect(() => {
    if (  (lastState === 'home' || lastState === 'exploring')) {
     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~refetching history and goes');
     triggerHistoryRefetch();
      refetchGoesLeft();
    }
  }, [ lastState]);
  const triggerHistoryRefetch = () => {  
    queryClient.invalidateQueries({ queryKey: ["history", user?.id] });
    // queryClient.refetchQueries({ queryKey: ["history", user?.id] });  
  };



  const {
    data: remainingGoes,
    isLoading,
    isFetching,
    isSuccess: remainingGoesIsSuccess,
    isError,
    refetch: refetchGoesLeft,
  } = useQuery({
    queryKey: ["remainingGoes", user?.id],
    queryFn: () => getRemainingGoes(),
    enabled: !settingsAreLoading && !!(isAuthenticated && lastState && (lastState != 'searching for twin' && lastState != 'searching for ruins')),
 
  });


  // useEffect(() => {
  //   if (remainingGoes) {
  //     console.log('remaininggoooess')
  //     console.log(remainingGoes);
  //   }

  // }, [remainingGoes]);

  const refetchRemainingGoes = () => {
    queryClient.invalidateQueries({ queryKey: ["remainingGoes", user?.id] });
   // queryClient.refetchQueries({ queryKey: ["remainingGoes", user?.id] });
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
      // setIsSearchingForTwin(true); //Extra, might set it slightly earlier than we get the info from the socket
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
      console.log("go home mutation activated");
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
     // refetchRemainingGoes();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        sendGoHomeMutation.reset();
      }, 2000);
    },
  });
 

 

  return (
    <ActiveSearchContext.Provider
      value={{ 
        handleGo, 
        remainingGoes,
        handleGoHome,
        refetchRemainingGoes,
        history,
        triggerHistoryRefetch,
      }}
    >
      {children}
    </ActiveSearchContext.Provider>
  );
};
