import { View, FlatList  } from "react-native";
import React from "react"; 
import { useRouter } from "expo-router"; 
import { useSurroundingsWS } from "@/src/context/SurroundingsWSContext";

import INaturalistTray from "../INaturalistComponents/iNaturalistTray";
import useINaturalist from "@/app/hooks/useINaturalist";

//onPress feature depends on groqHistory

//Unmapped = image results are arbitrarily assigned to base
//used for iNaturalist -- iNaturalist returns much more revelant results
//than Pexel with just the location coords
const PortalUnmappedTreasuresView = ({itemChoices}) => {
  const { iNaturalist } = useINaturalist();
  const router = useRouter(); 
  const { lastLocationName } = useSurroundingsWS();

  const handleInteractWithItem = (topic, base, query, index) => {
    if (topic) {
      router.push({
        pathname: "(treasures)/interact",
        params: {
          name: lastLocationName, // Pass `name` directly, not wrapped in locationData
          topic,
          base,
          query,
          index,
        },
      });
    }
  };

  // useEffect(() => {
  //   if (itemChoices) {
  //     console.log(`itemchoicesasobjects`, itemChoices[1]);
  //     console.log(`iNaturalist`, iNaturalist?.results[1])
  //   }

  // }, [itemChoices]);

  return (
    <>
      {iNaturalist?.results?.length > 0 && (
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
            paddingVertical: 8,
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <FlatList
            data={itemChoices}
            renderItem={({ item, index }) => (
              <>
                {item && itemChoices[index] && iNaturalist.results[index] && (
                  <View key={index} style={{ width: 300, marginRight: 20 }}>
                    <INaturalistTray
                      index={index}
                      item={iNaturalist.results[index]}
                      topic={"Test"}
                      base={JSON.stringify(itemChoices[index])}
                      onPress={handleInteractWithItem}
                    />
                  </View>
                )}
              </>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            ListFooterComponent={<View style={{ width: 100 }}></View>}
          />

        </View>
      )}
    </>
  );
};

export default PortalUnmappedTreasuresView;
