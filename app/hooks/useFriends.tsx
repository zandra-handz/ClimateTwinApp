import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";

import { useUser } from "../context/UserContext";
import {
  getFriends,
  getAllUsers,
  requestToAddFriend,
  acceptFriendship,
  declineFriendship,
} from "../apicalls";

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
  const { user, isAuthenticated, isInitializing } = useUser();
  const [friendsDropDown, setFriendsDropDown] = useState<DropdownOption[]>([]);

  const [userSearchResults, setUserSearchResults] = useState(null);

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The return type of useQuery, assuming 'friends' is an array of Friend objects
  const {
    data: friends,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  }: UseQueryResult<Friend[], Error> = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
    enabled: !!isAuthenticated && !isInitializing,
    onSuccess: (data) => {
      // Convert the friends data into a dropdown array
      const dropdownData = data.map((friend) => ({
        label: friend.nickname,
        value: friend.id,
        friendshipNumber: friend.friendship,
      }));
      setFriendsDropDown(dropdownData);
    },
  });

  const extractUserIdFromNotification = (
    notification: string
  ): number | null => {
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

  const searchUsersMutation = useMutation({
    mutationFn: () => getAllUsers(),
    onSuccess: (data) => {
      console.log("User search results successful!");
      setUserSearchResults(data);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchUsersMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchUsersMutation.reset();
      }, 2000);
    },
  });

  const handleSearchUsers = () => {
    searchUsersMutation.mutate();
  };

  const handleSendFriendRequest = (recipientId: number, message: string) => {
    
    if (!recipientId) {
      console.error("Treasure ID or recipient ID is missing.");
      return;
    }
 
    const friendRequestData = { 
      message: message || 'None',
      sender: user?.id,
      recipient: recipientId,  // Include recipient's ID
    };
 
    friendRequestMutation.mutate(friendRequestData);
  };

      const friendRequestMutation = useMutation({
        mutationFn: (data) => requestToAddFriend(data),
        onSuccess: (data) => {
          //console.log("Gift sent successfully:", data); 
    
          triggerFriendsRefetch();
    
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
    
          timeoutRef.current = setTimeout(() => {
            friendRequestMutation.reset();
          }, 2000); 
        },
        onError: (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
    
          timeoutRef.current = setTimeout(() => {
            friendRequestMutation.reset();
          }, 2000); 
        },
      });

      const triggerFriendsRefetch = () => { 
        console.log('Refreshing friends list..');
        queryClient.invalidateQueries({ queryKey: ["friends"] });
        queryClient.refetchQueries({ queryKey: ["friends"] });  
      };

        
        const handleAcceptFriendship = (itemViewId) => {
            
          if (!itemViewId) {
            console.error("Item view id is missing.");
            return;
          }
        
       
          acceptFriendshipMutation.mutate(itemViewId);
        };
        
      const acceptFriendshipMutation = useMutation({
        mutationFn: (itemViewId) => acceptFriendship(itemViewId),
        onSuccess: (itemViewId) => { 
      
          triggerFriendsRefetch();
      
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          timeoutRef.current = setTimeout(() => {
            acceptFriendshipMutation.reset();
          }, 2000); 
        },
        onError: (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
      
          timeoutRef.current = setTimeout(() => {
            acceptFriendshipMutation.reset();
          }, 2000); 
        },
      });
    


  return {
    friends,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    friendsDropDown: memoizedDropDown,
    replaceUserIdWithFriendName, //this is for the notification update from the websocket
    handleSearchUsers,
    userSearchResults,
    handleSendFriendRequest,
    handleAcceptFriendship,
    acceptFriendshipMutation,
  };
};

export default useFriends;
