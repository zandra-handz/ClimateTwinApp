import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";


import { useRouter } from "expo-router";
import { useUser } from "../../src/context/UserContext";
import { useAppMessage } from "@/src/context/AppMessageContext";
import {
  getFriends,
  getFriend,
  getAllUsers,
  searchUsers,
  requestToAddFriend,
  acceptFriendship,
  declineFriendship,
  deleteFriendship,
} from "../../src/calls/apicalls";

//not currently using dropdown
import {
  AddFriendRequest,
  Friend,
  DropdownOption,
} from "@/src/types/useFriendsTypes";

//WARNING: The endpoint here returns the user's profiles for their friends
//rather than just the friend object
//So the top level id is for the profile
// //To use the friend pk must specify .friend
const useFriends = () => {
  const router = useRouter();
  const { showAppMessage } = useAppMessage();
  const { user, isAuthenticated, isInitializing } = useUser();
  const [friendsDropDown, setFriendsDropDown] = useState<DropdownOption[]>([]);
  const [viewingFriend, setViewingFriend] = useState<Friend | null>(null); //is this correct or do i need the friendship?

  const [userSearchResults, setUserSearchResults] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The return type of useQuery, assuming 'friends' is an array of Friend objects
  const {
    data: friends,
    //isLoading,
    //isFetching,
    isPending,
    isSuccess,
    isError,
  }: UseQueryResult<Friend[], Error> = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: getFriends,
    enabled: !!(isAuthenticated && !isInitializing && user && user.id),

  });

  // useEffect(() => {
  //   if (isSuccess && friends && friends.length > 0) {
  //     const dropdownData = friends.map((friend) => ({
  //       label: friend.username,
  //       value: friend.id,
  //       friendshipNumber: friend.friendship,
  //     }));
  //     console.log(`friends call successful, setting dropdownData...`);
  //     setFriendsDropDown(dropdownData);
  //   }
  // }, [isSuccess]);

  // FOR DEBUGGING
  useEffect(() => {
    if (isError) {
      console.log(`WARNING: friends call failed`);
    }
  }, [isError]);

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

  const handleGetFriend = async (id: number) => {
    try {
      const friend = await queryClient.fetchQuery<Friend>({
        queryKey: ["friend", user?.id, id],
        queryFn: () => getFriend(id),
      });

      if (friend) {
        setViewingFriend(friend);
      }
    } catch (error) {
      console.error("Error fetching friend: ", error);
    }
  };

  const searchUsersMutation = useMutation({
    mutationFn: (query: string) => searchUsers(query),
    onSuccess: (data) => {
      console.log("User search results successful!", data);
      setUserSearchResults(data);
      console.log(`user search results, `, userSearchResults);

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

  const handleSearchUsers = (query: string) => {
    console.log("handleSearchUsers");
    searchUsersMutation.mutate(query);
  };

  const getAllUsersMutation = useMutation({
    mutationFn: () => getAllUsers(),
    onSuccess: (data) => {
      setAllUsers(data);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        getAllUsersMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        getAllUsersMutation.reset();
      }, 2000);
    },
  });

  const handleGetAllUsers = () => {
    getAllUsersMutation.mutate();
  };

  const handleSendFriendRequest = (recipientId: number, message: string) => {
    if (!recipientId || !user?.id) {
      console.error("User ID or recipient ID is missing.");
      return;
    }

    const friendRequestData: AddFriendRequest = {
      message: message || "None",
      sender: user.id,
      recipient: recipientId,
    };

    friendRequestMutation.mutate(friendRequestData);
  };

  const friendRequestMutation = useMutation({
    mutationFn: (data: AddFriendRequest) => requestToAddFriend(data),
    onSuccess: () => {
      //Do we need?
      triggerFriendsRefetch();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        friendRequestMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        friendRequestMutation.reset();
      }, 2000);
    },
  });

  const triggerFriendsRefetch = () => {
    console.log('triggerFriendsRefetch triggered');
    queryClient.invalidateQueries({ queryKey: ["friends", user?.id] });
    queryClient.refetchQueries({ queryKey: ["friends", user?.id] });
  };

  const handleAcceptFriendship = (itemViewId: number) => {
    if (!itemViewId) {
      console.error("Item view id is missing.");
      return;
    }
    acceptFriendshipMutation.mutate(itemViewId);
  };

  const acceptFriendshipMutation = useMutation({
    mutationFn: (itemViewId: number) => acceptFriendship(itemViewId),
    onSuccess: () => {
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

  const handleDeclineFriendship = (itemViewId: number) => {
    if (!itemViewId) {
      console.error("Item view id is missing.");
      return;
    }
    declineFriendshipMutation.mutate(itemViewId);
  };

  const declineFriendshipMutation = useMutation({
    mutationFn: (itemViewId: number) => declineFriendship(itemViewId),
    onSuccess: () => {
      // triggerFriendsRefetch();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        declineFriendshipMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.log(`declineFriendshipMutation error: ${error}`);

      timeoutRef.current = setTimeout(() => {
        declineFriendshipMutation.reset();
      }, 2000);
    },
  });

  const deleteFriendshipMutation = useMutation({
    mutationFn: (itemViewId: number) => deleteFriendship(itemViewId),
    onSuccess: () => { 
      triggerFriendsRefetch();
      // moved to friend ui card
     // router.replace('/(friends)');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteFriendshipMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.log(`deleteFriendshipMutation error: ${error}`);

      timeoutRef.current = setTimeout(() => {
        deleteFriendshipMutation.reset();
      }, 2000);
    },
  });

  const handleDeleteFriendship = (itemViewId: number) => {
    if (!itemViewId) {
      console.error("Item view id is missing.");
      return;
    }
    deleteFriendshipMutation.mutate(itemViewId);
  };

  return {
    friends,
    handleGetFriend,
    friendsDropDown: memoizedDropDown,
    replaceUserIdWithFriendName, //this is for the notification update from the websocket
    handleGetAllUsers,
    getAllUsersMutation,
    allUsers,
    handleSearchUsers,
    userSearchResults,
    handleSendFriendRequest,
    friendRequestMutation,
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
    handleDeleteFriendship,
    deleteFriendshipMutation,
    viewingFriend,
  };
};

export default useFriends;
