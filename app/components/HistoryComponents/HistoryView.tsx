import { View, FlatList } from "react-native";
import HistoryUICard from "./HistoryUICard";
import React from "react";
import { useGlobalStyles } from "../../../src/context/GlobalStylesContext";

const HistoryView = ({ data, onPress }) => {
  const { appContainerStyles } = useGlobalStyles();
  return (
    <View style={[appContainerStyles.dataListContainer]}>
      <FlatList
      fadingEdgeLength={40}
        data={data}
        keyExtractor={(item, index) =>
          item.id ? `${item.id}-${item.timestamp || index}` : index.toString()
        }
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 0}}>
            <HistoryUICard data={item} leftSide={index % 2 === 0} onPress={onPress} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

export default HistoryView;
