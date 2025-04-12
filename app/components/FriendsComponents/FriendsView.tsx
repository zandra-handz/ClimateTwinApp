import { View, FlatList } from "react-native"; 
import FriendsUICard from "./FriendsUICard";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext"; 

const FriendsView = ({
  listData, 
  onViewFriendPress,
}) => {
  const { appContainerStyles } = useGlobalStyles();
  return (
    <View style={[appContainerStyles.dataListContainer]}>
      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
        }
        renderItem={({ item }) => (
          <View style={{ marginVertical: "2%" }}>
            <FriendsUICard
              data={item}
              onViewFriendPress={onViewFriendPress}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default FriendsView;
