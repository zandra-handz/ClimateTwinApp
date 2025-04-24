import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Keyboard } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
 
import { useFriends } from "@/src/context/FriendsContext";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useAppMessage } from "@/src/context/AppMessageContext";
import useInbox from "@/app/hooks/useInbox"; 

import DoubleCheckerWithMessageInput from "../Scaffolding/DoubleCheckerWithMessageInput";

const FriendingFunctionsButton = ({ cTUserId, cTUsername, size }) => {
  const router = useRouter();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
    const [ isDoubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<Number>(0);
  const { showAppMessage } = useAppMessage();


  const {
    friends,
    friendRequests,
    handleSendFriendRequest,
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
  } = useFriends();
  const { triggerInboxItemsRefetch } = useInbox();

  const handleToggleDoubleChecker = () => {
    console.log('add friend pressed');
    console.log(`is visible`, isDoubleCheckerVisible);
    //this works but the modal also opens without dismissing the keyboard
    // and the keyboard opens again when go back, which is nice?
    // however not sure if this will cause a bug in future
    // if (!isDoubleCheckerVisible) {
    //     Keyboard.dismiss();
    // }
    setDoubleCheckerVisible(prev => !prev);
  
  };

 
  const handleAddFriend = (message) => { //this is set inside DoubleCheckerWithMessage
    if (cTUserId) {
      const numberId = Number(cTUserId);
      
    handleSendFriendRequest(numberId, message);
    handleToggleDoubleChecker(); 
    
  }
  
   };

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
    if (friends) {
      const checkForFriendship = friends?.find(
        (friend) => friend.friend === cTUserId
      );
      setIsFriend(!!checkForFriendship);

      if (!checkForFriendship) {
        const checkForSentRequest = friendRequests?.find(
          (request) => request.recipient === cTUserId
        );
        const checkForPendingRequest = friendRequests?.find(
          (request) => request.sender === cTUserId
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
  }, [friends, cTUserId, friendRequests]);

  return (
    <> 
    {isDoubleCheckerVisible && (
      <DoubleCheckerWithMessageInput
      isVisible={isDoubleCheckerVisible}
      toggleVisible={handleToggleDoubleChecker}
      singleQuestionText={`Add ${cTUsername || ''}?`}
 
      noButtonText="Back"
      yesButtonText="Send"
      onPress={handleAddFriend} />
    )}
    <View
      style={{
        flex: 1,
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {!isFriend && isPending && (
        <View
          style={{
            borderRadius: 10,
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "space-evenly",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
           // backgroundColor: "orange",
          }}
        >
          <TouchableOpacity
            onPress={handleAccept}
            style={{
              borderRadius: 6,
              width: "90%",
              height: "40%",
              alignItems: "center",
              justifyContent: 'center',
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDecline}
            style={{
              borderRadius: 6,
              width: "90%",
              height: "40%",
              alignItems: "center",
              justifyContent: 'center',
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          >
            <Text style={themeStyles.primaryText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isFriend && !isPending && !isSent && (
        <TouchableOpacity
          onPress={handleToggleDoubleChecker}
          style={{
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <Feather
            name="user-plus"
            size={size / 2}
            color={themeStyles.primaryText.color}
            style={{
              borderRadius: size / 2,
              opacity: 0.9,
              backgroundColor: "transparent",
              marginRight: 4,
            }}
          />
          {/* <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.friendingFunctionsButtonText,
              ]}
            >
              Add
            </Text> */}
        </TouchableOpacity>
      )}
      {!isFriend && isSent && (
        <View
        style={{
            borderRadius: 6,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <Text style={[themeStyles.primaryText]}>Request sent</Text>
        </View>
      )}

      {isFriend && (
        <View
          style={{
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            flex: 1,
            justifyContent: "center",

            backgroundColor: themeStyles.darkestBackground.backgroundColor,
          //  backgroundColor: "orange",
          }}
        >
          <AntDesign
            name="check"
            size={size / 2}
            color={`limegreen`}
            style={{
              borderRadius: size / 2,
              backgroundColor: themeStyles.darkerBackground.backgroundColor,
            }}
          />
        </View>
      )}
    </View>
    </>
  );
};

export default FriendingFunctionsButton;
