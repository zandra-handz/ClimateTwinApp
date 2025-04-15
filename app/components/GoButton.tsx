import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { useActiveSearch } from "../../src/context/ActiveSearchContext"; 

import AnimatedCircle from "../animations/AnimatedCircle";

const GoButton = ({ address, size=240  }) => {
  const { handleGo, remainingGoes, isSearchingForTwin } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
 

  const handleButtonPress = () => {
    handleGo(address); //this will set search to active in the onMutate function
  };
  return (
    <>
      {remainingGoes && remainingGoes !== "0" ? ( 
          <TouchableOpacity
            onPress={!isSearchingForTwin ? handleButtonPress : () => {}}
            style={[
              appContainerStyles.bigGoButtonContainer,
              themeStyles.primaryOverlayBackground,
              { height: size,
                width: size,
                borderRadius: size / 2, 
                borderColor: themeStyles.tabBarHighlightedText.color },
            ]}
          >
            <View style={{ position: "absolute", top: 0 }}>
              <AnimatedCircle width={size} height={size} /> 
            </View>
            <>
              <View
                style={{
                  flexWrap: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  width: "100%",
                }}
              >
                <Text
                  style={[themeStyles.primaryText, appFontStyles.goButtonText]}
                >
                  Open a portal
                </Text>
              </View>
              <View style={{position: 'absolute', bottom: 26 }}>
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
              </View>
            </>
          </TouchableOpacity>
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
