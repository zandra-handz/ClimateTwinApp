import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useRouter } from "expo-router";
import { useTreasures } from "@/src/context/TreasuresContext";
import { useUser } from "@/src/context/UserContext";

import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
import DebouncedSearch from "@/app/components/DebouncedSearch";

import SearchResultsView from "@/app/components/FriendsComponents/SearchResultsView";
 
import useInlineComputations from "@/src/hooks/useInlineComputations";

const search = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const router = useRouter();
  const { user } = useUser();

  const { 
    treasuresAndRequests,
    treasureSearchResults,
    handleSearchTreasures,
    handleGiftTreasure,
    searchTreasuresMutation,
    handleGetSearchableTreasure,
  } = useTreasures();
 
  const { sortPendingGiftRequests, getNonPendingTreasures } =
    useInlineComputations();
  const allGiftRequests = treasuresAndRequests?.pending_gift_requests;

  const { recGiftRequests, sentGiftRequests } = sortPendingGiftRequests(
    allGiftRequests,
    user?.id
  );
  const nonPendingTreasures = getNonPendingTreasures(treasuresAndRequests.treasures);

  //   const handleFriendRequest = (friendObject) => {
  //     if (friendObject) {
  //       handleSendFriendRequest(
  //         friendObject.id,
  //         "Friend request message placeholder!"
  //       );
  //     }
  //   };
 

  const handleViewTreasure = (id, descriptor) => {
    if (id) {

      handleGetSearchableTreasure(id);
      router.push({
        pathname: "(treasures)/searchable",
        params: { id: id, descriptor: descriptor },
      });
    }
  };

  return (
    <>
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
        ]}
      >
        <View style={{ height: 50, width: "100%", marginVertical: 6 }}>
          <DebouncedSearch
            onEnter={handleSearchTreasures}
            placeholder={`Search treasures`}
          />
        </View>

        <View style={appContainerStyles.innerFlexStartContainer}>
          {searchTreasuresMutation.isPending && (
            <ComponentSpinner
              showSpinner={true}
              spinnerSize={30}
              spinnerType={"circle"}
            />
          )}

          {treasureSearchResults && !searchTreasuresMutation.isPending && (
            <SearchResultsView
              data={treasureSearchResults}
              onViewResultPress={handleViewTreasure}
              recRequests={recGiftRequests}
              sentRequests={sentGiftRequests}
              friendsOrTreasures={"treasures"}
            />
          )}
        </View>

        <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
      </View>
    </>
  );
};

export default search;
