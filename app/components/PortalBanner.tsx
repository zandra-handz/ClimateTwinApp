import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";  
import PortalPixellySvg from "../assets/svgs/portal-pixelly.svg";
import { useSurroundings } from "../../src/context/CurrentSurroundingsContext"; 
 

// Only meant to be visible when currently exploring a location; no longer has go button
const PortalBanner = () => { 
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { locationId, portalSurroundings, homeSurroundings } = useSurroundings();

 
  return (
    <View
      style={[portalSurroundings?.id !== null ? appContainerStyles.portalBannerContainer : appContainerStyles.emptyBannerContainer, themeStyles.darkerBackground]} > 
      {portalSurroundings?.id !== null && locationId !== null && (
        <>
        <View style={[appContainerStyles.portalTempsAndSvgContainer]}>
          <View style={appContainerStyles.startingPointTempContainer}>
            {homeSurroundings?.temperature && (
              <Text
                style={[
                  appFontStyles.startingPointTempText,
                  themeStyles.primaryText,
                ]}
              >
                {Math.ceil(homeSurroundings.temperature * 10) / 10}°
              </Text>
            )}
            {homeSurroundings?.humidity && (
              <Text
                style={[
                  appFontStyles.startingPointHumidityText,
                  themeStyles.primaryText,
                ]}
              >
                {Math.ceil(homeSurroundings.humidity * 10) / 10}%
              </Text>
            )}
          </View>
          <PortalPixellySvg
            height={appFontStyles.goButtonPortalSize.fontSize}
            width={appFontStyles.goButtonPortalSize.fontSize}
            color={themeStyles.primaryText.color} 
            style={{ opacity: .8, transform: [{rotate: '-90deg'}]}}
          />
          <View style={appContainerStyles.portalTempContainer}>
            {portalSurroundings?.temperature && (
              <Text
                style={[
                  appFontStyles.portalTempText,
                  themeStyles.primaryText,
                ]}
              >
                {Math.ceil(portalSurroundings.temperature * 10) / 10}°
              </Text>
            )}
            {portalSurroundings?.humidity && (
              <Text
                style={[
                  appFontStyles.portalHumidityText,
                  themeStyles.primaryText,
                ]}
              >
                {Math.ceil(portalSurroundings.humidity * 10) / 10}%
              </Text>
            )}
          </View>  
          
   
        </View> 
        {/* <GoHomeButton /> */}
        </>
      )} 
      
      {/* <GoButton address={address}/> */}
      {/* <GoHomeButton /> */}
    </View>
  );
};

export default PortalBanner;
