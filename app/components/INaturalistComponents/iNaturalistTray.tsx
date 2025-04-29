import { View, Text } from "react-native";
import React  from "react"; 
import INaturalistImageCard from "./INaturalistImageCard"; 
import useINaturalist from "@/src/hooks/useINaturalist";
import useInlineComputations from "@/src/hooks/useInlineComputations";



 
const INaturalistTray = ({ index, item, topic, base, onPress, width=300, height=300 }) => {
  const { iNaturalist } = useINaturalist(); 

 

  const { getiNaturalistItemData } = useInlineComputations();
 

  const { resultsExist, label, scientificLabel, mediumImageUrl, imageUrl } = getiNaturalistItemData(iNaturalist, index);
  const query = `${label} (${scientificLabel})`;
 

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
      {resultsExist ? (
       
       <INaturalistImageCard
       value={
        // Accessing medium_url from default_photo
        mediumImageUrl || imageUrl ||
        null
      }
      scientificLabel={scientificLabel}
      label={label}
      accessibilityLabel={
        scientificLabel }
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
