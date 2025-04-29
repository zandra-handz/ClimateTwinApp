import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react"; 
import SurroundingsImageCard from "./SurroundingsImageCard";
import usePexels from "@/app/DELETE/usePexels";
import { useGlobalStyles } from "@/src/context/GlobalStylesContext";
import { useFocusEffect } from "expo-router";
 

const SurroundingsTray = ({ value }) => { 

  const debug = true;

 
 

  return (
    <View
      style={{
        width: "100%",

        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: "auto",
      }}
    > 

      
        <SurroundingsImageCard
          value={value|| null}
          accessibilityLabel={ 'No label available'}
          avgColor={null}
        />  
    </View>
  );
};

export default SurroundingsTray;
