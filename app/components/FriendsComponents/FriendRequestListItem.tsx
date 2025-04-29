import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext"; 
import Avatar from "../FriendsComponents/Avatar";
import useDateTimeFunctions from "@/src/hooks/useDateTimeFunctions";
import FriendingFunctionsButton from "./FriendingFunctionsButton"; 
import DoubleCheckerWithMessageDisplay from "../Scaffolding/DoubleCheckerWithMessageDisplay";
import { AntDesign, Feather } from "@expo/vector-icons";
const FriendRequestListItem = ({
  userId,
  username,
  avatar,
  size,
  onPress,
  message,
  isSender = false,
  recFriendRequests,
  sentFriendRequests,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleCheckerWithMessageDisplay
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Message from ${username || ""}: `}
          noButtonText="Close"
          message={message}
        />
      )}
      <TouchableOpacity
        style={[
          appContainerStyles.pickerButtonContainer,
          themeStyles.darkerBackground,
          { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
        ]}
        onPress={() => onPress(userId, username)} // different from userlistitem
      >
        <View style={{ paddingRight: size / 3 }}>
          <Avatar image={avatar} size={size} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: 'space-between' , width: '50%'}}>
          <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
            {username}
          </Text>
          {!isSender && (
            
          <TouchableOpacity
          onPress={handleToggleDoubleChecker}
          style={{
            // position: "absolute",
            marginLeft: 20,
            height: "100%",
            width: 60,
            // left: 140,
            // padding: 6,
            // alignItems: "center",
            // justifyContent: "center",
           // backgroundColor: "orange",
          }}
        >
          <Feather
            name="message-circle"
            size={appFontStyles.exploreTabBarIcon.width}
            color={themeStyles.exploreTabBarText.color}
          />
        </TouchableOpacity>
        
      )}
        </View>

        {/* <TouchableOpacity
          onPress={handleToggleDoubleChecker}
          style={{
            position: "absolute",
            height: "100%",
            width: 60,
            left: 140,
            padding: 6,
            alignItems: "center",
            justifyContent: "center",
           // backgroundColor: "orange",
          }}
        >
          <Feather
            name="message-circle"
            size={appFontStyles.exploreTabBarIcon.width}
            color={themeStyles.exploreTabBarText.color}
          />
        </TouchableOpacity> */}

        <View
          style={{
            position: "absolute",
            height: "100%",
            width: 110,
            right: 10,
            padding: 6,
          }}
        >
          <FriendingFunctionsButton
            cTUserId={userId}
            cTUsername={username}
            size={size}
            recFriendRequests={recFriendRequests}
            sentFriendRequests={sentFriendRequests}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default FriendRequestListItem;
