import React, {  useEffect  } from "react";
import {   View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext";

import { useAppMessage } from "../../context/AppMessageContext"; 
import { StatusBar } from "expo-status-bar"; 
import DataList from "../../components/DataList"; 

import ActionsFooter from "@/app/components/ActionsFooter";
import useTreasures from "@/app/hooks/useTreasures";

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
            params: { id: id, descriptor: descriptor},
        })
    }

}



  return (
    <>
      <StatusBar
        barStyle={themeStyles.primaryBackground.backgroundColor}
        translucent={true}
        backgroundColor="transparent"
      />
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
          {viewingTreasure && (
            <DataList
              listData={[viewingTreasure]}
              onCardButtonPress={handlePress}
            />
          )}
 
        </View>
        <ActionsFooter
        onPressLeft={() => router.replace('(treasures)')}
        labelLeft={"Back"}
        onPressRight={handleGoToGiveScreen}
        labelRight={"Gift"}
      />
      </View>
    </>
  );
};

export default details;
