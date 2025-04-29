import React, { useLayoutEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext";
import FriendPicker from "@/app/components/FriendPicker";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useTreasures } from "@/src/context/TreasuresContext";
import TreasuresUICard from "@/app/components/TreasuresComponents/TreasuresUICard";

import ReturnItemButton from "@/app/components/Scaffolding/ReturnItemButton";
import HistoryButton from "@/app/components/Scaffolding/HistoryButton";
import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";
import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";

import useInlineComputations from "@/src/hooks/useInlineComputations";
import { usePendingRequests } from "@/src/context/PendingRequestsContext";
import { useUser } from "@/src/context/UserContext";
import GiftingFunctionsButton from "@/app/components/TreasuresComponents/GiftingFunctionsButton";

interface Friend {
  id: number;
  username: string;
}

const details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const { user } = useUser();
  const router = useRouter();
  const { friends } = useFriends();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const {
    handleGiftTreasureBackToFinder,
    setViewingTreasure,
    viewingTreasure,
    getTreasureMutation,
  } = useTreasures();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);

  const { pendingRequests } = usePendingRequests();
  const { sortPendingGiftRequests, getNonPendingTreasures } =
    useInlineComputations();
  const allGiftRequests = pendingRequests?.pending_gift_requests;

  const { recGiftRequests, sentGiftRequests } = sortPendingGiftRequests(
    allGiftRequests,
    user?.id
  );

  // const [selectedFriendProfile, setSelectedFriendProfile] =
  //   useState<Friend | null>(null);

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

  useLayoutEffect(() => {
    if (id) {
      console.log("moved this to the navigation button");
      //  handleGetFriend(id);
    }

    // Cleanup the data when leaving the screen
    return () => {
      console.log("setting viewingtreasure to null");
      setViewingTreasure(null); // Reset viewingFriend when navigating away
    };
  }, [id]);

  const openFriendPicker = () => {
    setIsListVisible(true);
  };

  const closeFriendPicker = () => {
    setIsListVisible(false);
  };

  const handleGiftTreasureBack = () => {
    handleGiftTreasureBackToFinder(data?.id);
    handleToggleDoubleChecker();
    router.back();
  };

  const handleDeleteTreasure = () => {
    console.log(`handleDeleteTreasure function has yet to be written`);
  };

  const handleViewTreasureHistory = () => {
    console.log("handleViewTreasureHistory pressed");
    if (id) {
      router.push({
        pathname: "(treasures)/history",
        params: { id: id, descriptor: descriptor },
      });
    }
  };

  const handleFriendSelect = (selectedValue: Friend) => {
    handleGoToGiveScreen(selectedValue.friend);
    // setSelectedFriendProfile(selectedValue);
  };

  const handleGoToGiveScreen = (friendId) => {
    if (id) {
      router.push({
        pathname: "/give",
        params: { id: id, descriptor: descriptor, friendId: friendId },
      });
    }
  };

  return (
    <>
      {isDoubleCheckerVisible && (
        <DoubleChecker
          isVisible={isDoubleCheckerVisible}
          toggleVisible={handleToggleDoubleChecker}
          singleQuestionText={`Send ${
            viewingTreasure?.descriptor || ""
          } back to original finder :)?`}
          optionalText="(They can accept or decline.)"
          noButtonText="Back"
          yesButtonText="Yes"
          onPress={handleGiftTreasureBack}
        />
      )}

      {getTreasureMutation.isPending && (
        <ComponentSpinner
          showSpinner={true}
          backgroundColor={themeStyles.primaryBackground.backgroundColor}
          spinnerType={"circle"}
          offsetStatusBarHeight={true}
        />
      )}

      {viewingTreasure && !getTreasureMutation.isPending && (
        <View
          style={[
            appContainerStyles.screenContainer,
            themeStyles.primaryBackground,
            { paddingTop: 10 },
          ]}
        >
          <View style={[appContainerStyles.nextToNextToPickerContainer]}>
            <HistoryButton
              onPress={() => handleViewTreasureHistory()}
              backgroundColor={themeStyles.darkerBackground.backgroundColor}
            />
          </View>
          <View style={[appContainerStyles.nextToPickerContainer]}>
            <ReturnItemButton
              onPress={() => handleToggleDoubleChecker()}
              backgroundColor={themeStyles.darkerBackground.backgroundColor}
            />
          </View>

          <ScrollView
            nestedScrollEnabled={true}
            pointerEvents={isListVisible ? "none" : "auto"}
          >
            <View
              style={{
                position: "absolute",
                width: 110,
                height: 60,
                right: 10,
                top: 10,
                zIndex: 1000,
              }}
            >
              <GiftingFunctionsButton
                cTUserId={user?.id}
                cTUsername={user?.username}
                treasureId={viewingTreasure.id}
                treasureName={viewingTreasure.descriptor}
               // size={size}
                recGiftRequests={recGiftRequests}
                sentGiftRequests={sentGiftRequests}
              />
            </View>
            <TreasuresUICard
              data={viewingTreasure}
              isFullView={true}
              recGiftRequests={recGiftRequests}
              sentGiftRequests={sentGiftRequests}
            />
          </ScrollView>
          <FriendPicker
            items={friends}
            onSelect={handleFriendSelect}
            isVisible={isListVisible}
            open={openFriendPicker}
            close={closeFriendPicker}
          />
          <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
        </View>
      )}
    </>
  );
};

export default details;
