import React, { createContext, useContext, useRef, useState } from "react";
import {
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";

 
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
  getTreasuresAndRequests,
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
  triggerTreasuresAndRequestsRefetch;
  testData; 
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
  const [viewingTreasureId, setViewingTreasureId] = useState(null);
  const [viewingSearchableTreasure, setViewingSearchableTreasure] =
    useState<Treasure | null>(null);   
  const [treasureSearchResults, setTreasureSearchResults] = useState([]);

  
 

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: treasures,
    isPending: treasuresIsPending,
    isSuccess,
    isError,
  }: UseQueryResult<Treasure[], Error> = useQuery({
    queryKey: ['treasures', { user: user?.id }],
    queryFn: getTreasures,
 
     enabled: !!(isAuthenticated && !settingsAreLoading && user && user.id),
  });


  const {
    data: treasuresAndRequests,
    isPending: treasuresAndRequestsIsPending,
    isSuccess: treasuresAndRequestsIsSuccess,
    isError: treasuresAndRequestsIsError,
  } = useQuery({
    queryKey: ['treasuresAndRequests', { user: user?.id }],
    queryFn: getTreasuresAndRequests,
 
     enabled: !!(isAuthenticated && !settingsAreLoading && user && user.id),
  });

// FOR DEBUGGING ONLY
  // useEffect(() => {
  //   if (treasuresWithRequestsIsSuccess) {
  //     console.log(`Treasures with requests data: `, treasuresWithRequests);
  //   }

  // }, [treasuresWithRequestsIsSuccess]);
 
 
  const handleGetTreasure = async (id: number) => {
    const cacheKey = ["treasure", user?.id, id];
    const cachedTreasure = queryClient.getQueryData<Treasure>(cacheKey);
  
    if (cachedTreasure) {
      setViewingTreasure(cachedTreasure);
      setViewingTreasureId(cachedTreasure?.id);
    } else {
      await getTreasureMutation.mutateAsync(id);
    }
  };
  
  const getTreasureMutation = useMutation<Treasure, Error, number>({
    mutationFn: (id: number) => getTreasure(id),
    onSuccess: (data, id) => {

      setViewingTreasure(data);
      setViewingTreasureId(data?.id);
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
  onSuccess: () => { 

    triggerRequestsAndInboxRefetch();
    triggerTreasuresAndRequestsRefetch(); 

    showAppMessage(true, null, `Treasure collected!`);
 
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

  setViewingTreasureId(treasureId);

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

  
    triggerTreasuresAndRequestsRefetch();
    triggerRequestsAndInboxRefetch();
 
    
   // showAppMessage(true, null, 'Treasure sent!');
  

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
  onSuccess:  () => { 
 
  
    triggerTreasuresAndRequestsRefetch(); 

   triggerRequestsAndInboxRefetch();
   // showAppMessage(true, null, 'Treasure sent!');
    

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


const triggerTreasuresAndRequestsRefetch = () => { 
  queryClient.refetchQueries({ queryKey: ['treasuresAndRequests', { user: user?.id} ] });  
};

 

const triggerTreasuresRefetch = () => { 
  queryClient.refetchQueries({ queryKey: ['treasures', { user: user?.id} ] });  
};



const handleAcceptTreasureGift = (itemViewId : number, treasureId: number | null) => {
    
  if (!itemViewId) {
    console.error("Item view id is missing.");
    return;
  }

  if (treasureId) {
    setViewingTreasureId(treasureId);

  } 

  acceptTreasureGiftMutation.mutate(itemViewId);
};

const acceptTreasureGiftMutation = useMutation({
mutationFn: (itemViewId : number) => acceptTreasureGift(itemViewId),
onSuccess:  () => { 

 triggerRequestsAndInboxRefetch();
  triggerTreasuresAndRequestsRefetch(); 
 

 // showAppMessage(true, null, 'Treasure accepted!');


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





const handleDeclineTreasureGift = (itemViewId : number, treasureId : number | null) => {
    
  if (!itemViewId) {
    console.error("Item view id is missing.");
    return;
  }

  if (treasureId) {
    setViewingTreasureId(treasureId);

  } 
declineTreasureGiftMutation.mutate(itemViewId);
};

const declineTreasureGiftMutation = useMutation({
mutationFn: (itemViewId : number) => declineTreasureGift(itemViewId),
onSuccess: () => { 

  triggerRequestsAndInboxRefetch();
  triggerTreasuresAndRequestsRefetch(); 
 

  showAppMessage(true, null, 'Treasure declined');
  

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
        triggerTreasuresAndRequestsRefetch,
        testData, 

        treasuresAndRequests,


        //for matching list item to current treasure being acted on
        viewingTreasureId,
        treasuresIsPending,
        treasuresAndRequestsIsPending,
        treasuresAndRequestsIsSuccess,
      }}
    >
      {children}
    </TreasuresContext.Provider>
  );
};
