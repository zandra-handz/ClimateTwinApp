import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useSurroundingsWS } from "../../src/context/SurroundingsWSContext";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext"; 
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import { clearNotificationCache } from "../../src/calls/apicalls";

import { useAppMessage } from "@/src/context/AppMessageContext";

import { useTreasures } from "@/src/context/TreasuresContext";


const NotificationNotifier = () => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();
  const {   isAuthenticated } = useUser();
  const { settingsAreLoading } = useUserSettings();
  const { showAppMessage } = useAppMessage();
  const {
    handleAcceptTreasureGift, 
    handleDeclineTreasureGift, 
    handleGetTreasure,

  } = useTreasures();
  const router = useRouter();
  const { lastNotification, lastInboxItemId, lastRequestId, lastRequestType, lastRequestItemId } =
    useSurroundingsWS();

  const [isVisible, setIsVisible] = useState(false);
  const {
    replaceUserIdWithFriendName,
    handleAcceptFriendship,
    acceptFriendshipMutation,
    handleDeclineFriendship,
    declineFriendshipMutation,
    handleGetPublicProfile,
  } = useFriends();
  const [modalMessage, setModalMessage] = useState(null);
  const { triggerRequestsAndInboxRefetch } = usePendingRequests();

  const closeModal = () => {
    setIsVisible(false);
  };

  const openModal = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    if (lastNotification && !modalMessage) {
      const updatedMessage = replaceUserIdWithFriendName(lastNotification);

      if (updatedMessage) {
        setModalMessage(updatedMessage);
        openModal();
      }
    } else {
      console.log("No notification in cache");
    }
  }, [lastNotification]);


  const handleView = async () => {
    if (lastRequestType === "gift" && lastInboxItemId && lastRequestItemId) {
      // put back in after done testing
      await clearNotificationCache();
      triggerRequestsAndInboxRefetch();
      handleGetTreasure(lastRequestItemId);
      router.push({
        pathname: "/(drawer)/(treasures)/[id]",
        params: {
          id: lastRequestItemId,
          descriptor: 'New treasure',
        },
      });
    } else if (lastRequestType === "friend" && lastInboxItemId && lastRequestItemId) {
      await clearNotificationCache();
      triggerRequestsAndInboxRefetch();
      handleGetPublicProfile(lastRequestItemId);
      router.push({
        pathname: "/(friends)/user",
        params: {
          id: lastRequestItemId,
          username: 'New friend'
        },
      });
    }
    closeModal();
  };


  // const handleView = async () => {
  //   if (lastRequestType === "gift" && lastInboxItemId && lastRequestItemId) {
  //     // put back in after done testing
  //     await clearNotificationCache();
  //     triggerRequestsAndInboxRefetch();
  //     router.push({
  //       pathname: "/(drawer)/(inbox)/[id]",
  //       params: {
  //         id: lastInboxItemId,
  //         contentType: "gift request",
  //         senderName: "A Gift",
  //       },
  //     });
  //   } else if (lastRequestType === "friend" && lastInboxItemId && lastRequestItemId) {
  //     triggerRequestsAndInboxRefetch();
  //     router.push({
  //       pathname: "/(drawer)/(inbox)/[id]",
  //       params: {
  //         id: lastInboxItemId,
  //         contentType: "friend request",
  //         senderName: "A friend",
  //       },
  //     });
  //   }
  //   closeModal();
  // };

  const handleDecline = async () => {
    console.log("handleDecline pressed");
    if (lastRequestType === "gift" && lastRequestId) {
      handleDeclineTreasureGift(lastRequestId);
      triggerRequestsAndInboxRefetch();
      await clearNotificationCache();
      closeModal();
    } else if (lastRequestType === "friend" && lastRequestId) {
      handleDeclineFriendship(lastRequestId);
      triggerRequestsAndInboxRefetch();
      console.log("decline friendship here");
      await clearNotificationCache();
      closeModal();
    }
  };

  const handleAccept = async () => {
    if (lastRequestType === "gift" && lastRequestId) {
      handleAcceptTreasureGift(lastRequestId);
      triggerRequestsAndInboxRefetch();
      console.log("accept treasure here");
      await clearNotificationCache();
      closeModal();
    } else if (lastRequestType === "friend" && lastRequestId) {
      handleAcceptFriendship(lastRequestId);
      triggerRequestsAndInboxRefetch();
      console.log("accept friendship here");
      await clearNotificationCache();
      closeModal();
    }
  };

  // useEffect(() => {
  //   if (acceptTreasureGiftMutation.isSuccess) {
  //     showAppMessage(true, null, "Treasure gift accepted!");
  //   }
  // }, [acceptTreasureGiftMutation.isSuccess]);

  // useEffect(() => {
  //   if (acceptTreasureGiftMutation.isError) {
  //     showAppMessage(true, null, "Oops! Treasure gift was not accepted.");
  //   }
  // }, [acceptTreasureGiftMutation.isError]);



  // useEffect(() => {
  //   if (acceptFriendshipMutation.isSuccess) {
  //     showAppMessage(true, null, "Friendship accepted!");
  //   }
  // }, [acceptFriendshipMutation.isSuccess]);

  // useEffect(() => {
  //   if (acceptFriendshipMutation.isError) {
  //     showAppMessage(true, null, "Oops! Friendship was not accepted.");
  //   }
  // }, [acceptFriendshipMutation.isError]);

  // useEffect(() => {
  //   if (declineFriendshipMutation.isSuccess) {
  //     showAppMessage(true, null, "Friendship declined");
  //   }
  // }, [declineFriendshipMutation.isSuccess]);

  //       useEffect(() => {
  //   if (declineFriendshipMutation.isError) {
  //     showAppMessage(true, null, "Oops! Friendship was not declined.");
  //   }
  // }, [declineFriendshipMutation.isError]);



  // useEffect(() => {
  //   if (declineTreasureGiftMutation.isSuccess) {
  //     showAppMessage(true, null, "Treasure declined");
  //   }
  // }, [declineTreasureGiftMutation.isSuccess]);

  // useEffect(() => {
  //   if (declineTreasureGiftMutation.isError) {
  //     showAppMessage(true, null, "Oops! Treasure was not declined.");
  //   }
  // }, [declineTreasureGiftMutation.isError]);

  useEffect(() => {
    if (!lastNotification) {
      return;
    }

    if (lastNotification) {
      openModal();
    }
  }, [lastNotification]);
  return (
    <>
      {isAuthenticated &&
        !settingsAreLoading &&
        lastNotification &&
        lastRequestType &&
        lastRequestId && (
          <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={appContainerStyles.dCBackgroundContainer}>
              <View
                style={[
                  appContainerStyles.doubleCheckerContainer,
                  themeStyles.darkerBackground,
                  {
                    borderColor:
                      constantColorsStyles.v1LogoColor.backgroundColor,
                    height: 130, // overrides height in styles as of 4/15/25
                  },
                ]}
              >
                <View style={appContainerStyles.doubleCheckerQuestonContainer}>
                  <Text
                    style={[
                      appFontStyles.notifierText,
                      themeStyles.primaryText,
                    ]}
                  >
                    {modalMessage && modalMessage}
                  </Text>
                </View>
                <View style={appContainerStyles.notifierButtonTray}>
                  <TouchableOpacity
                    style={[
                      appContainerStyles.notifierButton,
                      themeStyles.darkestBackground,
                    ]}
                    onPress={handleDecline}
                  >
                    <Text
                      style={[
                        appFontStyles.notifierButtonText,
                        themeStyles.primaryText,
                      ]}
                    >
                      {`Decline`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      appContainerStyles.notifierButton,
                      themeStyles.darkestBackground,
                    ]}
                    onPress={handleView}
                  >
                    <Text
                      style={[
                        appFontStyles.notifierButtonText,
                        themeStyles.primaryText,
                      ]}
                    >
                      {`View`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      appContainerStyles.notifierButton,
                      themeStyles.darkestBackground,
                    ]}
                    onPress={handleAccept}
                  >
                    <Text
                      style={[
                        appFontStyles.notifierButtonText,
                        themeStyles.primaryText,
                      ]}
                    >
                      {`Accept`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
    </>
  );
};

export default NotificationNotifier;
