import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import DirectionSquare from "./DirectionSquare";

const RuinsHarmonyUICard = ({
  name,

  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree, 
  windHarmony,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

 

  return ( 

    <View
      style={[
        appContainerStyles.ruinsHarmonyCardContainer,
        themeStyles.darkestBackground, {borderWidth: 3, borderColor: windHarmony === true ? 'limegreen' : 'transparent'}
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
        <View style={{width: 210, paddingTop: 20, height: 50, flexWrap: 'flex'}}>
          
        <Text style={[themeStyles.primaryText, appFontStyles.windCompassText]}>{windCompass}</Text>
        
        </View>
     
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
