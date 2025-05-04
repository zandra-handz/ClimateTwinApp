import { View, Text } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";
import useDateTimeFunctions from "../../../src/hooks/useDateTimeFunctions";

const StatsUICard = ({ data, onPress, onOpenPress, onOpenTreasurePress }) => {
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
        appContainerStyles.itemCardContainer,
        { borderColor: themeStyles.primaryBorder.color },
      ]}
    >
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
        <Text style={{ fontWeight: "bold" }}>Record:{" "} 
          </Text>
          {data?.id}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
        <Text style={{ fontWeight: "bold" }}>
          Date:{" "} 
          </Text>
          {formatUTCToMonthDayYear(data?.created_on) || "unknown date"}
        </Text>
      </View>

      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Matched:{" "} </Text>
          {data?.home_temperature} | {data?.climate_twin_temperature}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Places searched:{" "}</Text>
          {data?.points_searched_on_land || "Unknown"} (Generated: {data?.total_points_generated})
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Countries:{" "}</Text>

          {data?.countries_searched || "Unknown"}
        </Text>
      </View>

      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>High variances:{" "}</Text>
          {data?.high_variances || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>OWM calls:{" "}</Text>
          {data?.openweathermap_calls || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Google map calls:{" "}</Text>
          {data?.google_map_calls || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>
            Preset random points in country:{" "}
          </Text>
          {data?.preset_random_points_in_each_country || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Preset std dev divider: </Text>
          {data?.preset_divider_for_point_gen_deviation || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>
            Preset high variances allowed:{" "}
          </Text>
          {data?.preset_num_high_variances_allowed || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>
            Preset twin candidates required:{" "}
          </Text>
          {data?.preset_num_final_candidates_required || "Unknown"}
        </Text>
      </View>
      <View style={appContainerStyles.statRow}>
        <Text style={[appFontStyles.statText, themeStyles.primaryText]}>
          <Text style={{ fontWeight: "bold" }}>Twin address: </Text>
          {data?.climate_twin_address || "Unknown"}
        </Text>
      </View> 
    </View>
  );
};

export default StatsUICard;
