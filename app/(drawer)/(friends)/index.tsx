import React from "react";
import { View } from "react-native";

import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useRouter } from "expo-router"; 
import { useFriends } from "@/src/context/FriendsContext";
import FriendsView from "@/app/components/FriendsComponents/FriendsView"; 
import useInlineComputations from "@/src/hooks/useInlineComputations";

// MOVED INSIDE FRIENDSVIEW TO INCLUDE IN THE SAME FLATLIST
// import FriendRequestsView from "@/app/components/FriendsComponents/FriendRequestsView";

import ActionsFooter from "@/app/components/ActionsFooter";
import NothingHere from "@/app/components/Scaffolding/NothingHere";
import { useUser } from "@/src/context/UserContext";




const index = () => {
  const { themeStyles,  appContainerStyles } = useGlobalStyles();
 
  const {  friendsAndRequests, handleGetFriend, handleGetPublicProfile } =
    useFriends();

    const { user } = useUser();
 
    const { sortPendingFriendRequests, checkForExistingFriendship, otherUserRecFriendRequest, otherUserSentFriendRequest } = useInlineComputations();
   
   
    const allFriendRequests = friendsAndRequests?.pending_friend_requests;
    const { recFriendRequests, sentFriendRequests } = sortPendingFriendRequests(allFriendRequests, user?.id);
   

  const router = useRouter();

  const handleViewFriend = (id, friendName) => {

    if (id) {
     handleGetFriend(id);
      router.push({
        pathname: "/[id]",
        params: { id: id, friendName: friendName },
      });
    }
  };

  const handleViewUser = (id, friendName) => {
    if (id) {
      handleGetPublicProfile(id);
      router.push({
        pathname: "/user",
        params: { id: id, friendName: friendName },
      });
    }
  }; 
  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          // { paddingTop: 10 },
        ]}
      >
         
      
        <View style={appContainerStyles.innerFlexStartContainer}>

        {((friendsAndRequests?.friends && friendsAndRequests?.friends?.length > 0) || (allFriendRequests && allFriendRequests?.length > 0)) && (
            <FriendsView
            listData={[
              ...(recFriendRequests ?? []),
              ...(sentFriendRequests ?? []),
              ...(friendsAndRequests?.friends ?? [])
            ]}
              onViewFriendPress={handleViewFriend}
              onViewUserPress={handleViewUser}
            recFriendRequests={recFriendRequests}
            sentFriendRequests={sentFriendRequests}
            />
          )}
          {friendsAndRequests?.friends && !friendsAndRequests?.friends.length && !allFriendRequests?.length && (
            <NothingHere message={'No friends yet!'} subMessage={'search users to find friends!'} offsetStatusBarHeight={true} />
          ) }
        </View>
   


        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={() => router.push("/search")}
          labelRight={"Search users"}
        />
      </View>
    </>
  );
};

export default index;
