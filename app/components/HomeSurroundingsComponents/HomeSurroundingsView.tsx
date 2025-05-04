import { View } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import MagnifiedNavButton from "../MagnifiedNavButton"; 
import useInlineComputations from "@/src/hooks/useInlineComputations";

const HomeSurroundingsView = ({remainingGoes, onPress }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();
  const { formatRemainingGoes } = useInlineComputations();

  const adjustedGoes = remainingGoes != 'No limit' && remainingGoes != '0' ? Number(remainingGoes) - 1 : remainingGoes;
  
  const message = formatRemainingGoes(adjustedGoes); // this number on backend doesn't update count until twin location has been archived

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~home screen rerendered', remainingGoes);
  const overlayColor = `${themeStyles.primaryBackground.backgroundColor}99`;

  return (
    <>
      <View
        style={[appContainerStyles.dimmer, { backgroundColor: overlayColor }]}
      >
        <View style={{ paddingBottom: 200 }}>
          <MagnifiedNavButton
            direction={"left"}
            message={`Go home? (${message})`}
            onPress={onPress}
          />
        </View>
      </View>
    </>
  );
};

export default HomeSurroundingsView;
