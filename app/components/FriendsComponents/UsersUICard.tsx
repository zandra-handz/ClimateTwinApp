import { View, Text } from "react-native";
import React, { useEffect, useState} from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useAppMessage } from "@/src/context/AppMessageContext";
import { useRouter } from "expo-router";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";
import CuteDetailBox from "../CuteDetailBox"; 
import GoToItemButton from "../GoToItemButton";  
import UnfriendButton from "../Scaffolding/UnfriendButton";
import AddFriendButton from "../Scaffolding/AddFriendButton";
import DoubleChecker from "../Scaffolding/DoubleChecker";
import Avatar from "./Avatar";

import useFriends from "@/app/hooks/useFriends";


// NEED TO ALSO CHECK THAT A FRIEND REQUEST ISN'T ALREADY PENDING
const UsersUICard = ({ data, onViewUserPress, isFullView }) => {
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { friends, friendRequestMutation } = useFriends();
  const [ isAlreadyFriend, setIsAlreadyFriend ] = useState(false);

  const [ isDoubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);

  const image = data?.profile?.avatar || null;


  useEffect(() => {
    if (data && friends) {
      const checkForFriendship = friends?.find((friend) => (friend.friend === data.id));
 
      setIsAlreadyFriend(!!checkForFriendship);
    }

  }, [data, friends]); 

const handleToggleDoubleChecker = () => {
  setDoubleCheckerVisible(prev => !prev);

};



 const handleAddFriend = () => {
  onViewUserPress(data);
  handleToggleDoubleChecker();
  //handleDeleteFriendship(data?.friendship); 

 };


 // Not working?
 useEffect(() => {
  if (friendRequestMutation.isSuccess) {
    showAppMessage(true, null, `Friend request has been sent to ${data?.username}!`);
    router.back();
  }

 }, [friendRequestMutation.isSuccess]);

 // Not working?
 useEffect(() => {
  if (friendRequestMutation.isError) {
    showAppMessage(true, null, `Oops! Did you already send a friend request to ${data?.username}?`);
    router.back();
  }

 }, [friendRequestMutation.isError]);

  const handlePress = () => {
    if (onViewUserPress) {
      onViewUserPress(data.id, data.username);
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

//   const findDetails = (
//     <>
//       <Text
//         style={[
//           appFontStyles.itemCollectionDetailsText,
//           themeStyles.primaryText,
//         ]}
//       >
//         Friends since
//       </Text>
//       <Text
//         style={[
//           appFontStyles.itemCollectionDetailsText,
//           themeStyles.primaryText,
//         ]}
//       >
//         {" "}
//         {formatUTCToMonthDayYear(data?.created_on) || "unknown date"}.
//       </Text>
//     </>
//   );

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
        {data?.profile?.most_recent_visit?.location_name || ""}{" "}
        {formatUTCToMonthDayYear(
          data?.profile?.most_recent_visit?.visited_on
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
      singleQuestionText={`Add ${data?.username || ''}?`}

     // optionalText=""
      noButtonText="Back"
      yesButtonText="Yes"
      onPress={handleAddFriend} />
    )}
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


        <View style={[appContainerStyles.itemCollectionDetailsSubheader]}>
          <CuteDetailBox
            //iconOne={"heart"}
            iconTwo={"map"}
            message={findLastVisit}
          />
        </View> 

        {!isFullView && (
          <>
          <GoToItemButton onPress={() => handlePress()} label={"See profile"} />
         
          </>
        )}
        {/* {isFullView && ( */} 
            {data && (
              
         <AddFriendButton isAlreadyFriend={isAlreadyFriend} onPress={() => handleToggleDoubleChecker()}  />
        
        )}
        {/* )} */}
      </View>
    </>
  );
};

export default UsersUICard;
