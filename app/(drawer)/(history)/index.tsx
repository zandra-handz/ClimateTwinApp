import React from "react";
import { View } from "react-native";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

import useHistory from "../../../src/hooks/useHistory";

import DataList from "../../components/Scaffolding/DataList";

const index = () => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();

  const { history } = useHistory();

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
            <DataList listData={history} onCardButtonPress={handlePress} />
          )}
        </View>
      </View>
    </>
  );
};

export default index;
