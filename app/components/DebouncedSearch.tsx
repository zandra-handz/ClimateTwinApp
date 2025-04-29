import { TextInput } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useGlobalStyles } from "../../src/context/GlobalStylesContext";
import { debounce } from "lodash";

const DebouncedSearch = ({ onEnter, placeholder=`Search treasures` }) => {
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
      debouncedOnEnter(searchQuery);
    }
  }, [searchQuery, debouncedOnEnter]);

  const handleEnterPress = () => {
    onEnter(searchQuery);
  };

  return (
    <TextInput
      style={[
        appContainerStyles.goToItemButtonContainer,
        themeStyles.primaryBackground,
        appFontStyles.dCButtonText,

        { borderColor: themeStyles.primaryText.color },
      ]}
      placeholder={placeholder}
      placeholderTextColor={themeStyles.primaryText.color}
      color={themeStyles.primaryText.color}
      autoFocus={true}
      value={searchQuery}
      onChangeText={handleSearch}
      onSubmitEditing={handleEnterPress}
    />
  );
};

export default DebouncedSearch;
