import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

import Avatar from "../FriendsComponents/Avatar";
import FriendingFunctionsButton from "./FriendingFunctionsButton";

const UserListItem = ({
  user,
  avatar,
  size,
  onPress,
  showIsFriend = false,
  recFriendRequests,
  sentFriendRequests
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <TouchableOpacity
      style={[
        appContainerStyles.pickerButtonContainer,
        themeStyles.darkerBackground,
        { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
      ]}
      onPress={() => onPress(user)}
    >
      <View style={{ paddingRight: size / 3 }}>
        <Avatar image={avatar} size={size} />
      </View>

      <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
        {user.username}
      </Text>
      {showIsFriend && (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: 110,
            right: 10,
            padding: 6,
          }}
        >
          <FriendingFunctionsButton
            cTUserId={user.id}
            cTUsername={user.username}
            size={size}
            recFriendRequests={recFriendRequests}
            sentFriendRequests={sentFriendRequests}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UserListItem;
