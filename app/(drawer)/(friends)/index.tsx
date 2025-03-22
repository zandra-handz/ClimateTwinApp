import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useGlobalStyles } from "../../context/GlobalStylesContext";

import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";
import GoToItemButton from "@/app/components/GoToItemButton";

import DataList from "../../components/Scaffolding/DataList";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { friends, handleSearchUsers, userSearchResults, handleSendFriendRequest } = useFriends();

  const handlePress = () => {
    console.log("Friend handlePress pressed!");
  };

  const handleFriendRequest = (friendObject) => {
    if (friendObject) {
      console.log("attempting to send friend request", friendObject);
      handleSendFriendRequest(friendObject.id, 'Friend request message placeholder!');
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
        <View style={{ height: 80, paddingHorizontal: 20, width: "100%" }}>
          <GoToItemButton
            label="Show all users"
            onPress={handleSearchUsers}
          />
        </View>
        <View style={appContainerStyles.innerFlexStartContainer}>
        {userSearchResults && (
            <DataList listData={userSearchResults} onCardButtonPress={handleFriendRequest} />
          )}

          {friends && (
            <DataList listData={friends} onCardButtonPress={handlePress} />
          )}

        </View>
      </View>
    </>
  );
};

export default index;
