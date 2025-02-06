import { View, Text, FlatList } from 'react-native';
import DataCard from './DataCard';
import React, {useEffect } from 'react';
import { useGlobalStyles } from '../context/GlobalStylesContext';

const DataList = ({listData, onCardButtonPress}) => {

  // useEffect(() => {
  //   if (listData) {
  //     console.log('DATA LIST DATA: ', listData);
  //   }

  // }, [listData]);

    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
    return (
<View style={[themeStyles.primaryBackground, appContainerStyles.dataListContainer]}>
  <FlatList
    data={listData}
    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
    renderItem={({ item }) => (
      <View style={{ marginVertical: '2%' }}>
        <DataCard data={item} onPress={onCardButtonPress} />
      </View>
    )}
    contentContainerStyle={{ paddingBottom: 60 }} 
    ListFooterComponent={<View style={{ height: 100 }} />}
  />
</View>

      );
    }

export default DataList;