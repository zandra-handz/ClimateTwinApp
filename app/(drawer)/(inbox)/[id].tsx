import React, { useState, useCallback, useEffect, useRef } from "react";
import { SafeAreaView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import { useRouter } from "expo-router";

import { useAppMessage } from "../../context/AppMessageContext";
import useInbox from "../../hooks/useInbox";
import useTreasures from "@/app/hooks/useTreasures";

import { StatusBar } from "expo-status-bar";

import DataList from "../../components/DataList";
import { useFocusEffect } from "expo-router";
import { getInboxItem, getMessage } from "../../apicalls";

import ActionsFooter from "@/app/components/ActionsFooter";

const read = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messageId } = useLocalSearchParams<{ messageId: string }>();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { handleAcceptTreasureGift, acceptTreasureGiftMutation } = useTreasures();
  const { showAppMessage } = useAppMessage();
  const { handleGetInboxItem, viewingInboxItem, viewingMessage, triggerInboxItemsRefetch } =
    useInbox();
    const router = useRouter();
 

  const fetchInboxItem = async (id) => {
    await handleGetInboxItem(id);
  };

  const handleAccept = () => {
    if (viewingMessage) {
    handleAcceptTreasureGift(viewingMessage?.content_object.id);
    triggerInboxItemsRefetch(); 
    
  }  };


  useEffect(() => {
    if ( acceptTreasureGiftMutation.isSuccess) {
      showAppMessage(true, null, 'Treasure gift accepted!');
      router.back();
    }

  }, [ acceptTreasureGiftMutation.isSuccess ]);


  useEffect(() => {
    if ( acceptTreasureGiftMutation.isError) {
      showAppMessage(true, null, 'Oops! Treasure gift was not accepted.');
      router.back();
    }

  }, [ acceptTreasureGiftMutation.isError ]);



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
      {/* <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      /> */}
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
        onPressLeft={() => console.log("Left footer botton pressed!")}
        labelLeft={"Decline"}
        onPressRight={handleAccept}
        labelRight={"Accept"}
      />
      </View>
    </>
  );
};

export default read;
