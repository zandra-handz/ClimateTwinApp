import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useFriends from "@/app/hooks/useFriends";
import { useAppMessage } from "../../context/AppMessageContext";
import { StatusBar } from "expo-status-bar";
import DataList from "../../components/Scaffolding/DataList";
import Picker from "@/app/components/Picker";
import ActionsFooter from "@/app/components/ActionsFooter";
import useTreasures from "@/app/hooks/useTreasures";
import TreasuresUICard from "@/app/components/TreasuresComponents/TreasuresUICard";


interface Friend {
  id: number;
  username: string;
}

const details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const router = useRouter();
  const { friends, friendsDropDown } = useFriends();  
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { treasures, handleGetTreasure, viewingTreasure } = useTreasures();


   const [selectedFriendProfile, setSelectedFriendProfile] = useState<Friend | null>(null);

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
        pathname: "give",
        params: { id: id, descriptor: descriptor, friendId: friendId },
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
                    <Picker
                      items={friends} // Passing label/value pairs (friendsDropDown)
                      onSelect={handleFriendSelect} // Handling the selection
                    />
        <ScrollView>
          {viewingTreasure && (
            <TreasuresUICard data={viewingTreasure} isFullView={true} />
          )}
        </ScrollView>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"} 
        />
      </View>
    </>
  );
};

export default details;
