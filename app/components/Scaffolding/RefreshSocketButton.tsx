import React from "react";
import { TouchableOpacity } from "react-native";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext";

const RefreshSocketButton = () => {
  const { handleRefreshDataFromSocket, locationSocketColor } =
    useSurroundingsWS();
  return (
    <TouchableOpacity
      onPress={handleRefreshDataFromSocket}
      style={{
        zIndex: 2,
        height: "auto",
        width: "auto",
        height: 10,
        width: 10,
        backgroundColor: locationSocketColor,
        justifyContent: "center",
        borderRadius: 10 / 2,
      }}
    ></TouchableOpacity>
  );
};

export default RefreshSocketButton;
