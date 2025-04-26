import { View, FlatList } from "react-native"; 

import UserListItem from '@/app/components/FriendsComponents/UserListItem';
 
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 

const SearchResultsView = ({
  data, 
  onViewUserPress,
  recFriendRequests,
  sentFriendRequests
}) => {
  const { appContainerStyles } = useGlobalStyles();
  return (
    <View style={[appContainerStyles.dataListContainer]}>
      <FlatList
        data={data}
        removeClippedSubviews={false} 
        keyboardShouldPersistTaps="always"//this enables buttons to be pressed when keyboard is up
        keyExtractor={(item) => item.id.toString()}
        // keyExtractor={(item, index) =>
        //   item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
        // }
        renderItem={({ item }) => (
          <View style={{ marginVertical: 4 }}>
            <UserListItem
            user={item}
            avatar={item.profile?.avatar}
            onPress={onViewUserPress}
            size={40}
            showIsFriend={true}
            recFriendRequests={recFriendRequests}
            sentFriendRequests={sentFriendRequests}
            /> 
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default SearchResultsView;
