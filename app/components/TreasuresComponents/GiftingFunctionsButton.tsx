import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Keyboard,
} from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext";
import { AntDesign, Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useAppMessage } from "@/src/context/AppMessageContext";
import useInbox from "@/app/hooks/useInbox";

import useTreasures from "@/app/hooks/useTreasures"; 

import DoubleCheckerWithMessageInput from "../Scaffolding/DoubleCheckerWithMessageInput";
import { ConstantColorFactor } from "three";


const GiftingFunctionsButton = ({ cTUserId, cTUsername, treasureId, treasureName, size }) => {
  const router = useRouter();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isOwner, setIsOwner ] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<Number>(0);
  const { showAppMessage } = useAppMessage();

  const {
    handleAcceptTreasureGift,
    acceptTreasureGiftMutation,
    handleDeclineTreasureGift, 
    triggerTreasuresRefetch,
    treasures,
  } = useTreasures();

  const {
    friends,
    giftRequests,
    handleSendFriendRequest,  
    declineFriendshipMutation,
  } = useFriends();
  const { triggerInboxItemsRefetch } = useInbox();

  const handleToggleDoubleChecker = () => {
    console.log("add friend pressed");
    console.log(`is visible`, isDoubleCheckerVisible);
    //this works but the modal also opens without dismissing the keyboard
    // and the keyboard opens again when go back, which is nice?
    // however not sure if this will cause a bug in future
    // if (!isDoubleCheckerVisible) {
    //     Keyboard.dismiss();
    // }
    setDoubleCheckerVisible((prev) => !prev);
  };

  const handleAddFriend = (message) => {
    //this is set inside DoubleCheckerWithMessage
    if (cTUserId) {
      const numberId = Number(cTUserId);

      handleSendFriendRequest(numberId, message);
      handleToggleDoubleChecker();
    }
  };

  const handleAccept = () => {
    if (messageId) {
      handleAcceptTreasureGift(messageId);
      triggerTreasuresRefetch();
      triggerInboxItemsRefetch();
    }
  };

  const handleDecline = () => {
    if (messageId) {
      handleDeclineTreasureGift(messageId);
      triggerTreasuresRefetch();
      triggerInboxItemsRefetch();
    }
  };

  useEffect(() => {
    if (acceptTreasureGiftMutation.isSuccess) {
      showAppMessage(true, null, "Treasure accepted!");
    }
  }, [acceptTreasureGiftMutation.isSuccess]);

  useEffect(() => {
    if (acceptTreasureGiftMutation.isError) {
      showAppMessage(true, null, "Oops! Friendship was not accepted.");
    }
  }, [acceptTreasureGiftMutation.isError]);

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
    if (treasures) {
      const checkForOwnership = treasures?.find((treasure) => {
        // console.log("Checking treasure:", treasure);
        // console.log("Comparing treasure.id:", treasure.id, "with treasureId:", treasureId);
        // console.log("Comparing treasure.user.id:", treasure.user, "with cTUserId:", cTUserId);
      
        return treasure.id === treasureId && treasure.user === cTUserId;
      });
      
      setIsOwner(!!checkForOwnership);

      const checkForSentRequest = giftRequests?.find(
        (request) => request.sender === cTUserId && request.treasure_data.id === treasureId
      );

    //  console.log(`TREASURE ID`, treasureId);

      // if (!checkForOwnership) {

        const checkForPendingRequest = giftRequests?.find(
          (request) => request.recipient === cTUserId && request.treasure_data.id === treasureId
        ); 

        setIsSent(!!checkForSentRequest);
        setIsPending(!!checkForPendingRequest);
        setMessageId(checkForPendingRequest?.id);
      // }
    }
  }, [ cTUserId, giftRequests, treasures]);

  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleCheckerWithMessageInput
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Send ${treasureName|| ""} to a friend?`}
          noButtonText="Back"
          yesButtonText="Send"
          onPress={() => {}}
        />
      )}
      <View
        style={{
          flex: 1,
          width: "100%",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {!isOwner && isPending && (
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
                justifyContent: "center",
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
                justifyContent: "center",
                backgroundColor: themeStyles.darkerBackground.backgroundColor,
              }}
            >
              <Text style={themeStyles.primaryText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {isOwner && !isPending && !isSent && (
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
              name="send"
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
        {isOwner && isSent && (
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

        {/* {isOwner && (
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
        )} */}
      </View>
    </>
  );
};

export default GiftingFunctionsButton;
