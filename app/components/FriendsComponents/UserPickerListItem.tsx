import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";

import Avatar from "../FriendsComponents/Avatar";
import FriendingFunctionsButton from "./FriendingFunctionsButton";

const UserPickerListItem = ({
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
        appContainerStyles.dCPickerButtonContainer,
        // themeStyles.darkestBackground,
        { borderColor: themeStyles.primaryText.color, height: size * 1.6 },
      ]}
      onPress={() => onPress(user)}
    >
      <View style={{ paddingRight: size / 2 }}>
        <Avatar image={avatar} size={size} />
      </View>

      <Text numberOfLines={1} style={[themeStyles.primaryText, appFontStyles.dCPickerButtonText]}>
        {user.username}
      </Text>
 
    </TouchableOpacity>
  );
};

export default UserPickerListItem;
