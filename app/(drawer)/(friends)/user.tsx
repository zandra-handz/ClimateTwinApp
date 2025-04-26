import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext";
import UsersUICard from "@/app/components/FriendsComponents/UsersUICard";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import ActionsFooter from "@/app/components/ActionsFooter";

import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import useInlineComputations from "@/app/hooks/useInlineComputations";
import { useUser } from "@/src/context/UserContext";
// This accesses friends and checks for friendships so that i can move it if needed or
// or link from multiple places

const userdetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user } = useUser();
  const router = useRouter();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const {
    handleGetPublicProfile,
    getPublicProfileMutation,
    viewingPublicProfile,
  } = useFriends();
  const {
    friends,
    handleSendFriendRequest,
    friendRequestMutation,
    searchUsersMutation,
  } = useFriends();

  const { pendingRequests } = usePendingRequests();
  const { sortPendingFriendRequests } = useInlineComputations();

  const allFriendRequests = pendingRequests?.pending_friend_requests;
  const { recFriendRequests, sentFriendRequests } = sortPendingFriendRequests(
    allFriendRequests,
    user?.id
  );

  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
  const { showAppMessage } = useAppMessage();

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

  useEffect(() => {
    if (friendRequestMutation.isSuccess) {
      showAppMessage(
        true,
        null,
        `Friend request has been sent to ${username}!`
      );
      router.back();
    }
  }, [friendRequestMutation.isSuccess]);

  // Not working?
  useEffect(() => {
    if (friendRequestMutation.isError) {
      showAppMessage(
        true,
        null,
        `Oops! Did you already send a friend request to ${username}?`
      );
      router.back();
    }
  }, [friendRequestMutation.isError]);

  const handleAddFriend = () => {
    if (id) {
      const numberId = Number(id);

      handleSendFriendRequest(numberId);
      handleToggleDoubleChecker();
    }
  };

  useEffect(() => {
    if (id) {
      handleGetPublicProfile(id);
    }
  }, [id]);

  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleChecker
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Add ${username || ""}?`}
          noButtonText="Back"
          yesButtonText="Yes"
          onPress={handleAddFriend}
        />
      )}
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        {viewingPublicProfile && (
          <UsersUICard
            data={viewingPublicProfile}
            isFullView={true}
            recFriendRequests={recFriendRequests}
            sentFriendRequests={sentFriendRequests}
          />
        )}
        <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
      </View>
    </>
  );
};

export default userdetails;
