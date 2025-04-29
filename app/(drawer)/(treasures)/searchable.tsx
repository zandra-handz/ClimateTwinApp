import React, { useEffect, useLayoutEffect } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import ActionsFooter from "@/app/components/ActionsFooter";
import { useTreasures } from "@/src/context/TreasuresContext";
import TreasuresUICard from "@/app/components/TreasuresComponents/TreasuresUICard";
import { useUser } from "@/src/context/UserContext";

import ComponentSpinner from "@/app/components/Scaffolding/ComponentSpinner";
// This accesses friends and checks for friendships so that i can move it if needed or
// or link from multiple places

const searchable = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { descriptor } = useLocalSearchParams<{ descriptor: string | null }>();
  const { user } = useUser();
  const router = useRouter();
  const {
    setViewingSearchableTreasure,
    viewingSearchableTreasure,
    searchableTreasureMutation,
  } = useTreasures();
  const { themeStyles, appContainerStyles } = useGlobalStyles();

  useLayoutEffect(() => {
    if (id) {
      console.log("moved this to the navigation button");
      //  handleGetFriend(id);
    }

    // Cleanup the data when leaving the screen
    return () => {
      console.log("setting viewingsearchabletreasure to null");
      setViewingSearchableTreasure(null); // Reset viewingFriend when navigating away
    };
  }, [id]);
  return (
    <>
      {searchableTreasureMutation.isPending && (
        <ComponentSpinner
          showSpinner={true}
          backgroundColor={themeStyles.primaryBackground.backgroundColor}
          spinnerType={"circle"}
          offsetStatusBarHeight={true}
        />
      )}

      {viewingSearchableTreasure && !searchableTreasureMutation.isPending && (
        <View
          style={[
            appContainerStyles.screenContainer,
            themeStyles.primaryBackground,
            { paddingTop: 10 },
          ]}
        >
          <ScrollView>
            <TreasuresUICard
              data={viewingSearchableTreasure}
              isFullView={true}
            />
          </ScrollView>
          <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
        </View>
      )}
    </>
  );
};

export default searchable;
