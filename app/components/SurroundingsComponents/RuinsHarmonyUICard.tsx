import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import DirectionSquare from "./DirectionSquare";

const RuinsHarmonyUICard = ({
  name,

  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree, 
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

 

  return ( 

    <View
      style={[
        appContainerStyles.windFriendsCardContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          top: 10,
          left: 10,
          height: 30,
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}>
          {name}
        </Text>
        <Text style={[themeStyles.primaryText]}>{milesAway} miles {direction.toLowerCase()} of portal</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          flexGrow: 1,
          flex: 1,
        }}
      > 
        <DirectionSquare
          locationDirection={directionDegree}
          size={120}
          opacity={0.8}
          color={themeStyles.primaryText.color}
        />
      </View>
    </View>
 
  );
};
  

export default RuinsHarmonyUICard;
