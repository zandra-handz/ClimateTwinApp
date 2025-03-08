import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalStyles } from "../../context/GlobalStylesContext";
import { useSurroundings } from "../../context/CurrentSurroundingsContext";
import DirectionSquare from "../SurroundingsComponents/DirectionSquare";

const NearbyUICard = ({ data, onPress, onOpenPress, onOpenTreasurePress }) => {
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
  const { locationId } = useSurroundings();

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
        themeStyles.primaryBackground,
        appContainerStyles.dataCardContainer,
        { borderColor: themeStyles.primaryBorder.color },
      ]}
    >
      {Object.entries(data).map(([key, value]) => renderField(key, value))}
      {data?.id !== locationId && (
        
      <TouchableOpacity onPress={() => onPress(data)}>
        <Text style={themeStyles.primaryText}>PRESS ME</Text>
      </TouchableOpacity>
      
    )}

      {onOpenPress && (
        <TouchableOpacity onPress={() => onOpenPress(data.id, data.message)}>
          <Text style={themeStyles.primaryText}>OPEN VIA DATA ID</Text>
        </TouchableOpacity>
      )}
            {onOpenTreasurePress && (
        <TouchableOpacity onPress={() => onOpenTreasurePress(data.id, data.descriptor)}>
          <Text style={themeStyles.primaryText}>OPEN VIA DATA ID</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NearbyUICard;
