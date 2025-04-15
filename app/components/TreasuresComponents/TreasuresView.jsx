import { View, FlatList } from 'react-native'; 
import TreasuresUICard from './TreasuresUICard';
import React from 'react';
import { useGlobalStyles } from '../../../src/context/GlobalStylesContext';
import useFriends from '@/app/hooks/useFriends';

 
const TreasuresView = ({listData, onOpenTreasurePress}) => {
 
  const { friends } = useFriends();
    const {  appContainerStyles  } = useGlobalStyles();
    return (
<View style={[ appContainerStyles.dataListContainer]}>
  
  <FlatList
    data={listData}
    keyExtractor={(item, index) => 
      item.id 
        ? `${item.id}-${item.timestamp || index}`  
        : index.toString()
    }
    renderItem={({ item }) => (
      <View style={{ marginVertical: '2%' }}>
        <TreasuresUICard data={item} onOpenTreasurePress={onOpenTreasurePress} />
      </View>
    )}
    contentContainerStyle={{ paddingBottom: 60 }} 
    ListFooterComponent={<View style={{ height: 100 }} />}
  />
</View>

      );
    }

export default TreasuresView;