import { View, Text } from "react-native";
import React from "react";
 
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import useInlineComputations from "@/src/hooks/useInlineComputations";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

const NewItemsDot = ({ showUnread = "all" }) => {
  // all, friends, or gifts
  const {  inboxItems } = usePendingRequests();
  const { getUnreadRequestCounts } = useInlineComputations();

  const {
    unreadFriendReqCount,
    unreadGiftReqCount,
    unreadCount
  } = getUnreadRequestCounts(  inboxItems);

  const {
    themeStyles,
    appFontStyles,
    appContainerStyles,
    constantColorsStyles,
  } = useGlobalStyles();

  return (
    <>
      {showUnread === "friends" && unreadFriendReqCount > 0 && (
        <View
          style={[
            appContainerStyles.newItemsNonCircle,
            {
              backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              appFontStyles.newItemsText,
              { color: constantColorsStyles.v1LogoColor.color },
            ]}
          >
            {unreadFriendReqCount} new
          </Text>
        </View>
      )}
            {showUnread === "gifts" && unreadGiftReqCount > 0 && (
        <View
          style={[
            appContainerStyles.newItemsNonCircle,
            {
              backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              appFontStyles.newItemsText,
              { color: constantColorsStyles.v1LogoColor.color },
            ]}
          >
            {unreadGiftReqCount} new
          </Text>
        </View>
      )}
      {showUnread === "all" && unreadCount > 0 && (
        <View
          style={[
            appContainerStyles.newItemsNonCircle,
            {
              backgroundColor: constantColorsStyles.v1LogoColor.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              appFontStyles.newItemsText,
              { color: constantColorsStyles.v1LogoColor.color },
            ]}
          >
            {unreadCount} new
          </Text>
        </View>
      )}
    </>
  );
};

export default NewItemsDot;
