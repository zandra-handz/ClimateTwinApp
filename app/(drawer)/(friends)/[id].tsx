import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";
 
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";
 
import ActionsFooter from "@/app/components/ActionsFooter";

const details = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter();
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const {   handleGetFriend, viewingFriend } = useFriends();

  const fetchFriend = async (id) => {
    await handleGetFriend(id);
  };

  useEffect(() => {
    if (id) {
      fetchFriend(id);
    }
  }, [id]);
 

  const handleGoToGiveScreen = () => {
    console.log("removed");
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
        <ScrollView>
          {viewingFriend && (
            <FriendsUICard data={viewingFriend} isFullView={true} />
          )}
        </ScrollView>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          // onPressRight={handleGoToGiveScreen}
          // labelRight={"Gift"}
        />
      </View>
    </>
  );
};

export default details;
