import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import { useUser } from '../context/UserContext';
import { getFriends } from '../apicalls';

// Define the types for the response from getFriends API
interface Friend {
  id: number;
  nickname: string;
  created_on: string;
  user: number;
  friend: number;
  friendship: number;
  // Add other properties based on your actual friend data structure
}

// Define the type for the dropdown data
interface DropdownOption {
  label: string;
  value: number;
  friendshipNumber: number;
}

const useFriends = () => {
  const { user, isAuthenticated } = useUser();
  const [friendsDropDown, setFriendsDropDown] = useState<DropdownOption[]>([]);

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The return type of useQuery, assuming 'friends' is an array of Friend objects
  const { data: friends, isLoading, isFetching, isSuccess, isError }: UseQueryResult<Friend[], Error> = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
    enabled: !!isAuthenticated,
    onSuccess: (data) => {
      // Convert the friends data into a dropdown array
      const dropdownData = data.map((friend) => ({
        label: friend.nickname,
        value: friend.id,
        friendshipNumber: friend.friendship,
      }));
      setFriendsDropDown(dropdownData);
    }
  });


  const extractUserIdFromNotification = (notification: string): number | null => {
    const match = notification.match(/User ID (\d+)/);
    return match ? parseInt(match[1], 10) : null;
};

const replaceUserIdWithFriendName = (notification: string): string => {
  const userId = extractUserIdFromNotification(notification);
  if (userId === null) return notification; // Return the original notification if no user ID is found

  const friendName = friends?.find((f) => f.id === userId)?.nickname;
  if (!friendName) return notification; // Return the original string if no friend is found

  return notification.replace(`User ID ${userId}`, friendName);
};
  // Memoize the dropdown data to avoid unnecessary re-renders
  const memoizedDropDown = useMemo(() => friendsDropDown, [friendsDropDown]);

  return {
    friends,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    friendsDropDown: memoizedDropDown,
    replaceUserIdWithFriendName , //this is for the notification update from the websocket
  };
};

export default useFriends;


    // const createHelloMutation = useMutation({
    //     mutationFn: (data) => saveHello(data),
    //     onError: (error) => {
    //       if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //       }
    
    //       timeoutRef.current = setTimeout(() => {
    //         createHelloMutation.reset();
    //       }, 2000);
    //     },
    //     onSuccess: (data) => {
    //       queryClient.setQueryData(["pastHelloes"], (old) => {
    //         const updatedHelloes = old ? [data, ...old] : [data];
    //         return updatedHelloes;
    //       });
    
    //       const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
    //       console.log("Actual HelloesList after mutation:", actualHelloesList);
    
    //       if (timeoutRef.current) {
    //         clearTimeout(timeoutRef.current);
    //       }
    
    //       timeoutRef.current = setTimeout(() => {
    //         createHelloMutation.reset();
    //       }, 2000);
    //     },
    //   });


    //   const handleCreateHello = async (helloData) => {
    //     const hello = {
    //       user: authUserState.user.id,
    //       friend: helloData.friend,
    //       type: helloData.type,
    //       typed_location: helloData.manualLocation,
    //       additional_notes: helloData.notes,
    //       location: helloData.locationId,
    //       date: helloData.date,
    //       thought_capsules_shared: helloData.momentsShared,
    //       delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
    //     };
    
    //     console.log("Payload before sending:", hello);
    
    //     try {
    //       await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    //     } catch (error) {
    //       console.error("Error saving hello:", error);
    //     }
    //   };