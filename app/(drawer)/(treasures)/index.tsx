import React from "react";
import { 
  View, 
} from "react-native"; 
import { useRouter } from "expo-router";
import { useGlobalStyles } from "../../context/GlobalStylesContext"; 
 
import useTreasures from "../../hooks/useTreasures"; 
import TreasuresView from '../../components/TreasuresComponents/TreasuresView';
 
  
const index = () => {
  const { themeStyles,  appContainerStyles } = useGlobalStyles();  
  const { treasures } = useTreasures();
  const router = useRouter();

const handlePress = () => {
    console.log('Treasure item pressed!');

};
 
 
const handleViewTreasure = (id, descriptor) => {
    if (id) {
        router.push({
            pathname: "(treasures)/[id]",
            params: { id: id, descriptor: descriptor},
        })
    }

}
 
 
 
  
  return (
    <> 
      <View
        style={[
          appContainerStyles.screenContainer,
          themeStyles.primaryBackground,
          { paddingTop: 10 },
        ]}
      >
        <View style={appContainerStyles.innerFlexStartContainer}>
        
        {treasures && <TreasuresView listData={treasures} onCardButtonPress={handlePress} onOpenTreasurePress={handleViewTreasure} />}
 
          </View>
      </View>
    </>
  );
};

export default index;
