import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext";
import { useActiveSearch } from "../context/ActiveSearchContext";
import { useSurroundings } from "../context/CurrentSurroundingsContext";

import AnimatedCircle from "../animations/AnimatedCircle";


const GoButton = ({ address }) => {
  const { handleGo, remainingGoes, isSearchingForTwin } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { portalSurroundings } = useSurroundings();

  const handleButtonPress = () => {
    handleGo(address); //this will set search to active in the onMutate function
  };
  return (
    <>

      {remainingGoes && remainingGoes !== "0" ? (
        !portalSurroundings || portalSurroundings?.id === null ? (
          <TouchableOpacity
            onPress={!isSearchingForTwin ? handleButtonPress : () => {}}
            style={[
              appContainerStyles.bigGoButtonContainer,
              themeStyles.primaryOverlayBackground,
              { borderColor: themeStyles.tabBarHighlightedText.color },
            ]}
          >
                <View style={{position: 'absolute', top: 0}}>
      <AnimatedCircle width={'240'} height={'240'} />
    </View>
            <>
            <View style={{flexWrap: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%'}}>
              
              <Text
                style={[themeStyles.primaryText, appFontStyles.goButtonText]}
              >
                Open a portal
              </Text>
              
            </View>
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
