import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react"; 
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext"; 
import RuinsTreasuresView from "../ItemChoicesComponents/RuinsTreasuresView";
import PortalTreasuresView from "../ItemChoicesComponents/PortalTreasuresView";

const CurrentSurroundingsView = ({ height }) => {
 
  const { 
    itemChoicesAsObjectTwin,
    itemChoicesAsObjectExplore, 
  } = useInteractiveElements();

 

  return (
    <View style={{ height: height }}>
      {Object.keys(itemChoicesAsObjectExplore).length > 0 && (
        <RuinsTreasuresView />
      )}
      {Object.keys(itemChoicesAsObjectTwin).length > 0 && (
        <PortalTreasuresView />
      )}
    </View>
  );
};

export default CurrentSurroundingsView;
