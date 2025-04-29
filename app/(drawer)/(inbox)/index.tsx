import React from "react";
import { SafeAreaView, View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 
import useInbox from "../../../src/hooks/useInbox"; 
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
  const handleOpenInboxItem = (id, contentType, senderName) => {
 
    if (id) {
      router.push({
        pathname: "/(drawer)/(inbox)/[id]",
        params: { id: id, contentType: contentType, senderName: senderName },
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
