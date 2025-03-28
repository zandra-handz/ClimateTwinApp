import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";
import CuteDetailBox from "../CuteDetailBox";
import SingleDetailPanel from "../SingleDetailPanel";
import GoToItemButton from "../GoToItemButton";
import { Image } from "expo-image";
import Avatar from "./Avatar";

import useFriends from "@/app/hooks/useFriends";

const FriendsUICard = ({ data, onViewFriendPress, isFullView }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { friends } = useFriends();

  const image = data?.friend_profile?.avatar || null;

  const renderFriendName = (id) => {
    if (friends) {
      const friend = friends.find((friend) => friend.id === id);
      return friend?.nickname || null;
    } else {
      return null;
    }
  };

  const handlePress = () => {
    if (onViewFriendPress) {
      onViewFriendPress(data.id, data.username);
    }
  };
  // Function to recursively render object fields
  const renderField = (key, value, level = 0) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <View key={key} style={{ marginLeft: level * 10 }}>
          <Text
            style={[
              themeStyles.primaryText,
              { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
            ]}
          >
            {key}:
          </Text>
          {Object.entries(value).map(([subKey, subValue]) =>
            renderField(subKey, subValue, level + 1)
          )}
        </View>
      );
    }

    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          marginVertical: 4,
          marginLeft: level * 10,
          flexWrap: "wrap",
        }}
      >
        <Text
          style={[
            themeStyles.primaryText,
            { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
          ]}
        >
          {key}:
        </Text>
        <Text
          style={[
            themeStyles.primaryText,
            { marginLeft: 8, flexWrap: "wrap", flexShrink: 1, flex: 1 },
          ]}
        >
          {value?.toString()}
        </Text>
      </View>
    );
  };

  const findDetails = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        Friends since
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {formatUTCToMonthDayYear(data?.created_on) || "unknown date"}.
      </Text>
    </>
  );

  const findLastVisit = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        Last trip:
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {data?.friend_profile?.most_recent_visit?.location_name || ""}{" "}
        {formatUTCToMonthDayYear(
          data?.friend_profile?.most_recent_visit?.visited_on
        ) || "No trips"}
      </Text>
    </>
  );

  //   const ownershipDetails = (
  //     <>
  //       <Text
  //         style={[
  //           appFontStyles.itemCollectionDetailsText,
  //           themeStyles.primaryText,
  //         ]}
  //       >
  //         This was given to you by {renderFriendName(data?.giver)} on{" "}
  //         {formatUTCToMonthDayYear(data?.owned_since) ||
  //           formatUTCToMonthDayYear(data?.created_on) ||
  //           "unknown date"}
  //         !
  //       </Text>
  //     </>
  //   );

  return (
    <>
      <View
        style={[
          themeStyles.darkerBackground,
          appContainerStyles.itemCardContainer,
          { borderColor: themeStyles.primaryBorder.color },
        ]}
      >
        <View style={appContainerStyles.friendHeaderRow}>
          <Text style={[appFontStyles.itemHeaderText, themeStyles.primaryText]}>
            {data?.username || "Friend name is missing"}
          </Text>
        </View>

        {image && ( 
            <Avatar image={image} size={100}/>
        )}
        {isFullView && (
          <View
            style={[
              appContainerStyles.itemDescriptionContainer,
              themeStyles.darkestBackground,
            ]}
          >
            <Text
              style={[
                appFontStyles.itemDescriptionText,
                themeStyles.primaryText,
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Bio: </Text>
              {data?.friend_profile?.bio || "No bio"}
            </Text>
          </View>
        )}
        {/* {isFullView && (
          
          <View
            style={[
              appContainerStyles.itemDescriptionContainer,
              themeStyles.darkestBackground,
            ]}
          >
            <Text
              style={[
                appFontStyles.itemDescriptionText,
                themeStyles.primaryText,
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Additional data: </Text>
              {data?.add_data || "None recorded"}
            </Text>
          </View>
          
        )} */}



        <View style={[appContainerStyles.itemCollectionDetailsSubheader]}>
          <CuteDetailBox
            //iconOne={"heart"}
            iconTwo={"map"}
            message={findLastVisit}
          />
        </View>
        <View style={[appContainerStyles.itemCollectionDetailsSubheader]}>
          <CuteDetailBox
            iconOne={"heart"}
            //iconTwo={"map"}
            message={findDetails}
          />
        </View>

        {onViewFriendPress && (
          <GoToItemButton onPress={() => handlePress()} label={"See profile"} />
        )}
      </View>
    </>
  );
};

export default FriendsUICard;
