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
import { useUser } from "@/src/context/UserContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "@/src/context/AppMessageContext";
import useInbox from "@/app/hooks/useInbox";
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import useInlineComputations from "@/app/hooks/useInlineComputations";
import useTreasures from "@/app/hooks/useTreasures";

import DoubleCheckerWithMessageInput from "../Scaffolding/DoubleCheckerWithMessageInput";
import { ConstantColorFactor } from "three";

const GiftingFunctionsButton = ({
  cTUserId,
  cTUsername,
  treasureId,
  treasureName,
  size,
  recGiftRequests,
  sentGiftRequests,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const { showAppMessage } = useAppMessage();
  const {
    handleAcceptTreasureGift,
    acceptTreasureGiftMutation,
    handleDeclineTreasureGift,
    triggerTreasuresRefetch,
    treasures,
  } = useTreasures();
 
  console.log(recGiftRequests.length); 
  console.log(sentGiftRequests.length);

  const { 
    checkForTreasureOwnership,
    otherUserRecGiftRequest,
    otherUserSentGiftRequest,
  } = useInlineComputations();
 

  const isOwner = checkForTreasureOwnership(treasureId, treasures, cTUserId);

  const recGiftRequest = otherUserRecGiftRequest(
    treasureId,
    recGiftRequests,
    cTUserId
  );

  const  sentGiftRequestItem  = otherUserSentGiftRequest(
    treasureId,
    sentGiftRequests,
    cTUserId
  );
  // console.log(sentGiftRequestItem);
  const messageId = sentGiftRequestItem?.id || null;

  const sentGiftRequest = !!sentGiftRequestItem;
 
  const { triggerInboxItemsRefetch } = useInbox();

  const handleToggleDoubleChecker = () => {
    // console.log("add friend pressed");
    // console.log(`is visible`, isDoubleCheckerVisible);
    //this works but the modal also opens without dismissing the keyboard
    // and the keyboard opens again when go back, which is nice?
    // however not sure if this will cause a bug in future
    // if (!isDoubleCheckerVisible) {
    //     Keyboard.dismiss();
    // }
    setDoubleCheckerVisible((prev) => !prev);
  };

  const handleAccept = () => {
    if (messageId) {
      handleAcceptTreasureGift(messageId);
      triggerTreasuresRefetch();
      triggerInboxItemsRefetch();
    } else {
    console.log('no message id');
    };
  };

  const handleDecline = () => {
    if (messageId) {
      handleDeclineTreasureGift(messageId);
      triggerTreasuresRefetch();
      triggerInboxItemsRefetch();
    }
  };

  // useEffect(() => {
  //   if (acceptTreasureGiftMutation.isSuccess) {
  //     showAppMessage(true, null, "Treasure accepted!");
  //   }
  // }, [acceptTreasureGiftMutation.isSuccess]);

  // useEffect(() => {
  //   if (acceptTreasureGiftMutation.isError) {
  //     showAppMessage(true, null, "Oops! Friendship was not accepted.");
  //   }
  // }, [acceptTreasureGiftMutation.isError]);

  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleCheckerWithMessageInput
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Send ${treasureName || ""} to a friend?`}
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
        {!isOwner && recGiftRequest && (
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

        {isOwner && !recGiftRequest && !sentGiftRequest && (
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
        {isOwner && sentGiftRequest && (
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
