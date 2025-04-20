import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import useFriends from "@/app/hooks/useFriends";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
import UsersUICard from "@/app/components/FriendsComponents/UsersUICard";
import { useAppMessage } from "../../../src/context/AppMessageContext";
import ActionsFooter from "@/app/components/ActionsFooter";
 

const userdetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter();
  const { themeStyles, appContainerStyles } = useGlobalStyles();  
const { handleGetPublicProfile, getPublicProfileMutation, viewingPublicProfile } = useFriends();

const [ userProfileData, setUserProfileData ] = useState(null);

 
  const handleGoToGiveScreen = () => {
    console.log("removed");
  };


  useEffect(() => {
    if (id) {
      handleGetPublicProfile(id);
    }

  }, [id]);

  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      > 
          {viewingPublicProfile && (
            <UsersUICard data={viewingPublicProfile} isFullView={true} />
          )} 
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={handleGoToGiveScreen}
          labelRight={"Gift"}
        />
      </View>
    </>
  );
};

export default userdetails;
