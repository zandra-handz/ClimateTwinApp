import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";
import GoToItemButton from "@/app/components/GoToItemButton";
import ActionsFooter from "@/app/components/ActionsFooter";

import DataList from "../../components/Scaffolding/DataList";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } = useFriends();
  const router = useRouter();

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

        {/* this was really just here for testing, I don't want user to be able to just fetch all users */}
        {/* <View style={{ height: 80, paddingHorizontal: 20, width: "100%" }}>
          <GoToItemButton
            label="Show all users"
            onPress={handleGetAllUsers}
          />
        </View> */}
        <View style={appContainerStyles.innerFlexStartContainer}>
        {allUsers && (
            <DataList listData={allUsers} onCardButtonPress={handleFriendRequest} />
          )}

          {friends && (
            <DataList listData={friends} onCardButtonPress={handlePress} />
          )}

        </View>
              <ActionsFooter
                height={66}
                onPressLeft={() => router.back()}
                labelLeft={"Back"}
                onPressRight={() => router.push('search/')}
                labelRight={"Add new"}
                // onPressCenter={isMinimized ? handleFullScreenToggle : null}
                // labelCenter={"Groq"}
              />
      </View>
    </>
  );
};

export default index;
