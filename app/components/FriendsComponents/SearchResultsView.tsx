import { View, FlatList } from "react-native";

import UserListItem from "@/app/components/FriendsComponents/UserListItem"; 
import TreasureSearchableListItem from "../TreasuresComponents/TreasureSearchableListItem";

import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

const SearchResultsView = ({
  data,
  onViewResultPress,
  recRequests,
  sentRequests,
  friendsOrTreasures = "friends", // or 'treasures'
}) => {
  const { appContainerStyles } = useGlobalStyles();
  return (
    <View style={[appContainerStyles.dataListContainer]}>
      {friendsOrTreasures === "friends" && (
        <FlatList
          data={data}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="always" //this enables buttons to be pressed when keyboard is up
          keyExtractor={(item) => item.id.toString()}
          // keyExtractor={(item, index) =>
          //   item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
          // }
          renderItem={({ item }) => (
            <View style={{ marginVertical: 4 }}>
              <UserListItem
                user={item}
                avatar={item.profile?.avatar}
                onPress={onViewResultPress}
                size={40}
                showIsFriend={true}
                recFriendRequests={recRequests}
                sentFriendRequests={sentRequests}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {friendsOrTreasures === "treasures" && (
        <FlatList
          data={data}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="always" //this enables buttons to be pressed when keyboard is up
          keyExtractor={(item) => item.id.toString()}
          // keyExtractor={(item, index) =>
          //   item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
          // }
          renderItem={({ item }) => (
            <View style={{ marginVertical: 4 }}>
              <TreasureSearchableListItem
                treasure={item}
               // avatar={item.profile?.avatar} should be owner avatar on backend maybe? is avatar only sent on the requests?
                onPress={onViewResultPress}
                size={40} 
                recGiftRequests={recRequests}
                sentGiftRequests={sentRequests}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </View>
  );
};

export default SearchResultsView;
