import React, { useState, useCallback, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useRouter } from "expo-router";

import { useAppMessage } from "../../../src/context/AppMessageContext";
import useInbox from "../../hooks/useInbox";
import useTreasures from "@/app/hooks/useTreasures";
import useFriends from "@/app/hooks/useFriends";
 

import DataList from "../../components/Scaffolding/DataList"; 

import ActionsFooter from "@/app/components/ActionsFooter";

const read = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messageId } = useLocalSearchParams<{ messageId: string }>();
  const { contentType } = useLocalSearchParams<{ contentType: string }>();
  const { senderName } = useLocalSearchParams<{ senderName: string }>();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { handleAcceptTreasureGift, acceptTreasureGiftMutation } =
    useTreasures();
  const { handleAcceptFriendship, acceptFriendshipMutation } = useFriends();
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

  useEffect(() => {
    if (acceptFriendshipMutation.isSuccess) {
      showAppMessage(true, null, "Friendship accepted!");
      router.back();
    }
  }, [acceptFriendshipMutation.isSuccess]);

  useEffect(() => {
    if (acceptFriendshipMutation.isError) {
      showAppMessage(true, null, "Oops! Friendship was not accepted.");
      router.back();
    }
  }, [acceptFriendshipMutation.isError]);

  useEffect(() => {
    if (id) {
      fetchInboxItem(id);
    }
  }, [id]);

  const handleOpenInboxItem = () => {
    console.log(`Inbox Item ${id} ${messageId} pressed!`);
  };

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
              onCardButtonPress={handleOpenInboxItem}
            />
          )}

          {viewingMessage && (
            <DataList
              listData={[viewingMessage.content_object]}
              onCardButtonPress={handleOpenInboxItem}
            />
          )}
        </View>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressCenter={() => console.log("Left footer botton pressed!")}
          labelCenter={"Decline"}
          onPressRight={handleAccept}
          labelRight={"Accept"}
        />
      </View>
    </>
  );
};

export default read;
