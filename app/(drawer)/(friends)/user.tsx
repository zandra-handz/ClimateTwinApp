import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext";
import UsersUICard from "@/app/components/FriendsComponents/UsersUICard";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import ActionsFooter from "@/app/components/ActionsFooter";

import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";
import FriendingFunctionsButton from "@/app/components/FriendsComponents/FriendingFunctionsButton";

// This accesses friends and checks for friendships so that i can move it if needed or
// or link from multiple places

const userdetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const {
    handleGetPublicProfile,
    getPublicProfileMutation,
    viewingPublicProfile,
  } = useFriends();
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const {
    friends,
    handleSendFriendRequest,
    friendRequestMutation,
    searchUsersMutation,
  } = useFriends();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
  const { showAppMessage } = useAppMessage();
  const [userProfileData, setUserProfileData] = useState(null);

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
    if (friends) {
      const checkForFriendship = friends?.find(
        (friend) => friend.friend === Number(id)
      );
      setIsFriend(!!checkForFriendship);
    }
  }, [friends]);

  const handleGoToGiveScreen = () => {
    console.log("removed");
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
          <UsersUICard data={viewingPublicProfile} isFullView={true} />
        )}
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          // onPressRight={isFriend ? () => {} : handleToggleDoubleChecker}
          // labelRight={isFriend ? "Friends" : "Add friend"}
        />
      </View>
    </>
  );
};

export default userdetails;
