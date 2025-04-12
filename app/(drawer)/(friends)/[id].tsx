import React, {  useEffect  } from "react";
import {   View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import useFriends from "@/app/hooks/useFriends";
import FriendsUICard from "@/app/components/FriendsComponents/FriendsUICard";

import { useAppMessage } from "../../../src/context/AppMessageContext";  
import DataList from "../../components/Scaffolding/DataList"; 

import ActionsFooter from "@/app/components/ActionsFooter";  
 
    
const details = () => {
    const { id } = useLocalSearchParams<{ id: string }>(); 
    const { friendName } = useLocalSearchParams<{ friendName: string | null }>();  
  const router = useRouter();
    const { themeStyles, appContainerStyles } = useGlobalStyles();
    const { showAppMessage } = useAppMessage();  
  const { friends, handleGetFriend, viewingFriend } = useFriends();
   
  
    const fetchFriend = async (id) => {
      await handleGetFriend(id);
    };
  
    useEffect(() => {
      if (id) {
        fetchFriend(id);
      }
    }, [id]);
  
    const handlePress = () => {
      console.log(`Treasure ${id}  pressed!`);
    };
  
    const handleGoToGiveScreen = () => {
     console.log('removed');
  
  }
  
  
  
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
          onPressRight={handleGoToGiveScreen}
          labelRight={"Gift"}
        />
        </View>
      </>
    );
  };
  
  export default details;
  