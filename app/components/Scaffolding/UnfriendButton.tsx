import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { Feather } from "@expo/vector-icons";

const UnfriendButton = ({ onPress }) => {
  const { appContainerStyles, appFontStyles } = useGlobalStyles();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <View style={{ marginHorizontal: 3 }}>
        <TouchableOpacity
          style={[
            appContainerStyles.floatingIconButtonContainer,
            { borderColor: "red" },
          ]}
          onPress={onPress}
        >
          <Feather
            name="user-minus"
            size={appFontStyles.exploreTabBarIcon.width}
            color={"red"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UnfriendButton;
