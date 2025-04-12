import { View, Text, TextInput } from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { searchUsers } from "../../src/calls/apicalls";
import useFriends from "../hooks/useFriends";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { debounce } from 'lodash';

const DebouncedUserSearch = ({onEnter}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { handleSearchUsers } = useFriends();
  const { themeStyles, appContainerStyles, appFontStyles } = useGlobalStyles();

  const handleSearch = (text) => {
    setSearchQuery(text);
    console.log(text); 
  };


  //const stableOnEnter = useCallback(onEnter, []);


  const debouncedOnEnter = useCallback(
    debounce((query) => {
      console.log("Debounced search query:", query);
      //stableOnEnter(query);
      onEnter(query);
    }, 500),
   // [stableOnEnter]
    []
  );
 
  useEffect(() => {
    if (searchQuery.trim()) {
      console.log('fetching search results via debounce function');
      debouncedOnEnter(searchQuery);
    }
  }, [searchQuery, debouncedOnEnter]);

  const handleEnterPress = () => {
    console.log('enter press detected, searchQuery in memory is:', searchQuery);
    onEnter(searchQuery);
  }

  return (
    //  <View style={[appContainerStyles.goToItemButtonContainer, themeStyles.primaryBackground, {borderColor: themeStyles.primaryText.color}]}>

    <TextInput
      style={[
        appContainerStyles.goToItemButtonContainer,
        themeStyles.primaryBackground,
        { borderColor: themeStyles.primaryText.color },
      ]}
      style={[themeStyles.primaryText]}
      placeholder={`Search users`}
      // placeholderTextColor={textAndIconColor}
      // color={textAndIconColor}
      autoFocus={true}
      value={searchQuery}
      onChangeText={handleSearch}
      onSubmitEditing={handleEnterPress}
      //   onBlur={handleBlur}  // Clear when the user moves away from the input
    />
    // </View>
  );
};

export default DebouncedUserSearch;
