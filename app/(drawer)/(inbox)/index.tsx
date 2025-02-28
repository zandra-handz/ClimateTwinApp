import React from "react";
import { SafeAreaView, View } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
import { useAppMessage } from "../../context/AppMessageContext";
import useInbox from "../../hooks/useInbox"; 
import { StatusBar } from "expo-status-bar"; 
import DataList from "../../components/DataList"; 
import { useRouter } from "expo-router";

import ActionsFooter from "@/app/components/ActionsFooter";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const { inboxItems } = useInbox();
  const router = useRouter();

 
  const handleOpenInboxItem = (id, messageId) => {
    // console.log(id);
    // console.log(messageId);
    if (id && messageId) {
      router.push({
        pathname: "(inbox)/[id]",
        params: { id: id, messageId: messageId },
      });
    }
  };

  const handlePress = () => {
    console.log("Inbox Item pressed!");
  };

  const handleCompose = () => {
    router.push('/compose');
  }

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
          {inboxItems && (
            <DataList
              listData={inboxItems}
              onCardButtonPress={handlePress}
              onOpenButtonPress={handleOpenInboxItem}
            />
          )}

        </View>
        <ActionsFooter
        onPressLeft={() => console.log("Left footer botton pressed!")}
        labelLeft={"Left button"}
        onPressRight={handleCompose}
        labelRight={"New"}
      />
 
      </View>

    </>
  );
};

export default index;
