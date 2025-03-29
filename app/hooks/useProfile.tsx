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
  updateUserProfile,
  uploadUserAvatar,
} from "../apicalls";
 
interface UserProfile {
  id: number;
  user: number;  
  first_name: string;
  last_name: string;
  bio: string | null;
  avatar: string;
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
  const [avatar, setAvatar] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 
  const {
    data: profile,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  }: UseQueryResult<UserProfile, Error> = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: getUserProfile,
    enabled: !!isAuthenticated && !isInitializing,
    onSuccess: (data) => { 
     
    },
  });

  useEffect(() => {
    if (profile) {
      setAvatar(profile?.avatar || null);
    }

  }, [profile]);

 

    const updateProfileMutation = useMutation({
      mutationFn: (newData) => updateUserProfile(user?.id, newData),
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', user?.id]);
      },
      onError: (error) => {
        console.log('Error updating profile: ', error);
      }
    });


    const handleUpdateProfile = (newData) => {
      updateProfileMutation.mutate(newData);
    }

    const uploadAvatarMutation = useMutation({
      mutationFn: (newData) => uploadUserAvatar(user?.id, newData),
      onSuccess: () => {
        triggerProfileRefetch();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
          uploadAvatarMutation.reset();
        }, 2000); 
      },
      onError: (error) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = setTimeout(() => {
          uploadAvatarMutation.reset();
        }, 2000); 
      }
    });

    const triggerProfileRefetch = () => {  
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id]});
      queryClient.refetchQueries({ queryKey: ['profile', user?.id] });  
    };
  


    const handleUploadAvatar = (newData) => {
      uploadAvatarMutation.mutate(newData);
    }


  
    


  return {
    profile,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    avatar,
    handleUpdateProfile,
    updateProfileMutation,
    handleUploadAvatar,
    uploadAvatarMutation,
  };
};

export default useProfile;
