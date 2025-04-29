import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import {
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";



import { useUser } from "../../src/context/UserContext";
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
  nonPendingTreasures;
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
  collectTreasureMutation;
  giftTreasureMutation;
  giftTreasureBackToFinderMutation;
  acceptTreasureGiftMutation;
  declineTreasureGiftMutation;
  triggerTreasuresRefetch;
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
  const { user, isAuthenticated, isInitializing } = useUser();
  const { triggerRequestsRefetch } = usePendingRequests();
  const [testData, setTestData] = useState(null);
  const [ nonPendingTreasures, setNonPendingTreasures ] = useState([]);
  const [viewingTreasure, setViewingTreasure] = useState<Treasure | null>(null);
  const [viewingSearchableTreasure, setViewingSearchablerofile] =
    useState<Treasure | null>(null);  

  const [treasureSearchResults, setTreasureSearchResults] = useState(null);
 

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: treasures,
    isPending,
    isSuccess,
    isError,
  }: UseQueryResult<Treasure[], Error> = useQuery({
    queryKey: ["treasures", user?.id],
    queryFn: getTreasures,
    enabled: !!(isAuthenticated && !isInitializing && user && user.id),
  });

  //move out of context and out of a useEffect
 
  useEffect(() => {
    if (isSuccess) {
      const filtered = treasures.filter((treasure) => (treasure.pending === false));

      setNonPendingTreasures(filtered);
      
    }

  }, [isSuccess]);

  const handleGetTreasure = async (id: number) => {
    try {
      const treasure = await queryClient.fetchQuery<Treasure>({
        queryKey: ["treasure", user?.id, id],
        queryFn: () => getTreasure(id),
      });

      if (treasure) {
        setViewingTreasure(treasure); 
      }
    } catch (error) {
      console.error("Error fetching treasure: ", error);
    }
  };

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

//   const getPublicProfileMutation = useMutation<PublicProfile, Error, number>({
//     mutationFn: (userId: number) => getPublicProfile(userId),
//     onSuccess: (data) => {
//       setViewingPublicProfile(data);

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//       timeoutRef.current = setTimeout(() => {
//         getPublicProfileMutation.reset();
//       }, 2000);
//     },
//     onError: () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       timeoutRef.current = setTimeout(() => {
//         getPublicProfileMutation.reset();
//       }, 2000);
//     },
//   });

//   const handleGetPublicProfile = (userId: number) => {
//     getPublicProfileMutation.mutate(userId);
//   };

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
    showAppMessage(true, null, `Treasure collected!`);
    triggerTreasuresRefetch();
    triggerRequestsRefetch();

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
  onSuccess: () => { 
    triggerTreasuresRefetch();
    triggerRequestsRefetch();

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
  onSuccess: () => { 
    triggerTreasuresRefetch();
    triggerRequestsRefetch();

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








const triggerTreasuresRefetch = () => {  
  queryClient.invalidateQueries({ queryKey: ["treasures", user?.id] });
  queryClient.refetchQueries({ queryKey: ["treasures", user?.id] });  
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
onSuccess: () => { 

  triggerTreasuresRefetch();
  triggerRequestsRefetch();

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

// triggerTreasuresRefetch();
triggerRequestsRefetch();

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
        nonPendingTreasures, // USE THIS FOR TREASURES LIST
        handleGetTreasure,
        handleGetOwnerChangeRecords,
        handleSearchTreasures,
        handleCollectTreasure,
        handleGiftTreasure,
        handleGiftTreasureBackToFinder,
        handleAcceptTreasureGift,
        handleDeclineTreasureGift,
        viewingTreasure,
        searchTreasuresMutation,
        collectTreasureMutation,
        giftTreasureMutation,
        giftTreasureBackToFinderMutation,
        acceptTreasureGiftMutation,
        declineTreasureGiftMutation,
        triggerTreasuresRefetch,
        testData,
      }}
    >
      {children}
    </TreasuresContext.Provider>
  );
};
