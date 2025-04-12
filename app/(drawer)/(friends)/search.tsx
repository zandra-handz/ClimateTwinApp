import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useRouter } from "expo-router";
import useFriends from '@/app/hooks/useFriends';

import DebouncedUserSearch from '@/app/components/DebouncedUserSearch';
import DataList from '@/app/components/Scaffolding/DataList';


const search = () => {
     const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
    const router = useRouter();
    const { userSearchResults, handleSearchUsers, handleSendFriendRequest } = useFriends();


    const handleFriendRequest = (friendObject) => {
        if (friendObject) {
          console.log("attempting to send friend request", friendObject);
          handleSendFriendRequest(friendObject.id, 'Friend request message placeholder!');
        }
      };


      useEffect(() => {
        if (userSearchResults) {
            console.log(`user search results in search screen: `, userSearchResults);
        }

      }, [userSearchResults]);
    
 
     return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={{ height: 90, paddingHorizontal: 20, width: "100%" }}>
          <DebouncedUserSearch onEnter={handleSearchUsers} />
        </View>

        <View style={appContainerStyles.innerFlexStartContainer}>
        {userSearchResults && (
            <DataList listData={userSearchResults} onCardButtonPress={handleFriendRequest} />
          )}
 
        </View>
        
              <ActionsFooter 
                onPressLeft={() => router.back()}
                labelLeft={"Back"}
                // onPressRight={() => router.push('search/')}
                // labelRight={"Search"}
                // onPressCenter={isMinimized ? handleFullScreenToggle : null}
                // labelCenter={"Groq"}
              />
      </View>
    </>
  )
}

export default search