import { View, FlatList } from 'react-native';
import DataCard from '../Scaffolding/DataCard';
import React from 'react';
import { useGlobalStyles } from '../../../src/context/GlobalStylesContext';
import InboxItemUICard
 from './InboxItemUICard';
const InboxView = ({listData,   onOpenButtonPress }) => {
 

    const {  appContainerStyles  } = useGlobalStyles();
    return (
<View style={[ appContainerStyles.dataListContainer]}>
{/* <View style={{height: 400}}>
  
  <InboxItemUICard data={listData[0]} />
  
</View> */}
  <FlatList
    data={listData}
    keyExtractor={(item, index) => 
      item.id 
        ? `${item.id}-${item.timestamp || index}`  
        : index.toString()
    }
    renderItem={({ item }) => (
      <View style={{ marginVertical: '2%' }}>
        <InboxItemUICard data={item} onOpenInboxItemPress={onOpenButtonPress} />
      </View>
    )}
    contentContainerStyle={{ paddingBottom: 60 }} 
    ListFooterComponent={<View style={{ height: 100 }} />}
  />
</View>

      );
    }

export default InboxView;