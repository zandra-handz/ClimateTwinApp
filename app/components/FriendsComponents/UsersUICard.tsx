import { View, Text,  TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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
import { Feather } from "@expo/vector-icons";

import ActionsFooter from "../ActionsFooter";
import ComponentSpinner from "../Scaffolding/ComponentSpinner";

import useFriends from "@/app/hooks/useFriends";


// NEED TO ALSO CHECK THAT A FRIEND REQUEST ISN'T ALREADY PENDING
const UsersUICard = ({ data, onViewUserPress  }) => {
  const { showAppMessage } = useAppMessage();
  const router = useRouter();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();
  const { friends, friendRequestMutation, getPublicProfileMutation } = useFriends();
  const [ isAlreadyFriend, setIsAlreadyFriend ] = useState(false);

  const [ isDoubleCheckerVisible, setDoubleCheckerVisible ] = useState(false);

  const profile = data;
  const image = data?.avatar || null;
  const bio = data?.bio || null;


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
        {data?.most_recent_visit?.location_name || ""}{" "}
        {formatUTCToMonthDayYear(
          data?.most_recent_visit?.visited_on
        ) || "No trips"}
      </Text>
    </>
  );

  const findTotalVisits = (
    <>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsBoldText,
          themeStyles.primaryText,
        ]}
      >
        Trips taken:
      </Text>
      <Text
        style={[
          appFontStyles.itemCollectionDetailsText,
          themeStyles.primaryText,
        ]}
      >
        {" "}
        {profile?.total_visits || ""}{" "}
      </Text>
    </>
  );

    const findCreatedOn = (
      <>
        <Text
          style={[
            appFontStyles.itemCollectionDetailsBoldText,
            themeStyles.primaryText,
          ]}
        >
          Account created:
        </Text>
        <Text
          style={[
            appFontStyles.itemCollectionDetailsText,
            themeStyles.primaryText,
          ]}
        >
          {" "}
          {formatUTCToMonthDayYear(profile.created_on) || "Unknown"}
        </Text>
      </>
    );
 

  return (
    <>
   {isDoubleCheckerVisible && (
      <DoubleChecker
      isVisible={isDoubleCheckerVisible}
      toggleVisible={handleToggleDoubleChecker}
      singleQuestionText={`Add ${data?.username || ''}?`}
 
      noButtonText="Back"
      yesButtonText="Yes"
      onPress={handleAddFriend} />
    )}
     {getPublicProfileMutation.isPending && <ComponentSpinner showSpinner={true} />}
      
      <View
        style={{flex: 1}}
      >
         {profile && !getPublicProfileMutation.isPending && (
        
            <ScrollView
              contentContainerStyle={[
                appContainerStyles.innerFlexStartContainer,
              ]}
            >
              <View style={{ width: "100%", height: 170 }}>
                <Avatar image={image} size={140} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                  height: 'auto',
                  marginBottom: 10,
                
                }}
              >
                <Text
                  style={[
                    appFontStyles.profileHeaderText,
                    themeStyles.primaryText,
                  ]}
                >
                  {profile.username || 'No name'}
                </Text>
              </View> 
              {profile && (
                <> 
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
                      {profile.bio || "No bio"}
                    </Text>
                  </View>
                  <View style={{ marginVertical: 3 }}>
                    <CuteDetailBox
                      //iconOne={"heart"}
                      iconTwo={"map"}
                      message={findTotalVisits}
                    />
                  </View>
                  <View style={{ marginVertical: 3 }}>
                    <CuteDetailBox
                      iconOne={"heart"}
                      //iconTwo={"map"}
                      message={findLastVisit}
                    />
                  </View>
                  <View style={{ marginVertical: 3 }}>
                    <CuteDetailBox
                      iconOne={"heart"}
                      //iconTwo={"map"}
                      message={findCreatedOn}
                    />
                  </View>
                </>
              )} 
            </ScrollView> 
        )}
      </View>
    </>
  );
};

export default UsersUICard;
