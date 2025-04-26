import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import { useFriends } from "@/src/context/FriendsContext"; 
import FriendPicker from "@/app/components/FriendPicker";
import ActionsFooter from "@/app/components/ActionsFooter";
import useTreasures from "@/app/hooks/useTreasures";
import TreasuresUICard from "@/app/components/TreasuresComponents/TreasuresUICard";
 

import ReturnItemButton from "@/app/components/Scaffolding/ReturnItemButton";
import HistoryButton from "@/app/components/Scaffolding/HistoryButton";
import DoubleChecker from "@/app/components/Scaffolding/DoubleChecker";

interface Friend {
  id: number;
  username: string;
}

const details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const router = useRouter();
  const { friends  } = useFriends();
  const { themeStyles, appContainerStyles } = useGlobalStyles(); 
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const { 
    handleGetTreasure, 
    handleGiftTreasureBackToFinder,

    viewingTreasure,
  } = useTreasures();
  const [isDoubleCheckerVisible, setDoubleCheckerVisible] = useState(false);

  const [selectedFriendProfile, setSelectedFriendProfile] =
    useState<Friend | null>(null);

  const handleToggleDoubleChecker = () => {
    setDoubleCheckerVisible((prev) => !prev);
  };

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
    setSelectedFriendProfile(selectedValue);
  };
  const fetchTreasure = async (id) => {
    await handleGetTreasure(id);
  };

  useEffect(() => {
    if (id) {
      fetchTreasure(id);
    }
  }, [id]);

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
          {viewingTreasure && (
            <TreasuresUICard data={viewingTreasure} isFullView={true} />
          )}
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
    </>
  );
};

export default details;
