import { View, Text, FlatList } from 'react-native';
import DataCard from './DataCard';
import React from 'react';
import { useGlobalStyles } from '../context/GlobalStylesContext';

const DataList = ({listData, onCardButtonPress}) => {

    const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();
    return (
       <View style={[themeStyles.primaryBackground, appContainerStyles.dataListContainer]}>
          
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id.toString()} 
            renderItem={({ item }) => 
                <View style={{marginVertical: '2%'}}>
            <DataCard data={item} onPress={onCardButtonPress} />
            </View>
        }
            contentContainerStyle={{ paddingBottom: 60 }} 
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>
      );
    }

export default DataList;