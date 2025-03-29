import { View, Text } from "react-native";
import React, { useEffect, useState } from "react"; 
import INaturalistImageCard from "./INaturalistImageCard";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import useINaturalist from "@/app/hooks/useINaturalist";

const INaturalistTray = ({ index, item }) => {
  const { iNaturalist } = useINaturalist(); // Use iNaturalist data from the hook
  const { handleAvgPhotoColor, avgPhotoColor } = useGlobalStyles();

  useEffect(() => {
    if (item) {
        console.log(`item in naturalist tray: `, item);
    }
  }, [item]);

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
      {/* Render the image card with data from iNaturalist */}
      {iNaturalist && iNaturalist.results && iNaturalist.results[index] ? (
        <INaturalistImageCard
          value={
            // Accessing medium_url from default_photo
            iNaturalist.results[index]?.taxon?.default_photo?.medium_url ||
            iNaturalist.results[index]?.taxon?.default_photo?.url ||
            null
          }
          scientificLabel={
            iNaturalist.results[index]?.taxon?.name || "No scientific name available"
          }
          label={
            iNaturalist.results[index]?.taxon?.preferred_common_name || "No common name available"
          }
          accessibilityLabel={
            iNaturalist.results[index]?.taxon?.name || "No description available"
          }
        />
      ) : (
        <Text>No image available</Text> // Fallback in case data is missing
      )}
    </View>
  );
};

export default INaturalistTray;
