import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Feather } from "@expo/vector-icons";

const AddFriendButton = ({ isAlreadyFriend = false, onPress }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <View style={{ marginHorizontal: 3 }}>
        {!isAlreadyFriend && (
          <TouchableOpacity
            style={[
              appContainerStyles.floatingIconButtonContainer,
              { borderColor: themeStyles.primaryText.color },
            ]}
            onPress={onPress}
          >
            <Feather
              name="user-plus"
              size={appFontStyles.exploreTabBarIcon.width}
              color={themeStyles.primaryText.color}
            />
          </TouchableOpacity>
        )}
        {isAlreadyFriend && (
          <View
            style={[
              appContainerStyles.floatingIconButtonContainer,
              { borderColor: "green" },
            ]}
          >
            <Feather
              name="user-check"
              size={appFontStyles.exploreTabBarIcon.width}
              color={"green"}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AddFriendButton;
