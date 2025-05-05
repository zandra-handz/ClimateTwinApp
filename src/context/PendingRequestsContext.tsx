import React, {
  createContext,
  useContext, 
  useState, 
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
  getUserPendingRequests,getInboxItems, getInboxItem,
} from "../../src/calls/apicalls";

import {  
  PendingRequestsResponse,
} from "@/src/types/useFriendsTypes";
 
 import { ContentObject, Message, InboxItem } from "../types/useInboxTypes";

export interface PendingRequestsContextType {  
  triggerRequestsAndInboxRefetch: ( ) => void;
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

    const [viewingInboxItem, setViewingInboxItem] = useState<InboxItem | null>(
      null
    );
    const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
  
 

      const {
        data: inboxItems,
        isPending,
        isSuccess,
        isError,
      } = useQuery<InboxItem[]>({
        queryKey: ['inboxItems', { user: user?.id }],
        queryFn: getInboxItems,
        enabled: !!isAuthenticated && !settingsAreLoading,
     
      });

 
     const handleGetInboxItem = async (id: number) => {
       try {
         const inboxItem = await queryClient.fetchQuery<InboxItem>({
           queryKey: ['inboxItem', { user: user?.id, id: id }],
           queryFn: () => getInboxItem(id),
         });
   
         if (inboxItem) {
           setViewingInboxItem(inboxItem);
           setViewingMessage(inboxItem.message);  
           console.log(`SPECIAL TYPE:`, inboxItem.message.content_object.special_type)
         }
       } catch (error) {
         console.error("Error fetching inbox item:", error);
       }
     };
    
    

  // shouldn't depend on friends data because you need to send /get a request to friend
  const {
    data: pendingRequests,
    isPending: isPendingRequests,
    isSuccess: isPendingRequestsSuccess,
    isError: isPendingRequestsError,
  }: UseQueryResult<PendingRequestsResponse, Error> = useQuery({
    queryKey: ['pendingRequests', { user: user?.id }],
    queryFn: getUserPendingRequests,
    enabled: !!(isAuthenticated && !settingsAreLoading && user && user.id),
  });
  
  
  const triggerRequestsAndInboxRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['pendingRequests', { user: user?.id }] }); 
    queryClient.invalidateQueries({ queryKey: ['inboxItems', { user: user?.id }] });  
  };
 
  return (
    <PendingRequestsContext.Provider
      value={{ 
        inboxItems, 
        viewingInboxItem,
        handleGetInboxItem,
        viewingMessage, 
        triggerRequestsAndInboxRefetch,  
        pendingRequests, 
      }}
    >
      {children}
    </PendingRequestsContext.Provider>
  );
};
