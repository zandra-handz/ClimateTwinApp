import React, {
  createContext,
  useContext,
  useRef,
  useState, 
} from "react";
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
  getFriends,
  getFriend,
  searchUsers,
  requestToAddFriend,
  acceptFriendship,
  declineFriendship,
  deleteFriendship,
  getPublicProfile, 
} from "../../src/calls/apicalls";
import { usePendingRequests } from "./PendingRequestsContext";
import {
  AddFriendRequest,
  Friend,
  PublicProfile, 
} from "@/src/types/useFriendsTypes";

//WARNING: The endpoint here returns the user's profiles for their friends
//rather than just the friend object
//So the top level id is for the profile
// //To use the friend pk must specify .friend

export interface FriendsContextType {
  friends: Friend[] | undefined;
  handleGetFriend: (id: number) => Promise<void>;
  replaceUserIdWithFriendName: (text: string) => string;
  // handleGetAllUsers: () => Promise<void>;
  // getAllUsersMutation: UseMutationResult<any, unknown>;
  // allUsers: any;
  handleSearchUsers: (searchText: string) => void;
  searchUsersMutation: UseMutationResult<any, unknown>; // Replace with your real mutation result type
  userSearchResults: any; // Replace with actual search result type
  handleSendFriendRequest: (userId: string) => void;
  friendRequestMutation: UseMutationResult<any, unknown>; // Replace with appropriate mutation type
  handleAcceptFriendship: (friendshipId: string) => void;
  acceptFriendshipMutation: UseMutationResult<any, unknown>;
  handleDeclineFriendship: (friendshipId: string) => void;
  declineFriendshipMutation: UseMutationResult<any, unknown>;
  handleDeleteFriendship: (friendshipId: string) => void;
  deleteFriendshipMutation: UseMutationResult<any, unknown>;
  viewingFriend: Friend | null;
  handleGetPublicProfile: (userId: string) => void;
  getPublicProfileMutation: UseMutationResult<any, unknown>;
  viewingPublicProfile: PublicProfile | null;
 
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};

interface FriendsProviderProps {
  children: React.ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({
  children,
}) => { 
  const { showAppMessage } = useAppMessage();
  const { user, isAuthenticated,  } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { triggerRequestsRefetch } = usePendingRequests();
  const [viewingFriend, setViewingFriend] = useState<Friend | null>(null);  
  const [viewingPublicProfile, setViewingPublicProfile] =
    useState<PublicProfile | null>(null); //is this correct or do i need the friendship?

  const [userSearchResults, setUserSearchResults] = useState(null);

  // was only making a getAllUsers call for dev stuff
  //   const [allUsers, setAllUsers] = useState(null);

  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: friends,
    isPending,
    isSuccess,
    isError,
  }: UseQueryResult<Friend[], Error> = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: getFriends,
    enabled: !!(isAuthenticated && !settingsAreLoading && user && user.id),
  });
  
  

  // FOR DEBUGGING
  //   useEffect(() => {
  //     if (isError) {
  //       console.log(`WARNING: friends call failed`);
  //     }
  //   }, [isError]);

  const handleGetFriend = async (id: number) => {
    const cacheKey = ["friend", user?.id, id];
    const cachedFriend = queryClient.getQueryData<Friend>(cacheKey);
  
    if (cachedFriend) {
      setViewingFriend(cachedFriend);
    } else {
      await getFriendMutation.mutateAsync(id);
    }
  };
  
  const getFriendMutation = useMutation({
    mutationFn: (friendId: number) => getFriend(friendId),
    onSuccess: (data, friendId) => {
      setViewingFriend(data);
      queryClient.setQueryData(["friend", user?.id, friendId], data); // correctly uses friendId
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        getFriendMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      setViewingFriend(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        getFriendMutation.reset();
      }, 2000);
    },
  });
  

  const searchUsersMutation = useMutation({
    mutationFn: (query: string) => searchUsers(query),
    onSuccess: (data) => {
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

  const handleSearchUsers = (query: string) => {
  
    searchUsersMutation.mutate(query);
  };

  const handleGetPublicProfile = async (userId: number) => {
    const cacheKey = ["publicProfile", user?.id, userId];
    const cachedProfile = queryClient.getQueryData<PublicProfile>(cacheKey);
  
    if (cachedProfile) {
      setViewingPublicProfile(cachedProfile);
    } else {
      await getPublicProfileMutation.mutateAsync(userId);
    }
  };
  
  const getPublicProfileMutation = useMutation<PublicProfile, Error, number>({
    mutationFn: (userId: number) => getPublicProfile(userId),
    onSuccess: (data, userId) => {
      setViewingPublicProfile(data);
      queryClient.setQueryData(["publicProfile", user?.id, userId], data); // Cache the public profile
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        getPublicProfileMutation.reset();
      }, 2000);
    },
    onError: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(() => {
        getPublicProfileMutation.reset();
      }, 2000);
    },
  });
  


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
      triggerRequestsRefetch();
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
    console.log("triggerFriendsRefetch triggered");
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
      showAppMessage(true, null, "Friendship accepted!");
     triggerRequestsRefetch();
     triggerFriendsRefetch(); 
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        acceptFriendshipMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      showAppMessage(true, null, "Oops! Friendship was not accepted.");
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
     showAppMessage(true, null, "Friendship declined");
      triggerRequestsRefetch();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        declineFriendshipMutation.reset();
      }, 2000);
    },
    onError: (error) => {
    showAppMessage(true, null, "Oops! Friendship was not declined.");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      //   console.log(`declineFriendshipMutation error: ${error}`);
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



  
  
 
 

  return (
    <FriendsContext.Provider
      value={{
        friends,
        handleGetFriend,
        getFriendMutation,
        replaceUserIdWithFriendName,
        handleSearchUsers,
        searchUsersMutation,
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
        setViewingFriend, // using to clear screen
        handleGetPublicProfile,
        getPublicProfileMutation,
        viewingPublicProfile, 
        setViewingPublicProfile, // using to clear screen
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
