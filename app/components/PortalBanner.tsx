import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyles } from "../context/GlobalStylesContext"; 
import { useActiveSearch } from "../context/ActiveSearchContext";
import PortalSvg from "../assets/svgs/portal.svg";
import PortalPixellySvg from "../assets/svgs/portal-pixelly.svg";
import { useSurroundings } from "../context/CurrentSurroundingsContext";
import GoButton from "./GoButton";

const PortalBanner = ({ address }) => {
  const { handleGo } = useActiveSearch();
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();
  const { portalSurroundings, homeSurroundings } = useSurroundings();

 
  return (
    <View
      style={portalSurroundings?.id != null ? appContainerStyles.portalBannerContainer : appContainerStyles.emptyBannerContainer} > 
      {portalSurroundings?.id != null && (
        <View style={appContainerStyles.portalTempsAndSvgContainer}>
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
      )} 
      
      <GoButton address={address}/>
    </View>
  );
};

export default PortalBanner;
