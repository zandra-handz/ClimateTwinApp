import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { useActiveSearch } from "../../src/context/ActiveSearchContext"; 
const GoHomeButton = () => {
  const { handleGoHome, remainingGoes, isSearchingForTwin } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
 

  const handleButtonPress = () => {
    console.log('handle go home pressed!');
    handleGoHome();
  };
  return (
    <>
      {remainingGoes && remainingGoes !== "0" ? (

          <>
            <TouchableOpacity
              onPress={!isSearchingForTwin ? handleButtonPress : () => {}}
              style={[
                appContainerStyles.goButtonContainer,
                themeStyles.primaryOverlayBackground,
                { borderColor: themeStyles.tabBarHighlightedText.color },
              ]}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.goHomeButtonText,
                ]}
              >
                go home
              </Text>
              {remainingGoes != "No limit" && (
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.remainingTripsText,
                  ]}
                >
                  {`${remainingGoes} left`}
                </Text>
              )}
              {remainingGoes === "No limit" && (
                <Text
                  style={[
                    themeStyles.primaryText,
                    appFontStyles.remainingTripsText,
                  ]}
                >
                  {`${remainingGoes}`}
                </Text>
              )}
            </TouchableOpacity>
          </> 
      ) : (
        <View
          style={[
            appContainerStyles.messageBox,
            themeStyles.primaryOverlayBackground,
          ]}
        >
          <Text style={[themeStyles.primaryText, { fontSize: 14 }]}>
            No trips left for today. Your wings need to rest!{" "}
          </Text>
        </View>
      )}
    </>
  );
};

export default GoHomeButton;
