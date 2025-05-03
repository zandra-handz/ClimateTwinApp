import React, {
  createContext,
  useContext,
  useRef, 
} from "react";
import { 
  useQuery,
  useQueryClient,
  UseQueryResult, 
} from "@tanstack/react-query";
 ;
import { useUser } from "../../src/context/UserContext"; 
import { useUserSettings } from "./UserSettingsContext";
import { 
  getUserPendingRequests,
} from "../../src/calls/apicalls";

import {  
  PendingRequestsResponse,
} from "@/src/types/useFriendsTypes";
 

export interface PendingRequestsContextType {  
  triggerRequestsRefetch: ( ) => void;
 
  pendingRequests?: PendingRequestsResponse; 
}

const PendingRequestsContext = createContext<PendingRequestsContextType | undefined>(undefined);

export const usePendingRequests = () => {
  const context = useContext(PendingRequestsContext);
  if (!context) {
    throw new Error("usePendingRequests must be used within a PendingRequestsProvider");
  }
  return context;
};

interface PendingRequestsProviderProps {
  children: React.ReactNode;
}

export const PendingRequestsProvider: React.FC<PendingRequestsProviderProps> = ({
  children,
}) => { 
  const { user, isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
 
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 

  // shouldn't depend on friends data because you need to send /get a request to friend
  const {
    data: pendingRequests,
    isPending: isPendingRequests,
    isSuccess: isPendingRequestsSuccess,
    isError: isPendingRequestsError,
  }: UseQueryResult<PendingRequestsResponse, Error> = useQuery({
    queryKey: ["pendingRequests", user?.id],
    queryFn: getUserPendingRequests,
    enabled: !!(isAuthenticated && !settingsAreLoading && user && user.id),
  });
 
 

  const triggerRequestsRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["pendingRequests", user?.id] });
    queryClient.refetchQueries({ queryKey: ["pendingRequests", user?.id] });
  };

 

  return (
    <PendingRequestsContext.Provider
      value={{ 
        pendingRequests,
        triggerRequestsRefetch
      }}
    >
      {children}
    </PendingRequestsContext.Provider>
  );
};
