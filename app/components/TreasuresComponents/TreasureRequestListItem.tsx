import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";
import Avatar from "../FriendsComponents/Avatar";
import useDateTimeFunctions from "@/app/hooks/useDateTimeFunctions";
import GiftingFunctionsButton from "./GiftingFunctionsButton";  
import DoubleCheckerWithMessageDisplay from "../Scaffolding/DoubleCheckerWithMessageDisplay";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";


const TreasureRequestListItem = ({
  treasure,
  treasureId,
  username,
  avatar,
  size,
  onPress,
  message,
  isSender = false,
  senderName,
  recGiftRequests,
  sentGiftRequests,
}) => {
  const { user } = useUser();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };
// useEffect(() => {
//   if (treasure) {
//     console.log(treasure);
//   }

// }, [treasure]);
  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleCheckerWithMessageDisplay
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Message from ${username || ""}: `}
          noButtonText="Close"
          message={treasure.message}
        />
      )}
      <TouchableOpacity
        style={[
          appContainerStyles.pickerButtonContainer,
          themeStyles.darkerBackground,
          { borderColor: themeStyles.primaryText.color, height: size * 1.8 },
        ]}
        onPress={() => onPress(treasureId, treasure.descriptor)} // configured for treasure ID and descriptor
      >
        <View style={{ paddingRight: size / 3 }}>
          <Avatar image={avatar} size={size} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: 'space-between' , width: '50%'}}>
          <Text style={[themeStyles.primaryText, appFontStyles.dCButtonText]}>
            {treasure.descriptor}
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
          <GiftingFunctionsButton
             cTUserId={user?.id}

            cTUsername={username}
            treasureId={treasureId}
            treasureName={treasure.descriptor}
            size={size}
            recGiftRequests={recGiftRequests}
            sentGiftRequests={sentGiftRequests}
          />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default TreasureRequestListItem;
