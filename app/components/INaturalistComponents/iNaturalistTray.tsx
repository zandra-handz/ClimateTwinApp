import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react"; 
import INaturalistImageCard from "./INaturalistImageCard";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import useINaturalist from "@/app/hooks/useINaturalist";



//pass topic and base and pass those in to touchable on press to start allowing treasure saving
const INaturalistTray = ({ index, item, topic, base, onPress, width=300, height=300 }) => {
  const { iNaturalist } = useINaturalist(); // Use iNaturalist data from the hook
  const { handleAvgPhotoColor, avgPhotoColor } = useGlobalStyles();

  // useEffect(() => {
  //   if (item) {
  //       console.log(`item in naturalist tray: `, item);
  //   }
  // }, [item]);

 

  const label = iNaturalist.results[index]?.taxon?.preferred_common_name || "No common name available";
  const scientificLabel = iNaturalist.results[index]?.taxon?.preferred_common_name || "No common name available"
  const query = `${label} (${scientificLabel})`;
  //const wikiLink = iNaturalist.results[index]?.taxon?.wikipedia_url || `No wiki available`;
        

  return (
    <View
    // onPress={handleOnPress}
      style={{
        width: "100%",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: "auto",
        borderRadius: 30,
       
        
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
          scientificLabel={scientificLabel}
          label={label}
          accessibilityLabel={
            iNaturalist.results[index]?.taxon?.name || "No description available"
          }
          base={base}
          index={index}
          query={query}
          onPress={onPress}
          width={width}
          height={height}
        />
 
      ) : (
        <Text>No image available</Text> // Fallback in case data is missing
      )}
    </View>
  );
};

export default INaturalistTray;
