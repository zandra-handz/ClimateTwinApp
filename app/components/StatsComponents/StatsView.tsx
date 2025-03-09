import { View, FlatList } from 'react-native';
 
import StatsUICard from './StatsUICard';
import React from 'react';
import { useGlobalStyles } from '../../context/GlobalStylesContext';

const StatsView = ({listData, onCardButtonPress, onOpenButtonPress, onOpenTreasurePress}) => {
 

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
        <StatsUICard data={item} onPress={onCardButtonPress} onOpenPress={onOpenButtonPress} onOpenTreasurePress={onOpenTreasurePress} />
      </View>
    )}
    contentContainerStyle={{ paddingBottom: 60 }} 
    ListFooterComponent={<View style={{ height: 100 }} />}
  />
</View>

      );
    }

export default StatsView;