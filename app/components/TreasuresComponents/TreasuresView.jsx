import { View, FlatList, Text } from "react-native";
import TreasuresUICard from "./TreasuresUICard";
import React, { useEffect } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import TreasureListItem from "./TreasureListItem";
import TreasureRequestListItem from "./TreasureRequestListItem";
import { useFriends } from "@/src/context/FriendsContext";
import { useUser } from "@/src/context/UserContext";

const TreasuresView = ({
  listData,
  onOpenTreasurePress,
  recGiftRequests,
  sentGiftRequests,
}) => {
  const { user } = useUser();
  const { giftRequests, giftRequestsReceived, giftRequestsSent } = useFriends();
  const { appContainerStyles, themeStyles } = useGlobalStyles();

  // useEffect(() => {
  //   if (giftRequests && giftRequestsSent) {
  //     console.log(`GIFT REQUESTS: `, giftRequestsSent);
  //   }
  // }, [giftRequests, giftRequestsSent]);

  return (
    <View style={[appContainerStyles.dataListContainer]}>
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
                <TreasureRequestListItem
                  treasure={item.treasure_data}
                  treasureId={item.treasure_data.id}
                  isSender={false}
                  avatar={item.sender_avatar}
                  size={40}
                  message={item.message}
                  onPress={onOpenTreasurePress}
                  recGiftRequests={recGiftRequests}
                  sentGiftRequests={sentGiftRequests}
                />
              )}
            {item.special_type && item.sender && item.sender === user?.id && (
              <TreasureRequestListItem
                treasure={item.treasure_data}
                treasureId={item.treasure_data.id}
                isSender={true}
                avatar={item.recipient_avatar}
                size={40}
                message={item.message}
                onPress={onOpenTreasurePress}
                recGiftRequests={recGiftRequests}
                sentGiftRequests={sentGiftRequests}
              />
            )}
            {!item.special_type && (
              <TreasureListItem
                treasure={item}
                size={40}
                onPress={onOpenTreasurePress}
                recGiftRequests={recGiftRequests}
                sentGiftRequests={sentGiftRequests}
              />
            )}
            {/* <TreasuresUICard
              data={item}
              onOpenTreasurePress={onOpenTreasurePress}
            /> */}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default TreasuresView;
