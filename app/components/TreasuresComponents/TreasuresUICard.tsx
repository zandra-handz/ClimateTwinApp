import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import useDateTimeFunctions from "../../hooks/useDateTimeFunctions";

const TreasuresUICard = ({
  data,
  onPress,
  onOpenPress,
  onOpenTreasurePress,
}) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { formatUTCToMonthDayYear } = useDateTimeFunctions();

  // Function to recursively render object fields
  const renderField = (key, value, level = 0) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <View key={key} style={{ marginLeft: level * 10 }}>
          <Text
            style={[
              themeStyles.primaryText,
              { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
            ]}
          >
            {key}:
          </Text>
          {Object.entries(value).map(([subKey, subValue]) =>
            renderField(subKey, subValue, level + 1)
          )}
        </View>
      );
    }

    return (
      <View
        key={key}
        style={{
          flexDirection: "row",
          marginVertical: 4,
          marginLeft: level * 10,
          flexWrap: "wrap",
        }}
      >
        <Text
          style={[
            themeStyles.primaryText,
            { fontWeight: "bold", flexWrap: "wrap", flexShrink: 1 },
          ]}
        >
          {key}:
        </Text>
        <Text
          style={[
            themeStyles.primaryText,
            { marginLeft: 8, flexWrap: "wrap", flexShrink: 1, flex: 1 },
          ]}
        >
          {value?.toString()}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        themeStyles.darkerBackground,
        appContainerStyles.treasureCardContainer,
        { borderColor: themeStyles.primaryBorder.color },
      ]}
    >
      <View style={appContainerStyles.treasureHeaderRow}>
        <Text
          style={[appFontStyles.treasureHeaderText, themeStyles.primaryText]}
        >
          {data?.descriptor || "unnamed Item"}
        </Text>
      </View>
      <View style={[appContainerStyles.treasureDescriptionContainer, themeStyles.darkestBackground]}>
        <Text
          style={[appFontStyles.treasureDescriptionText, themeStyles.primaryText]}
        >
          <Text style={{fontWeight: 'bold'}}>Description: </Text>
           {data?.description || "No description given"}
        </Text>
      </View>
      <View style={appContainerStyles.treasureHeaderRow}>
        <Text
          style={[appFontStyles.treasureDescriptionText, themeStyles.primaryText]}
        >
             <Text style={{fontWeight: 'bold'}}>Additional data: </Text>
          {data?.add_data || "None recorded"}
        </Text>
      </View>
      <View style={appContainerStyles.treasureCollectionDetailsSubheader}>
        <Text
          style={[
            appFontStyles.treasureCollectionDetailsText,
            themeStyles.primaryText,
          ]}
        >Finder traveled{" "}
          {data?.miles_traveled_to_collect || "0"}{" "}miles to{" "}
          <Text          style={[
            appFontStyles.treasureCollectionDetailsBoldText,
            themeStyles.primaryText,
          ]}>
          {data?.location_name || "unknown"}
            </Text>{" "}to collect on{" "}{formatUTCToMonthDayYear(data?.created_on) || "unknown date"} .
        </Text>
      </View>


      {Object.entries(data).map(([key, value]) => renderField(key, value))}
      <View style={appContainerStyles.treasureCollectionDetailsSubheader}>
        <Text
          style={[
            appFontStyles.treasureCollectionDetailsText,
            themeStyles.primaryText,
          ]}
        >You have owned this since{" "}{formatUTCToMonthDayYear(data?.owned_since) || formatUTCToMonthDayYear(data?.created_on) || "unknown date"} .
        </Text>
      </View>
      <TouchableOpacity onPress={() => onPress(data)}>
        <Text style={themeStyles.primaryText}>PRESS ME</Text>
      </TouchableOpacity>

      {onOpenPress && (
        <TouchableOpacity onPress={() => onOpenPress(data.id, data.message)}>
          <Text style={themeStyles.primaryText}>OPEN VIA DATA ID</Text>
        </TouchableOpacity>
      )}
      {onOpenTreasurePress && (
        <TouchableOpacity
          onPress={() => onOpenTreasurePress(data.id, data.descriptor)}
        >
          <Text style={themeStyles.primaryText}>OPEN VIA DATA ID</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TreasuresUICard;
