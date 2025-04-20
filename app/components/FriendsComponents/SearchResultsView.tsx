import { View, FlatList } from "react-native"; 

import UserListItem from '@/app/components/FriendsComponents/UserListItem';
import UsersUICard from "./UsersUICard";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 

const SearchResultsView = ({
  data, 
  onViewUserPress,
}) => {
  const { appContainerStyles } = useGlobalStyles();
  return (
    <View style={[appContainerStyles.dataListContainer]}>
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
        }
        renderItem={({ item }) => (
          <View style={{ marginVertical: "4" }}>
            <UserListItem
            user={item}
            avatar={item.profile?.avatar}
            onPress={onViewUserPress}
            size={40}
            showIsFriend={true}
            />
            {/* <UsersUICard
              data={item}
              onViewUserPress={onViewUserPress}
            /> */}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default SearchResultsView;
