import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useRouter } from "expo-router";
import { useAppMessage } from "../../context/AppMessageContext";
import useFriends from "../../hooks/useFriends";

import FriendsView from "@/app/components/FriendsComponents/FriendsView";
import GoToItemButton from "@/app/components/GoToItemButton";
import ActionsFooter from "@/app/components/ActionsFooter";

import useProfile from "@/app/hooks/useProfile";


import DataList from "../../components/Scaffolding/DataList";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
const index = () => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { friends, handleGetAllUsers, allUsers, handleSendFriendRequest } = useFriends();
  const router = useRouter();
  const { profile } = useProfile();

  const handlePress = () => {
    console.log("User profile handlePress pressed!");
  };


 
 

 

  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
 
        <View style={appContainerStyles.innerFlexStartContainer}>

          {profile && (
            <DataList listData={[profile]} onCardButtonPress={handlePress} />
          )}

        </View>
              <ActionsFooter
                height={66}
                onPressLeft={() => router.back()}
                labelLeft={"Back"}
                onPressRight={() => console.log('implement edit screen eventually')}
                labelRight={"Edit"}
                // onPressCenter={isMinimized ? handleFullScreenToggle : null}
                // labelCenter={"Groq"}
              />
      </View>
    </>
  );
};

export default index;
