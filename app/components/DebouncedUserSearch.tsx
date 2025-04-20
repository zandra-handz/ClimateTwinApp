import { View, Text, TextInput } from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react"; 
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { debounce } from 'lodash';

const DebouncedUserSearch = ({onEnter}) => {
  const [searchQuery, setSearchQuery] = useState("");  
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();

  const handleSearch = (text) => {
    setSearchQuery(text); 
  };
 
  const debouncedOnEnter = useCallback(
    debounce((query) => { 
      onEnter(query);
    }, 500), 
    []
  );
 
  useEffect(() => {
    if (searchQuery.trim()) {
      console.log('fetching search results via debounce function');
      debouncedOnEnter(searchQuery);
    }
  }, [searchQuery, debouncedOnEnter]);

  const handleEnterPress = () => {
    //console.log('enter press detected, searchQuery in memory is:', searchQuery);
    onEnter(searchQuery);
  }

  return ( 
    <TextInput
      style={[
        appContainerStyles.goToItemButtonContainer,
        themeStyles.primaryBackground,
        appFontStyles.dCButtonText,
        
        { borderColor: themeStyles.primaryText.color,
        
         },
      ]} 
      placeholder={`Search users`}
       placeholderTextColor={themeStyles.primaryText.color}
       color={themeStyles.primaryText.color}
      autoFocus={true}
      value={searchQuery}
      onChangeText={handleSearch}
      onSubmitEditing={handleEnterPress} 
    /> 
  );
};

export default DebouncedUserSearch;
