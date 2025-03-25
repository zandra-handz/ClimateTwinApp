import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useInteractiveElements } from "@/app/context/InteractiveElementsContext";
import RuinsTreasuresView from "../ItemChoicesComponents/RuinsTreasuresView";
import PortalTreasuresView from "../ItemChoicesComponents/PortalTreasuresView";
//import useGroq from "@/app/hooks/useGroq";
import { useGroqContext } from "@/app/context/GroqContext";

const CurrentSurroundingsView = ({ height }) => {
  const { groqHistory } = useGroqContext();
  

  const { itemChoicesAsObjectTwin, itemChoicesAsObjectExplore } =
    useInteractiveElements();

  return (
    <>
      {groqHistory && (
        <View style={{ height: height }}>
          {Object.keys(itemChoicesAsObjectExplore).length > 0 && (
            <RuinsTreasuresView />
          )}
          {Object.keys(itemChoicesAsObjectTwin).length > 0 && (
            <PortalTreasuresView />
          )}
        </View>
      )}
    </>
  );
};

export default CurrentSurroundingsView;
