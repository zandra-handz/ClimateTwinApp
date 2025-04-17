import React, { useRef, useState } from 'react';
import { useQuery, useQueryClient, UseQueryResult, useMutation } from '@tanstack/react-query';
import { useUser } from '../../src/context/UserContext';
import { getTreasures, getTreasure, getOwnerChangeRecords, collectTreasure, acceptTreasureGift, declineTreasureGift, requestToGiftTreasure, requestToGiftTreasureBackToFinder } from '../../src/calls/apicalls';
  
import { Treasure, CollectTreasureRequest, GiftTreasureRequest, GiftTreasureBackToFinderRequest } from '@/src/types/useTreasuresTypes'; 
const useTreasures = () => {
  const { user, isAuthenticated, isInitializing } = useUser();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const [viewingTreasure, setViewingTreasure] = useState<Treasure | null>(null);
   const [testData, setTestData] = useState(null);
  

  const { data: treasures,  isPending, isSuccess, isError }: UseQueryResult<Treasure[], Error> = useQuery({
    queryKey: ["treasures", user?.id],
    queryFn: () => getTreasures(),
    enabled: !!(isAuthenticated && !isInitializing && user && user.id),

  });

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
      triggerTreasuresRefetch();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        collectTreasureMutation.reset();
      }, 2000); 
    },
    onError: (error) => {
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





  return {
    treasures,
    isPending,
    isSuccess,
    isError,
    handleGetTreasure,
    handleGetOwnerChangeRecords,
    handleCollectTreasure,
    handleGiftTreasure,
    handleGiftTreasureBackToFinder,
    handleAcceptTreasureGift,
    handleDeclineTreasureGift,
    viewingTreasure,
    collectTreasureMutation,
    giftTreasureMutation,
    giftTreasureBackToFinderMutation,
    acceptTreasureGiftMutation,
    declineTreasureGiftMutation,
    triggerTreasuresRefetch,
    testData,
  };
};

export default useTreasures;
