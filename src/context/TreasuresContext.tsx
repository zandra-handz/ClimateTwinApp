import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import {
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";


import useInlineComputations from "../hooks/useInlineComputations";
import { useUser } from "../../src/context/UserContext";
import { useUserSettings } from "./UserSettingsContext";
import { useAppMessage } from "@/src/context/AppMessageContext";
import {
  Treasure,
  CollectTreasureRequest,
  GiftTreasureRequest,
  GiftTreasureBackToFinderRequest,
} from "@/src/types/useTreasuresTypes";

import {
  getTreasures,
  getTreasure,
  getOwnerChangeRecords,
  searchTreasures,
  getSearchableTreasure,
  collectTreasure,
  acceptTreasureGift,
  declineTreasureGift,
  requestToGiftTreasure,
  requestToGiftTreasureBackToFinder,
} from "../../src/calls/apicalls";

import { usePendingRequests } from "./PendingRequestsContext";

export interface TreasuresContextType {
  treasures: Treasure[] | undefined;
  handleGetTreasure: (id: number) => Promise<void>; 
 
  handleGetOwnerChangeRecords;
  handleSearchTreasures: (searchText: string) => void;
  searchTreasuresMutation: UseMutationResult<any, unknown>; // Replace with your real mutation result type
  treasureSearchResults: any; // Replace with actual search result type
  handleCollectTreasure;
  handleGiftTreasure;
  handleGiftTreasureBackToFinder;
  handleAcceptTreasureGift;
  handleDeclineTreasureGift;
  viewingTreasure;
  viewingSearchableTreasure;
  searchableTreasureMutation;
  collectTreasureMutation;
  giftTreasureMutation;
  giftTreasureBackToFinderMutation;
  acceptTreasureGiftMutation;
  declineTreasureGiftMutation;
  triggerTreasuresRefetch;
  testData;
  nonPendingTreasures;
}

const TreasuresContext = createContext<TreasuresContextType | undefined>(undefined);

export const useTreasures = () => {
  const context = useContext(TreasuresContext);
  if (!context) {
    throw new Error("useTreasures must be used within a TreasuresProvider");
  }
  return context;
};

interface TreasuresProviderProps {
  children: React.ReactNode;
}

export const TreasuresProvider: React.FC<TreasuresProviderProps> = ({
  children,
}) => {
  const { showAppMessage } = useAppMessage();
  const { user, isAuthenticated  } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { triggerRequestsAndInboxRefetch } = usePendingRequests();
  const [testData, setTestData] = useState(null); 
  const [viewingTreasure, setViewingTreasure] = useState<Treasure | null>(null);
  const [viewingSearchableTreasure, setViewingSearchableTreasure] =
    useState<Treasure | null>(null);  
const { getNonPendingTreasures } = useInlineComputations();
  const [treasureSearchResults, setTreasureSearchResults] = useState([]);

 
  const [nonPendingTreasures, setNonPendingTreasures ] = useState(null);
 

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: treasures,
    isPending,
    isSuccess,
    isError,
  }: UseQueryResult<Treasure[], Error> = useQuery({
    queryKey: ['treasures'],
    queryFn: getTreasures,
    enabled: true,
   // enabled: !!(isAuthenticated && !settingsAreLoading),
  });


  useEffect(() => {
    showAppMessage(true, null, 'treasures successfully refetched');
    if (isSuccess && treasures && treasures.length > 0) {
      setNonPendingTreasures(getNonPendingTreasures(treasures));
    }

  }, [isSuccess, treasures]);
 
  const handleGetTreasure = async (id: number) => {
    const cacheKey = ["treasure", user?.id, id];
    const cachedTreasure = queryClient.getQueryData<Treasure>(cacheKey);
  
    if (cachedTreasure) {
      setViewingTreasure(cachedTreasure);
    } else {
      await getTreasureMutation.mutateAsync(id);
    }
  };
  
  const getTreasureMutation = useMutation<Treasure, Error, number>({
    mutationFn: (id: number) => getTreasure(id),
    onSuccess: (data, id) => {
      setViewingTreasure(data);
      queryClient.setQueryData(["treasure", user?.id, id], data);
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        getTreasureMutation.reset();
      }, 2000);
    },
    onError: () => {
      setViewingTreasure(null);
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        getTreasureMutation.reset();
      }, 2000);
    },
  });
  

  const searchTreasuresMutation = useMutation({
    mutationFn: (query: string) => searchTreasures(query),
    onSuccess: (data) => {
      setTreasureSearchResults(data);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchTreasuresMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchTreasuresMutation.reset();
      }, 2000);
    },
  });
  
  const handleSearchTreasures = (query: string) => {
    searchTreasuresMutation.mutate(query);
  };

  const handleGetSearchableTreasure = async (treasureId: number) => {
    const cacheKey = ["searchableTreasure", user?.id, treasureId];
    const cachedTreasure = queryClient.getQueryData<Treasure>(cacheKey);
  
    if (cachedTreasure) {
      setViewingSearchableTreasure(cachedTreasure);
    } else {
      await searchableTreasureMutation.mutateAsync(treasureId);
    }
  };
  
  const searchableTreasureMutation = useMutation<Treasure, Error, number>({
    mutationFn: (treasureId: number) => getSearchableTreasure(treasureId),
    onSuccess: (data, treasureId) => {
      setViewingSearchableTreasure(data);
      queryClient.setQueryData(["searchableTreasure", user?.id, treasureId], data);
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        searchableTreasureMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(() => {
        searchableTreasureMutation.reset();
      }, 2000);
    },
  });
  

 

  const handleCollectTreasure = (item: string, descriptor: string, description: string, thirdData: string) => {
      
    if (!item || !descriptor || !description) {
      console.error("Item, descriptor, or description is missing.");
      return;
    }
 
    const collectData: CollectTreasureRequest = {
      item: item,
      descriptor: descriptor,
      description: description,
      third_data: thirdData,  // Include recipient's ID
     // third_data: thirdData || null,  // Include recipient's ID
    };
 
    collectTreasureMutation.mutate(collectData);
  };


const collectTreasureMutation = useMutation({
  mutationFn: (data: CollectTreasureRequest) => collectTreasure(data),
  onSuccess: async () => { 
    showAppMessage(true, null, `Treasure collected!`);

     triggerTreasuresRefetch();
    await queryClient.refetchQueries({ queryKey: ['pendingRequests', { user: user?.id } ] }); 
    await queryClient.refetchQueries({ queryKey: ['inboxItems', { user: user?.id } ] });  
    //await queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id}]});
  
    // triggerTreasuresRefetch();
    // triggerRequestsAndInboxRefetch();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      collectTreasureMutation.reset();
    }, 2000); 
  },
  onError: (error) => {
    showAppMessage(true, null, `Oops! Treasure not collected.`);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      collectTreasureMutation.reset();
    }, 2000); 
  },
});






const handleGiftTreasure = (treasureId: number, recipientId: number, message: string) => {
  
  if (!treasureId || !recipientId || !user?.id) {
    console.error("Treasure ID, recipient ID, or user ID is missing.");
    return;
  }

  const giftData: GiftTreasureRequest = {
    treasure: treasureId,
    message: message || 'None',
    sender: user.id,
    recipient: recipientId,  
  };

  giftTreasureMutation.mutate(giftData);
};


const giftTreasureMutation = useMutation({
  mutationFn: (data: GiftTreasureRequest) => requestToGiftTreasure(data),
  onSuccess:   () => { 

    queryClient.refetchQueries({ queryKey: ['pendingRequests', { user: user?.id } ] }); 
   queryClient.refetchQueries({ queryKey: ['inboxItems', { user: user?.id } ] });  
   
   
    // triggerRequestsAndInboxRefetch();
     triggerTreasuresRefetch();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      giftTreasureMutation.reset();
    }, 2000); 
  },
  onError: () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      giftTreasureMutation.reset();
    }, 2000); 
  },
});



const handleGiftTreasureBackToFinder = (treasureId: number, message: string | 'No message') => {
  
  if (!treasureId || !user?.id) {
    console.error("Treasure ID or user ID is missing.");
    return;
  }

  const giftData: GiftTreasureBackToFinderRequest = {
    treasure: treasureId,
    message: message || 'None',
   // sender: user.id, 
  };

  giftTreasureBackToFinderMutation.mutate(giftData);
};


const giftTreasureBackToFinderMutation = useMutation({
  mutationFn: (data: GiftTreasureBackToFinderRequest) => requestToGiftTreasureBackToFinder(data),
  onSuccess: async () => { 

    await queryClient.refetchQueries({ queryKey: ['pendingRequests', { user: user?.id } ] }); 
    await queryClient.refetchQueries({ queryKey: ['inboxItems', { user: user?.id } ] });  
    await queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id}]}); 
  
    // triggerTreasuresRefetch();
    // triggerRequestsAndInboxRefetch();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      giftTreasureBackToFinderMutation.reset();
    }, 2000); 
  },
  onError: () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      giftTreasureBackToFinderMutation.reset();
    }, 2000); 
  },
});








// const triggerTreasuresRefetch = () => {  
// queryClient.invalidateQueries({ queryKey: ['treasures' ] });
//  queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id} ] });  
// };

const triggerTreasuresRefetch = () => {
  // const oldData = queryClient.getQueryData(['treasures']) || [];

  // // Show old data
  // const oldDataMessage = oldData.length 
  //   ? `Old Treasures data:\n\n${JSON.stringify(oldData, null, 2)}\n` 
  //   : 'No old treasures data available.';
  
  // showAppMessage(true, null, [oldDataMessage]);

  // Invalidate and refetch
   queryClient.invalidateQueries({ queryKey: ['treasures'] });
   queryClient.refetchQueries({ queryKey: ['treasures'] });

  const newData = queryClient.getQueryData(['treasures']) || [];

  // Show new data
  // const newDataMessage = newData.length 
  //   ? `New Treasures data:\n\n${JSON.stringify(newData, null, 2)}\n` 
  //   : 'No new treasures data available.';
  
  // showAppMessage(true, null, [newDataMessage]);

  // Compare using JSON.stringify (can be replaced with custom ID-based logic)
  // const oldSet = new Set(oldData.map(d => JSON.stringify(d)));
  // const newSet = new Set(newData.map(d => JSON.stringify(d)));

  // const differences = [
  //   ...[...oldSet].filter(x => !newSet.has(x)),  // removed
  //   ...[...newSet].filter(x => !oldSet.has(x))   // added
  // ];

  // const differenceMessage = `✨ Treasures data changed:\n${differences.length ? differences.join('\n\n') : 'No differences detected.'}`;

  // // Show differences in data
  // showAppMessage(true, null, [differenceMessage]);
};



const handleAcceptTreasureGift = (itemViewId : number) => {
    
  if (!itemViewId) {
    console.error("Item view id is missing.");
    return;
  }


  acceptTreasureGiftMutation.mutate(itemViewId);
};

const acceptTreasureGiftMutation = useMutation({
mutationFn: (itemViewId : number) => acceptTreasureGift(itemViewId),
onSuccess:  () => { 

showAppMessage(true, null, "onSuccess for acceptTreasureGiftMutation successfully triggered!");
   triggerTreasuresRefetch();

   queryClient.refetchQueries({ queryKey: ['pendingRequests', { user: user?.id } ] }); 
   queryClient.refetchQueries({ queryKey: ['inboxItems', { user: user?.id } ] });  
//  await queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id}]});



  // triggerTreasuresRefetch();
  // triggerRequestsAndInboxRefetch();

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    acceptTreasureGiftMutation.reset();
  }, 2000); 
},
onError: () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    acceptTreasureGiftMutation.reset();
  }, 2000); 
},
});





const handleDeclineTreasureGift = (itemViewId : number) => {
    
if (!itemViewId) {
  console.error("Item view id is missing.");
  return;
}

declineTreasureGiftMutation.mutate(itemViewId);
};

const declineTreasureGiftMutation = useMutation({
mutationFn: (itemViewId : number) => declineTreasureGift(itemViewId),
onSuccess: () => { 
  showAppMessage(true, null, "onSuccess for declineTreasureGiftMutation successfully triggered!");
   triggerTreasuresRefetch();

  queryClient.refetchQueries({ queryKey: ['pendingRequests', { user: user?.id } ] }); 
  queryClient.refetchQueries({ queryKey: ['inboxItems', { user: user?.id } ] });  
  // await queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id}]});

// triggerTreasuresRefetch();
//triggerRequestsAndInboxRefetch();

if (timeoutRef.current) {
  clearTimeout(timeoutRef.current);
}

timeoutRef.current = setTimeout(() => {
  declineTreasureGiftMutation.reset();
}, 2000); 
},
onError: () => {
if (timeoutRef.current) {
  clearTimeout(timeoutRef.current);
}

timeoutRef.current = setTimeout(() => {
  declineTreasureGiftMutation.reset();
}, 2000); 
},
});




const handleGetOwnerChangeRecords = (treasureId: string) => {
  
if (!treasureId) {
  console.error("Treasure ID, recipient ID, or user ID is missing.");
  return;
}



ownerChangeRecordsMutation.mutate(treasureId);
};


const ownerChangeRecordsMutation = useMutation({
mutationFn: (data: string) => getOwnerChangeRecords(data),
onSuccess: (data) => {  
  setTestData(data);

  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    ownerChangeRecordsMutation.reset();
  }, 2000); 
},
onError: () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    ownerChangeRecordsMutation.reset();
  }, 2000); 
},
});




  return (
    <TreasuresContext.Provider
      value={{
        treasures,
        isPending,
        isSuccess,
        isError, 
        handleGetTreasure,
        handleGetOwnerChangeRecords,
        handleSearchTreasures,
        handleCollectTreasure,
        handleGiftTreasure,
        handleGiftTreasureBackToFinder,
        handleAcceptTreasureGift,
        handleDeclineTreasureGift,
        handleGetSearchableTreasure,
        viewingTreasure,
        setViewingTreasure,
        getTreasureMutation,
        viewingSearchableTreasure,
        setViewingSearchableTreasure,
        searchTreasuresMutation,
        searchableTreasureMutation,
        treasureSearchResults,
        collectTreasureMutation,
        giftTreasureMutation,
        giftTreasureBackToFinderMutation,
        acceptTreasureGiftMutation,
        declineTreasureGiftMutation,
        triggerTreasuresRefetch,
        testData,
        nonPendingTreasures,
      }}
    >
      {children}
    </TreasuresContext.Provider>
  );
};
