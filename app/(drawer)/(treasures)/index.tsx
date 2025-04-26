import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";
import useTreasures from "../../hooks/useTreasures";
import TreasuresView from "../../components/TreasuresComponents/TreasuresView";
import ActionsFooter from "@/app/components/ActionsFooter";
import NothingHere from "@/app/components/Scaffolding/NothingHere";
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import useInlineComputations from "@/app/hooks/useInlineComputations";
import { useUser } from "@/src/context/UserContext";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { treasures, nonPendingTreasures } = useTreasures();
  const { user } = useUser();

  const { pendingRequests } = usePendingRequests();
   const { sortPendingGiftRequests, checkForTreasureOwnership, otherUserRecGiftRequest,
    otherUserSentGiftRequest  } = useInlineComputations();
   const allGiftRequests = pendingRequests?.pending_gift_requests;

   const { recGiftRequests, sentGiftRequests } = sortPendingGiftRequests(allGiftRequests, user?.id);
  
    
  const router = useRouter();

  const handlePress = () => {
    console.log("Treasure item pressed!");
  };

  const handleViewTreasure = (id, descriptor) => {
    if (id) {
      router.push({
        pathname: "(treasures)/[id]",
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
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {((nonPendingTreasures && nonPendingTreasures?.length > 0) ||
            (allGiftRequests && allGiftRequests?.length > 0)) && (
            <TreasuresView
              listData={[
                ...( recGiftRequests ?? []),
                ...(sentGiftRequests ?? []),
                ...(nonPendingTreasures ?? []),
              ]}
              onCardButtonPress={handlePress}
              onOpenTreasurePress={handleViewTreasure}
              recGiftRequests={recGiftRequests}
              sentGiftRequests={sentGiftRequests}
            />
          )}
          {treasures && !treasures.length && !allGiftRequests?.length && (
            <NothingHere
              message={"No friends yet!"}
              subMessage={"search users to find friends!"}
              offsetStatusBarHeight={true}
            />
          )}
        </View>
        <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
      </View>
    </>
  );
};

export default index;
