import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import useFriends from "../../hooks/useFriends";

import FriendsView from "@/app/components/FriendsComponents/FriendsView";
import ActionsFooter from "@/app/components/ActionsFooter";

const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } =
    useFriends();
  const router = useRouter();

  const handleViewFriend = (id, friendName) => {
    if (id) {
      router.push({
        pathname: "(friends)/[id]",
        params: { id: id, friendName: friendName },
      });
    }
  };
  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          // { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {friends && (
            <FriendsView
              listData={friends}
              onViewFriendPress={handleViewFriend}
            />
          )}
        </View>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={() => router.push("/search")}
          labelRight={"Add new"}
        />
      </View>
    </>
  );
};

export default index;
