import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
const GoButton = ({ address }) => {
  const { handleGo, remainingGoes, searchIsActive } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { portalSurroundings } = useSurroundings();

  const handleButtonPress = () => {
    handleGo(address);
  };
  return (
    <>
      {remainingGoes && remainingGoes !== "0" ? (
        !portalSurroundings || portalSurroundings?.id === null ? (
          <TouchableOpacity
            onPress={!searchIsActive ? handleButtonPress : () => {}}
            style={[
              appContainerStyles.goButtonContainer,
              themeStyles.primaryOverlayBackground,
              { borderColor: themeStyles.tabBarHighlightedText.color },
            ]}
          >
            <>
              <Text
                style={[themeStyles.primaryText, appFontStyles.goButtonText]}
              >
                GO
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
            </>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={!searchIsActive ? handleButtonPress : () => {}}
              style={[
                appContainerStyles.goButtonContainer,
                themeStyles.primaryOverlayBackground,
                { borderColor: themeStyles.tabBarHighlightedText.color },
              ]}
            >
              <Text
                style={[
                  themeStyles.primaryText,
                  appFontStyles.smallGoButtonText,
                ]}
              >
                GO
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
        )
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

export default GoButton;
