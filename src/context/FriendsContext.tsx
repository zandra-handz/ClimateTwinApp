import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  UseMutationResult,
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
  searchUsers,
  requestToAddFriend,
  acceptFriendship,
  declineFriendship,
  deleteFriendship,
  getPublicProfile,
  getUserPendingRequests,
} from "../../src/calls/apicalls";

import {
  AddFriendRequest,
  Friend,
  PublicProfile,
  FriendRequest,
  GiftRequest,
  PendingRequestsResponse,
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
  friendRequests: FriendRequest[];
  giftRequests: GiftRequest[];
  friendRequestsReceived: any[];
  friendRequestsSent: any[];
  giftRequestsReceived: any[];
  giftRequestsSent: any[];
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
  const router = useRouter();
  const { showAppMessage } = useAppMessage();
  const { user, isAuthenticated, isInitializing } = useUser();
  const [viewingFriend, setViewingFriend] = useState<Friend | null>(null); //is this correct or do i need the friendship?
  const [giftRequests, setGiftRequests] = useState<GiftRequest[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [giftRequestsSent, setGiftRequestsSent] = useState([]);
  const [giftRequestsReceived, setGiftRequestsReceived] = useState([]);
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
    enabled: !!(isAuthenticated && !isInitializing && user && user.id),
  });

  // shouldn't depend on friends data because you need to send /get a request to friend
  const {
    data: pendingRequests,
    isPending: isPendingRequests,
    isSuccess: isPendingRequestsSuccess,
    isError: isPendingRequestsError,
  }: UseQueryResult<PendingRequestsResponse, Error> = useQuery({
    queryKey: ["pendingRequests", user?.id],
    queryFn: getUserPendingRequests,
    enabled: !!(isAuthenticated && !isInitializing && user && user.id),
  });

  useEffect(() => {
    if (pendingRequests && isPendingRequestsSuccess) {
      setGiftRequests(pendingRequests?.pending_gift_requests);
      setFriendRequests(pendingRequests?.pending_friend_requests);
    }
  }, [pendingRequests, isPendingRequestsSuccess]);

  useEffect(() => {
    if (friendRequests.length > 0 && user) {
      const received = friendRequests?.filter(
        (request) => request.recipient === user?.id
      );
      const sent = friendRequests?.filter(
        (request) => request.sender === user?.id
      );

      setFriendRequestsReceived(received);
      setFriendRequestsSent(sent);
    }
  }, [friendRequests, user]);

    useEffect(() => { 
  
      if (giftRequests && giftRequests.length > 0 && user) {
        const received = giftRequests?.filter(
          (request) => request.recipient === user?.id
        );
        const sent = giftRequests?.filter(
          (request) => request.sender === user?.id
        ); 
  
        setGiftRequestsReceived(received);
        setGiftRequestsSent(sent);
      }
    }, [giftRequests, user]);

  // FOR DEBUGGING
  //   useEffect(() => {
  //     if (isError) {
  //       console.log(`WARNING: friends call failed`);
  //     }
  //   }, [isError]);

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
    console.log("handleSearchUsers");
    searchUsersMutation.mutate(query);
  };

  const getPublicProfileMutation = useMutation<PublicProfile, Error, number>({
    mutationFn: (userId: number) => getPublicProfile(userId),
    onSuccess: (data) => {
      setViewingPublicProfile(data);

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

  const handleGetPublicProfile = (userId: number) => {
    getPublicProfileMutation.mutate(userId);
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
      triggerRequestsRefetch();

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

  const triggerRequestsRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["pendingRequests", user?.id] });
    queryClient.refetchQueries({ queryKey: ["pendingRequests", user?.id] });
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
      triggerRequestsRefetch();
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
      triggerRequestsRefetch();
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
        handleGetPublicProfile,
        getPublicProfileMutation,
        viewingPublicProfile,
        friendRequests,
        giftRequests,
        friendRequestsReceived,
        friendRequestsSent,
        giftRequestsReceived,
        giftRequestsSent,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};
