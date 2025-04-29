import { View, Text  } from "react-native";
import React  from "react"; 
import INaturalistHeaderImageCard from "./INaturalistHeaderImageCard"; 
import useINaturalist from "@/src/hooks/useINaturalist";
import useInlineComputations from "@/src/hooks/useInlineComputations";



const INaturalistHeader = ({ index, item, topic, base, onPress, width=300, height=300 }) => {
  const { iNaturalist } = useINaturalist(); 
 
const { getiNaturalistItemData } = useInlineComputations();
 

  const { resultsExist, label, scientificLabel, mediumImageUrl, imageUrl } = getiNaturalistItemData(iNaturalist, index);
  const query = `${label} (${scientificLabel})`;
  //const wikiLink = iNaturalist.results[index]?.taxon?.wikipedia_url || `No wiki available`;
        

  return (
    <View 
      style={{
        width: "100%",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: "auto",
        borderRadius: 30,
        position: 'absolute',
        top: 0,
        width: '100%',
        right: 0,
        left: 0,
        height: 300,
       
        
      }}
    >
      {/* Render the image card with data from iNaturalist */}
      {resultsExist === true ? (
       
       <INaturalistHeaderImageCard
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

export default INaturalistHeader;
