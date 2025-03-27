import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";

import { useUser } from "../context/UserContext";
import {
  getUserProfile,
} from "../apicalls";
 
interface UserProfile {
  id: number;
  user: number;  
  first_name: string;
  last_name: string;
  bio: string | null;
  gender: string;
  date_of_birth: string | null;  
  most_recent_visit: {
    location_name: string;
    latitude: number;
    longitude: number;
    visited_on: string;  
  } | null;
  total_visits: number;  
}

 

const useProfile = () => {
  const { user, isAuthenticated, isInitializing } = useUser();  

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 
  const {
    data: profile,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  }: UseQueryResult<UserProfile, Error> = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    enabled: !!isAuthenticated && !isInitializing,
    onSuccess: (data) => {
      // Convert the friends data into a dropdown array
     
    },
  });

 

    const handleGetFriend = async (id: number) => {
      try {
        const friend = await queryClient.fetchQuery<Friend>({
          queryKey: ["treasure", user?.id, id],
          queryFn: () => getFriend(id),
        });
  
        if (friend) {
          setViewingFriend(friend); 
        }
      } catch (error) {
        console.error("Error fetching friend: ", error);
      }
    };


  
    


  return {
    profile,
  };
};

export default useProfile;
