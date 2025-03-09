import { View, Text } from "react-native";
import React from "react"; 
import { useGlobalStyles } from "../context/GlobalStylesContext";

const SingleDetailPanel = ({ label, value }) => {
  const { themeStyles, appContainerStyles } = useGlobalStyles();

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
          paddingHorizontal: 10,
          paddingVertical: 8,
          
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={[themeStyles.primaryText, {fontWeight: 'bold'}]}>
          {" "}
          {label}
        </Text>
        <Text selectable={true} style={[themeStyles.primaryText]}>{value}</Text>
      </View>
    </View>
  );
};

export default SingleDetailPanel;
