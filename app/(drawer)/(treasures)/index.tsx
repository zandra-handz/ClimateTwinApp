import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import { useTreasures } from "@/src/context/TreasuresContext";
import TreasuresView from "../../components/TreasuresComponents/TreasuresView";
import ActionsFooter from "@/app/components/ActionsFooter";
import NothingHere from "@/app/components/Scaffolding/NothingHere"; 
import useInlineComputations from "@/src/hooks/useInlineComputations";
import { useUser } from "@/src/context/UserContext";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { treasuresAndRequests,  handleGetTreasure  } = useTreasures();
  const { user } = useUser(); 
  const { sortPendingGiftRequests, getNonPendingTreasures } =
    useInlineComputations();
  const allGiftRequests = treasuresAndRequests?.pending_gift_requests;

  const { recGiftRequests, sentGiftRequests } = sortPendingGiftRequests(
    allGiftRequests,
    user?.id
  );
  const nonPendingTreasures = getNonPendingTreasures(treasuresAndRequests?.treasures);

  const router = useRouter();

  const handlePress = () => {
    console.log("Treasure item pressed!");
  };

  const handleViewTreasure = (id, descriptor) => {
    if (id) {
      handleGetTreasure(id);
      router.push({
        pathname: "/(drawer)/(treasures)/[id]",
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
                ...(recGiftRequests ?? []),
                ...(sentGiftRequests ?? []),
                ...(nonPendingTreasures ?? []),
              ]}
              onCardButtonPress={handlePress}
              onOpenTreasurePress={handleViewTreasure}
              recGiftRequests={recGiftRequests}
              sentGiftRequests={sentGiftRequests}
            />
          )}
          {treasuresAndRequests?.treasures && !treasuresAndRequests?.treasures?.length && !allGiftRequests?.length && (
            <NothingHere
              message={"No treasures yet!"}
              subMessage={"Start opening portals and exploring to collect treasures!"}
              offsetStatusBarHeight={true}
            />
          )}
        </View>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={() => router.push("/search")}
          labelRight={"Search treasures"}
        />
      </View>
    </>
  );
};

export default index;
