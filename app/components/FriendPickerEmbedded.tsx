import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  Text, 
  FlatList, 
} from "react-native";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";

import UserPickerListItem from "./FriendsComponents/UserPickerListItem";

interface PickerProps {
  friends: { label: string; value: string; username: string; id: string }[];
  onSelect: (selectedItem: any) => void;
}

const FriendPickerEmbedded = forwardRef((props: PickerProps, ref) => {
  const { onSelect } = props;
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { friends } = useFriends();

  useImperativeHandle(ref, () => ({
    getSelectedValue: () => selectedValue,
    resetPicker: () => {
      setSelectedValue(null);
      setSelectedName(null);
    },
  }));

  const handleButtonPress = (data: Record<string, any>) => {
    setSelectedValue(data.id);
    setSelectedName(data.username);
    onSelect(data);
  };

  return (
    <View
      style={[
        appContainerStyles.embeddedPickerContainer,

        {
          borderRadius: 10,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "100%",
          }}
        >
          <FlatList
            data={friends}
            fadingEdgeLength={30}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View
                style={{
                  marginVertical: 2,
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor:
                    item.friend_profile?.username === selectedName
                      ? "limegreen"
                      : "transparent",
                }}
              >
                <UserPickerListItem
                  user={item}
                  avatar={item.friend_profile?.avatar}
                  size={22}
                  onPress={handleButtonPress}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={themeStyles.primaryText}>No friends</Text>
            }
          />
        </View>
      </View>
    </View>
  );
});
 

export default FriendPickerEmbedded;
