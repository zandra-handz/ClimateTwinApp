import { View, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import DirectionSquare from "../SurroundingsComponents/DirectionSquare";
import { useSurroundingsWS } from "@/app/context/SurroundingsWSContext";
import { Image } from "expo-image";

const NearbyRuinUICard = ({
  data,
  name,
  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree,
  windHarmony,
  image,
  onPress,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { lastLocationId } = useSurroundingsWS();

  const englishNameKey = `name:en`;
  const internationalNameKey = `int_name`;

  const [isUserHere, setIsUserHere] = useState(false);

  useEffect(() => {
    if (lastLocationId && lastLocationId === data.id) {
      setIsUserHere(true);
    } else {
      setIsUserHere(false);
    }
  }, [lastLocationId]);

  const handlePress = () => {
    console.log("nearbyruinuicard button pressed");
    if (isUserHere) {
      console.log("Already visiting!");
    } else {
      onPress(data);
    }
  };
  const streetViewUrl = image || null;

  const bestNameOption =
    tags[englishNameKey] || tags[internationalNameKey] || name;
  return (
    <>
    {!isUserHere && (
        
    <TouchableOpacity
      onPress={handlePress}
      style={[
        appContainerStyles.ruinsHarmonyCardContainer,
        themeStyles.darkestBackground,
        {
          borderWidth: 1,
          borderColor:
            isUserHere === true
              ? "yellow"
              : windHarmony === true
              ? "limegreen"
              : "transparent",
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: 62,
          right: 24,
          height: 40,
          zIndex: 3,
        }}
      >
        {!image && (
            
        <DirectionSquare
          locationDirection={directionDegree}
          size={80}
          opacity={0.6}
          color={themeStyles.primaryText.color}
        />
        
    )}
      </View>
      <View style={appContainerStyles.smallImageContainer}>
        {streetViewUrl && (
          <View
            style={{
              width: "50%",
              height: "110%",
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <Image
              source={streetViewUrl}
              style={{
                width: "200%", // Double the width to allow cropping
                height: "100%",
                position: "absolute",
                right: "-50%", // Shift left to show the middle 50%
                resizeMode: "cover",
              }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "column",
          top: 10,
          left: 10,
          height: 'auto',
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}>
          {bestNameOption}
        </Text>

        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={[themeStyles.primaryText]}>
            {milesAway} miles {direction.toLowerCase()} of portal
          </Text>
        </View>
        <View
          style={{ width: 210, paddingTop: 20, height: 50, flexWrap: "flex" }}
        >
          <Text
            style={[themeStyles.primaryText, appFontStyles.windCompassText]}
          >
            {windCompass}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: 'center',
          alignContent: 'center',


          width: "100%",
          height: "100%",
          flexGrow: 1,
          flex: 1,
        }}
      >
        {/* {!image && (
            
            <DirectionSquare
              locationDirection={directionDegree}
              size={60}
              opacity={0.94}
              color={themeStyles.primaryText.color}
            />
            
        )} */}
      </View>
    </TouchableOpacity>
    
)}
    
    </>
  );
};

export default NearbyRuinUICard;
