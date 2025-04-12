import React from "react";
import { SafeAreaView, View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import useInbox from "../../hooks/useInbox"; 
import InboxView from "@/app/components/InboxComponents/InboxView";
import { useRouter } from "expo-router";
import { useNavigation, useRoute } from "@react-navigation/native";

import ActionsFooter from "@/app/components/ActionsFooter";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { inboxItems } = useInbox();
  const router = useRouter();
  const navigation = useNavigation();


  //Data coming from InboxItemUICard
  const handleOpenInboxItem = (id, messageId, contentType, senderName) => {
 
    if (id && messageId) {
      router.push({
        pathname: "(inbox)/[id]",
        params: { id: id, messageId: messageId, contentType: contentType, senderName: senderName },
      });
    }
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
          {inboxItems && (
            <InboxView
              listData={inboxItems} 
              onOpenButtonPress={handleOpenInboxItem}
            />
          )}
        </View>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"} 
        />
      </View>
    </>
  );
};

export default index;
