import React, { useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useRouter } from "expo-router";

import { useAppMessage } from "../../../src/context/AppMessageContext";
import useInbox from "../../hooks/useInbox";
import useTreasures from "@/app/hooks/useTreasures"; 
import { useFriends } from "@/src/context/FriendsContext";

import DataList from "../../components/Scaffolding/DataList";

import ActionsFooter from "@/app/components/ActionsFooter";

const read = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contentType } = useLocalSearchParams<{ contentType: string }>();
  const { senderName } = useLocalSearchParams<{ senderName: string }>();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const {
    handleAcceptTreasureGift,
    acceptTreasureGiftMutation,
    handleDeclineTreasureGift,
    declineTreasureGiftMutation,
  } = useTreasures();
  const {
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
  } = useFriends();
  const { showAppMessage } = useAppMessage();
  const {
    handleGetInboxItem,
    viewingInboxItem,
    viewingMessage,
    triggerInboxItemsRefetch,
  } = useInbox();
  const router = useRouter();

  const fetchInboxItem = async (id) => {
    await handleGetInboxItem(id);
  };

  const handleDecline = () => { 
    if (viewingMessage?.content_object.special_type === "gift request") {
      handleDeclineTreasureGift(viewingMessage?.content_object.id);
      triggerInboxItemsRefetch();
    }
    if (viewingMessage?.content_object.special_type === "friend request") {
      handleDeclineFriendship(viewingMessage?.content_object.id);
      triggerInboxItemsRefetch();
    }
  };

  const handleAccept = () => {
    console.log("handle accept pressed!");
    if (viewingMessage?.content_object.special_type === "gift request") {
      handleAcceptTreasureGift(viewingMessage?.content_object.id);
      triggerInboxItemsRefetch();
    }
    if (viewingMessage?.content_object.special_type === "friend request") {
      handleAcceptFriendship(viewingMessage?.content_object.id);
      triggerInboxItemsRefetch();
    }
  };

  useEffect(() => {
    if (acceptTreasureGiftMutation.isSuccess) {
      showAppMessage(true, null, "Treasure gift accepted!");
      router.back();
    }
  }, [acceptTreasureGiftMutation.isSuccess]);

  useEffect(() => {
    if (acceptTreasureGiftMutation.isError) {
      showAppMessage(true, null, "Oops! Treasure gift was not accepted.");
      router.back();
    }
  }, [acceptTreasureGiftMutation.isError]);

  // useEffect(() => {
  //   if (acceptFriendshipMutation.isSuccess) {
  //     showAppMessage(true, null, "Friendship accepted!");
  //     router.back();
  //   }
  // }, [acceptFriendshipMutation.isSuccess]);

  // useEffect(() => {
  //   if (acceptFriendshipMutation.isError) {
  //     showAppMessage(true, null, "Oops! Friendship was not accepted.");
  //     router.back();
  //   }
  // }, [acceptFriendshipMutation.isError]);

  // useEffect(() => {
  //   if (declineFriendshipMutation.isSuccess) {
  //     showAppMessage(true, null, "Friendship declined");
  //     router.back();
  //   }
  // }, [declineFriendshipMutation.isSuccess]);

  // useEffect(() => {
  //   if (declineFriendshipMutation.isError) {
  //     showAppMessage(true, null, "Oops! Friendship was not declined.");
  //     router.back();
  //   }
  // }, [declineFriendshipMutation.isError]);

  useEffect(() => {
    if (declineTreasureGiftMutation.isSuccess) {
      showAppMessage(true, null, "Treasure declined");
      router.back();
    }
  }, [declineTreasureGiftMutation.isSuccess]);

  useEffect(() => {
    if (declineTreasureGiftMutation.isError) {
      showAppMessage(true, null, "Oops! Treasure was not declined.");
      router.back();
    }
  }, [declineTreasureGiftMutation.isError]);

  useEffect(() => {
    if (id) {
      fetchInboxItem(id);
    }
  }, [id]);

  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {viewingInboxItem && (
            <DataList
              listData={[viewingInboxItem]}
              onCardButtonPress={() => {}}
            />
          )}

          {viewingMessage && (
            <DataList
              listData={[viewingMessage.content_object]}
              onCardButtonPress={() => {}}
            />
          )}
        </View>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressCenter={handleDecline}
          labelCenter={"Decline"}
          onPressRight={handleAccept}
          labelRight={"Accept"}
        />
      </View>
    </>
  );
};

export default read;
