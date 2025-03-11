import { View, FlatList } from "react-native";
import NearbyUICard from "./NearbyUICard";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import RuinsHarmonyView from "../SurroundingsComponents/RuinsHarmonyView";
import WindFriendsView from "../SurroundingsComponents/WindFriendsView";
import NearbyRuinUICard from "./NearbyRuinUICard";
import NearbyPortalUICard from "./NearbyPortalUICard";
 
const NearbyView = ({
  listData,
  onCardButtonPress,
  onOpenButtonPress,
  onOpenTreasurePress,
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
            {item.explore_type === "twin_location" && (
              <NearbyPortalUICard
              data={item}
              name={item.name}
              description={item.description}
              windSpeed={item.wind_speed}
              windDirection={item.wind_direction}
              windFriends={item.wind_friends}
              homeDescription={item.home_location.description}
              homeWindSpeed={item.home_location.wind_speed}
              homeWindDirection={item.home_location.wind_direction}
              onPress={onCardButtonPress}
              />

              // <NearbyUICard
              //   data={item}
              //   onPress={onCardButtonPress}
              //   onOpenPress={onOpenButtonPress}
              //   onOpenTreasurePress={onOpenTreasurePress}
              // />
            )}
              {item.explore_type === "discovery_location" && (
                <>
                <NearbyRuinUICard
                data={item}
                name={item.name}
                windCompass={item.wind_compass}
                tags={item.tags}
                milesAway={item.miles_away}
                direction={item.direction}
                directionDegree={item.direction_degree}
                windHarmony={item.wind_harmony}
                onPress={onCardButtonPress}
                image={item.street_view_image}
                />
              {/* <NearbyUICard
                data={item}
                onPress={onCardButtonPress}
                onOpenPress={onOpenButtonPress}
                onOpenTreasurePress={onOpenTreasurePress}
              /> */}
              
                </>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default NearbyView;
