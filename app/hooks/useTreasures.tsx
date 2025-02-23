import React, { useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient, UseQueryResult, useMutation } from '@tanstack/react-query';
import { useUser } from '../context/UserContext';
import { getTreasures, getTreasure, requestToGiftTreasure } from '../apicalls';

interface User {
  id: string; // Assuming the user model has an 'id' as a string (e.g., a UUID or integer)
  username: string;
  email: string;
  // Add other user fields as necessary
}

interface Treasure {
  user: User;
  original_user: string;
  miles_traveled_to_collect: number;
  location_name: string;
  found_at_latitude: number;
  found_at_longitude: number;
  descriptor: string;
  description?: string | null;
  item_name: string;
  item_category: string;

  add_data?: Record<string, unknown> | null;
  pending: boolean;

  // Gift-related fields
  message?: string | null;
  giver?: User | null;
  recipient?: User | null;
  created_on: string;
  owned_since?: string | null;
}

const useTreasures = () => {
  const { user, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const [viewingTreasure, setViewingTreasure] = useState<Message | null>(null);
  

  const { data: treasures, isLoading, isFetching, isSuccess, isError }: UseQueryResult<Treasure[], Error> = useQuery({
    queryKey: ['treasures'],
    queryFn: () => getTreasures(),
    enabled: !!isAuthenticated, // Only run if user is authenticated
    onSuccess: (data) => {
      // Handle successful query response
      console.log("Fetched treasures:", data);
    },
    onError: (error) => {
      console.error("Error fetching treasures:", error);
    },
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

  // New mutation using the new syntax for Tanstack Query v4
  const mutation = useMutation({
    mutationFn: requestToGiftTreasure,
    onSuccess: (data) => {
      console.log("Gift sent successfully:", data); 
    },
    onError: (error) => {
      console.error("Error gifting treasure:", error); 
    },
  });


  const handleGiftTreasure = (treasureId: number, recipientId: number, message: string) => {
    
    if (!treasureId || !recipientId) {
      console.error("Treasure ID or recipient ID is missing.");
      return;
    }
 
    const giftData = {
      treasure: treasureId,
      message: message || 'None',
      sender: user?.id,
      recipient: recipientId,  // Include recipient's ID
    };
 
    mutation.mutate(giftData);
  };

  return {
    treasures,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    handleGetTreasure,
    handleGiftTreasure,
    viewingTreasure,
  };
};

export default useTreasures;
