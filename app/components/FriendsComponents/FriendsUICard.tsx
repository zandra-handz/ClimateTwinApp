import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useAppMessage } from "@/src/context/AppMessageContext";
import { useRouter } from "expo-router";
import useDateTimeFunctions from "../../../src/hooks/useDateTimeFunctions";
import CuteDetailBox from "../CuteDetailBox";
import GoToItemButton from "../GoToItemButton";
import UnfriendButton from "../Scaffolding/UnfriendButton";
import DoubleChecker from "../Scaffolding/DoubleChecker";
import Avatar from "./Avatar";

import { useFriends } from "@/src/context/FriendsContext";

const FriendsUICard = ({ data, onViewFriendPress, isFullView }) => {
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { handleDeleteFriendship, deleteFriendshipMutation } = useFriends();

  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);

  const image = data?.friend_profile?.avatar || null;

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

  const handleDeleteFriend = () => {
    handleDeleteFriendship(data?.friendship);
  };

  useEffect(() => {
    if (deleteFriendshipMutation.isSuccess) {
      showAppMessage(true, null, `${data?.username} was unfriended.`);
      router.back();
    }
  }, [deleteFriendshipMutation.isSuccess]);

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
      {isDoubleCheckerVisible && (
        <DoubleChecker
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Unfriend ${data?.username || ""}?`}
          optionalText="(They won't be notified.)"
          noButtonText="Back"
          yesButtonText="Yes"
          onPress={handleDeleteFriend}
        />
      )}
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[appContainerStyles.innerFlexStartContainer]}
        >
          <View style={{ width: "100%", height: 170 }}>
            <Avatar image={image} size={140} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              height: "auto",
              marginBottom: 10,
            }}
          >
            <Text
              style={[appFontStyles.profileHeaderText, themeStyles.primaryText]}
            >
              {data.username || "No name"}
            </Text>
          </View>

          <View
            style={[
              appContainerStyles.userBioContainer,
              themeStyles.darkestBackground,
              { marginVertical: 3 },
            ]}
          >
            <Text
              style={[
                appFontStyles.itemDescriptionText,
                themeStyles.primaryText,
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Bio: </Text>
              {data?.friend_profile.bio || "No bio"}
            </Text>
          </View>

          <View style={[appContainerStyles.itemCollectionDetailsSubheader]}>
            <CuteDetailBox
              //iconOne={"heart"}
              iconTwo={"map"}
              message={findLastVisit}
            />
            <View style={{marginVertical: 8}}>
              
                    <CuteDetailBox
              iconOne={"heart"}
              //iconTwo={"map"}
              message={findDetails}
            />
            
            </View>
          </View> 
          {onViewFriendPress && (
            <>
              <GoToItemButton
                onPress={() => handlePress()}
                label={"See profile"}
              />
            </>
          )}
          {isFullView && (
            <UnfriendButton onPress={() => handleToggleDoubleChecker()} />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default FriendsUICard;
