import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { useSurroundingsWS } from "../../src/context/SurroundingsWSContext"; 
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
 
import { useFriends } from "@/src/context/FriendsContext";
import useInbox from "../hooks/useInbox";
import { clearNotificationCache } from "../../src/calls/apicalls";

import { useAppMessage } from "@/src/context/AppMessageContext";

import useTreasures from "../hooks/useTreasures";

const NotificationNotifier = () => {
  const {
    themeStyles,
    appContainerStyles,
    appFontStyles,
    constantColorsStyles,
  } = useGlobalStyles();
  const { user, isAuthenticated, isInitializing } = useUser();
  const { showAppMessage } = useAppMessage();
  const { handleAcceptTreasureGift, acceptTreasureGiftMutation, handleDeclineTreasureGift, declineTreasureGiftMutation } = useTreasures();
  const router = useRouter();
  const { lastNotification, lastInboxItemId, lastRequestId , lastRequestType} = useSurroundingsWS();
 
  const [isVisible, setIsVisible] = useState(false);
  const { replaceUserIdWithFriendName, handleAcceptFriendship, acceptFriendshipMutation, handleDeclineFriendship, declineFriendshipMutation } = useFriends();
  const [modalMessage, setModalMessage] = useState(null); 
  const { triggerInboxItemsRefetch } = useInbox();

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
    if ((lastRequestType === 'gift') && lastInboxItemId) {
        // put back in after done testing
    await clearNotificationCache();
    triggerInboxItemsRefetch();
      router.push({
        pathname: "/(drawer)/(inbox)/[id]",
        params: { id: lastInboxItemId, contentType: 'gift request', senderName: 'A Gift' },

      })
    } else if ((lastRequestType === 'friend') && lastInboxItemId) {
      triggerInboxItemsRefetch();
      router.push({
        pathname: "/(drawer)/(inbox)/[id]",
        params: { id: lastInboxItemId, contentType: 'friend request', senderName: 'A friend' },

      })

     }
    closeModal();
  };


  const handleDecline = async () => {
    console.log('handleDecline pressed');
    if ((lastRequestType === 'gift') && lastRequestId) {
      handleDeclineTreasureGift(lastRequestId);
      triggerInboxItemsRefetch(); 
      await clearNotificationCache();
      closeModal(); 
    } else if ((lastRequestType === 'friend') && lastRequestId) {
      handleDeclineFriendship(lastRequestId);
      triggerInboxItemsRefetch();
      console.log('decline friendship here');
      await clearNotificationCache();
      closeModal();
    }

  };

  const handleAccept =  async () => {
    if ((lastRequestType === 'gift') && lastRequestId) {
      handleAcceptTreasureGift(lastRequestId);
      triggerInboxItemsRefetch();
      console.log('accept treasure here');
      await clearNotificationCache();
      closeModal();

    } else if ((lastRequestType === 'friend') && lastRequestId) {
      handleAcceptFriendship(lastRequestId);
      triggerInboxItemsRefetch();
      console.log('accept friendship here');
      await clearNotificationCache();
      closeModal();
    }
 

  };
  
  
    useEffect(() => {
      if (acceptTreasureGiftMutation.isSuccess) {
        showAppMessage(true, null, "Treasure gift accepted!");
      }
    }, [acceptTreasureGiftMutation.isSuccess]);
  
    useEffect(() => {
      if (acceptTreasureGiftMutation.isError) {
        showAppMessage(true, null, "Oops! Treasure gift was not accepted.");
      }
    }, [acceptTreasureGiftMutation.isError]);

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


            useEffect(() => {
        if (declineTreasureGiftMutation.isSuccess) {
          showAppMessage(true, null, "Treasure declined");
        }
      }, [declineTreasureGiftMutation.isSuccess]);


            useEffect(() => {
        if (declineTreasureGiftMutation.isError) {
          showAppMessage(true, null, "Oops! Treasure was not declined.");
        }
      }, [declineTreasureGiftMutation.isError]);
    


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
      {isAuthenticated && !isInitializing && lastNotification && lastRequestType && lastRequestId && (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
          <View style={appContainerStyles.dCBackgroundContainer}>
            <View
              style={[
                appContainerStyles.doubleCheckerContainer,
                themeStyles.darkerBackground,
                {
                  borderColor: constantColorsStyles.v1LogoColor.backgroundColor,
                  height: 130, // overrides height in styles as of 4/15/25
                },
              ]}
            >
              <View style={appContainerStyles.doubleCheckerQuestonContainer}>
                <Text
                  style={[appFontStyles.notifierText, themeStyles.primaryText]}
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
                  onPress={handleAccept }
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
