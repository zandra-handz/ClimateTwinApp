import React  from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
  
import Avatar from "../FriendsComponents/Avatar";  
import useDateTimeFunctions from "@/src/hooks/useDateTimeFunctions";
import FriendingFunctionsButton from "./FriendingFunctionsButton"; 

const FriendListItem = ({
  user,
  avatar,
  size,
  onPress,
  // NOT USING RIGHT NOW
  // showIsFriend = false,
  // recFriendRequests,
  // sentFriendRequests,
}) => { 
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();


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
          {formatUTCToMonthDayYear(user?.created_on) || "unknown date"}.
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
        {user?.friend_profile?.most_recent_visit?.location_name || ""}{" "}
        {formatUTCToMonthDayYear(
          user?.friend_profile?.most_recent_visit?.visited_on
        ) || "No trips"}
      </Text>
    </>
  );

  
  return (
    <TouchableOpacity
      style={[
        appContainerStyles.pickerButtonContainer,
        themeStyles.darkerBackground,
        { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
      ]}
      onPress={() => onPress(user.id, user.username)} // different from userlistitem
    >
      <View style={{ paddingRight: size / 3 }}>
        <Avatar image={avatar} size={size} />
      </View>

      <View style={{flexDirection: 'column', width: 300}}>
 
      <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
        {user.username}
      </Text>
      <Text style={[themeStyles.primaryText]}>
        {findLastVisit}
      </Text>
      {/* <Text style={[themeStyles.primaryText]}>
        {findDetails}
      </Text> */}
     
      
      </View>
      {/* {showIsFriend && (
        <View style={{ position: "absolute", height: '100%', width: 110, right: 10, padding: 6 }}>
          
        <FriendingFunctionsButton cTUserId={user.id} cTUsername={user.username} size={size} recFriendRequests={recFriendRequests}
          sentFriendRequests={sentFriendRequests} />
        
        </View>
      )} */}
    </TouchableOpacity>
  );
};

export default FriendListItem;
