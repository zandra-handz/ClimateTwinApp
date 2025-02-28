import { View, FlatList } from 'react-native';
import DataCard from './DataCard';
import React from 'react';
import { useGlobalStyles } from '../context/GlobalStylesContext';

const InboxView = ({listData, onCardButtonPress, onOpenButtonPress, onOpenTreasurePress}) => {
 

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
        <DataCard data={item} onPress={onCardButtonPress} onOpenPress={onOpenButtonPress} onOpenTreasurePress={onOpenTreasurePress} />
      </View>
    )}
    contentContainerStyle={{ paddingBottom: 60 }} 
    ListFooterComponent={<View style={{ height: 100 }} />}
  />
</View>

      );
    }

export default InboxView;