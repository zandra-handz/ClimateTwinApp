import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import WindyWindSquare from "./WindyWindSquare";
import { useDeviceLocationContext } from "@/src/context/DeviceLocationContext";

//maybe get wind direction and wind speed of both home and portal locations and animate that way?

interface WindyWindFriendsViewProps {
  name?: string;
  description?: string;
  windFriends?: string;
  windDirection?: string;
  windSpeed?: string;
  homeDescription?: string;
  homeWindSpeed?: string;
  homeWindDirection?: string;
  homeLat: number;
  homeLon: number;
  homeZoom?: number;
  portalLat: number;
  portalLon: number;
  portalZoom?: number;
}

const WindyWindFriendsView: React.FC<WindyWindFriendsViewProps> = ({
  name = "",
  description = "",
  windFriends = "",
  windDirection = "",
  windSpeed = "",
  homeDescription = "",
  homeWindSpeed = "",
  homeWindDirection = "",
  homeLat,
  homeLon,
  homeZoom = 5,
  portalLat,
  portalLon,
  portalZoom = 5,
}) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  const { deviceLocation } = useDeviceLocationContext();
  const formatDescription = (description: string) => {
    return description
      .replace(/([A-Z])/g, " $1") 
      .replace(/^\S+\s(\S)/, (match, p1) => match.toLowerCase()); 
  };

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
          right: 10,
          height: "auto",
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingHorizontal: 10,
        }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}>
          {name}
        </Text>
        <Text style={[themeStyles.primaryText]}>
          {formatDescription(description)}
        </Text>
        <Text style={[themeStyles.primaryText]}>
          {windFriends === "Same-Heart" && windFriends}
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flex: 1,
        }}
      >
        <View style={{ height: 100, width: "26%" }}>
          {deviceLocation && (
            <WindyWindSquare lat={homeLat} lon={homeLon} zoom={homeZoom} />
          )}
        </View>
        <View style={{ height: 100, width: "70%" }}>
          <WindyWindSquare
            lat={portalLat}
            lon={portalLon}
            zoom={portalZoom}
            size={120}
          />
        </View>
      </View>
    </View>
  );
};

export default WindyWindFriendsView;
