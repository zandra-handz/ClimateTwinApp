import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext";

import { useAppMessage } from "../../context/AppMessageContext";
import { StatusBar } from "expo-status-bar";
import DataList from "../../components/Scaffolding/DataList";

import ActionsFooter from "@/app/components/ActionsFooter";
import useTreasures from "@/app/hooks/useTreasures";
import TreasuresUICard from "@/app/components/TreasuresComponents/TreasuresUICard";

const details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const router = useRouter();
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { showAppMessage } = useAppMessage();
  const { treasures, handleGetTreasure, viewingTreasure } = useTreasures();

  const fetchTreasure = async (id) => {
    await handleGetTreasure(id);
  };

  useEffect(() => {
    if (id) {
      fetchTreasure(id);
    }
  }, [id]);

  const handlePress = () => {
    console.log(`Treasure ${id}  pressed!`);
  };

  const handleGoToGiveScreen = () => {
    if (id) {
      router.push({
        pathname: "give",
        params: { id: id, descriptor: descriptor },
      });
    }
  };

  return (
    <>
      {/* <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      /> */}
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <ScrollView>
          {viewingTreasure && (
            <TreasuresUICard data={viewingTreasure} isFullView={true} />
          )}
        </ScrollView>
        <ActionsFooter
          onPressLeft={() => router.back()}
          labelLeft={"Back"}
          onPressRight={handleGoToGiveScreen}
          labelRight={"Gift"}
        />
      </View>
    </>
  );
};

export default details;
