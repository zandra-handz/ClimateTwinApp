import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,

} from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
 
import { Feather } from "@expo/vector-icons"; 
import useInbox from "@/app/hooks/useInbox"; 
import useInlineComputations from "@/app/hooks/useInlineComputations";
import useTreasures from "@/app/hooks/useTreasures";

import DoubleCheckerWithMessageInput from "../Scaffolding/DoubleCheckerWithMessageInput";
 

const GiftingFunctionsButton = ({
  cTUserId,
  cTUsername,
  treasureId,
  treasureName,
  size,
  recGiftRequests,
  sentGiftRequests,
}) => { 
  const { themeStyles  } = useGlobalStyles();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);
 
  const {
    handleAcceptTreasureGift, 
    handleDeclineTreasureGift,
    triggerTreasuresRefetch,
    treasures,
  } = useTreasures();
  

  const { 
    checkForTreasureOwnership,
    otherUserRecGiftRequest,
    otherUserSentGiftRequest,
  } = useInlineComputations();
 

  const isOwner = checkForTreasureOwnership(treasureId, treasures, cTUserId);
 
  const recGiftRequestItem = otherUserRecGiftRequest(
    treasureId,
    recGiftRequests,
    cTUserId
  );

  const recGiftRequest = !!recGiftRequestItem;
 
  const  sentGiftRequestItem  = otherUserSentGiftRequest(
    treasureId,
    sentGiftRequests,
    cTUserId
  ); 
  const messageId = recGiftRequestItem?.id || null;
 
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
    }
    //  else {
    // console.log('no message id');
    // };
  };

  const handleDecline = () => {
    if (messageId) {
      handleDeclineTreasureGift(messageId);
      triggerTreasuresRefetch();
      triggerInboxItemsRefetch();
    }
  };
 

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
      </View>
    </>
  );
};

export default GiftingFunctionsButton;
