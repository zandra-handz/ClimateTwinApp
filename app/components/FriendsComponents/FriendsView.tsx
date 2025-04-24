import { View, FlatList } from "react-native"; 
import React from "react";
import { useUser } from "@/src/context/UserContext";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import FriendListItem from "./FriendListItem";
import FriendRequestListItem from "./FriendRequestListItem";

const FriendsView = ({ listData, onViewFriendPress, onViewUserPress }) => {
  const { appContainerStyles } = useGlobalStyles();
  const { user } = useUser();

  // useEffect(() => {
  //   if (listData) {
  //     console.log(listData);
  //   }
  // }, [listData]);

  return (
    <View style={[appContainerStyles.dataListContainer, { paddingTop: 6 }]}>
      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
        }
        renderItem={({ item }) => (
          <View style={{ marginVertical: 4 }}>
            {item.special_type &&
              item.recipient &&
              item.recipient === user?.id && (
                <FriendRequestListItem
                  userId={item.sender}
                  username={item.sender_username}
                  avatar={item.sender_avatar}
                  size={60}
                  onPress={onViewUserPress}
                  message={item.message}
                  isSender={false}
                />
              )}
            {item.special_type && item.sender && item.sender === user?.id && (
              // <Text style={themeStyles.primaryText}>request to {item.recipient_username}</Text>
              <FriendRequestListItem
                userId={item.recipient}
                username={item.recipient_username}
                avatar={item.recipient_avatar}
                size={60}
                onPress={onViewUserPress}
                message={item.message}
                isSender={true}
              />
            )}
            {!item.special_type && item.friend_profile && (
              <FriendListItem
                user={item}
                avatar={item.friend_profile.avatar}
                size={60}
                onPress={onViewFriendPress}
              />
            )}
            {/* <FriendsUICard
              data={item}
              onViewFriendPress={onViewFriendPress}
            /> */}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default FriendsView;
