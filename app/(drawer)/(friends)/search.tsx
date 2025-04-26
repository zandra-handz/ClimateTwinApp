import React, { useEffect } from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useRouter } from "expo-router";
import { useFriends } from "@/src/context/FriendsContext";
import { useUser } from "@/src/context/UserContext";

import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import DebouncedUserSearch from "@/app/components/DebouncedUserSearch";
import SearchResultsView from "@/app/components/FriendsComponents/SearchResultsView";
import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import useInlineComputations from "@/app/hooks/useInlineComputations";

const search = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const router = useRouter();
  const { user } = useUser();
  const {
    friends,
    userSearchResults,
    handleSearchUsers,
    handleSendFriendRequest,
    searchUsersMutation,
    
  } = useFriends();

  const { pendingRequests } = usePendingRequests();
  const {
    sortPendingFriendRequests, 
  } = useInlineComputations();

  const allFriendRequests = pendingRequests?.pending_friend_requests;
  const { recFriendRequests, sentFriendRequests } = sortPendingFriendRequests(
    allFriendRequests,
    user?.id
  );

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
        <View style={{ height: 50, width: "100%", marginVertical: 6 }}>
          <DebouncedUserSearch onEnter={handleSearchUsers} />
        </View>

        <View style={appContainerStyles.innerFlexStartContainer}>
          {searchUsersMutation.isPending && (
            <ComponentSpinner
              showSpinner={true}
              spinnerSize={30}
              spinnerType={"circle"}
            />
          )}

          {userSearchResults && !searchUsersMutation.isPending && (
            <SearchResultsView
              data={userSearchResults}
              onViewUserPress={handleViewUser}
              recFriendRequests={recFriendRequests}
              sentFriendRequests={sentFriendRequests}
            />
          )}
        </View>

        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"} 
        />
      </View>
    </>
  );
};

export default search;
