import React , { useEffect } from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useRouter } from "expo-router"; 
import { useFriends } from "@/src/context/FriendsContext";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import DebouncedUserSearch from "@/app/components/DebouncedUserSearch";
import SearchResultsView from "@/app/components/FriendsComponents/SearchResultsView";
import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";
 

const search = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const router = useRouter();
  const { userSearchResults, handleSearchUsers, handleSendFriendRequest, searchUsersMutation } =
    useFriends();

  const handleFriendRequest = (friendObject) => {
    if (friendObject) {
      handleSendFriendRequest(
        friendObject.id,
        "Friend request message placeholder!"
      );
    }
  };

  const handleViewUser = (user) => {
    if (user.id) {
      router.push({
        pathname: "(friends)/user",
        params: { id: user.id, username: user.username },
      });
    }
  };

  // useEffect(() => {
  //   if search

  // }, [searchUsersMutation.isPending]);

  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        
        ]}
      >
        <View style={{ height: 50,  width: "100%", marginVertical: 6 }}>
          <DebouncedUserSearch onEnter={handleSearchUsers} />
        </View>

        <View style={appContainerStyles.innerFlexStartContainer}>
          {searchUsersMutation.isPending && (
            <ComponentSpinner showSpinner={true} spinnerSize={30} spinnerType={'circle'}/>
          )}

          {userSearchResults && !searchUsersMutation.isPending && (
            <SearchResultsView
              data={userSearchResults}
              onViewUserPress={handleViewUser}
            />
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
  );
};

export default search;
