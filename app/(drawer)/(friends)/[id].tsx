import React, { Component, useEffect, useLayoutEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";

import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import ActionsFooter from "@/app/components/ActionsFooter";

const details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { handleGetFriend, getFriendMutation, viewingFriend, setViewingFriend } = useFriends();

  useLayoutEffect(() => {
    if (id) {
      console.log('moved this to the navigation button');
    //  handleGetFriend(id);
    }

    // Cleanup the data when leaving the screen
    return () => {
      console.log('setting viewingfriend to null');
      setViewingFriend(null); // Reset viewingFriend when navigating away
    };
  }, [id]);

  // useEffect(() => {
  //   if (viewingFriend) {
  //     console.log(viewingFriend);
  //   }

  // }, [viewingFriend]);

  const handleGoToGiveScreen = () => {
    console.log("removed");
  };

  return (
    <>
      {getFriendMutation.isPending && (
        <ComponentSpinner
          showSpinner={true}
          backgroundColor={themeStyles.primaryBackground.backgroundColor}
          spinnerType={'circle'}
          offsetStatusBarHeight={true}
        />
      )}

      {viewingFriend && !getFriendMutation.isPending && (
        <View
          style={[
            appContainerStyles.screenContainer,
            themeStyles.primaryBackground,
            { paddingTop: 10 },
          ]}
        >
          <ScrollView> 
              <FriendsUICard data={viewingFriend} isFullView={true} />
      
          </ScrollView>
          <ActionsFooter
            onPressLeft={() => router.back()}
            labelLeft={"Back"}
            // onPressRight={handleGoToGiveScreen}
            // labelRight={"Gift"}
          />
        </View>
      )}
    </>
  );
};

export default details;
