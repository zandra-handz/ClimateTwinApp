import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import useFriends from "@/app/hooks/useFriends";
import Avatar from "../FriendsComponents/Avatar";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useAppMessage } from "@/src/context/AppMessageContext";
import useInbox from "@/app/hooks/useInbox";

import AddFriendButton from "../Scaffolding/AddFriendButton";
import UnfriendButton from "../Scaffolding/UnfriendButton";

const UserListItem = ({
  user,
  avatar,
  size,
  onPress,
  showIsFriend = false,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<Number>(0);
  const { showAppMessage } = useAppMessage();
  const {
    friends,
    friendRequests,
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
  } = useFriends();
  const { triggerInboxItemsRefetch } = useInbox();

  useEffect(() => {
    if (acceptFriendshipMutation.isSuccess) {
      showAppMessage(true, null, "Friendship accepted!");
    }
  }, [acceptFriendshipMutation.isSuccess]);

  useEffect(() => {
    if (acceptFriendshipMutation.isError) {
      showAppMessage(true, null, "Oops! Friendship was not accepted.");
    }
  }, [acceptFriendshipMutation.isError]);

  useEffect(() => {
    if (declineFriendshipMutation.isSuccess) {
      showAppMessage(true, null, "Friendship declined");
    }
  }, [declineFriendshipMutation.isSuccess]);

  useEffect(() => {
    if (declineFriendshipMutation.isError) {
      showAppMessage(true, null, "Oops! Friendship was not declined.");
    }
  }, [declineFriendshipMutation.isError]);

  useEffect(() => {
    if (friends && showIsFriend) {
      const checkForFriendship = friends?.find(
        (friend) => friend.friend === user.id
      );
      setIsFriend(!!checkForFriendship);

      if (!checkForFriendship) {
        const checkForSentRequest = friendRequests?.find(
          (request) => request.recipient === user.id
        );
        const checkForPendingRequest = friendRequests?.find(
          (request) => request.sender === user.id
        );

        setIsSent(!!checkForSentRequest);
        setIsPending(!!checkForPendingRequest);
        setMessageId(checkForPendingRequest?.id);
       // console.log(`message id: ${checkForPendingRequest?.id}`);

        // Check if the request exists and log the matching request
        // if (checkForPendingRequest) {
        //   console.log("pending request found:", checkForPendingRequest);
        //   // Or stringify it for better readability
        //   console.log(
        //     "pending request JSON:",
        //     JSON.stringify(checkForPendingRequest, null, 2)
        //   );
        // } 
 
        // else {
        //   console.log("No pending request found.");
        // }
      }
    }
  }, [friends, showIsFriend, user.id, friendRequests]);

  const handleAccept = () => {
    if (messageId) {
      handleAcceptFriendship(messageId);
      triggerInboxItemsRefetch();
    }
  };

  const handleDecline = () => {
    if (messageId) {
      handleDeclineFriendship(messageId);
      triggerInboxItemsRefetch();
    }
  };

  return (
    <TouchableOpacity
      style={[
        appContainerStyles.pickerButtonContainer,
        themeStyles.darkerBackground,
        { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
      ]}
      onPress={() => onPress(user)}
    >
      <View style={{ paddingRight: size / 3 }}>
        <Avatar image={avatar} size={size} />
      </View>

      <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
        {user.username}
      </Text>
      {!isFriend && isPending && (
        <View style={{ position: "absolute", right: 10, padding: 6 }}>
          <TouchableOpacity
            onPress={handleAccept}
            style={{
              borderRadius: 10,
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Accept request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecline}
            style={{
              borderRadius: 10,
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Decline request</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isFriend && isSent && (
        <View style={{ position: "absolute", right: 10, padding: 6 }}>
          <Text style={themeStyles.primaryText}>Request sent</Text>
        </View>
      )}

      {isFriend && showIsFriend && (
        <AntDesign
          name="check"
          size={size / 2}
          color={`limegreen`}
          style={{
            position: "absolute",
            right: 10,
            padding: 6,
            borderRadius: size / 2,
            backgroundColor: themeStyles.darkerBackground.backgroundColor,
          }}
        />
      )}

      {!isFriend && showIsFriend && (
        <AddFriendButton isAlreadyFriend={isFriend} />
      )}
    </TouchableOpacity>
  );
};

export default UserListItem;
