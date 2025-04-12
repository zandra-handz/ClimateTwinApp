import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSurroundingsWS } from "../../src/context/SurroundingsWSContext";
import { useActiveSearch } from "../../src/context/ActiveSearchContext";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import useFriends from "../hooks/useFriends";
import useInbox from "../hooks/useInbox";
import useTreasures from "../hooks/useTreasures";
import { clearNotificationCache } from "../../src/calls/apicalls";

const NotificationNotifier = () => {
  const { themeStyles, appContainerStyles, appFontStyles, constantColorsStyles } = useGlobalStyles();
  const router = useRouter();
  const { lastNotification } = useSurroundingsWS();
  const { locationUpdateWSIsOpen } = useActiveSearch();
  const [isVisible, setIsVisible] = useState(false);
  const { replaceUserIdWithFriendName  } = useFriends();
  const [modalMessage, setModalMessage ] = useState(null);
  const [isNewTreasureMessage, setIsNewTreasureMessage ] = useState(null);
  const { triggerInboxItemsRefetch } = useInbox();

  const closeModal = () => {
    setIsVisible(false);
  };

  const openModal = () => {
    setIsVisible(true);
  };

  const containsTreasureAndSent = (message: string): boolean => {
    return message.toLowerCase().includes('treasure') && message.toLowerCase().includes('sent');
  };

  useEffect(() => {
    if (lastNotification && locationUpdateWSIsOpen && !modalMessage) {
      const updatedMessage = replaceUserIdWithFriendName(lastNotification);
      
      if (updatedMessage) {
        setModalMessage(updatedMessage);
        openModal();
        
        // Check if modalMessage contains "treasure" and "sent"
        if (containsTreasureAndSent(updatedMessage)) {
            setIsNewTreasureMessage(true);
          console.log("Notification contains both 'treasure' and 'sent'");
        }
      }
      
      console.log(`Last notification: ${lastNotification}`);
    } else {
      console.log('No notification in cache');
    }
  }, [lastNotification, locationUpdateWSIsOpen]);
  
  const handleGoToTreasures = async () => {
    await clearNotificationCache();
    triggerInboxItemsRefetch();
    router.push("/(drawer)/(inbox)");
    closeModal();
  }

  const handleAcknowledgeNonActionNotif = async () => {
    await clearNotificationCache(); 
    closeModal();
  }

  useEffect(() => {
    if (!lastNotification) {
      //} || lastNotification === '') {
      //   if (isVisible) {
      //     closeModal();
      //   }
      return;
    }

    if (lastNotification) {
      openModal();
    }
  }, [lastNotification]);
  return (
    <>
      {locationUpdateWSIsOpen && (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
       
            <View style={[appContainerStyles.notifierContainer, themeStyles.darkerBackground, {borderColor: constantColorsStyles.v1LogoColor.backgroundColor}]}>
              <View style={appContainerStyles.notifierTextContainer}>
                <Text
                //   numberOfLines={1}
                  style={[appFontStyles.notifierText, themeStyles.primaryText]}
                >
                  {modalMessage && modalMessage}
                </Text>
              </View>
              <View style={appContainerStyles.notifierButtonTray}>
                {/* <TouchableOpacity
                  style={[
                    appContainerStyles.notifierButton,
                    themeStyles.darkestBackground, 
                  ]}
                  onPress={closeModal}
                >
                  <Text style={[appFontStyles.notifierButtonText, themeStyles.primaryText]}>
                    Back
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[
                    appContainerStyles.notifierButton,
                    themeStyles.darkestBackground, 
                  ]}
                  onPress={isNewTreasureMessage ? handleGoToTreasures : handleAcknowledgeNonActionNotif}
                >
                  <Text style={[appFontStyles.notifierButtonText, themeStyles.primaryText]}>
                    { isNewTreasureMessage ? `Go to messages` : `Yay!`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View> 
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  
 
 
  prevArrowContainer: {
    position: "absolute",
    left: 20,
  },
  nextArrowContainer: {
    position: "absolute",
    right: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    //textTransform: 'uppercase',
  },
});

export default NotificationNotifier;
