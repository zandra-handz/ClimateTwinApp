import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import HistoryView from "@/app/components/HistoryComponents/HistoryView";
 
import { useActiveSearch } from "@/src/context/ActiveSearchContext";
import ActionsFooter from "@/app/components/ActionsFooter";
import { useRouter } from "expo-router";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { history } = useActiveSearch();
  const router = useRouter();
 // const { history } = useHistory();
  const handlePress = () => {
    console.log("History handlePress pressed!");
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
          {history && (
            <HistoryView data={history} onCardButtonPress={handlePress} />
          )}
        </View>
        <ActionsFooter onPressLeft={() => router.back()} labelLeft={"Back"} />
      </View>
    </>
  );
};

export default index;
