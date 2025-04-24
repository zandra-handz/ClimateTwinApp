import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useFriends } from "@/src/context/FriendsContext";
import useTreasures from "../../hooks/useTreasures";
import TreasuresView from "../../components/TreasuresComponents/TreasuresView";
import ActionsFooter from "@/app/components/ActionsFooter";
import NothingHere from "@/app/components/Scaffolding/NothingHere";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { treasures, nonPendingTreasures } = useTreasures();
  const { friends, giftRequests, giftRequestsReceived, giftRequestsSent } =
    useFriends();
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
            (giftRequests && giftRequests?.length > 0)) && (
            <TreasuresView
              listData={[
                ...(giftRequestsReceived ?? []),
                ...(giftRequestsSent ?? []),
                ...(nonPendingTreasures ?? []),
              ]}
              onCardButtonPress={handlePress}
              onOpenTreasurePress={handleViewTreasure}
            />
          )}
          {treasures && !treasures.length && !giftRequests?.length && (
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
