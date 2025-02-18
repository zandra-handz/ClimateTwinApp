import { View, Text } from "react-native";
import React from "react"; 
import { useGlobalStyles } from "../context/GlobalStylesContext";

const SingleDetailPanel = ({ label, value }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyles();

  return (
    <View
      style={[
        appContainerStyles.singleDetailPanelContainer,
        themeStyles.darkestBackground,
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          padding: 10,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={[themeStyles.primaryText, appFontStyles.bannerHeaderText]}>
          {" "}
          {label}
        </Text>
        <Text style={[themeStyles.primaryText]}>{value}</Text>
      </View>
    </View>
  );
};

export default SingleDetailPanel;
